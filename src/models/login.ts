import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, "El campo 'password' no puede estar vacío."),
  });

export type LoginParams = z.infer<typeof loginSchema>;

export type Login = LoginParams;
