import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api";
import { refreshSession } from "@/lib/auth";
import { Suspense } from "react";
import { Await } from "react-router";
import type { Route } from "./+types/dashboard";

export async function clientLoader(_: Route.LoaderArgs) {
  const me = apiClient.get("auth/me").json();
  return { me };
}

export default function DashboardPage({ loaderData }: Route.ComponentProps) {
  return (
    <main className="space-y-4 p-4">
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
      <Button
        onClick={() => {
          refreshSession();
        }}
      >
        Refresh Token
      </Button>
    </main>
  );
}
