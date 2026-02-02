import { describe, expect, it, vi, beforeEach } from "vitest";
// Mock the auth library
vi.mock("@/lib/auth", () => ({
  register: vi.fn(),
  registerAdministrator: vi.fn(),
}));

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRoutesStub } from "react-router";
import RegisterForm from "./index";
import * as auth from "@/lib/auth";

describe("RegisterForm Component", () => {
  const defaultProps = {
    title: "Crear Cuenta",
    subtitle: "Regístrate para continuar",
    asideTitle: "Bienvenido",
    asideSubtitle: "Únete a nuestra plataforma",
    admin: false,
  };

  const Stub = createRoutesStub([
    {
      path: "/register",
      Component: () => <RegisterForm {...defaultProps} />,
    },
    {
      path: "/",
      Component: () => <div>Home Page</div>,
    },
  ]);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the register form with correctly", () => {
    render(<Stub initialEntries={["/register"]} />);

    expect(screen.getByText("Crear Cuenta")).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre de Usuario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Nombre$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Crear cuenta/i }),
    ).toBeInTheDocument();
  });

  it("shows validation errors when submitting empty form", async () => {
    const user = userEvent.setup();
    render(<Stub initialEntries={["/register"]} />);

    await user.click(screen.getByRole("button", { name: /Crear cuenta/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/El nombre de usuario es requerido/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/El nombre es requerido/i)).toBeInTheDocument();
    });
  });

  it("calls register service and navigates on success", async () => {
    const user = userEvent.setup();
    vi.mocked(auth.register).mockResolvedValue({} as any);

    render(<Stub initialEntries={["/register"]} />);

    await user.type(screen.getByLabelText(/Nombre de Usuario/i), "testuser");
    await user.type(screen.getByLabelText(/^Nombre$/i), "Test User");
    await user.type(screen.getByLabelText(/Email/i), "test@example.com");
    await user.type(screen.getByLabelText(/^Contraseña$/i), "Password123!");
    await user.type(
      screen.getByLabelText(/Confirmar contraseña/i),
      "Password123!",
    );

    await user.click(screen.getByRole("button", { name: /Crear cuenta/i }));

    await waitFor(() => {
      expect(auth.register).toHaveBeenCalled();
    });

    expect(await screen.findByText(/Home Page/i)).toBeInTheDocument();
  });
});
