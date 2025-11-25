import { isAuthenticated } from "@/lib/auth";
import { redirect } from "react-router";
import type { Route } from "./+types/layout";

const authMiddleware: Route.ClientMiddlewareFunction = () => {
  const authenticated = isAuthenticated();
  console.log("Auth Middleware - isAuthenticated:", authenticated);
  if (!authenticated) {
    throw redirect("/login");
  }
};

export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
  authMiddleware,
];
