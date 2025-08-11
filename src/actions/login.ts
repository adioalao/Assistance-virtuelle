"use server"
import { LoginSchema } from "@/schemas";
import { z } from "zod";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export const login = async (data: z.infer<typeof LoginSchema>) => {
   try {
      //Validation côté serveur avec la librairie Zod
      const validatedData = LoginSchema.parse(data);
      const { username, password } = validatedData;

      /*       const user = await prisma.user.findFirst({
               where: {
                  username,
               }
            }) 
             if (!user) {
               return { error: "Utilisateur non trouvé" };
            }
            const test = await bcrypt.compare(password, user?.password as string)
            if (!test) {
               return { error: "Mot de passe incorrect" };
            } */
      // On délègue toute la vérification à "authorize" du CredentialsProvider
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
                  return { error: 'Identifiants invalides' }
               default:
                  return { error: "Erreur d'authentification" }
            }
         }
      }
   } catch (error) {
      console.log(error);
      return { error: "Données invalides" };
   }
};