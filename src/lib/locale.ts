import type { Locale } from "@/src/lib/types";

export const SUPPORTED_LOCALES: Locale[] = [
  "ja",
  "en",
  "zh-CN",
  "zh-TW",
  "ko",
  "es",
  "pt-BR",
  "fr",
  "de",
  "it",
  "nl",
  "sv",
  "pl",
  "tr",
  "id",
  "vi",
  "th",
  "hi",
  "ar",
  "ru",
];
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
    case "zh-TW":
      return "繁體中文";
    case "ko":
      return "한국어";
    case "es":
      return "Español";
    case "pt-BR":
      return "Português (BR)";
    case "fr":
      return "Français";
    case "de":
      return "Deutsch";
    case "it":
      return "Italiano";
    case "nl":
      return "Nederlands";
    case "sv":
      return "Svenska";
    case "pl":
      return "Polski";
    case "tr":
      return "Türkçe";
    case "id":
      return "Bahasa Indonesia";
    case "vi":
      return "Tiếng Việt";
    case "th":
      return "ไทย";
    case "hi":
      return "हिन्दी";
    case "ar":
      return "العربية";
    case "ru":
      return "Русский";
    case "en":
    default:
      return "English";
  }
}

export function outputLanguage(locale: Locale) {
  switch (locale) {
    case "ja":
      return "Japanese";
    case "zh-CN":
      return "Simplified Chinese";
    case "zh-TW":
      return "Traditional Chinese";
    case "ko":
      return "Korean";
    case "es":
      return "Spanish";
    case "pt-BR":
      return "Brazilian Portuguese";
    case "fr":
      return "French";
    case "de":
      return "German";
    case "it":
      return "Italian";
    case "nl":
      return "Dutch";
    case "sv":
      return "Swedish";
    case "pl":
      return "Polish";
    case "tr":
      return "Turkish";
    case "id":
      return "Indonesian";
    case "vi":
      return "Vietnamese";
    case "th":
      return "Thai";
    case "hi":
      return "Hindi";
    case "ar":
      return "Arabic";
    case "ru":
      return "Russian";
    case "en":
    default:
      return "English";
  }
}
