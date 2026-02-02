import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("@/lib/auth", () => ({
  login: vi.fn(),
}));

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRoutesStub } from "react-router";
import LoginRoute from "./login";
import { login } from "@/lib/auth";

describe("LoginRoute", () => {
  const Stub = createRoutesStub([
    { path: "/login", Component: LoginRoute },
    { path: "/", Component: () => <div>Home Page</div> },
  ]);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("verifica inicio de sesión exitoso con credenciales válidas", async () => {
    const user = userEvent.setup();
    vi.mocked(login).mockResolvedValue({} as any);

    render(<Stub initialEntries={["/login"]} />);

    await user.type(screen.getByLabelText(/Nombre de Usuario/i), "testuser");
    await user.type(
      screen.getByLabelText(/Contraseña/i, { selector: "input" }),
      "password123",
    );

    await user.click(screen.getByRole("button", { name: /Iniciar Sesión/i }));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({
        username: "testuser",
        password: "password123",
      });
    });

    expect(await screen.findByText(/Home Page/i)).toBeInTheDocument();
  });
});
