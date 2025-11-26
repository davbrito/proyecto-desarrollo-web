import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api";
import { Suspense } from "react";
import { Await, Form } from "react-router";
import type { Route } from "./+types/index";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Sistema de Reservas de Laboratorio - UNEG" },
    {
      name: "description",
      content:
        "Sistema de reservas de laboratorios de la UNEG, donde los usuarios pueden gestionar y visualizar sus reservas.",
    },
  ];
}

export async function clientLoader(_: Route.LoaderArgs) {
  const me = apiClient.get("api/auth/me").json();
  return { me };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <main className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Welcome</h1>
      <p>This is the home page.</p>
      <Suspense fallback={<div>Loading user data...</div>}>
        <Await resolve={loaderData.me}>
          {(me) => (
            <pre className="bg-muted rounded-2xl p-3">
              {JSON.stringify(me, null, 2)}
            </pre>
          )}
        </Await>
      </Suspense>
      <Form action="/logout" method="post" className="contents">
        <Button type="submit">Logout</Button>
      </Form>
      {/* <Button
        onClick={() => {
          refreshSession();
        }}
      >
        Refresh Token
      </Button> */}
    </main>
  );
}
