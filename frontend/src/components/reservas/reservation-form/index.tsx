import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatDate } from "date-fns";
import { useId } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import CalendarReservation from "../calendar-reservation";
import { reservationFormAction, reservationFormSchema } from './schema';
import { setErrorFromServer } from "@/lib/api";
import postReservation from "./PostReservation";

export interface ModalReservasionProps {
  availableHours: string[];
  availableLaboratory: { id: number; name: string; active: boolean, number: number }[];
  stateTypeEvent: {
    id: any;
    name: string;
    minimalAnticipation: number;
    blockDuration: number;
    priority: number;
    needsApproval: boolean;
  }[];
}

function ReservationForm({ availableHours, availableLaboratory, stateTypeEvent }: ModalReservasionProps) {
  const navigate = useNavigate();
  const formId = useId();
  const form = useForm({
    resolver: zodResolver(reservationFormSchema),
  });
  const { register, handleSubmit, formState, setError, control } = form;
  const { isSubmitting, errors } = formState;

  const dateValue = useWatch({ control, name: "date" });

  return (
    <form
      noValidate
      onSubmit={handleSubmit(async (data) => {

        const authDataRaw = localStorage.getItem("auth");


        const authData = JSON.parse(authDataRaw as string);
        const userId = authData.state.user.id;



        try {
          console.log(data)

          const sendData = {
            userId: userId,
            name: data.description,
            startDate: data.date.toISOString().split('T')[0],
            endDate: null,
            rrule: null,
            defaultStartTime: data.start_time + ":00",
            defaultEndTime: data.end_time + ":00",
            laboratoryId: Number(data.laboratorio),
            stateId: 1,
            typeId: Number(data.type_event)
          }
          await postReservation(sendData);
          // navigate("/reservas");
        } catch (error) {
          setErrorFromServer(setError, error);
          console.log(error)
          return;
        }
      })}
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
              <Controller
                control={control}
                name="date"
                render={({ field }) => (
                  <CalendarReservation
                    selected={field.value}
                    onSelect={(date) => {
                      field.onChange(date);
                    }}
                  />
                )}
              />
              <FieldError>{errors.date?.message}</FieldError>
              <p className="text-destructive px-2 text-center leading-tight font-semibold text-pretty">
                <span>Nota:</span> Las reservas tienen una duración de 2 horas
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-stretch gap-4">
          <div className="w-96 self-center rounded-lg border bg-zinc-50 p-5 text-center shadow-md">
            <h2 className="text-xl font-semibold">
              {dateValue
                ? "Seleccionaste " + formatDate(dateValue, "d 'de' MMMM yyyy")
                : "Selecciona una fecha"}
            </h2>
            {/* <p className="text-red-800">Horas de Reservas no disponibles</p>
            <span className="text-red-800"> 9am - 11 am - 1pm</span> */}
          </div>

          <FieldGroup>
            <Field>

              <FieldLabel htmlFor="laboratorio-selection">
                Selecciona un laboratorio
              </FieldLabel>

              <select
                id="laboratorio-selection"
                {...register("laboratorio")}
                className="w-full p-2 border rounded-md"

              >
                <option value="">Selecciona</option>
                {availableLaboratory.map((laboratory: any) => (
                  laboratory.active === true && (
                    <option key={laboratory.id} value={laboratory.id}>
                      {laboratory.name}
                    </option>
                  )
                ))}
              </select>

              <FieldError>{errors.laboratorio?.message}</FieldError>
            </Field>


            <Field>
              <FieldLabel htmlFor="tipo-evento">
                Selecciona el tipo de evento
              </FieldLabel>

              <select
                id="tipo de evento"
                {...register("type_event")}
                className="w-full p-2 border rounded-md"

              >
                <option value="">Selecciona</option>
                {stateTypeEvent.map((state) => (
                  <option key={state.id} value={state.id}>
                    {state.name}
                  </option>
                ))}
              </select>

              <FieldError>{errors.type_event?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor={`${formId}-time`}>
                Selecciona la hora a reservar
              </FieldLabel>
              <Input
                list="horas-disponibles"
                type="time"
                {...register("start_time")}
              />
              <FieldError>{errors.start_time?.message}</FieldError>
              <datalist id="horas-disponibles">
                {availableHours.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                ))}
              </datalist>
            </Field>
            <Field>
              <FieldLabel htmlFor={`${formId}-time`}>
                Selecciona la hora de finalizacion
              </FieldLabel>
              <Input
                list="horas-disponibles"
                type="time"
                {...register("end_time")}
              />
              <FieldError>{errors.end_time?.message}</FieldError>
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
                id="message"
                {...register("description")}
                rows={4}
                placeholder="Escribe por que necesitas reservar este espacio"
              />
              <FieldError>{errors.description?.message}</FieldError>
            </Field>
          </FieldGroup>
          <FieldError>{errors.root?.message}</FieldError>
          <Field
            orientation="horizontal"
            className="flex-col items-stretch justify-end md:flex-row md:items-center"
          >
            <Button asChild type="button" variant="secondary">
              <Link to="/reservas">Cancelar</Link>
            </Button>
            <Button type="submit" variant="default" /*d isabled={isSubmitting} */ >
              Aceptar
            </Button>
          </Field>
        </div>
      </div>
    </form>
  );
}

export default ReservationForm;
