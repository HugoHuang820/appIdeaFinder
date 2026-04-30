import { notFound } from "next/navigation";

import { LocalizedPrices } from "@/src/components/localized-prices";
import { isLocale } from "@/src/lib/locale";

export default async function LocalizedPricesPage({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return <LocalizedPrices locale={locale} />;
}
