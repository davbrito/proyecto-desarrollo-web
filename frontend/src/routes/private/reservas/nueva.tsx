import ModalReservasion from "@/components/reservas/reservation-form";
import {
  AvailableHours,
  reservationFormAction,
} from "@/components/reservas/reservation-form/schema";
import type { Route } from "./+types/nueva";

export async function clientAction({ request }: Route.ClientActionArgs) {
  const data = await request.formData();
  return await reservationFormAction(data);
}

export async function clientLoader() {
  return {
    availableHours: AvailableHours,
  };
}

export default function NuevaReserva({
  actionData,
  loaderData,
}: Route.ComponentProps) {
  return (
    <ModalReservasion
      lastResult={actionData}
      availableHours={loaderData.availableHours}
    />
  );
}
