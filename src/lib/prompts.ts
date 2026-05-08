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
- Each idea must include opportunityScores with 1-10 scores
- The "why" field must include a concrete monetization signal
- signalSummary must be a plain-language takeaway, not an analytics report
- opportunityScores must help users compare options quickly without pretending to be exact analytics
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
- Do not include tables or raw market metric dumps
- Do include compact 1-10 opportunityScores for demand, competition, monetization, buildEase, indieFit, and overall
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
      "opportunityScores": {
        "demand": 1,
        "competition": 1,
        "monetization": 1,
        "buildEase": 1,
        "indieFit": 1,
        "overall": 1,
        "rationale": "string"
      },
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
- Avoid generic ASO jargon; write like product positioning and conversion messaging

Additional quality bar for "opportunityScores":
- Use whole numbers from 1 to 10
- Higher competition means harder competition, not better competition
- buildEase should be higher when the MVP is easier for a solo maker
- indieFit should be higher when the idea is realistic for a solo or AI-assisted builder
- overall should balance demand, monetization, buildEase, indieFit, and competition risk
- rationale should be one concrete sentence explaining the score tradeoff`;

  return {
    systemPrompt: IDEA_SYSTEM_PROMPT,
    userPrompt,
  };
}
