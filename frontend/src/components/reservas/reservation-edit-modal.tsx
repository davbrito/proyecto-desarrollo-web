import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import type { Reservation } from "@uneg-lab/api-types/reservation";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reservationsService } from "@/services/reservations";

type ReservationEditFormValues = {
  laboratoryId: string;
  startTime: string;
  endTime: string;
  userId: string;
};

type SimpleQueryState<T> = {
  data?: T[];
  isPending: boolean;
};

type LaboratoryOption = {
  id: number;
  name: string;
};

type UserOption = {
  id: string;
  name: string;
  username: string;
};

type ReservationEditModalProps = {
  isAdmin: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reservation: Reservation;
  laboratoriesQuery: SimpleQueryState<LaboratoryOption>;
  usersQuery: SimpleQueryState<UserOption>;
  isSubmitting?: boolean;
};

export function ReservationEditModal({
  isAdmin,
  open,
  onOpenChange,
  reservation,
  laboratoriesQuery,
  usersQuery,
  isSubmitting,
}: ReservationEditModalProps) {
  const queryClient = useQueryClient();
  const form = useForm<ReservationEditFormValues>({
    values: {
      laboratoryId: reservation.laboratory?.id
        ? String(reservation.laboratory.id)
        : "",
      startTime: reservation.defaultStartTime?.slice(0, 5) ?? "",
      endTime: reservation.defaultEndTime?.slice(0, 5) ?? "",
      userId: reservation.user?.id ?? "",
    },
  });

  const { control, register, handleSubmit } = form;

  const normalizeTime = (value: string) =>
    value.length === 5 ? `${value}:00` : value;

  const updateMutation = useMutation({
    mutationFn: (payload: {
      laboratoryId: number;
      defaultStartTime: string;
      defaultEndTime: string;
      userId?: string;
    }) => reservationsService.update(reservation.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reservation", reservation.id],
      });
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      toast.success("Reserva actualizada");
      onOpenChange(false);
    },
    onError: () => {
      toast.error("No se pudo actualizar la reserva");
    },
  });

  const handleFormSubmit = handleSubmit((values) => {
    if (!values.laboratoryId) {
      toast.error("Selecciona un laboratorio");
      return;
    }
    if (!values.startTime || !values.endTime) {
      toast.error("Selecciona la hora de inicio y fin");
      return;
    }
    if (values.startTime >= values.endTime) {
      toast.error("La hora de inicio debe ser menor a la hora de fin");
      return;
    }

    const payload: {
      laboratoryId: number;
      defaultStartTime: string;
      defaultEndTime: string;
      userId?: string;
    } = {
      laboratoryId: Number(values.laboratoryId),
      defaultStartTime: normalizeTime(values.startTime),
      defaultEndTime: normalizeTime(values.endTime),
    };

    if (isAdmin && values.userId) {
      payload.userId = values.userId;
    }

    updateMutation.mutate(payload);
  });

  if (!isAdmin) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Editar reserva</DialogTitle>
          <DialogDescription>
            Actualiza el laboratorio, horario y el solicitante si es necesario.
          </DialogDescription>
        </DialogHeader>

        <form className="grid gap-4" onSubmit={handleFormSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="edit-laboratory">Laboratorio</Label>
            <Controller
              control={control}
              name="laboratoryId"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
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
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="edit-start-time">Hora inicio</Label>
              <Input
                id="edit-start-time"
                type="time"
                {...register("startTime")}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-end-time">Hora fin</Label>
              <Input id="edit-end-time" type="time" {...register("endTime")} />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-user">Asignar a</Label>
            <Controller
              control={control}
              name="userId"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
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
              )}
            />
          </div>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleFormSubmit}
            disabled={isSubmitting || updateMutation.isPending}
          >
            {isSubmitting || updateMutation.isPending
              ? "Guardando..."
              : "Guardar cambios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
