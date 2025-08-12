"use server"
import { LoginSchema } from "@/schemas";
import { z } from "zod";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export const login = async (data: z.infer<typeof LoginSchema>) => {
   try {
      //Validation côté serveur avec la librairie Zod
      const validatedData = LoginSchema.parse(data);
      const { username, password } = validatedData;

      try {
         await signIn("credentials", {
            redirect: false, // on gère la redirection côté client
            username,
            password,
         });
      } catch (error) {
         if (error instanceof AuthError) {
            switch (error.type) {
               case 'CredentialsSignin':
                  return { error: 'Données invalides' }
               default:
                  return { error: "Erreur d'authentification" }
            }
         }
      }
   } catch (error) {
      return { error: "Données invalides" };
   }
};