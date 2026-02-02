import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { createRoutesStub } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReservationForm from "./index";

// Mock services
vi.mock("@/services/reservations", () => ({
  reservationsService: {
    create: vi.fn(),
  },
}));

import { reservationsService } from "@/services/reservations";

// Mock CalendarReservation to make it testable
vi.mock("../calendar-reservation", () => {
  let clickCount = 0;
  return {
    default: ({ onSelect }: any) => (
      <button
        type="button"
        data-testid="mock-calendar"
        onClick={() => {
          const date = new Date("2026-02-01T12:00:00Z");
          // Increment day for each click to ensure start != end and end > start
          date.setDate(date.getDate() + clickCount);
          clickCount++;
          onSelect(date);
        }}
      >
        Select Date
      </button>
    ),
  };
});

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

describe("ReservationForm Component", () => {
  const defaultProps = {
    reserved: [],
    availableHours: ["08:00", "09:00", "10:00", "11:00", "12:00"],
    availableLaboratory: [
      { id: 1, name: "Lab A", active: true, number: 101 },
      { id: 2, name: "Lab B", active: true, number: 102 },
    ],
    stateTypeEvent: [
      {
        id: 1,
        name: "Clase",
        minimalAnticipation: 1,
        blockDuration: 2,
        priority: 1,
        needsApproval: false,
      },
    ],
  };

  const Stub = createRoutesStub([
    {
      path: "/reservar",
      Component: () => (
        <QueryClientProvider client={createTestQueryClient()}>
          <ReservationForm {...defaultProps} />
        </QueryClientProvider>
      ),
    },
    {
      path: "/reservas",
      Component: () => <div>Reservations List</div>,
    },
  ]);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly and enables second step after filling first step", async () => {
    const user = userEvent.setup();
    render(<Stub initialEntries={["/reservar"]} />);

    // Step 1 check
    expect(screen.getByText(/Calendario de Reservas/i)).toBeInTheDocument();

    // Fill fields
    const calendarButtons = screen.getAllByRole("button", {
      name: /Select Date/i,
    });
    await user.click(calendarButtons[0]);
    await user.selectOptions(
      screen.getByLabelText(/Selecciona un laboratorio/i),
      "1",
    );
    await user.selectOptions(
      screen.getByLabelText(/Selecciona el tipo de evento/i),
      "1",
    );

    await user.type(
      screen.getByLabelText(/Selecciona la hora a reservar/i),
      "08:00",
    );
    await user.type(
      screen.getByLabelText(/Selecciona la hora de finalizacion/i),
      "10:00",
    );
    await user.type(
      screen.getByLabelText(/Escribe una descripcion/i),
      "Test reservation content",
    );

    // Go to next step
    await user.click(screen.getByRole("button", { name: /Siguiente/i }));

    // Step 2 check
    await waitFor(() => {
      expect(
        screen.getByText(/Selecciona la fecha de finalizacion/i),
      ).toBeInTheDocument();
    });
  });

  it("submits the form successfully", async () => {
    const user = userEvent.setup();
    vi.mocked(reservationsService.create).mockResolvedValue({} as any);

    render(<Stub initialEntries={["/reservar"]} />);

    // Step 1
    const calendarButtonsStep1 = screen.getAllByRole("button", {
      name: /Select Date/i,
    });
    await user.click(calendarButtonsStep1[0]);
    await user.selectOptions(
      screen.getByLabelText(/Selecciona un laboratorio/i),
      "1",
    );
    await user.selectOptions(
      screen.getByLabelText(/Selecciona el tipo de evento/i),
      "1",
    );

    // Clear and type to be safe with time inputs
    const startInput = screen.getByLabelText(/Selecciona la hora a reservar/i);
    await user.type(startInput, "08:00");
    const endInput = screen.getByLabelText(
      /Selecciona la hora de finalizacion/i,
    );
    await user.type(endInput, "10:00");

    await user.type(
      screen.getByLabelText(/Escribe una descripcion/i),
      "Test reservation",
    );
    await user.click(screen.getByRole("button", { name: /Siguiente/i }));

    // Step 2
    await waitFor(() => {
      expect(
        screen.getByText(/Selecciona la fecha de finalizacion/i),
      ).toBeInTheDocument();
    });

    // The second calendar button appears in step 2
    const calendarButtons = screen.getAllByRole("button", {
      name: /Select Date/i,
    });
    await user.click(calendarButtons[1]);

    await user.click(screen.getByRole("button", { name: /confirmar/i }));

    await waitFor(() => {
      expect(reservationsService.create).toHaveBeenCalled();
    });

    expect(await screen.findByText(/Reservations List/i)).toBeInTheDocument();
  });

  it("shows validation errors if fields are missing", async () => {
    const user = userEvent.setup();
    render(<Stub initialEntries={["/reservar"]} />);

    await user.click(screen.getByRole("button", { name: /Siguiente/i }));

    await waitFor(() => {
      expect(screen.getByText(/La fecha es requerida/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Selecciona un laboratorio válido/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/La descripcion es requerida/i),
      ).toBeInTheDocument();
    });
  });
});
