import { notFound } from "next/navigation";

import { LocalizedResults } from "@/src/components/localized-results";
import { isLocale } from "@/src/lib/locale";

type PageProps = {
  params: Promise<{ locale: string; taskId: string }>;
  searchParams: Promise<{ payment?: string }>;
};

export default async function LocalizedResultsPage({ params, searchParams }: PageProps) {
  const [{ locale, taskId }, query] = await Promise.all([params, searchParams]);

  if (!isLocale(locale)) {
    notFound();
  }

  return <LocalizedResults locale={locale} paymentStatus={query.payment} taskId={taskId} />;
}
