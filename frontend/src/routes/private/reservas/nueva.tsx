import ReservationForm from "@/components/reservas/reservation-form";
import { AvailableHours } from "@/components/reservas/reservation-form/schema";
import { apiClient } from "@/lib/api";
import { useUser } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { RoleEnum } from "@uneg-lab/api-types/auth";
import { Loader2 } from "lucide-react";
export default function NuevaReserva() {
  const { user } = useUser();

  const laboratories = useQuery({
    queryKey: ["laboratories"],
    queryFn: ({ signal }) =>
      apiClient
        .get("laboratories", { signal, throwHttpErrors: true })
        .json<any[]>(),
  });

  const reserveTypes = useQuery({
    queryKey: ["reserve-types"],
    queryFn: ({ signal }) =>
      apiClient
        .get("reserve-types", { signal, throwHttpErrors: true })
        .json<any[]>(),
  });

  const reservations = useQuery({
    queryKey: ["reservations"],
    queryFn: ({ signal }) =>
      apiClient
        .get("reservations", { signal, throwHttpErrors: true })
        .json<{ data: any[] }>()
        .then((response) => response.data),
  });

  const shouldLoadUsers = !!user && user.role === RoleEnum.ADMIN;

  const users = useQuery({
    queryKey: ["users"],
    queryFn: ({ signal }) =>
      apiClient.get("users", { signal, throwHttpErrors: true }).json<any[]>(),
    enabled: shouldLoadUsers, // Solo cargar usuarios si el usuario es admin
  });

  const isPending =
    laboratories.isPending ||
    reserveTypes.isPending ||
    reservations.isPending ||
    (shouldLoadUsers && users.isPending);

  if (isPending) {
    return (
      <div className="flex min-h-60 items-center justify-center">
        <div className="flex items-center gap-3 rounded-md border bg-white px-4 py-2 shadow-sm">
          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
          <p className="text-sm text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <ReservationForm
      availableHours={AvailableHours}
      availableLaboratory={laboratories.data ?? []}
      stateTypeEvent={reserveTypes.data ?? []}
      reserved={reservations.data ?? []}
      users={users.data ?? []}
    />
  );
}
