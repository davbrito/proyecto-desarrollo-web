import { getSession, seemsAuthenticated } from "@/lib/auth";
import { Outlet, redirect } from "react-router";
import type { Route } from "./+types/layout";

const ensureAnonymous: Route.ClientMiddlewareFunction = async (_, next) => {
  if (!seemsAuthenticated()) return next();

  const session = await getSession();
  if (session) {
    throw redirect("/", 302);
  }

  return next();
};

export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
  ensureAnonymous,
];

export default function AuthLayout() {
  return (
    <div className="auth-bg h-svh content-center overflow-auto">
      <Outlet />
    </div>
  );
}
