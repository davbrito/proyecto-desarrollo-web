import { isAuthenticated } from "@/lib/auth";
import { redirect } from "react-router";
import type { Route } from "./+types/layout";

const authMiddleware: Route.ClientMiddlewareFunction = async () => {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    throw redirect("/login");
  }
};

export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
  authMiddleware,
];
