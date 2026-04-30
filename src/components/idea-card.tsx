"use client";

import Link from "next/link";

import { getDictionary } from "@/src/lib/dictionaries";
import type { Idea } from "@/src/lib/types";
import type { Locale } from "@/src/lib/types";

type IdeaCardProps = {
  idea: Idea;
  locale: Locale;
  unlockHref?: string;
};

export function IdeaCard({ idea, locale, unlockHref }: IdeaCardProps) {
  const dict = getDictionary(locale).ideaCard;

  return (
    <article className={`idea-card ${idea.isLocked ? "locked" : ""}`}>
      <div className="idea-card__header">
        <div>
          <span className="idea-card__badge">{idea.isLocked ? dict.locked : dict.idea}</span>
          <h3>{idea.name}</h3>
        </div>
      </div>

      <p className="idea-card__one-line">{idea.oneLine}</p>

      {idea.signalSummary ? (
        <section>
          <h4>{dict.signalSummary}</h4>
          <p>{idea.signalSummary.summary}</p>
        </section>
      ) : null}

      {idea.isLocked ? (
        <div className="idea-card__locked-copy">
          <p>{dict.lockedBody}</p>
          {unlockHref ? (
            <div className="idea-card__locked-cta">
              <Link className="primary-button" href={unlockHref}>
                {dict.unlockButton}
              </Link>
            </div>
          ) : null}
        </div>
      ) : (
        <>
          <section>
            <h4>{dict.why}</h4>
            <p>{idea.why}</p>
          </section>

          {idea.buildPackage ? (
            <section>
              <h4>{dict.buildPackage}</h4>
              <div className="aso-box">
                <p>
                  <strong>{dict.productSummary}:</strong> {idea.buildPackage.productSummary}
                </p>
                <p>
                  <strong>{dict.mvpFeatures}:</strong> {idea.buildPackage.mvpFeatures.join(", ")}
                </p>
                <p>
                  <strong>{dict.devPromptKit}:</strong> {idea.buildPackage.devPromptKit.join(" | ")}
                </p>
                <p>
                  <strong>{dict.launchPromptKit}:</strong> {idea.buildPackage.launchPromptKit.join(" | ")}
                </p>
                <p>
                  <strong>{dict.v1Roadmap}:</strong> {idea.buildPackage.v1Roadmap.join(", ")}
                </p>
              </div>
            </section>
          ) : null}

          <section>
            <h4>{dict.targetUsers}</h4>
            <div className="chip-list">
              {idea.targetUsers.map((user) => (
                <span className="chip" key={user}>
                  {user}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h4>{dict.aso}</h4>
            <div className="aso-box">
              <p>
                <strong>{dict.heroHook}:</strong> {idea.aso.heroHook}
              </p>
              <p>
                <strong>{dict.title}:</strong> {idea.aso.title}
              </p>
              <p>
                <strong>{dict.subtitle}:</strong> {idea.aso.subtitle}
              </p>
              <p>
                <strong>{dict.description}:</strong> {idea.aso.description}
              </p>
              <p>
                <strong>{dict.keywords}:</strong> {idea.aso.keywords.join(", ")}
              </p>
              {idea.aso.valueBullets && idea.aso.valueBullets.length > 0 ? (
                <div className="idea-card__message-list">
                  <strong>{dict.valueBullets}:</strong>
                  <ul className="feature-list compact-feature-list">
                    {idea.aso.valueBullets.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <p>
                <strong>{dict.paywallCopy}:</strong> {idea.aso.paywallCopy}
              </p>
            </div>
          </section>
        </>
      )}
    </article>
  );
}
