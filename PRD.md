# PRD: App Idea Finder

## Product Overview

**App Idea Finder** is a simple web tool that helps indie developers and solo makers decide what to build next.

The user enters a keyword, the system generates a small set of app ideas, and each idea comes with a high-value execution package: ready-to-use ASO content, product scope suggestions, and AI-ready development prompts so the user can move from idea selection to build planning immediately.

This is still **not** an ASO analytics product. It does **not** expose keyword tables, raw scores, or dashboard-heavy competitor analysis. Instead, it may use **lightweight App Store signals in the background** to improve idea quality while keeping the UI simple, fast, and decision-oriented.

Core loop:

`Enter keyword -> Get 2 free ideas -> Preview locked ideas -> Pay -> Unlock full idea pack`

## Target Users

### Primary Users

- Indie developers looking for profitable app ideas they can build quickly
- Solo makers who want a fast starting point instead of researching for hours
- AI-assisted builders who can ship products quickly once they have a clear concept

### User Mindset

- "I want an app idea that feels specific and monetizable."
- "I do not want to dig through data dashboards."
- "I want something I can build this week."
- "I want help packaging the idea, not just brainstorming it."

## Core Value

App Idea Finder helps users answer one core question:

**"What should I build next that feels actionable and marketable?"**

It delivers value through:

- Fast idea generation from a simple keyword input
- Structured app concepts instead of vague brainstorming
- Lightweight real-world App Store signal enrichment without exposing heavy analytics UI
- Built-in launch packaging for each idea, including ASO and build guidance
- A low-friction paywall that unlocks more value at the moment of interest

## Product Goals

### Business Goal

Convert idea curiosity into paid unlocks by showing users a strong first set of ideas and making the additional idea pack feel immediately worth paying for.

### User Goal

Help users move from a vague niche or keyword to a shortlist of app ideas they could realistically build, package, and launch.

### Product Principles

- Simple over analytical
- Actionable over informational
- Fast over feature-heavy
- Card-based over table-based
- Decision support over optimization tooling
- Signal-informed over dashboard-driven

## Non-Goals

The MVP will not include:

- Keyword tables
- Complex analytics dashboards
- Score-heavy UI
- Full competitor tracking suites
- Search volume history charts
- Heavy market intelligence workflows
- Project management tools

## Core User Flow

### Primary Flow

1. User lands on homepage
2. User enters a keyword or niche, such as `fitness`, `habit tracker`, or `pet care`
3. System generates an idea pack using AI plus lightweight App Store signals where available
4. User sees the first 2 ideas fully visible
5. User sees additional ideas in locked cards
6. User clicks unlock CTA
7. User completes payment
8. Full idea pack is revealed
9. User copies or exports idea details for execution

### User Outcome

By the end of the flow, the user should feel:

- "I found a buildable idea"
- "I can start validating or building right now"
- "Paying saved me brainstorming time"

## Feature List

## P0 Features

### 1. Keyword Input

User enters a keyword or short phrase that describes a market, problem space, audience, or use case.

Requirements:

- Single input field
- One primary CTA: `Generate Ideas`
- Placeholder examples to guide usage
- Fast submission with minimal friction

### 2. Idea Generation

System generates a small pack of app ideas based on the keyword.

Requirements:

- Generate 5 to 10 ideas per request
- First 2 ideas are fully visible
- Remaining ideas are locked but previewable
- Content should feel specific, practical, and monetizable
- Generation may be enriched with lightweight App Store signals in the background

### 3. Idea Card

The idea card is the core product unit and must make each idea feel immediately actionable.

Each card should include:

- App name
- One-line concept
- Target user
- Core problem solved
- Key feature bullets
- Monetization angle
- App Store signal summary
- Launch package preview

Card rules:

- Must be easy to scan in under 10 seconds
- Must avoid numeric scores and dense research UI
- Must answer "why this is worth building"
- Must feel more concrete than generic brainstorming output

### 4. Lightweight App Store Signal Layer

The product may use limited real App Store data to improve idea quality, but the UI must remain extremely simple.

Allowed signal types:

- Top matching app titles for the keyword
- Repeated positioning phrases
- Common use-case patterns
- Common monetization patterns inferred from listing language
- Category or audience hints

Signal rules:

- Use signals only to improve idea generation quality
- Show only short, human-readable takeaways on cards
- Do not show raw tables, rankings, or score panels
- Do not turn the result page into a research dashboard

### 5. Built-in Launch Package Per Idea

