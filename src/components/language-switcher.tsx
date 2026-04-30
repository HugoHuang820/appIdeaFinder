"use client";

import { ChangeEvent } from "react";
import { useRouter } from "next/navigation";

import { localeLabel, SUPPORTED_LOCALES } from "@/src/lib/locale";
import type { Locale } from "@/src/lib/types";

type LanguageSwitcherProps = {
  locale: Locale;
  path: string;
  label?: string;
};

export function LanguageSwitcher({ locale, path, label = "Language" }: LanguageSwitcherProps) {
  const router = useRouter();

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value as Locale;
    router.push(`/${nextLocale}${path}`);
  }

  return (
    <div className="language-switcher">
      <label className="language-switcher__label" htmlFor="language-select">
        {label}
      </label>
      <select id="language-select" onChange={handleChange} value={locale}>
        {SUPPORTED_LOCALES.map((item) => (
          <option key={item} value={item}>
            {localeLabel(item)}
          </option>
        ))}
      </select>
    </div>
  );
}
