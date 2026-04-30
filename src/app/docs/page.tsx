import { redirect } from "next/navigation";

import { DEFAULT_LOCALE } from "@/src/lib/locale";

export default function LegacyDocsPage() {
  redirect(`/${DEFAULT_LOCALE}/docs`);
}
