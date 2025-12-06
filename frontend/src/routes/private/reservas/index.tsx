import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import type { Route } from "./+types";

type Reserva = {
  id: number;
  nombre: string;
  fecha: string;
  estado: "Pendiente" | "Aprobada" | "Cancelada";
  descripcion: string;
};

const MOCK_RESERVAS: Reserva[] = [
  {
    id: 3,
    nombre: "Carlos López",
    fecha: "19/11/2025",
    estado: "Pendiente",
    descripcion: "Reserva para reunión de equipo",
  },
  {
    id: 4,
    nombre: "Ana Martínez",
    fecha: "21/11/2025",
    estado: "Aprobada",
    descripcion: "Reserva de sala de conferencias",
  },
  {
    id: 5,
    nombre: "Carlos López",
    fecha: "19/11/2025",
    estado: "Pendiente",
    descripcion: "Reserva para reunión de equipo",
  },
  {
    id: 6,
    nombre: "Ana Martínez",
    fecha: "21/11/2025",
    estado: "Aprobada",
    descripcion: "Reserva de sala de conferencias",
  },
];

export function clientLoader() {
  // Aquí podrías cargar datos reales desde una API o base de datos
  return MOCK_RESERVAS;
}

export default function Reservas({
  loaderData: reservas,
}: Route.ComponentProps) {
  const [activeTab, setActiveTab] = useState<"reservas" | "solicitudes">(
    "reservas",
  );

  return (
    <section>
      <header className="flex flex-wrap justify-between gap-5 p-3">
        <div>
          <CardTitle className="text-lg">Gestion de Solicitudes</CardTitle>
          <CardDescription>
            Administra consultas y reservas de manera eficiente
          </CardDescription>
        </div>

        <Button asChild variant="default" className="w-full md:w-auto">
          <Link to="/reservas/new">
            <Plus className="size-4" />
            Nueva Reserva
          </Link>
        </Button>
      </header>

      <div className="p-3">
        <ToggleGroup
          className="mb-4"
          variant="rounded"
          type="single"
          value={activeTab}
          onValueChange={setActiveTab as any}
          spacing={1}
        >
          <ToggleGroupItem variant="rounded" value="reservas" size="sm">
            Reservas
          </ToggleGroupItem>
          <ToggleGroupItem variant="rounded" value="solicitudes" size="sm">
            Solicitudes
          </ToggleGroupItem>
        </ToggleGroup>

        <h3 className="mb-4 font-semibold">Lista De Reservas</h3>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservas.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.id}</TableCell>
                <TableCell>{r.nombre}</TableCell>
                <TableCell>{r.fecha}</TableCell>
                <TableCell>
                  {r.estado === "Pendiente" && (
                    <Badge variant="destructive">{r.estado}</Badge>
                  )}
                  {r.estado === "Aprobada" && (
                    <Badge variant="secondary">{r.estado}</Badge>
                  )}
                  {r.estado === "Cancelada" && (
                    <Badge variant="outline">{r.estado}</Badge>
                  )}
                </TableCell>
                <TableCell>{r.descripcion}</TableCell>
                <TableCell>
                  <Button asChild variant="link" size="sm">
                    <Link to={`/reservas/${r.id}`}>Detalles</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
