import { redirect } from "next/navigation";

import { DEFAULT_LOCALE } from "@/src/lib/locale";

export default async function LegacyResultsPage({
  params,
}: Readonly<{
  params: Promise<{ taskId: string }>;
}>) {
  const { taskId } = await params;
  redirect(`/${DEFAULT_LOCALE}/results/${taskId}`);
}
