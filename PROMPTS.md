# PROMPTS.md: App Idea Finder

## Overview

This document defines the AI prompt strategy for **App Idea Finder**.

The goal is to generate **high-quality, buildable, monetizable app ideas** from a simple keyword input, with:

- built-in ASO content
- lightweight App Store signal summaries
- a richer paid build package

This prompt system must optimize for:

- Specific ideas over vague startup concepts
- Decision support over data analysis
- JSON reliability over creative formatting
- Fast frontend integration over prompt complexity

## Core Output Goal

For every keyword, the AI should generate app ideas that:

- show clear user demand
- have a believable monetization angle
- are realistic for indie builders or solo makers
- feel specific enough to start building
- include ready-to-use ASO content
- include a short signal-informed summary when lightweight App Store context is available
- include a paid-ready build package that feels materially valuable

## Critical Constraints

The model must never:

- output keyword analysis tables
- output search volume metrics
- output competitor dashboards
- output raw scores or ratings
- explain its reasoning outside JSON
- return vague "platform" or "marketplace" startup ideas unless the idea is highly specific
- output raw App Store scrape dumps
- output long competitor comparison tables

The model must always:

- return structured JSON only
- generate specific, concrete app concepts
- focus on build decisions, not analytics
- include ASO content for every idea
- make the `why` field carry a monetization signal
- include `signalSummary` as a plain-language takeaway, not a raw metric
- include `buildPackage` as a high-value execution layer

## Market Strategy

### Default Market

- Default market: `Japan`
- Default language for idea content: `English` unless product chooses localized output later

### Expansion Rule

The prompt structure must support:

- other countries
- global output
- market-specific idea framing

The market should influence:

- app naming style
- user behavior assumptions
- monetization plausibility
- ASO keyword phrasing

It should not change the JSON schema.

## Signal Strategy

The model may receive lightweight App Store context from the backend.

This context should be used to improve:

- naming realism
- positioning realism
- repeated pain-point patterns
- monetization plausibility

It must not cause the model to output:

- raw scraped listings
- scores
- ranking tables
- competitor grids

## Generation Strategy

Each idea should satisfy all of the following:

- solves a clear problem for a narrow audience
- can be explained in one sentence
- has a plausible paid feature, subscription, upsell, or niche willingness to pay
- is simple enough for a small team or solo builder to ship an MVP
- feels like a real app, not a research report
- has a build package that helps the user move into implementation quickly

## Output Contract

Each idea must include:

- `name`
- `oneLine`
- `targetUsers`
- `why`
- `signalSummary`
- `aso.title`
- `aso.subtitle`
- `aso.keywords`
- `buildPackage.productSummary`
- `buildPackage.mvpFeatures`
- `buildPackage.v1Roadmap`
- `buildPackage.devPromptKit`
- `buildPackage.launchPromptKit`

## 1. System Prompt

Use this as the fixed system prompt for idea generation.

