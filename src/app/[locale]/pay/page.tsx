import { notFound } from "next/navigation";

import { LocalizedPay } from "@/src/components/localized-pay";
import { isLocale } from "@/src/lib/locale";

export default async function LocalizedPayPage({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return <LocalizedPay locale={locale} />;
}
