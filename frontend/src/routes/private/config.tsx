import { LaboratoriesManager } from "@/components/config/laboratories-manager";
import { Skeleton } from "@/components/ui/skeleton";
import { laboratoriesService } from "@/services/laboratories";
import { Suspense } from "react";
import { Await } from "react-router";
import type { Route } from "./+types/config";

export default function Config() {
  return (
    <Suspense fallback={<Skeleton className="h-125" />}>
      <LaboratoriesManager />
    </Suspense>
  );
}
