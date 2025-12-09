import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  getFormProps,
  getInputProps,
  getTextareaProps,
  useForm,
  useInputControl,
  type SubmissionResult,
} from "@conform-to/react";
import { formatDate, parse } from "date-fns";
import { Form, Link, useNavigation } from "react-router";
import type z from "zod";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import CalendarReservation from "../calendar-reservation";
import type { reservationFormSchema } from "./schema";

export interface ModalReservasionProps {
  lastResult: SubmissionResult<string[]> | null | undefined;
  availableHours: string[];
}

function ModalReservasion({
  lastResult,
  availableHours,
}: ModalReservasionProps) {
  const submitting = useNavigation().state === "submitting";
  const [form, fields] = useForm({
    lastResult,
    defaultValue: {
      date: "",
      time: "",
      description: "",
    } satisfies z.infer<typeof reservationFormSchema>,
  });

  const dateControl = useInputControl(fields.date);
  const dateValue = dateControl.value
    ? parse(dateControl.value, "yyyy-MM-dd", new Date())
    : undefined;

  return (
    <Form
      method="post"
      {...getFormProps(form)}
      className="p-4 md:h-full md:w-auto"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[400px_1fr]">
        <div className="flex flex-col gap-2">
          <div className="flex justify-center gap-14">
            <div className="flex items-center gap-2 text-sm">
              <div className="h-4 w-4 rounded-full bg-[#0FF48D]"></div>
              <span>Disponible</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="h-4 w-4 rounded-full bg-[#FF600B]"></div>
              <span>No Disponible</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col items-center">
              <h2 className="text-center text-xl font-bold">
                Calendario de Reservas
              </h2>
              <p className="text-center">
                Selecciona un dia para ver la disponibilidad
              </p>
            </div>
            <div className="flex flex-col items-center justify-center gap-4 p-4">
              {dateControl.value}
              <CalendarReservation
                selected={dateValue}
                onSelect={(date) => {
                  const isoDate = date ? formatDate(date, "yyyy-MM-dd") : "";
                  dateControl.change(isoDate);
                }}
              />
              <FieldError>{fields.date.errors}</FieldError>
              <p className="text-destructive px-2 text-center leading-tight font-semibold text-pretty">
                <span>Nota:</span> Las reservas duran 2 horas para dar clases
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-stretch gap-4">
          <div className="w-96 self-center rounded-lg border bg-zinc-50 py-3 text-center shadow-md">
            <h2 className="text-xl font-semibold">
              {dateValue
                ? formatDate(dateValue, "d 'de' MMMM yyyy")
                : "Selecciona una fecha"}
            </h2>
            <p className="text-red-800">Horas de Reservas no disponibles</p>
            <span className="text-red-800"> 9am - 11 am - 1pm</span>
          </div>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor={fields.time.id}>
                Selecciona la hora a reservar
              </FieldLabel>
              <Input
                list="horas-disponibles"
                {...getInputProps(fields.time, { type: "time" })}
              />
              <FieldError id={fields.time.errorId}>
                {fields.time.errors}
              </FieldError>
              <datalist id="horas-disponibles">
                {availableHours.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                ))}
              </datalist>
            </Field>

            <Field>
              <FieldLabel htmlFor="message">
                Escribe una descripcion del motivo de reserva
              </FieldLabel>
              <Textarea
                {...getTextareaProps(fields.description)}
                placeholder="Escribe por que necesitas reservar este espacio"
              />
              <FieldError id={fields.description.errorId}>
                {fields.description.errors}
              </FieldError>
            </Field>
          </FieldGroup>
          <Field
            orientation="horizontal"
            className="flex-col items-stretch justify-end md:flex-row md:items-center"
          >
            <Button asChild type="button" variant="secondary">
              <Link to="/reservas">Cancelar</Link>
            </Button>
            <Button type="submit" variant="default" disabled={submitting}>
              Aceptar
            </Button>
          </Field>
        </div>
      </div>
    </Form>
  );
}

export default ModalReservasion;
