import { notFound } from "next/navigation";

import { LocalizedDocs } from "@/src/components/localized-docs";
import { isLocale } from "@/src/lib/locale";

export default async function LocalizedDocsPage({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return <LocalizedDocs locale={locale} />;
}
