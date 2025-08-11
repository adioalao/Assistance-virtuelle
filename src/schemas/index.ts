import { z } from "zod";

export const LoginSchema = z.object({
   username: z.string().min(3, { message: "L'identifiant doit contenir au moins 3 caractères" }),
   password: z.string().min(3, { message: "Le mot de passe doit comporter au moins 3 caractères" }),
});