Each idea includes ready-to-use launch content so the idea feels closer to shippable.

Required ASO content:

- App title
- Subtitle / short description
- App Store / Play Store description draft
- Keyword suggestions

Required paid-only expansion content:

- Product concept summary
- Suggested MVP feature list
- Suggested V1 feature roadmap
- Monetization approach
- Build stack suggestion
- AI development prompt kit for implementing the app
- Optional landing page prompt / validation prompt

This content is not positioned as analytics-backed ASO research. It is positioned as launch-ready packaging for the idea.

### 6. Locked Ideas

After the first 2 visible ideas, remaining ideas appear as locked cards.

Requirements:

- Show enough preview to create curiosity
- Keep details partially obscured
- Repeat unlock CTA within result flow
- Reinforce value of full idea pack

### 7. Simple Payment Trigger

Users can unlock the full pack through a lightweight purchase flow.

Requirements:

- Single clear CTA such as `Unlock Full Idea Pack`
- Price visible near CTA
- Minimal friction between interest and purchase
- Return user to unlocked results after successful payment

### 8. Flexible Purchase Model

The product supports both one-time purchase and subscription.

Purchase options:

- One-time purchase: unlock current idea pack and download it
- Monthly subscription: generate and download idea packs within a monthly quota

Subscription rules:

- Monthly plan includes a fixed number of generations or downloads
- Usage status is visible in a simple, non-dashboard way
- Subscription should feel like a productivity plan, not a BI product

## P1 Features

### 1. Regenerate Ideas

Allow user to rerun generation with the same keyword for a fresh pack.

### 2. Copy Actions

Allow copy-to-clipboard for idea title, concept, and ASO content.

### 3. Export

Allow export to markdown or plain text.

### 4. Keyword Suggestions

Show a few starter prompts on home page to reduce blank-state friction.

### 5. Subscription Management

Allow users to view remaining monthly credits and billing status in a simple account area.

## Page Structure

## 1. Home Page

Goal: get user to submit a keyword as fast as possible.

Sections:

- Headline focused on finding profitable app ideas quickly
- Short subheadline explaining the output
- Keyword input field
- Primary CTA
- Example keywords
- Small value preview of what an idea card includes
- Small trust note such as `AI ideas enhanced with lightweight App Store signals`

Suggested messaging:

- Headline: `Find Your Next App Idea in Seconds`
- Subheadline: `Enter a niche or keyword and get buildable app ideas with ready-to-use launch content.`

## 2. Result Page

Goal: deliver immediate value, then convert.

Sections:

- Keyword summary
- Results header
- 2 fully unlocked idea cards
- Locked idea cards beneath
- Repeated unlock CTA between or below locked cards
- Optional short signal insight such as `Apps in this niche often emphasize routine, tracking, and reminders`

UX rules:

- Card-based layout only
- No tables
- No dashboards
- No score panels
- Keep page highly scannable
- Paid users should see much deeper content within the same card flow, not a separate complex workspace

## 3. Paywall

Goal: convert users without breaking momentum.

Sections:

- Short reminder of what user gets
- Count of locked ideas remaining
- One-time price
- Monthly plan option
- One primary payment CTA per plan
- Small trust copy such as instant unlock / cancel anytime / monthly quota included

Suggested value framing:

- Unlock the full idea pack
- Get more app concepts
- Access full ASO and product planning content for every idea
- Get feature scope and build prompts
- Save hours of brainstorming, packaging, and planning work

## Idea Card Specification

Each idea card should follow this structure:

### Visible Fields

- `name`: clear app concept name
- `hook`: one-sentence explanation
- `targetUser`: who it is for
- `problem`: what pain point it solves
- `features`: 3 to 5 key features
- `monetization`: how the app can make money
- `signalSummary`: short summary derived from lightweight App Store signals
- `packagePreview`: short preview of what is included after unlock

### ASO Block

- `appTitle`
- `subtitle`
- `description`
- `keywords`

### Build Package Block

- `productSummary`
- `mvpFeatures`
- `v1Roadmap`
- `devPromptKit`
- `launchPromptKit`

### Locked State

For locked cards, show:

- App name or partial concept teaser
- Partial hook
- Hidden details overlay
- Unlock CTA

## Data Model

## Idea

