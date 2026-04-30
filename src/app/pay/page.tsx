import { redirect } from "next/navigation";

import { DEFAULT_LOCALE } from "@/src/lib/locale";

export default function LegacyPayPage() {
  redirect(`/${DEFAULT_LOCALE}/pay`);
}
