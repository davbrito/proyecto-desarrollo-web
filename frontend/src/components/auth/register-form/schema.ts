import { RegisterSchema } from "@uneg-lab/api-types/auth";
import * as z from "zod";

export const registerFormSchema = RegisterSchema.extend({
  confirmPassword: z.string({ error: "Confirma la contraseña" }),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Las contraseñas no coinciden",
});
