import { redirect } from "next/navigation";

import { DEFAULT_LOCALE } from "@/src/lib/locale";

export default async function LegacyPricesPage({
  searchParams,
}: {
  searchParams: Promise<{ taskId?: string; payment?: string }>;
}) {
  const query = await searchParams;
  const params = new URLSearchParams();

  if (query.taskId) {
    params.set("taskId", query.taskId);
  }

  if (query.payment) {
    params.set("payment", query.payment);
  }

  redirect(`/${DEFAULT_LOCALE}/prices${params.size > 0 ? `?${params.toString()}` : ""}`);
}
