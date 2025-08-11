"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/actions/login";
import { LoginSchema } from "@/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export function LoginForm({
   className,
   ...props
}: React.ComponentProps<"div">) {
   const router = useRouter();
   const [error, setError] = useState<string | null>(null);
   const [loading, setLoading] = useState(false);

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<z.infer<typeof LoginSchema>>({
      resolver: zodResolver(LoginSchema),
      defaultValues: {
         username: "",
         password: "",
      },
   });

   const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
      setError(null);
      setLoading(true);
      const res = await login(data);
      setLoading(false);
      console.log({ data, res });

      if (res?.error) {
         setError(res.error);
      } else {
         router.refresh();
         router.push("/frontoffice");
      }
   };

   return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
         <Card>
            <CardHeader>
               <CardTitle>Connexion à votre compte</CardTitle>
               <CardDescription>
                  Entrez votre identifiant pour vous connecter
               </CardDescription>
            </CardHeader>
            <CardContent>
               <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                  <div className="grid gap-3">
                     <Label htmlFor="username">Identifiant</Label>
                     <Input
                        id="username"
                        type="text"
                        placeholder="Identifiant"

                        {...register("username")}
                        required
                     />
                     {errors.username && (
                        <span className="text-red-500 text-sm">{errors.username.message}</span>
                     )}
                  </div>
                  <div className="grid gap-3">
                     <div className="flex items-center">
                        <Label htmlFor="password">Mot de passe</Label>
                        <a
                           href="#"
                           className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                        >
                           Mot de passe oublié ?
                        </a>
                     </div>
                     <Input
                        id="password"
                        type="password"
                        placeholder="Votre mot de passe"
                        {...register("password")}
                        required
                     />
                     {errors.password && (
                        <span className="text-red-500 text-sm">{errors.password.message}</span>
                     )}
                  </div>
                  {error && (
                     <div className="text-red-500 text-center text-sm">{error}</div>
                  )}
                  <div className="flex flex-col gap-3">
                     <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Connexion..." : "Login"}
                     </Button>
                     <Button variant="outline" className="w-full" type="button">
                        Login with Google
                     </Button>
                  </div>
               </form>
            </CardContent>
         </Card>
      </div>
   );
}