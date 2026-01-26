import { z } from "zod";
import { UserSchema } from "./auth";

export const ReservationTypeNames = {
  PENDIENTE: "PENDIENTE",
  APROBADO: "APROBADO",
  RECHAZADO: "RECHAZADO",
  CANCELADO: "CANCELADO",
} as const;

export const ReservationSchema = z.object({
  id: z.number(),
  startDate: z.string(),
  defaultStartTime: z.string().optional(),
  defaultEndTime: z.string().optional(),
  state: z.object({ id: z.number(), name: z.string() }).optional(),
  type: z.object({ id: z.number(), name: z.string() }).optional(),
  user: UserSchema.optional(),
  laboratory: z
    .object({ id: z.number().optional(), name: z.string().optional() })
    .optional(),
});

export type Reservation = z.infer<typeof ReservationSchema>;
