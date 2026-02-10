import { apiClient } from "@/lib/api";

export const dashboardService = {
  downloadPdf: async (signal?: AbortSignal) => {
    const res = await apiClient.get("dashboard/pdf", { signal });
    const disposition = res.headers.get("Content-Disposition") || "";
    const match = disposition.match(/filename="(.+)"/);
    const fileName = match ? match[1] : "reservas-uneg.pdf";
    const blob = await res.blob();
    return new File([blob], fileName, { type: blob.type });
  },
};
