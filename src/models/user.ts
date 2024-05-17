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
  password: z
    .string({
      required_error: "Password es requerido",
      invalid_type_error: "Password debe ser un string",
    })
    .min(6, "Password debe tener al menos 6 caracteres"),
  age: z 
  .number({
    required_error: "Age es requerido",
    invalid_type_error: "Age debe ser un number",
  })
  .min(1),
  role: z
    .enum(["admin", "user"], {
      errorMap: () => ({ message: "El rol debe ser admin o user" }),
    })
    .default("user"),
});

export type UserParams = z.infer<typeof userSchema>;

export type User = UserParams & { id: number };
