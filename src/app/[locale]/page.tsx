import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { LocalizedHome } from "@/src/components/localized-home";
import { getTrendingKeywords } from "@/src/lib/hot-keywords";
import { isLocale } from "@/src/lib/locale";
import { getHomeUsageStatus } from "@/src/lib/store";

export default async function LocalizedHomePage({
  params,
  searchParams,
}: Readonly<{
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ keyword?: string | string[]; market?: string | string[] }>;
}>) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;

  if (!isLocale(locale)) {
    notFound();
  }

  const cookieStore = await cookies();
  const customerId = cookieStore.get("idea_finder_customer")?.value;
  const initialKeyword =
    typeof resolvedSearchParams?.keyword === "string" ? resolvedSearchParams.keyword.trim() : "";
  const initialMarket =
    typeof resolvedSearchParams?.market === "string" && resolvedSearchParams.market.trim()
      ? resolvedSearchParams.market.trim()
      : "Global";
  const [examples, usageStatus] = await Promise.all([
    getTrendingKeywords(locale, 5, [], initialMarket),
    Promise.resolve(getHomeUsageStatus(customerId)),
  ]);

  return (
    <LocalizedHome
      examples={examples}
      initialKeyword={initialKeyword}
      initialMarket={initialMarket}
      key={`${initialKeyword}:${initialMarket}`}
      locale={locale}
      usageStatus={usageStatus}
    />
  );
}
