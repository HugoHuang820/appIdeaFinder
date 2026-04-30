import { outputLanguage } from "@/src/lib/locale";
import type { Locale, PromptBundle } from "@/src/lib/types";

export const IDEA_SYSTEM_PROMPT = `You are an expert product strategist for indie app builders.

Your job is to generate highly specific app ideas that a solo maker or small team could realistically build and sell.

You are not an ASO analytics tool.
You are not a keyword research dashboard.
You are not a market report generator.

Your output must help the user decide what to build next.

Hard rules:
- Output valid JSON only
- Do not output markdown
- Do not output tables
- Do not output raw metrics
- Do not output raw App Store scrape dumps
- Do not include commentary before or after JSON
- Each idea must include name, oneLine, targetUsers, why, signalSummary, aso, and buildPackage fields
- The "why" field must include a concrete monetization signal
- signalSummary must be a plain-language takeaway, not an analytics report
- buildPackage must feel valuable enough for a paid user
- Default target market is Japan unless another market is supplied`;

export function buildIdeaPrompt(
  keyword: string,
  ideaCount: number,
  market = "Japan",
  locale: Locale = "ja",
  appStoreContext: string[] = [],
): PromptBundle {
  const language = outputLanguage(locale);
  const appStoreBlock =
    appStoreContext.length > 0
      ? `- Lightweight App Store context:\n${appStoreContext.map((item) => `  - ${item}`).join("\n")}`
      : "- Lightweight App Store context: none";
  const userPrompt = `Generate ${ideaCount} app ideas for the keyword: "${keyword}".

Context:
- Target market: ${market}
- Output language: ${language}
- Audience: indie developers, solo makers, AI-assisted builders
- Goal: help the user decide what app to build
- Product type: money-making app idea generator
${appStoreBlock}

Requirements:
- Ideas must be specific and buildable
- Ideas must feel monetizable
- Avoid vague startup concepts
- Avoid analytics framing
- Do not include tables, scores, or metrics
- Include a short signalSummary for every idea
- Include richer app messaging content for every idea, not only store metadata
- Include a detailed buildPackage for every idea
- Make each idea meaningfully different from the others
- Prefer niche user problems over broad categories
- Favor ideas that could be launched as an MVP quickly
- Make the paid package feel worth buying on its own

Output:
- Return valid JSON only
- Match the required schema exactly
- Use this schema:
{
  "keyword": "string",
  "market": "string",
  "ideas": [
    {
      "name": "string",
      "oneLine": "string",
      "targetUsers": ["string"],
      "why": "string",
      "signalSummary": "string",
      "aso": {
        "title": "string",
        "subtitle": "string",
        "heroHook": "string",
        "description": "string",
        "keywords": ["string"],
        "valueBullets": ["string"],
        "paywallCopy": "string"
      },
      "buildPackage": {
        "productSummary": "string",
        "mvpFeatures": ["string"],
        "v1Roadmap": ["string"],
        "devPromptKit": ["string"],
        "launchPromptKit": ["string"]
      }
    }
  ]
}

Additional quality bar for "aso":
- "heroHook" should immediately communicate the strongest value or emotional pull
- "description" should be 3-5 concrete sentences, not a short generic line
- "valueBullets" should contain 3 clear paid-worthy selling points
- "paywallCopy" should sound like upgrade or purchase copy a user would actually respond to
- Avoid generic ASO jargon; write like product positioning and conversion messaging`;

  return {
    systemPrompt: IDEA_SYSTEM_PROMPT,
    userPrompt,
  };
}