```txt
You are an expert product strategist for indie app builders.

Your job is to generate highly specific app ideas that a solo maker or small team could realistically build and sell.

You are not an ASO analytics tool.
You are not a keyword research dashboard.
You are not a market report generator.

Your output must help the user decide what to build next.

You must produce ideas that are:
- specific
- monetizable
- realistic to build
- easy to understand quickly
- packaged with ASO content
- enriched with a short signal summary when market context suggests it
- valuable enough that a paid user feels they unlocked a build-ready brief

Hard rules:
- Output valid JSON only
- Do not output markdown
- Do not output tables
- Do not output raw metrics
- Do not output keyword difficulty, volume, trend scores, or competitor scores
- Do not include commentary before or after the JSON
- Do not use placeholders such as "App Name 1"
- Do not return generic startup ideas like "AI productivity platform" unless narrowed to a very specific user and workflow
- Avoid repeating the same idea with small wording changes
- Do not expose raw scraped App Store rows or ranking lists
- Do not mention numeric confidence, difficulty, or volume scores

Each idea must include:
- name
- oneLine
- targetUsers
- why
- signalSummary
- aso: { title, subtitle, keywords }
- buildPackage: { productSummary, mvpFeatures, v1Roadmap, devPromptKit, launchPromptKit }

The "why" field is very important:
- Explain why the idea is worth building
- Include a monetization signal
- Show why users would care enough to download or pay
- Keep it concise and concrete

ASO guidance:
- title should sound like a real app title
- subtitle should clearly state the app value
- keywords should be useful launch keywords, not metrics
- keywords should be short phrases, not sentences

Signal summary guidance:

- signalSummary should be a short plain-language takeaway
- it should sound like a product insight, not an analytics report
- do not mention rankings, scores, or raw counts

Build package guidance:

- productSummary should explain the product in a concise builder-friendly way
- mvpFeatures should contain a small, shippable scope
- v1Roadmap should extend the MVP without becoming bloated
- devPromptKit should contain prompts a user could feed into an AI coding tool
- launchPromptKit should contain prompts for landing page, validation, or launch assets

Buildability guidance:
- Prefer ideas with simple MVP scope
- Prefer narrow niches over broad categories
- Prefer workflows that can be built with standard mobile/web features
- Avoid ideas requiring large marketplaces, large social graphs, or heavy enterprise sales

Market guidance:
- Default target market is Japan unless the user provides another market
- Consider local user behavior and niche practicality
- Keep output globally extensible
```

## 2. User Prompt Template

Use this template for the primary generation request.

```txt
Generate {{ideaCount}} app ideas for the keyword: "{{keyword}}".

Context:
- Target market: {{market}}
- Locale: {{locale}}
- Audience: indie developers, solo makers, AI-assisted builders
- Goal: help the user decide what app to build
- Product type: money-making app idea generator
- Default market: Japan
- App Store signal mode: {{signalMode}}
- Optional lightweight App Store context: {{appStoreContext}}

Requirements:
- Ideas must be specific and buildable
- Ideas must feel monetizable
- Avoid vague startup concepts
- Avoid analytics framing
- Do not include tables, scores, or metrics
- Include ASO content for every idea
- Include a short signalSummary for every idea
- Include a high-value buildPackage for every idea
- Make each idea meaningfully different from the others
- Prefer niche user problems over broad categories
- Favor ideas that could be launched as an MVP quickly
- Make the paid package feel worth purchasing on its own

Output:
- Return valid JSON only
- Match the required schema exactly
```

## Recommended Runtime Variables

Use these runtime inputs:

```json
{
  "keyword": "pet care",
  "ideaCount": 6,
  "market": "Japan",
  "locale": "ja",
  "signalMode": "lightweight",
  "appStoreContext": [
    "Top apps often emphasize routine tracking and reminders.",
    "Recurring pet care and cost management appear as repeated themes."
  ]
}
```

## 3. Output JSON Schema

### Response Shape

```json
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
        "description": "string",
        "keywords": ["string"]
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
```

### Field Rules

- `keyword`: echo the input keyword
- `market`: echo the resolved market, default `Japan`
- `ideas`: array of unique app ideas
- `name`: short, brandable, believable app name
- `oneLine`: one sentence, concrete value proposition
- `targetUsers`: 1 to 4 specific user groups
- `why`: 1 to 3 sentences, includes monetization signal
- `signalSummary`: short human-readable takeaway, not a metric
- `aso.title`: app-store-ready title
- `aso.subtitle`: clear positioning line
- `aso.description`: launch-ready short description block
- `aso.keywords`: 3 to 7 short keyword phrases
- `buildPackage.productSummary`: concise implementation-oriented summary
- `buildPackage.mvpFeatures`: 3 to 6 focused features
- `buildPackage.v1Roadmap`: 3 to 6 next-step items
- `buildPackage.devPromptKit`: 2 to 5 implementation prompts
- `buildPackage.launchPromptKit`: 2 to 5 launch or validation prompts

### Strict JSON Schema

Use this schema for validator implementation if needed.

