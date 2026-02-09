import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateReservationState } from "@/hooks/use-update-reservation-state";
import { useUser } from "@/lib/auth";
import { formatRecurrence } from "@/lib/rrule";
import { reservationsService } from "@/services/reservations";
import { laboratoriesService } from "@/services/laboratories";
import { usersService } from "@/services/users";
import { RoleEnum } from "@uneg-lab/api-types/auth";
import { ReservationStateEnum } from "@uneg-lab/api-types/reservation";
import {
  skipToken,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  Building2,
  CalendarIcon,
  CheckCircle2,
  ClockIcon,
  History,
  Pencil,
  Printer,
  Repeat2,
  UserRound,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import type { Route } from "./+types/[id]";

function formatDate(value?: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  return d.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(value?: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  return d.toLocaleString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatTimeRange(start?: string | null, end?: string | null) {
  if (start && end) return `${start} - ${end}`;
  if (start) return start;
  return "—";
}

function StateBadge({ state }: { state?: string | null }) {
  const normalized = String(state ?? "")
    .trim()
    .toUpperCase();
  if (!normalized) return <span className="text-muted-foreground">—</span>;

  if (normalized === "PENDIENTE") {
    return (
      <div className="flex h-7 items-center justify-center gap-x-1 rounded-full border border-amber-200 bg-amber-50 px-3">
        <span className="text-amber-600">
          <ClockIcon className="h-4 w-4" />
        </span>
        <p className="text-xs font-bold tracking-wider text-amber-700 uppercase">
          Pendiente
        </p>
      </div>
    );
  }
  if (normalized === "APROBADO") {
    return (
      <div className="flex h-7 items-center justify-center gap-x-1 rounded-full border border-emerald-200 bg-emerald-100 px-3">
        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
        <p className="text-xs font-bold tracking-wider text-emerald-700 uppercase">
          Aprobado
        </p>
      </div>
    );
  }
  if (normalized === "RECHAZADO") {
    return (
      <div className="flex h-7 items-center justify-center gap-x-1 rounded-full border border-rose-200 bg-rose-100 px-3">
        <XCircle className="h-4 w-4 text-rose-600" />
        <p className="text-xs font-bold tracking-wider text-rose-700 uppercase">
          Rechazado
        </p>
      </div>
    );
  }
  if (normalized === "CANCELADO") {
    return (
      <div className="flex h-7 items-center justify-center gap-x-1 rounded-full border border-gray-200 bg-gray-50 px-3">
        <XCircle className="h-4 w-4 text-gray-500" />
        <p className="text-xs font-bold tracking-wider text-gray-600 uppercase">
          Cancelado
        </p>
      </div>
    );
  }

  return <Badge variant="outline">{state}</Badge>;
}

export default function ReservasPage({ params }: Route.ComponentProps) {
  const reservationId = Number(params.id);
  const { user } = useUser();
  const isAdmin = user?.role === RoleEnum.ADMIN;
  const queryClient = useQueryClient();
  const [editOpen, setEditOpen] = useState(false);
  const [editValues, setEditValues] = useState({
    laboratoryId: "",
    startTime: "",
    endTime: "",
    userId: "",
  });

  const { data: reservation, isSuccess } = useQuery({
    queryKey: ["reservation", reservationId],
    queryFn: Number.isFinite(reservationId)
      ? () => reservationsService.getById(reservationId)
      : skipToken,
  });

  const laboratoriesQuery = useQuery({
    queryKey: ["laboratories"],
    queryFn: () => laboratoriesService.getAll(),
    enabled: isAdmin && editOpen,
  });

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: () => usersService.getAll(),
    enabled: isAdmin && editOpen,
  });

  const { mutate: changeState } = useUpdateReservationState();

  const updateMutation = useMutation({
    mutationFn: (payload: {
      laboratoryId?: number;
      defaultStartTime?: string;
      defaultEndTime?: string;
      userId?: string;
    }) => reservationsService.update(reservationId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reservation", reservationId],
      });
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      toast.success("Reserva actualizada");
      setEditOpen(false);
    },
    onError: () => {
      toast.error("No se pudo actualizar la reserva");
    },
  });

  useEffect(() => {
    if (!reservation) return;
    setEditValues({
      laboratoryId: reservation.laboratory?.id
        ? String(reservation.laboratory.id)
        : "",
      startTime: reservation.defaultStartTime?.slice(0, 5) ?? "",
      endTime: reservation.defaultEndTime?.slice(0, 5) ?? "",
      userId: reservation.user?.id ?? "",
    });
  }, [reservation]);

  if (!Number.isFinite(reservationId)) {
    return <div className="p-6">ID inválido</div>;
  }

  if (!isSuccess) {
    return <div className="p-6">Cargando reserva...</div>;
  }

  const canCancelReservation = isAdmin || reservation.user?.id === user?.id;

  const cancelledReservation = () => {
    if (!canCancelReservation) {
      toast.error("No tienes permiso para cancelar esta reserva");
      return;
    }
    if (
      reservation.state?.name === "RECHAZADO" ||
      reservation.state?.name === "CANCELADO"
    ) {
      toast.error("No puedes cancelar una reservacion rechazada o cancelada");
      return;
    }

    changeState({
      id: reservation.id,
      stateId: ReservationStateEnum.CANCELADO,
    });
  };

  const professorName =
    reservation.classInstance?.professor ??
    reservation.user?.name ??
    "Profesor no indicado";
  const labName = reservation.laboratory?.name ?? "Laboratorio sin asignar";
  const schedule = formatTimeRange(
    reservation.defaultStartTime,
    reservation.defaultEndTime,
  );
  const duration =
    reservation.defaultStartTime && reservation.defaultEndTime ? schedule : "—";
  const recurrence = formatRecurrence(reservation.rrule ?? null);
  const until = reservation.endDate
    ? `Hasta el ${formatDate(reservation.endDate)}`
    : "Sin fecha de fin";

  const normalizeTime = (value: string) =>
    value.length === 5 ? `${value}:00` : value;

  const handleUpdateReservation = () => {
    if (!editValues.laboratoryId) {
      toast.error("Selecciona un laboratorio");
      return;
    }
    if (!editValues.startTime || !editValues.endTime) {
      toast.error("Selecciona la hora de inicio y fin");
      return;
    }
    if (editValues.startTime >= editValues.endTime) {
      toast.error("La hora de inicio debe ser menor a la hora de fin");
      return;
    }

    const payload: {
      laboratoryId: number;
      defaultStartTime: string;
      defaultEndTime: string;
      userId?: string;
    } = {
      laboratoryId: Number(editValues.laboratoryId),
      defaultStartTime: normalizeTime(editValues.startTime),
      defaultEndTime: normalizeTime(editValues.endTime),
    };

    if (isAdmin && editValues.userId) {
      payload.userId = editValues.userId;
    }

    updateMutation.mutate(payload);
  };

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col overflow-auto bg-linear-to-br from-gray-50 to-gray-100">
      <main className="flex flex-1 flex-col items-center">
        <div className="flex w-full max-w-300 flex-col gap-6 px-6 py-8">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-primary">
              Inicio
            </Link>
            <span className="text-muted-foreground">›</span>
            <Link
              to="/reservas"
              className="text-muted-foreground hover:text-primary"
            >
              Reservas
            </Link>
            <span className="text-muted-foreground">›</span>
            <span className="font-medium text-slate-900">
              Detalle #{reservation.id}
            </span>
          </div>

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-black text-slate-900">
                  {reservation.name ?? "Detalle de reserva"}
                </h1>
                <StateBadge state={reservation.state?.name} />
              </div>
              <p className="text-muted-foreground text-base">
                ID de Solicitud:{" "}
                <span className="font-mono">#{reservation.id}</span>
                {reservation.createdAt
                  ? ` • Solicitado el ${formatDate(reservation.createdAt)}`
                  : ""}
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2">
                <Printer className="h-4 w-4" />
                Imprimir Comprobante
              </Button>
              {isAdmin && (
                <Dialog open={editOpen} onOpenChange={setEditOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Pencil className="h-4 w-4" />
                      Editar Reserva
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                      <DialogTitle>Editar reserva</DialogTitle>
                      <DialogDescription>
                        Actualiza el laboratorio, horario y el solicitante si es
                        necesario.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="edit-laboratory">Laboratorio</Label>
                        <Select
                          value={editValues.laboratoryId}
                          onValueChange={(value) =>
                            setEditValues((prev) => ({
                              ...prev,
                              laboratoryId: value,
                            }))
                          }
                        >
                          <SelectTrigger id="edit-laboratory">
                            <SelectValue placeholder="Selecciona un laboratorio" />
                          </SelectTrigger>
                          <SelectContent>
                            {laboratoriesQuery.isPending && (
                              <SelectItem value="loading" disabled>
                                Cargando...
                              </SelectItem>
                            )}
                            {laboratoriesQuery.data?.map((lab) => (
                              <SelectItem key={lab.id} value={String(lab.id)}>
                                {lab.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="grid gap-2">
                          <Label htmlFor="edit-start-time">Hora inicio</Label>
                          <Input
                            id="edit-start-time"
                            type="time"
                            value={editValues.startTime}
                            onChange={(event) =>
                              setEditValues((prev) => ({
                                ...prev,
                                startTime: event.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="edit-end-time">Hora fin</Label>
                          <Input
                            id="edit-end-time"
                            type="time"
                            value={editValues.endTime}
                            onChange={(event) =>
                              setEditValues((prev) => ({
                                ...prev,
                                endTime: event.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>

                      {isAdmin && (
                        <div className="grid gap-2">
                          <Label htmlFor="edit-user">Asignar a</Label>
                          <Select
                            value={editValues.userId}
                            onValueChange={(value) =>
                              setEditValues((prev) => ({
                                ...prev,
                                userId: value,
                              }))
                            }
                          >
                            <SelectTrigger id="edit-user">
                              <SelectValue placeholder="Selecciona un usuario" />
                            </SelectTrigger>
                            <SelectContent>
                              {usersQuery.isPending && (
                                <SelectItem value="loading-users" disabled>
                                  Cargando...
                                </SelectItem>
                              )}
                              {usersQuery.data?.map((person) => (
                                <SelectItem key={person.id} value={person.id}>
                                  {person.name} ({person.username})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>

                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setEditOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleUpdateReservation}
                        disabled={updateMutation.isPending}
                      >
                        {updateMutation.isPending
                          ? "Guardando..."
                          : "Guardar cambios"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="flex flex-col gap-6 lg:col-span-2">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Card className="p-5">
                  <div className="flex gap-4">
                    <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
                      <UserRound className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-muted-foreground text-xs font-bold uppercase">
                        Solicitante
                      </p>
                      <p className="text-base font-semibold text-slate-900">
                        {professorName}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {reservation.user?.email ?? "—"}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-5">
                  <div className="flex gap-4">
                    <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-muted-foreground text-xs font-bold uppercase">
                        Laboratorio Asignado
                      </p>
                      <p className="text-base font-semibold text-slate-900">
                        {labName}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {reservation.laboratory?.id
                          ? `ID: ${reservation.laboratory.id}`
                          : "—"}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-5">
                  <div className="flex gap-4">
                    <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
                      <CalendarIcon className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-muted-foreground text-xs font-bold uppercase">
                        Horario
                      </p>
                      <p className="text-base font-semibold text-slate-900">
                        {schedule}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Duración: {duration}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-5">
                  <div className="flex gap-4">
                    <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
                      <Repeat2 className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-muted-foreground text-xs font-bold uppercase">
                        Recurrencia
                      </p>
                      <p className="text-base font-semibold text-slate-900">
                        {recurrence}
                      </p>
                      {reservation.rrule && (
                        <p className="text-muted-foreground text-xs">
                          {reservation.rrule}
                        </p>
                      )}
                      <p className="text-muted-foreground text-xs">{until}</p>
                    </div>
                  </div>
                </Card>
              </div>

              <Card className="p-6">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
                  Información adicional
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <p className="text-muted-foreground mb-2 text-xs font-bold uppercase">
                      Tipo de reserva
                    </p>
                    <p className="text-sm">{reservation.type?.name ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-2 text-xs font-bold uppercase">
                      Estado
                    </p>
                    <p className="text-sm">{reservation.state?.name ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-2 text-xs font-bold uppercase">
                      Profesor
                    </p>
                    <p className="text-sm">
                      {reservation.classInstance?.professor ?? "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-2 text-xs font-bold uppercase">
                      Asistentes estimados
                    </p>
                    <p className="text-sm">
                      {reservation.event?.stimatedAssistants ?? "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-2 text-xs font-bold uppercase">
                      Recurrencias
                    </p>
                    <p className="text-sm">{reservation.rrule ? "Sí" : "No"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-2 text-xs font-bold uppercase">
                      Ocupaciones
                    </p>
                    <p className="text-sm">
                      {reservation.ocupations?.length ?? 0}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="flex flex-col gap-6">
              <Card className="h-full p-6">
                <h3 className="mb-6 flex items-center gap-2 text-lg font-bold">
                  <History className="h-5 w-5" /> Historial de Solicitud
                </h3>
                <div className="border-muted relative ml-2 flex flex-col gap-8 border-l-2 pl-6">
                  <div className="relative">
                    <div className="absolute top-0 -left-8.25 size-4 rounded-full border-4 border-white bg-emerald-500" />
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-slate-900">
                          Reserva {reservation.state?.name ?? "Actualizada"}
                        </p>
                        <span className="text-muted-foreground text-[10px] font-medium tracking-tighter uppercase">
                          {formatDateTime(reservation.approvedAt)}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-xs">
                        Por: {reservation.user?.name ?? "Sistema"}
                      </p>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="bg-primary absolute top-0 -left-8.25 size-4 rounded-full border-4 border-white" />
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-slate-900">
                          Solicitud Creada
                        </p>
                        <span className="text-muted-foreground text-[10px] font-medium tracking-tighter uppercase">
                          {formatDateTime(reservation.createdAt)}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-xs">
                        Por: {reservation.user?.name ?? "Sistema"}
                      </p>
                    </div>
                  </div>
                </div>
                {canCancelReservation && (
                  <div className="mt-6">
                    <Button
                      onClick={() => {
                        cancelledReservation();
                      }}
                      disabled={
                        reservation.state?.name === "RECHAZADO" ||
                        reservation.state?.name === "CANCELADO"
                      }
                      variant="outline"
                      className={`${
                        reservation.state?.name === "RECHAZADO" ||
                        reservation.state?.name === "CANCELADO"
                          ? "pointer-events-none cursor-not-allowed bg-gray-200 text-gray-500"
                          : "border-rose-200 text-rose-600 hover:bg-rose-50"
                      } w-full`}
                    >
                      Cancelar Reserva
                    </Button>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
