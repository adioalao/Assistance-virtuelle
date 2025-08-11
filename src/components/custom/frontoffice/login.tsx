"use client";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FormEvent } from "react";

export function LoginForm({
   className,
   ...props
}: React.ComponentProps<"div">) {
   return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
         <Card>
            <CardHeader>
               <CardTitle>Connection à votre compte</CardTitle>
               <CardDescription>
                  Entrez votre indentifiant pour vous connecter
               </CardDescription>
            </CardHeader>
            <CardContent>
               <form onSubmit={(e: FormEvent) => {
                  e.preventDefault()
                  console.log('submit');
               }}>
                  <div className="flex flex-col gap-6">
                     <div className="grid gap-3">
                        <Label htmlFor="email">Identifiant</Label>
                        <Input
                           id="username"
                           type="text"
                           placeholder="Identifiant123"
                           required
                        />
                     </div>
                     <div className="grid gap-3">
                        <div className="flex items-center">
                           <Label htmlFor="password">Mot de passe</Label>
                           <a
                              href="#"
                              className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                           >
                              Forgot your password?
                           </a>
                        </div>
                        <Input id="password" type="password" required />
                     </div>
                     <div className="flex flex-col gap-3">
                        <Button type="submit" className="w-full">
                           Login
                        </Button>
                        <Button variant="outline" className="w-full">
                           Login with Google
                        </Button>
                     </div>
                  </div>
                  <div className="mt-4 text-center text-sm">
                     Don&apos;t have an account?{" "}
                     <a href="#" className="underline underline-offset-4">
                        Sign up
                     </a>
                  </div>
               </form>
            </CardContent>
         </Card>
      </div>
   )
}