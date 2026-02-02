import { logout } from "@/lib/auth";
import type { Route } from "./+types/logout";
import { redirect } from "react-router";
import { queryClient } from "@/lib/query-client";

export async function clientAction(_: Route.ClientActionArgs) {
  await logout();
  queryClient.clear();
  throw redirect("/login");
}

export async function clientLoader() {
  throw redirect("/login");
}

export default function Logout() {
  return null;
}
