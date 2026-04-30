"use client";

import Link from "next/link";

import { LanguageSwitcher } from "@/src/components/language-switcher";
import { getDictionary } from "@/src/lib/dictionaries";
import type { Locale } from "@/src/lib/types";

type AppHeaderProps = {
  locale: Locale;
  path: string;
};

export function AppHeader({ locale, path }: AppHeaderProps) {
  const dict = getDictionary(locale);
  const activeTab = path.startsWith("/prices") ? "prices" : path.startsWith("/docs") ? "docs" : "home";

  return (
    <header className="topbar">
      <div className="topbar__left">
        <Link className="topbar__brand" href={`/${locale}`}>
          {dict.common.appName}
        </Link>
        <nav className="topbar__nav">
          <Link className={`topbar__nav-link${activeTab === "home" ? " topbar__nav-link--active" : ""}`} href={`/${locale}`}>
            {dict.common.home}
          </Link>
          <Link
            className={`topbar__nav-link${activeTab === "prices" ? " topbar__nav-link--active" : ""}`}
            href={`/${locale}/prices`}
          >
            {dict.common.prices}
          </Link>
          <Link className={`topbar__nav-link${activeTab === "docs" ? " topbar__nav-link--active" : ""}`} href={`/${locale}/docs`}>
            {dict.common.docs}
          </Link>
        </nav>
      </div>
      <LanguageSwitcher label={dict.common.language} locale={locale} path={path} />
    </header>
  );
}
