import { buildIdeaPrompt } from "@/src/lib/prompts";
import type { Idea, IdeaGenerationResult, Locale } from "@/src/lib/types";

const NAME_PREFIXES = [
  "Pocket",
  "Shift",
  "Local",
  "Daily",
  "Quick",
  "Smart",
  "Neo",
  "Mini",
  "Care",
  "Launch",
];

const SUFFIXES = [
  "Flow",
  "Note",
  "Plan",
  "Board",
  "Kit",
  "Pilot",
  "Desk",
  "Mate",
  "Guide",
  "Track",
];

const PROBLEM_PATTERNS = [
  {
    audience: "busy professionals",
    oneLine: "A lightweight planning app for %KEYWORD% routines that fits into short daily sessions.",
    why: "People dealing with %KEYWORD% need repeatable routines, which supports subscription features like reminders, saved plans, and premium templates.",
    signalSummary: "Apps in this niche often emphasize routines, reminders, and easy repeat usage.",
    keywords: ["%KEYWORD% planner", "daily %KEYWORD%", "%KEYWORD% routine", "%KEYWORD% reminders"],
  },
  {
    audience: "small business owners",
    oneLine: "A workflow app that helps small operators manage %KEYWORD% tasks without spreadsheets.",
    why: "%KEYWORD% work is recurring and operational, so owners are more likely to pay for time savings, checklists, and client-ready reports.",
    signalSummary: "Listings in this space often focus on saving time and replacing manual workflows.",
    keywords: ["%KEYWORD% workflow", "%KEYWORD% checklist", "%KEYWORD% manager", "small business %KEYWORD%"],
  },
  {
    audience: "beginners",
    oneLine: "A guided starter app that breaks %KEYWORD% into simple steps for first-time users.",
    why: "Beginners spend money on confidence and structure, making premium learning paths and personalized plans realistic monetization options.",
    signalSummary: "Simple onboarding and beginner-friendly positioning appear repeatedly in this niche.",
    keywords: ["learn %KEYWORD%", "%KEYWORD% beginner", "%KEYWORD% guide", "%KEYWORD% steps"],
  },
  {
    audience: "families",
    oneLine: "A shared household app for coordinating %KEYWORD% tasks across family members.",
    why: "Family coordination creates sticky usage and clear upgrade paths through shared lists, reminders, and premium household sync.",
    signalSummary: "Shared usage and recurring coordination are common hooks for this kind of app.",
    keywords: ["family %KEYWORD%", "shared %KEYWORD%", "%KEYWORD% organizer", "%KEYWORD% list"],
  },
  {
    audience: "side hustlers",
    oneLine: "A niche productivity app that helps side hustlers turn %KEYWORD% into repeatable weekly actions.",
    why: "Users trying to earn from %KEYWORD% care about consistency, which supports paid templates, automations, and performance snapshots without needing heavy analytics.",
    signalSummary: "This niche often responds well to productivity framing and repeatable templates.",
    keywords: ["%KEYWORD% side hustle", "%KEYWORD% planner", "%KEYWORD% toolkit", "%KEYWORD% workflow"],
  },
  {
    audience: "commuters in Japan",
    oneLine: "A mobile-first app for managing %KEYWORD% tasks in short commute-friendly sessions.",
    why: "Japan's mobile-heavy usage makes quick sessions valuable, and premium offline access, saved presets, and timed flows create a believable paid tier.",
    signalSummary: "Short-session mobile usage is a realistic angle for this audience.",
    keywords: ["%KEYWORD% app", "%KEYWORD% mobile", "%KEYWORD% quick plan", "%KEYWORD% daily tool"],
  },
  {
    audience: "hobby enthusiasts",
    oneLine: "A niche companion app for tracking goals, routines, and ideas related to %KEYWORD%.",
    why: "Hobby users pay when a tool helps them stay consistent and improve over time, especially with premium logs, templates, and community-ready exports.",
    signalSummary: "Users in this niche value consistency, progress tracking, and curated templates.",
    keywords: ["%KEYWORD% tracker", "%KEYWORD% log", "%KEYWORD% goals", "%KEYWORD% companion"],
  },
];

function toTitleCase(value: string) {
  return value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join("");
}

function normalizeKeyword(keyword: string) {
  return keyword.trim().replace(/\s+/g, " ");
}

function uniqueName(keyword: string, index: number) {
  const base = toTitleCase(keyword);
  return `${NAME_PREFIXES[index % NAME_PREFIXES.length]}${base}${SUFFIXES[index % SUFFIXES.length]}`;
}

function fill(template: string, keyword: string) {
  return template.replace(/%KEYWORD%/g, keyword);
}

