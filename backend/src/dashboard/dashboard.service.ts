import { Injectable } from "@nestjs/common";
import PDFDocument from "pdfkit";
import { ReservationsService } from "../reservations/reservations.service.js";
import { Readable } from "node:stream";

@Injectable()
export class DashboardService {
  constructor(private readonly reservationsService: ReservationsService) {}

  async generatePdf(user: Express.User): Promise<Readable> {
    const { data: reservas } = await this.reservationsService.search(
      { path: "", page: 1, limit: 1000 },
      user,
    );
    const doc = new PDFDocument({ margin: 50 });

    doc
      .fontSize(20)
      .text("Sistema de Reservas Laboratorio UNEG", { align: "center" });
    doc.moveDown();
    doc
      .fontSize(14)
      .text("Reporte de solicitudes de reserva", { align: "center" });
    doc.moveDown(2);

    doc.fontSize(10);

    reservas.forEach((r, i) => {
      const reserveName = r.name ?? "Solicitud sin título";
      const stateName = r.state?.name ?? "—";
      const labName = r.laboratory?.name ?? "—";
      const typeName = r.type?.name ?? "—";
      doc.text(`${i + 1}. ${reserveName}`, { continued: false });
      doc.text(`   Fecha: ${r.startDate} | Estado: ${stateName}`);
      doc.text(`   Tipo: ${typeName} | Laboratorio: ${labName}`);
      doc.text(`   Profesor: ${r.user?.name ?? "—"}`);
      doc.moveDown(0.5);
    });

    doc.end();
    return Readable.from(doc);
  }
}
