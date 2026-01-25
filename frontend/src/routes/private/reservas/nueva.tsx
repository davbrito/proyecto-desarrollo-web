import ReservationForm from "@/components/reservas/reservation-form";
import { AvailableHours } from "@/components/reservas/reservation-form/schema";
import type { Route } from "./+types/nueva";
import { useEffect } from "react";
import { getAccessToken } from "@/lib/auth";
import { useState } from "react";

export async function clientLoader() {
  return {
    availableHours: AvailableHours,
  };
}

export default function NuevaReserva({ loaderData }: Route.ComponentProps) {
  const [laboratorys, setLaboratorys] = useState([]);
  const [stateEventType, setEventType] = useState([]);
  const [reserved, sethoursReserved] = useState([]);

  useEffect(() => {
    const fetchDataLaboratory = async () => {
      const token = await getAccessToken();

      try {
        const res = await fetch("http://localhost:3000/api/laboratories", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }

        const data = await res.json();

        setLaboratorys(data);
      } catch (error) {
        console.error("Error al obtener laboratorios:", error);
      }
    };

    const fetchDataTypeActivity = async () => {
      const token = await getAccessToken();
      try {
        const res = await fetch("http://localhost:3000/api/reserve-types", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }

        const data = await res.json();

        setEventType(data);
      } catch (error) {
        console.error("Error al obtener laboratorios:", error);
      }
    };

    const reservedHours = async () => {
      const token = await getAccessToken();
      try {
        const res = await fetch("http://localhost:3000/api/reservations", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }

        const data = await res.json();

        const reserved = data.map((reser: any) => ({
          startDate: reser.startDate,
          defaultStartTime: reser.defaultStartTime,
        }));
        sethoursReserved(reserved);
      } catch (error) {
        console.error("Error al obtener laboratorios:", error);
      }
    };

    reservedHours();
    fetchDataTypeActivity();
    fetchDataLaboratory();
  }, []);

  return (
    <ReservationForm
      availableHours={loaderData.availableHours}
      availableLaboratory={laboratorys}
      stateTypeEvent={stateEventType}
      reserved={reserved}
    />
  );
}