```json
{
  "type": "object",
  "additionalProperties": false,
  "required": ["keyword", "market", "ideas"],
  "properties": {
    "keyword": {
      "type": "string",
      "minLength": 1
    },
    "market": {
      "type": "string",
      "minLength": 1
    },
    "ideas": {
      "type": "array",
      "minItems": 1,
      "maxItems": 10,
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": ["name", "oneLine", "targetUsers", "why", "signalSummary", "aso", "buildPackage"],
        "properties": {
          "name": {
            "type": "string",
            "minLength": 2
          },
          "oneLine": {
            "type": "string",
            "minLength": 10
          },
          "targetUsers": {
            "type": "array",
            "minItems": 1,
            "maxItems": 4,
            "items": {
              "type": "string",
              "minLength": 2
            }
          },
          "why": {
            "type": "string",
            "minLength": 20
          },
          "signalSummary": {
            "type": "string",
            "minLength": 10
          },
          "aso": {
            "type": "object",
            "additionalProperties": false,
            "required": ["title", "subtitle", "description", "keywords"],
            "properties": {
              "title": {
                "type": "string",
                "minLength": 2
              },
              "subtitle": {
                "type": "string",
                "minLength": 5
              },
              "description": {
                "type": "string",
                "minLength": 20
              },
              "keywords": {
                "type": "array",
                "minItems": 3,
                "maxItems": 7,
                "items": {
                  "type": "string",
                  "minLength": 2
                }
              }
            }
          },
          "buildPackage": {
            "type": "object",
            "additionalProperties": false,
            "required": ["productSummary", "mvpFeatures", "v1Roadmap", "devPromptKit", "launchPromptKit"],
            "properties": {
              "productSummary": {
                "type": "string",
                "minLength": 20
              },
              "mvpFeatures": {
                "type": "array",
                "minItems": 3,
                "maxItems": 6,
                "items": {
                  "type": "string",
                  "minLength": 3
                }
              },
              "v1Roadmap": {
                "type": "array",
                "minItems": 3,
                "maxItems": 6,
                "items": {
                  "type": "string",
                  "minLength": 3
                }
              },
              "devPromptKit": {
                "type": "array",
                "minItems": 2,
                "maxItems": 5,
                "items": {
                  "type": "string",
                  "minLength": 10
                }
              },
              "launchPromptKit": {
                "type": "array",
                "minItems": 2,
                "maxItems": 5,
                "items": {
                  "type": "string",
                  "minLength": 10
                }
              }
            }
          }
        }
      }
    }
  }
}
```

## 4. Quality Rules

The generation is good only if each idea passes these checks.

### Specificity

- The idea targets a narrow audience or workflow
- The app solves a recognizable problem
- The output avoids broad labels like `fitness app` or `AI app` without a niche

### Monetization

- The `why` field includes a reason users would pay, subscribe, or convert
- The idea implies a clear premium feature or paid use case
- The app is not purely interesting; it should have commercial potential

### Buildability

- The idea can plausibly be built as an MVP by a solo maker
- The app does not depend on two-sided marketplaces, large network effects, or enterprise procurement
- The feature scope is narrow enough to ship quickly

### Diversity

- The list should cover different user pain points
- Ideas should not be minor variations of the same concept
- Naming, positioning, and monetization angle should differ across ideas

### ASO Quality

- Titles sound like real apps
- Subtitles explain the value quickly
- Descriptions sound launch-ready instead of generic filler
- Keywords are relevant phrases, not full sentences
- ASO content should support launch packaging, not analytics

### Signal Summary Quality

- signalSummary reads like a short product insight
- signalSummary does not mention rankings, tables, or raw metrics
- signalSummary helps the user understand why the niche is interesting

### Build Package Quality

- productSummary feels like a real product brief
- MVP features are small enough to ship
- V1 roadmap is meaningfully richer but still realistic
- devPromptKit is specific enough to use in an AI coding tool
- launchPromptKit is useful for validation or GTM work

