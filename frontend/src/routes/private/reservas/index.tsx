import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export default function Reservas() {
  return (
    <div>
      <h1>Reservas</h1>
      <ol className="list-decimal pl-5">
        <li className="mb-2">
          <div className="font-bold">Reserva 1</div>

          <Button asChild variant="link">
            <Link to="/reservas/1">Detalles</Link>
          </Button>
        </li>
        <li className="mb-2">
          <div className="font-bold">Reserva 2</div>

          <Button asChild variant="link">
            <Link to="/reservas/2">Detalles</Link>
          </Button>
        </li>
        <li className="mb-2">
          <div className="font-bold">Reserva 3</div>
          <Button asChild variant="link">
            <Link to="/reservas/3">Detalles</Link>
          </Button>
        </li>
      </ol>
    </div>
  );
}
