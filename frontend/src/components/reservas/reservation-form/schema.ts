import type { FormMetadata } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod/v4";
import { redirect } from "react-router";
import z from "zod";

function requiredString(message = "Este campo es obligatorio") {
  return (ctx: z.core.$ZodRawIssue) => {
    return ctx.input ? "Valor inválido" : message;
  };
}

export const reservationFormSchema = z.object({
  date: z
    .string({ error: requiredString("La fecha es requerida") })
    .nonempty("La fecha es requerida"),
  time: z.string({ error: requiredString() }).nonempty("La hora es requerida"),
  description: z.string().optional(),
});

export type ReservationFormMetadata = FormMetadata<
  z.infer<typeof reservationFormSchema>
>;

export const AvailableHours = [
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
];

export async function reservationFormAction(formData: FormData) {
  const submission = parseWithZod(formData, { schema: reservationFormSchema });
  console.log("Submission:", submission);

  if (submission.status !== "success") {
    return submission.reply();
  }

  const value = submission.value;

  if (!AvailableHours.includes(value.time)) {
    return submission.reply({
      fieldErrors: {
        time: ["La hora seleccionada no está disponible"],
      },
    });
  }

  // TODO: Replace with actual API call
  console.log("Reservación creada:", value);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  throw redirect("/reservas");
}