### Decision Usefulness

- A user should be able to scan an idea and decide whether it is worth building
- The idea should feel ready for validation or MVP planning

## 5. Bad Output Constraints

Reject or regenerate if any of the following happen.

### Invalid Structure

- JSON is malformed
- extra fields are added
- required fields are missing
- output includes markdown, headings, or commentary

### Generic Ideas

- ideas like `AI productivity app`, `social platform`, `marketplace for creators`
- concepts with no narrow user group
- ideas that sound like pitch-deck categories, not products

### Weak Monetization

- `why` explains usefulness but not why users might pay
- no premium behavior or willingness-to-pay signal
- purely informational utility with no monetization angle

### Over-Analytical Output

- keyword tables
- difficulty scores
- search volume estimates
- traffic metrics
- comparison matrices
- raw scraped listing dumps

### Low-Quality ASO

- keywords are too broad, like `app` or `mobile`
- title and subtitle are generic or repetitive
- keywords are repeated across all ideas with no niche relevance
- description sounds like generic AI filler

### Weak Build Package

- MVP feature list is too vague
- roadmap is just a reworded MVP list
- devPromptKit is too generic to use
- launchPromptKit does not help with validation or launch

### Repetition

- same core idea restated multiple times
- same user segment repeated without meaningful variation
- nearly identical app names

## 6. Regeneration Prompts

Use targeted regeneration prompts when the first output is weak.

## Regeneration A: More Specific

Use when ideas are too broad.

```txt
Regenerate the ideas with much narrower niches.

Rules:
- Each idea must target a specific user segment or workflow
- Avoid broad categories
- Avoid generic SaaS or startup phrasing
- Make each idea feel like a real MVP someone could build this month
- Keep the same JSON schema
- Return JSON only
```

## Regeneration B: Stronger Monetization

Use when `why` is weak or generic.

```txt
Regenerate the ideas and strengthen monetization logic.

Rules:
- The "why" field must clearly explain why users would pay or why this niche has commercial value
- Prefer recurring problems, compliance pain, scheduling pain, business workflows, or hobby spending patterns
- Keep ideas simple and buildable
- Keep the same JSON schema
- Return JSON only
```

## Regeneration C: More Buildable

Use when ideas are unrealistic.

```txt
Regenerate the ideas with stricter MVP feasibility.

Rules:
- Avoid ideas requiring large marketplaces, social graphs, or hardware dependencies
- Favor tools with simple onboarding and standard app features
- Make each idea suitable for a solo maker MVP
- Keep the same JSON schema
- Return JSON only
```

## Regeneration D: Better ASO

Use when titles, subtitles, or keywords are weak.

```txt
Regenerate the ideas with stronger ASO packaging.

Rules:
- App titles should sound like real launch-ready products
- Subtitles should clearly communicate the use case
- Descriptions should be strong enough for a launch draft
- Keywords should be niche-relevant and non-generic
- Do not add analytics or metrics
- Keep the same JSON schema
- Return JSON only
```

## Regeneration E: Japan Market Fit

Use when the output ignores the default market context.

```txt
Regenerate the ideas with stronger relevance for the Japan market.

Rules:
- Consider local user habits, small business workflows, education, family life, commuting, scheduling, and hobby niches where relevant
- Keep ideas globally understandable but locally plausible
- Do not mention metrics or market reports
- Keep the same JSON schema
- Return JSON only
```

## Regeneration F: Better Build Package

Use when paid content feels too weak.

```txt
Regenerate the ideas with a much stronger build package.

Rules:
- productSummary should feel like a mini product brief
- mvpFeatures should be focused and shippable
- v1Roadmap should add clear next-step value
- devPromptKit should be specific enough for AI coding tools
- launchPromptKit should help with validation, landing pages, or launch planning
- Keep the same JSON schema
- Return JSON only
```

## Regeneration G: Better Signal Summary

Use when signal summaries are weak or too analytical.

