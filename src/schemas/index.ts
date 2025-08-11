import { z } from "zod";

export const RegisterSchema = z.object({
   name: z.string().min(1, { message: "Votre nom est requis" }),
   username: z.string().min(3, { message: "L'identifiant contient au moins 4 caractères" }),
   password: z.string().min(3, { message: "Le mot de passe doit comporter au moins 3 caractères" })
})