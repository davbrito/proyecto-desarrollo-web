import { cn } from "@/lib/utils";
import { addYears, endOfYear } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "../ui/calendar";

interface Props {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
}

function CalendarReservation({ selected, onSelect }: Props) {
  const today = new Date();
  const endMonth = endOfYear(addYears(today, 1));

  const bookedDates = [new Date(2025, 11, 11)];

  return (
    <Calendar
      locale={es}
      captionLayout="dropdown"
      mode="single"
      className="w-8/10 rounded-lg border shadow-sm"
      selected={selected}
      onSelect={onSelect}
      startMonth={today}
      endMonth={endMonth}
      disabled={[
        ...bookedDates, //dia 11 para mostrar no disponible de reserva full
        { before: new Date() }, // deshabilita los dias anteriores a hoy
        { dayOfWeek: [0, 6] }, // deshabilita los fines de semana (0 es domingo, 6 es sábado)
      ]} // es clave para desactivar cuando este full una reserva se transformara en un array posteriormente
      modifiers={{ booked: bookedDates }} // selecciona el ano - fecha - dia a modificar
      modifiersClassNames={{
        // estilos para dias modificados
        booked: cn(
          "rounded-lg border opacity-100! *:opacity-100!",
          "after:absolute after:top-0 after:right-0 after:size-2 after:-translate-x-2/4 after:translate-y-2/4 after:rounded-full after:bg-[#FF600B] after:content-['']",
        ),
      }}
      required
    />
  );
}

export default CalendarReservation;