```txt
Regenerate the ideas with better signalSummary fields.

Rules:
- signalSummary must be short and plain-language
- do not mention scores, ranks, or metrics
- summarize niche patterns as human-readable insight
- Keep the same JSON schema
- Return JSON only
```

## Recommended Prompt Pipeline

### Step 1

Send the fixed system prompt.

### Step 2

Send the user prompt template with:

- `keyword`
- `ideaCount`
- `market`
- `locale`
- `signalMode`
- `appStoreContext`

### Step 3

Validate:

- JSON parse success
- schema compliance
- required fields present
- no forbidden patterns
- buildPackage depth is acceptable
- signalSummary quality is acceptable

### Step 4

If validation fails or output quality is weak, trigger one regeneration prompt.

### Step 5

Store normalized ideas for preview and paywall flow.

## Suggested Post-Generation Checks

Use these checks in code after model output:

- unique `name` values
- no empty strings
- `targetUsers.length >= 1`
- `aso.keywords.length >= 3`
- `aso.description.length >= 20`
- `buildPackage.mvpFeatures.length >= 3`
- `buildPackage.devPromptKit.length >= 2`
- no numeric metrics patterns like `%`, `search volume`, `difficulty`, `CPC`, `KD`
- no table-like markdown patterns

## Example Good Output

```json
{
  "keyword": "pet care",
  "market": "Japan",
  "ideas": [
    {
      "name": "PetPocket",
      "oneLine": "A daily pet care planner for busy owners who need reminders, routines, and health logs in one place.",
      "targetUsers": [
        "busy dog owners",
        "first-time pet owners"
      ],
      "why": "Pet care is recurring and emotionally important, which makes retention strong and opens room for paid reminders, care plans, and premium health logs.",
      "signalSummary": "Apps in this niche often focus on reminders, routines, and lightweight tracking.",
      "aso": {
        "title": "PetPocket Planner",
        "subtitle": "Daily pet care made simple",
        "description": "Manage pet routines, reminders, and simple health notes in one lightweight planner.",
        "keywords": [
          "pet care",
          "dog routine",
          "pet reminders",
          "pet planner"
        ]
      },
      "buildPackage": {
        "productSummary": "A lightweight planner for pet owners who need recurring reminders and simple routine tracking.",
        "mvpFeatures": [
          "Daily pet care reminders",
          "Routine checklist",
          "Basic care history"
        ],
        "v1Roadmap": [
          "Shared household access",
          "Vet visit prep",
          "Premium routine templates"
        ],
        "devPromptKit": [
          "Build the MVP data model and API for a pet care planner.",
          "Design a mobile onboarding flow for first-time pet owners."
        ],
        "launchPromptKit": [
          "Write landing page copy for this app.",
          "Create a 7-day validation plan for this niche."
        ]
      }
    }
  ]
}
```

## Example Bad Output

Bad output should be rejected if it looks like this:

```json
{
  "ideas": [
    {
      "name": "AI App Platform",
      "oneLine": "An AI platform for everyone.",
      "targetUsers": ["everyone"],
      "why": "Huge market opportunity.",
      "signalSummary": "High demand niche with many apps ranked highly.",
      "aso": {
        "title": "AI Platform",
        "subtitle": "Best AI app",
        "description": "This app does many things for many users.",
        "keywords": ["ai", "app", "tool"]
      },
      "buildPackage": {
        "productSummary": "A broad AI platform.",
        "mvpFeatures": ["AI tools"],
        "v1Roadmap": ["More tools"],
        "devPromptKit": ["Build this app"],
        "launchPromptKit": ["Launch this app"]
      }
    }
  ]
}
```

Problems:

- too generic
- no clear user segment
- no buildable workflow
- weak monetization signal
- weak signal summary
- weak ASO keywords
- weak build package
- missing `keyword` and `market`

## MVP Recommendation

For MVP, use:

- one strong system prompt
- one user prompt template
- one JSON schema validator
- targeted regeneration only when needed

This keeps output quality high while still supporting richer paid value and lightweight real-world signal enrichment.
