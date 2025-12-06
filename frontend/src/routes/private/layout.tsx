import { getSession, seemsAuthenticated } from "@/lib/auth";
import { redirect } from "react-router";
import type { Route } from "./+types/layout";

const authMiddleware: Route.ClientMiddlewareFunction = async () => {
  const isAuth = seemsAuthenticated();

  if (!isAuth) {
    throw redirect("/login");
  }

  getSession();
};

export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
  authMiddleware,
];
