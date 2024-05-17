import { z } from "zod";

export const adminSchema = z.object({
  password: z
    .string({
      required_error: "Password es requerido",
      invalid_type_error: "Password debe ser un string",
  })
  .min(6, "Password debe tener al menos 6 caracteres"),
  });


  export type AdminParams = z.infer<typeof adminSchema>;

  export type Admin = AdminParams & { id: number };