```json
{
  "id": "string",
  "keyword": "string",
  "name": "string",
  "hook": "string",
  "targetUser": "string",
  "problem": "string",
  "features": [
    "string"
  ],
  "monetization": "string",
  "signalSummary": "string",
  "aso": {
    "appTitle": "string",
    "subtitle": "string",
    "description": "string",
    "keywords": [
      "string"
    ]
  },
  "buildPackage": {
    "productSummary": "string",
    "mvpFeatures": [
      "string"
    ],
    "v1Roadmap": [
      "string"
    ],
    "devPromptKit": [
      "string"
    ],
    "launchPromptKit": [
      "string"
    ]
  },
  "locked": true
}
```

## MVP Scope (7 Days)

### Day 1

- Finalize idea card and paid package schema
- Define lightweight App Store signal ingestion format
- Define one-time vs subscription entitlements

### Day 2

- Build homepage with keyword input
- Add language around AI + lightweight App Store signal enhancement

### Day 3

- Build result page with card-based layout
- Render 2 free cards, signal summary, and locked previews

### Day 4

- Integrate idea generation backend
- Validate output consistency for ASO and build package fields

### Day 5

- Integrate payment flow for one-time unlock
- Add subscription purchase option and usage model

### Day 6

- Add export for full paid package
- Polish copy and CTA placement around value and pricing

### Day 7

- QA core flow end to end
- Validate premium package feels high-value enough to convert

## Monetization Strategy

### Pricing

- Free: first 2 ideas
- One-time: unlock current idea pack and download it
- Subscription: monthly quota for generation and downloads
- Suggested one-time price: `$9` to `$19`
- Suggested monthly price: `$19` to `$49`

### Monetization Logic

The product monetizes at the peak of curiosity:

- User enters a keyword with strong intent
- User sees enough quality in the first 2 ideas to trust the system
- Locked cards create momentum, not confusion
- Payment unlocks high-value execution assets, not just more text
- Subscription appeals to repeat builders who want multiple idea packs per month

### Recommended MVP Offer

- One-time purchase per idea pack
- Monthly builder plan with limited generations and downloads
- Start one-time at `$9`
- Test one-time at `$19` after improving pack depth
- Test monthly at `$29` with a simple quota such as `20 generations / month`

### Paid Value Promise

Users should feel they are buying a **decision-to-build kit**, not just more idea cards.

Paid pack should include:

- More ideas
- Full ASO package
- Product summary
- MVP scope
- Suggested features
- AI development prompts
- AI launch / validation prompts

## Success Metrics

Focus on simple MVP metrics only:

- Homepage to generation conversion rate
- Result page to payment click rate
- Payment conversion rate
- Revenue per visitor
- Percentage of users who copy/export an idea
- One-time purchase rate
- Subscription conversion rate
- Average generations per subscriber
- Download rate of full packs

These metrics should be used internally, not exposed in the UI.

## UX Requirements

- Card-first design
- Extremely simple result page
- No tables
- No dashboards
- No analytics-heavy language
- Every screen should reinforce decision-making, not research overload
- If real App Store signals are used, summarize them in plain-language snippets only

## Launch Copy Direction

### Core Promise

`Find app ideas worth building, with launch-ready content and build prompts included.`

### Supporting Angles

- Stop overthinking what to build
- Turn one keyword into multiple product directions
- Get app concepts you can validate or ship fast
- Unlock a full execution pack, not just ASO text
- Unlock more ideas only when you want them

## Risks and Mitigations

### Risk: Ideas feel too generic

Mitigation:

- Enforce a structured output format
- Require target user, problem, monetization, and feature specificity

### Risk: Users think it is an ASO analytics tool

Mitigation:

- Use plain positioning around idea discovery and launch packaging
- Avoid score language, data-heavy copy, and research UI patterns
- Keep App Store signals lightweight and mostly in the backend

### Risk: Paywall feels premature

Mitigation:

- Make first 2 ideas genuinely useful
- Show enough locked-card preview to build desire
- Make paid content feel materially deeper than free
- Keep entry pricing simple

### Risk: Paid package feels too thin

Mitigation:

- Include feature scope and development prompt assets
- Include launch and validation prompt assets
- Ensure every paid idea feels like a build-ready brief

## Final MVP Definition

App Idea Finder MVP is a lightweight web app that:

- Accepts a keyword
- Generates 5 to 10 app ideas
- Uses lightweight App Store signals in the background when available
- Shows 2 ideas for free
- Includes ASO content inside every idea
- Expands paid ideas into a richer execution package
- Supports one-time purchase and monthly subscription
- Uses a simple card-based interface with no tables or dashboards

If the MVP succeeds, users should consistently understand the product as:

**"A fast tool for deciding what app to build next, why it can work, and how to start building it immediately."**
