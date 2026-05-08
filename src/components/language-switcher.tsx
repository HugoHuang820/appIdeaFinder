"use client";

import { ChangeEvent, FormEvent } from "react";
import { useSearchParams } from "next/navigation";

import { localeLabel, SUPPORTED_LOCALES } from "@/src/lib/locale";
import type { Locale } from "@/src/lib/types";

type LanguageSwitcherProps = {
  locale: Locale;
  path: string;
  label?: string;
};

export function LanguageSwitcher({ locale, path, label = "Language" }: LanguageSwitcherProps) {
  const searchParams = useSearchParams();

  function handleChange(event: ChangeEvent<HTMLSelectElement> | FormEvent<HTMLSelectElement>) {
    const nextLocale = event.currentTarget.value as Locale;
    const query = searchParams.toString();
    window.location.assign(`/${nextLocale}${path}${query ? `?${query}` : ""}`);
  }

  return (
    <div className="language-switcher">
      <label className="language-switcher__label" htmlFor="language-select">
        {label}
      </label>
      <select id="language-select" onChange={handleChange} onInput={handleChange} value={locale}>
        {SUPPORTED_LOCALES.map((item) => (
          <option key={item} value={item}>
            {localeLabel(item)}
          </option>
        ))}
      </select>
    </div>
  );
}
