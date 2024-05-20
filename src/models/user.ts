import { z } from "zod";

export const userSchema = z.object({
  name: z
    .string({
      required_error: "Name es requerido",
      invalid_type_error: "Name debe ser un string",
    }),
  email: z
    .string({
      required_error: "Email es requerido",
      invalid_type_error: "Email debe ser un string",
    })
    .email({
      message: "Email no es un email válido",
    }),
  age: z 
  .number().int().positive(),
  role: z
    .enum(["admin", "user"], {
      errorMap: () => ({ message: "El rol debe ser admin o user" }),
    })
    .default("user"),
});

export type UserParams = z.infer<typeof userSchema>;

export type User = UserParams & { id: number };