function localizeText(locale: Locale, value: string) {
  if (locale === "ja") {
    return `日本語向け: ${value}`;
  }

  if (locale === "zh-CN") {
    return `中文方案: ${value}`;
  }

  return value;
}

function localizeName(locale: Locale, value: string) {
  if (locale === "ja") {
    return `${value} JP`;
  }

  if (locale === "zh-CN") {
    return `${value} 中文`;
  }

  return value;
}

export function generateIdeaPackMock(
  keywordInput: string,
  market = "Japan",
  locale: Locale = "ja",
  ideaCount = 6,
): IdeaGenerationResult {
  const keyword = normalizeKeyword(keywordInput);
  const appStoreContext = [
    `Users searching for ${keyword} often respond to simple positioning and repeatable routines.`,
    `Lightweight App Store language in this niche tends to focus on clarity, reminders, and quick wins.`,
  ];
  const prompt = buildIdeaPrompt(keyword, ideaCount, market, locale, appStoreContext);

  const ideas: Idea[] = Array.from({ length: ideaCount }, (_, index) => {
    const pattern = PROBLEM_PATTERNS[index % PROBLEM_PATTERNS.length];
    const appName = uniqueName(keyword, index);
    const baseKeyword = keyword.toLowerCase();
    const titleName = locale === "ja" ? `${appName} アプリ` : locale === "zh-CN" ? `${appName} 应用` : appName;
    const description = localizeText(
      locale,
      `Manage ${baseKeyword} workflows with a clearer daily flow, fast setup, and practical guidance for staying consistent. The product helps users see what to do next, finish tasks in short sessions, and avoid messy spreadsheets or scattered notes. It feels lightweight at first use but still supports repeat usage, premium templates, and higher-value upgrade moments.`,
    );

    return {
      id: `idea_${index + 1}`,
      name: localizeName(locale, appName),
      oneLine: localizeText(locale, fill(pattern.oneLine, baseKeyword)),
      targetUsers: [localizeText(locale, pattern.audience), localizeText(locale, `${baseKeyword} users`)],
      why: localizeText(locale, fill(pattern.why, baseKeyword)),
      signalSummary: {
        summary: localizeText(locale, fill(pattern.signalSummary, baseKeyword)),
        source: "ai_inferred",
        confidence: "low",
      },
      aso: {
        title: titleName,
        subtitle: localizeText(locale, `Simple ${baseKeyword} workflows for ${pattern.audience}`),
        heroHook: localizeText(locale, `Turn ${baseKeyword} into a repeatable habit instead of a messy manual workflow.`),
        description,
        keywords: pattern.keywords.map((item) => localizeText(locale, fill(item, baseKeyword))),
        valueBullets: [
          localizeText(locale, `Show users the next best action for ${baseKeyword} in under 30 seconds.`),
          localizeText(locale, `Package progress, reminders, and saved templates into a premium upgrade story.`),
          localizeText(locale, `Position the app as a simpler alternative to notes, spreadsheets, or generic task tools.`),
        ],
        paywallCopy: localizeText(
          locale,
          `Unlock the full ${baseKeyword} workflow pack with clearer messaging, stronger feature framing, and prompts you can build from immediately.`,
        ),
      },
      buildPackage: {
        productSummary: localizeText(
          locale,
          `A focused app for ${pattern.audience} who need a simpler way to manage ${baseKeyword} without heavy setup.`,
        ),
        mvpFeatures: [
          localizeText(locale, `${baseKeyword} dashboard with daily focus`),
          localizeText(locale, `Reminder and checklist flow`),
          localizeText(locale, `Basic history and saved presets`),
        ],
        v1Roadmap: [
          localizeText(locale, `Shared collaboration mode`),
          localizeText(locale, `Premium templates for repeat workflows`),
          localizeText(locale, `Export and summary features`),
        ],
        devPromptKit: [
          localizeText(locale, `Design the MVP information architecture for this ${baseKeyword} app.`),
          localizeText(locale, `Build the backend schema and API for this ${baseKeyword} workflow product.`),
          localizeText(locale, `Create the first mobile result page and onboarding flow for this product.`),
        ],
        launchPromptKit: [
          localizeText(locale, `Write a landing page that explains why this ${baseKeyword} app is worth paying for.`),
          localizeText(locale, `Create a 7-day validation plan for launching this ${baseKeyword} MVP.`),
          localizeText(locale, `Draft App Store launch copy for this ${baseKeyword} product.`),
        ],
      },
      isLocked: index >= 2,
    };
  });

  return {
    keyword,
    market,
    locale,
    ideas,
    prompt,
  };
}
