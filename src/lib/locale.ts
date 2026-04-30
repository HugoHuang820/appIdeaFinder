import type { Locale } from "@/src/lib/types";

export const SUPPORTED_LOCALES: Locale[] = ["ja", "en", "zh-CN"];
export const DEFAULT_LOCALE: Locale = "ja";

export function isLocale(value: string): value is Locale {
  return SUPPORTED_LOCALES.includes(value as Locale);
}

export function resolveLocale(value: string | null | undefined): Locale {
  if (value && isLocale(value)) {
    return value;
  }

  return DEFAULT_LOCALE;
}

export function localeLabel(locale: Locale) {
  switch (locale) {
    case "ja":
      return "日本語";
    case "zh-CN":
      return "简体中文";
    case "en":
      return "English";
    default:
      return locale;
  }
}

export function outputLanguage(locale: Locale) {
  switch (locale) {
    case "ja":
      return "Japanese";
    case "zh-CN":
      return "Simplified Chinese";
    case "en":
    default:
      return "English";
  }
}
