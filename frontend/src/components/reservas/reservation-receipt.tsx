import type { Ref } from "react";
import {
  ReservationStateEnum,
  type Reservation,
} from "@uneg-lab/api-types/reservation";

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

export type ReservationReceiptProps = {
  ref?: Ref<HTMLDivElement>;
  reservation: Reservation;
};

export function ReservationReceipt({
  ref,
  reservation,
}: ReservationReceiptProps) {
  const professorName =
    reservation.classInstance?.professor ??
    reservation.user?.name ??
    "Profesor no indicado";
  const professorEmail = reservation.user?.email ?? null;
  const labName = reservation.laboratory?.name ?? "Laboratorio sin asignar";
  const laboratoryId = reservation.laboratory?.id ?? null;
  const schedule = [reservation.defaultStartTime, reservation.defaultEndTime]
    .filter(Boolean)
    .join(" - ");
  const duration = schedule || "—";
  const recurrence = reservation.rrule ? "Recurrente" : "Única";
  const until = reservation.endDate
    ? `Hasta el ${formatDate(reservation.endDate)}`
    : "Sin fecha de fin";
  const typeName = reservation.type?.name ?? "—";
  const stateName = reservation.state?.name ?? "—";
  const stateId = reservation.state?.id ?? null;
  const professor = reservation.user?.name ?? "—";
  const assistants = reservation.event?.stimatedAssistants ?? null;
  const hasRecurrence = !!reservation.rrule;
  return (
    <div
      ref={ref}
      className="mx-auto max-w-105 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <div className="mb-3 text-center">
        <div className="text-lg font-extrabold text-slate-900">
          Comprobante de Reserva
        </div>
        <div className="text-xs text-slate-500">
          ID #{reservation.id} • {formatDate(reservation.createdAt)}
        </div>
      </div>

      <div className="border-t border-dashed border-slate-200 py-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold tracking-wide text-slate-500 uppercase">
            Solicitante
          </span>
          <span className="font-semibold text-slate-900">{professorName}</span>
        </div>
        <div className="mt-2 text-xs text-slate-500">
          {professorEmail ?? "—"}
        </div>
        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="font-semibold tracking-wide text-slate-500 uppercase">
            Laboratorio
          </span>
          <span className="font-semibold text-slate-900">{labName}</span>
        </div>
        <div className="mt-2 text-xs text-slate-500">
          {laboratoryId ? `ID: ${laboratoryId}` : "—"}
        </div>
      </div>

      <div className="border-t border-dashed border-slate-200 py-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold tracking-wide text-slate-500 uppercase">
            Horario
          </span>
          <span className="font-semibold text-slate-900">{schedule}</span>
        </div>
        <div className="mt-2 text-xs text-slate-500">Duración: {duration}</div>
        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="font-semibold tracking-wide text-slate-500 uppercase">
            Recurrencia
          </span>
          <span className="font-semibold text-slate-900">{recurrence}</span>
        </div>
        <div className="mt-2 text-xs text-slate-500">{until}</div>
      </div>

      <div className="border-t border-dashed border-slate-200 py-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold tracking-wide text-slate-500 uppercase">
            Tipo
          </span>
          <span className="font-semibold text-slate-900">{typeName}</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="font-semibold tracking-wide text-slate-500 uppercase">
            Estado
          </span>
          <span className="font-semibold text-slate-900">{stateName}</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="font-semibold tracking-wide text-slate-500 uppercase">
            Profesor
          </span>
          <span className="font-semibold text-slate-900">{professor}</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="font-semibold tracking-wide text-slate-500 uppercase">
            Asistentes
          </span>
          <span className="font-semibold text-slate-900">
            {assistants !== null && assistants !== undefined ? assistants : "—"}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="font-semibold tracking-wide text-slate-500 uppercase">
            Recurrencias
          </span>
          <span className="font-semibold text-slate-900">
            {hasRecurrence ? "Sí" : "No"}
          </span>
        </div>
      </div>

      <div className="border-t border-dashed border-slate-200 py-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold tracking-wide text-slate-500 uppercase">
            Solicitud creada
          </span>
          <span className="font-semibold text-slate-900">
            {formatDateTime(reservation.createdAt)}
          </span>
        </div>
        {stateId === ReservationStateEnum.APROBADO && (
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="font-semibold tracking-wide text-slate-500 uppercase">
              Aprobación
            </span>
            <span className="font-semibold text-slate-900">
              {formatDateTime(reservation.approvedAt)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
