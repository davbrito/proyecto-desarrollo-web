import { ReservationReceipt } from "@/components/reservas/reservation-receipt";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import receiptStylesUrl from "@/styles/receipt-iframe.css?url";
import type { Reservation } from "@uneg-lab/api-types/reservation";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";

type ReservationReceiptModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reservation: Reservation;
};

export function ReservationReceiptModal({
  open,
  onOpenChange,
  reservation,
}: ReservationReceiptModalProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

  const srcDoc = /* HTML */ `
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <title>Comprobante de Reserva #${reservation.id}</title>
        <link rel="stylesheet" href="${receiptStylesUrl}" />
      </head>
      <body>
        <div id="receipt-root"></div>
      </body>
    </html>
  `;

  const handlePrint = () => {
    iframeRef.current?.contentWindow?.print();
  };

  const handleLoad = () => {
    const doc = iframeRef.current?.contentDocument;
    const root = doc?.getElementById("receipt-root");
    setPortalRoot(root ?? null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Comprobante de Reserva</DialogTitle>
        </DialogHeader>
        <div className="h-[70vh] w-full overflow-hidden rounded-md border bg-white">
          <iframe
            ref={iframeRef}
            title={`Comprobante de Reserva #${reservation.id}`}
            className="h-full w-full"
            srcDoc={srcDoc}
            onLoad={handleLoad}
          />
          {portalRoot &&
            createPortal(
              <ReservationReceipt reservation={reservation} />,
              portalRoot,
            )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
          <Button onClick={handlePrint}>Imprimir</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
