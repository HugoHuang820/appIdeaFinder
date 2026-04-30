"use client";

import { AppHeader } from "@/src/components/app-header";
import { getDictionary } from "@/src/lib/dictionaries";
import type { Locale } from "@/src/lib/types";

type LocalizedDocsProps = {
  locale: Locale;
};

export function LocalizedDocs({ locale }: LocalizedDocsProps) {
  const dict = getDictionary(locale);

  return (
    <main className="page-shell">
      <AppHeader locale={locale} path="/docs" />

      <section className="hero">
        <span className="chip">{dict.docs.badge}</span>
        <h1>{dict.docs.title}</h1>
        <p>{dict.docs.subtitle}</p>
      </section>

      <section className="doc-grid">
        {dict.docs.sections.map((section) => (
          <article className="section-card" key={section.title}>
            <h2 className="section-title">{section.title}</h2>
            <p className="muted">{section.body}</p>
            <ul className="feature-list">
              {section.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </main>
  );
}
