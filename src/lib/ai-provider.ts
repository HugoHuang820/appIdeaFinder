import OpenAI from "openai";

import { fetchLightweightAppStoreContext } from "@/src/lib/app-store-signals";
import { appEnv, isDeepSeekEnabled, isOpenAiEnabled } from "@/src/lib/env";
import { generateIdeaPackMock } from "@/src/lib/idea-generator";
import { buildIdeaPrompt } from "@/src/lib/prompts";
import type { Idea, IdeaGenerationResult, Locale } from "@/src/lib/types";

type GenerateIdeasInput = {
  keyword: string;
  market: string;
  locale: Locale;
  ideaCount: number;
};

type ModelPayload = {
  keyword?: unknown;
  market?: unknown;
  ideas?: unknown;
};

const openai =
  appEnv.aiProvider === "openai" && isOpenAiEnabled()
    ? new OpenAI({
        apiKey: appEnv.openAiApiKey,
      })
    : null;

const deepseek =
  appEnv.aiProvider === "deepseek" && isDeepSeekEnabled()
    ? new OpenAI({
        apiKey: appEnv.deepSeekApiKey,
        baseURL: appEnv.deepSeekBaseUrl,
      })
    : null;

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string" && item.trim().length > 0);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeIdeas(payload: ModelPayload, locale: Locale): IdeaGenerationResult {
  const keyword = typeof payload.keyword === "string" ? payload.keyword.trim() : "";
  const market = typeof payload.market === "string" ? payload.market.trim() : appEnv.defaultMarket;

  if (!Array.isArray(payload.ideas) || !keyword) {
    throw new Error("AI returned an invalid idea payload.");
  }

  const ideas: Idea[] = payload.ideas.map((idea, index) => {
    const record = idea as Record<string, unknown>;
    const aso = (record.aso ?? {}) as Record<string, unknown>;
    const buildPackage = (record.buildPackage ?? {}) as Record<string, unknown>;

    if (
      typeof record.name !== "string" ||
      typeof record.oneLine !== "string" ||
      typeof record.why !== "string" ||
      typeof record.signalSummary !== "string" ||
      !isStringArray(record.targetUsers) ||
      typeof aso.title !== "string" ||
      typeof aso.subtitle !== "string" ||
      typeof aso.heroHook !== "string" ||
      typeof aso.description !== "string" ||
      !isStringArray(aso.keywords) ||
      !isStringArray(aso.valueBullets) ||
      typeof aso.paywallCopy !== "string" ||
      typeof buildPackage.productSummary !== "string" ||
      !isStringArray(buildPackage.mvpFeatures) ||
      !isStringArray(buildPackage.v1Roadmap) ||
      !isStringArray(buildPackage.devPromptKit) ||
      !isStringArray(buildPackage.launchPromptKit)
    ) {
      throw new Error("AI returned an idea that does not match schema.");
    }

    return {
      id: `idea_${index + 1}`,
      name: record.name.trim(),
      oneLine: record.oneLine.trim(),
      targetUsers: record.targetUsers,
      why: record.why.trim(),
      signalSummary: {
        summary: record.signalSummary.trim(),
        source: "app_store_lightweight",
        confidence: "low",
      },
      aso: {
        title: aso.title.trim(),
        subtitle: aso.subtitle.trim(),
        heroHook: aso.heroHook.trim(),
        description: aso.description.trim(),
        keywords: aso.keywords,
        valueBullets: aso.valueBullets,
        paywallCopy: aso.paywallCopy.trim(),
      },
      buildPackage: {
        productSummary: buildPackage.productSummary.trim(),
        mvpFeatures: buildPackage.mvpFeatures,
        v1Roadmap: buildPackage.v1Roadmap,
        devPromptKit: buildPackage.devPromptKit,
        launchPromptKit: buildPackage.launchPromptKit,
      },
      isLocked: index >= 2,
    };
  });

  return {
    keyword,
    market,
    locale,
    ideas,
    prompt: buildIdeaPrompt(keyword, ideas.length, market, locale),
  };
}

async function generateIdeasWithClient(
  client: OpenAI,
  model: string,
  providerName: "OpenAI" | "DeepSeek",
  input: GenerateIdeasInput,
): Promise<IdeaGenerationResult> {
  const appStoreContext = await fetchLightweightAppStoreContext(input);
  const prompt = buildIdeaPrompt(input.keyword, input.ideaCount, input.market, input.locale, appStoreContext);
  const response = await client.chat.completions.create({
    model,
    response_format: {
      type: "json_object",
    },
    messages: [
      {
        role: "system",
        content: prompt.systemPrompt,
      },
      {
        role: "user",
        content: prompt.userPrompt,
      },
    ],
  });

  const content = response.choices[0]?.message?.content as
    | string
    | Array<{ text?: string }>
    | null
    | undefined;
  let normalizedContent = "";

  if (typeof content === "string") {
    normalizedContent = content;
  } else if (Array.isArray(content)) {
    normalizedContent = content.map((item) => item.text ?? "").join("");
  }

  if (!normalizedContent) {
    throw new Error(`${providerName} returned an empty response.`);
  }

  return normalizeIdeas(JSON.parse(normalizedContent) as ModelPayload, input.locale);
}

export async function generateIdeas(input: GenerateIdeasInput): Promise<IdeaGenerationResult> {
  if (appEnv.aiProvider === "deepseek") {
    if (!deepseek) {
      throw new Error("DeepSeek client is not configured.");
    }

    return generateIdeasWithClient(deepseek, appEnv.deepSeekModel, "DeepSeek", input);
  }

  if (appEnv.aiProvider === "openai") {
    if (!openai) {
      throw new Error("OpenAI client is not configured.");
    }

    return generateIdeasWithClient(openai, appEnv.openAiModel, "OpenAI", input);
  }

  if (!isOpenAiEnabled() && !isDeepSeekEnabled()) {
    return generateIdeaPackMock(input.keyword, input.market, input.locale, input.ideaCount);
  }

  if (deepseek) {
    return generateIdeasWithClient(deepseek, appEnv.deepSeekModel, "DeepSeek", input);
  }

  if (openai) {
    return generateIdeasWithClient(openai, appEnv.openAiModel, "OpenAI", input);
  }

  return generateIdeaPackMock(input.keyword, input.market, input.locale, input.ideaCount);
}
