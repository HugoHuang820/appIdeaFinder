import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { LocalizedHome } from "@/src/components/localized-home";
import { getTrendingKeywords } from "@/src/lib/hot-keywords";
import { isLocale } from "@/src/lib/locale";
import { getHomeUsageStatus } from "@/src/lib/store";

export default async function LocalizedHomePage({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const cookieStore = await cookies();
  const customerId = cookieStore.get("idea_finder_customer")?.value;
  const [examples, usageStatus] = await Promise.all([
    getTrendingKeywords(locale, 5),
    Promise.resolve(getHomeUsageStatus(customerId)),
  ]);

  return <LocalizedHome examples={examples} locale={locale} usageStatus={usageStatus} />;
}
