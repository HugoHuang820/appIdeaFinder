# API.md: App Idea Finder

## Overview

This API supports the MVP backend for **App Idea Finder**.

System goals:

- Generate app ideas from a keyword
- Enrich generation with lightweight App Store signals where available
- Return free preview ideas
- Hide deeper paid content until unlock
- Support one-time purchase and monthly subscription
- Export full idea packs after entitlement is granted

This API remains intentionally minimal.

It does **not** include:

- Keyword tables
- Search volume dashboards
- Raw score APIs
- Full competitor intelligence suites
- Heavy analytics reporting endpoints

The API should support simple frontend rendering while allowing the backend to combine:

- AI-generated ideas
- lightweight App Store signal summaries
- paid build-package content

## Design Principles

- Keep endpoints simple and frontend-friendly
- Return predictable JSON
- Separate preview behavior from full unlock behavior
- Support both one-time and subscription purchase modes
- Keep App Store signals lightweight and summary-oriented
- Avoid exposing internal AI or payment provider complexity

## Base URL

```txt
/api
```

## Authentication

MVP recommendation:

- Idea generation can work without a heavy account system
- Use `taskId` as the main retrieval key for idea packs
- Use `orderId` for payment lookup
- If subscriptions are enabled, associate usage with a lightweight user identity
- Webhook endpoint uses payment-provider signature validation

## Core Concepts

### Free vs Paid Access

- A generated idea pack contains `5` to `10` ideas
- The first `2` ideas are free
- Remaining ideas are locked until entitlement is granted
- Locked ideas may show teaser fields only
- Free ideas expose core idea content and lightweight signal summaries
- Paid ideas additionally expose the full `buildPackage`

### Lightweight App Store Signals

App Store data is used only as lightweight enrichment.

Allowed output examples:

- short signal summary
- repeated positioning pattern
- category hint
- monetization hint from listing language

Not allowed in response UI contracts:

- keyword tables
- raw ranking panels
- difficulty scores
- dashboard payloads

### Entitlement Modes

- `one_time_pack`: unlock the current idea pack only
- `subscription`: unlock current pack and allow future generations/downloads within quota

### Task Lifecycle

1. Client submits a keyword
2. Server creates a generation task
3. Backend generates idea pack and optional signal summaries
4. Client polls by `taskId`
5. Client renders preview-safe result cards
6. Client starts checkout for one-time or subscription purchase
7. Payment webhook confirms purchase
8. Task or user entitlement becomes active
9. Client fetches full result or export content

## Status Model

### Idea Task Status

- `pending`
- `processing`
- `completed`
- `failed`

### Payment Status

- `created`
- `pending`
- `paid`
- `failed`
- `expired`

### Entitlement Type

- `none`
- `one_time_pack`
- `subscription`

## Data Models

## Signal Summary

```json
{
  "summary": "Apps in this niche often emphasize routine tracking and reminders.",
  "source": "app_store_lightweight",
  "confidence": "low"
}
```

## Build Package

```json
{
  "productSummary": "A focused app for busy pet owners who need reminders, tracking, and simple care routines.",
  "mvpFeatures": [
    "Daily care reminders",
    "Feeding and walking tracker",
    "Basic health log"
  ],
  "v1Roadmap": [
    "Shared family accounts",
    "Vet visit preparation",
    "Premium routine templates"
  ],
  "devPromptKit": [
    "Build a mobile-first pet care planner with React and Supabase.",
    "Design an MVP onboarding flow for first-time pet owners."
  ],
  "launchPromptKit": [
    "Write a landing page for a pet care planner focused on busy owners.",
    "Generate a 7-day validation plan for launching this app."
  ]
}
```

## Idea

```json
{
  "id": "idea_001",
  "name": "PetPocket",
  "oneLine": "A daily pet care planner for busy owners.",
  "targetUsers": [
    "busy pet owners",
    "first-time dog owners"
  ],
  "why": "Pet care is recurring and emotionally important, which makes retention strong and creates room for paid reminders, care plans, and premium logs.",
  "signalSummary": {
    "summary": "Apps in this niche often emphasize routines, reminders, and lightweight tracking.",
    "source": "app_store_lightweight",
    "confidence": "low"
  },
  "aso": {
    "title": "PetPocket Planner",
    "subtitle": "Daily pet care made simple",
    "description": "Track routines, reminders, and care habits in one simple pet planner.",
    "keywords": [
      "pet care",
      "dog routine",
      "pet reminders"
    ]
  },
  "buildPackage": {
    "productSummary": "A lightweight routine app for pet owners.",
    "mvpFeatures": [
      "Daily reminders",
      "Routine checklist",
      "Basic history"
    ],
    "v1Roadmap": [
      "Shared household mode",
      "Health records",
      "Premium templates"
    ],
    "devPromptKit": [
      "Build the MVP architecture for this app."
    ],
    "launchPromptKit": [
      "Write launch copy for this product."
    ]
  },
  "isLocked": false
}
```

## Locked Idea Preview

Use this shape when the frontend needs to render locked cards without exposing full paid details.

```json
{
  "id": "idea_003",
  "name": "PetBudget",
  "oneLine": "A budgeting app for recurring pet expenses.",
  "targetUsers": [],
  "why": null,
  "signalSummary": {
    "summary": "Recurring cost control appears as a repeated theme in this niche.",
    "source": "app_store_lightweight",
    "confidence": "low"
  },
  "aso": {
    "title": null,
    "subtitle": null,
    "description": null,
    "keywords": []
  },
  "buildPackage": null,
  "isLocked": true
}
```

## Pricing Option

```json
{
  "type": "one_time_pack",
  "amount": 9,
  "currency": "USD",
  "label": "Unlock this idea pack"
}
```

## Subscription Status

```json
{
  "isActive": true,
  "plan": "monthly_builder",
  "monthlyGenerationLimit": 20,
  "monthlyDownloadLimit": 20,
  "remainingGenerations": 14,
  "remainingDownloads": 12,
  "renewsAt": "2026-05-29T10:00:00Z"
}
```

## Idea Pack

```json
{
  "taskId": "task_9fd2b",
  "keyword": "pet care",
  "status": "completed",
  "market": "Japan",
  "locale": "ja",
  "isUnlocked": false,
  "entitlementType": "none",
  "freeIdeaCount": 2,
  "totalIdeaCount": 6,
  "lockedIdeaCount": 4,
  "purchaseOptions": [
    {
      "type": "one_time_pack",
      "amount": 9,
      "currency": "USD",
      "label": "Unlock this idea pack"
    },
    {
      "type": "subscription",
      "amount": 29,
      "currency": "USD",
      "label": "Monthly builder plan"
    }
  ],
  "subscription": null,
  "ideas": []
}
```

## Order

```json
{
  "id": "order_4k2la",
  "taskId": "task_9fd2b",
  "status": "pending",
  "purchaseType": "one_time_pack",
  "amount": 9,
  "currency": "USD",
  "checkoutUrl": "https://payment.example.com/checkout/session_123",
  "provider": "stripe",
  "createdAt": "2026-04-29T10:00:00Z",
  "paidAt": null
}
```

## Error Response

All endpoints should return a consistent error shape.

```json
{
  "error": {
    "code": "TASK_NOT_FOUND",
    "message": "No idea task found for the provided taskId."
  }
}
```

## Paywall Logic

### Rule Set

- Every generated pack contains a full set of ideas in backend storage
- The API decides whether to return preview-safe content or full content
- If `isUnlocked = false`, only the first 2 ideas are fully visible
- Locked ideas may expose `id`, `name`, `oneLine`, and `signalSummary`
- Locked ideas must not expose paid `buildPackage`
- Payment success or active subscription flips entitlement state
- Once unlocked, all ideas return full ASO and `buildPackage` content

### Frontend Contract

- Use `/api/ideas/:taskId/preview` for the result page before unlock
- Use `/api/ideas/:taskId` after payment confirmation or page refresh
- Use `/api/payment/order/:id` to poll payment status if redirect-based checkout is used
- Use `purchaseOptions` from idea-pack responses to render pricing choices

## Endpoints

## 1. POST /api/ideas/generate

Creates a new idea-generation task.

### Purpose

- Accept a keyword
- Accept market and locale context
- Optionally accept lightweight App Store context
- Create a task
- Start idea generation
- Return `taskId` immediately

### Request Body

```json
{
  "keyword": "pet care",
  "market": "Japan",
  "locale": "ja",
  "signalMode": "lightweight"
}
```

### Validation Rules

- `keyword` is required
- `keyword` must be a string
- Recommended max length: `80`
- `market` is optional, default `Japan`
- `locale` is optional
- `signalMode` may be `none` or `lightweight`

### Success Response

`202 Accepted`

```json
{
  "taskId": "task_9fd2b",
  "status": "pending",
  "keyword": "pet care",
  "market": "Japan",
  "locale": "ja"
}
```

## 2. GET /api/ideas/:taskId

Returns the full idea task state.

### Purpose

- Poll generation status
- Fetch full unlocked content
- Return locked placeholders when unpaid

### Behavior

- If task is still generating, return task status only
- If task is completed but unpaid, return mixed visibility data
- If task is completed and entitlement is active, return all idea details

### Response While Processing

`200 OK`

```json
{
  "taskId": "task_9fd2b",
  "keyword": "pet care",
  "market": "Japan",
  "locale": "ja",
  "status": "processing",
  "isUnlocked": false,
  "entitlementType": "none",
  "freeIdeaCount": 2,
  "totalIdeaCount": 0,
  "ideas": []
}
```

### Response When Completed But Unpaid

`200 OK`

```json
{
  "taskId": "task_9fd2b",
  "keyword": "pet care",
  "market": "Japan",
  "locale": "ja",
  "status": "completed",
  "isUnlocked": false,
  "entitlementType": "none",
  "freeIdeaCount": 2,
  "totalIdeaCount": 6,
  "lockedIdeaCount": 4,
  "purchaseOptions": [
    {
      "type": "one_time_pack",
      "amount": 9,
      "currency": "USD",
      "label": "Unlock this idea pack"
    },
    {
      "type": "subscription",
      "amount": 29,
      "currency": "USD",
      "label": "Monthly builder plan"
    }
  ],
  "subscription": null,
  "ideas": [
    {
      "id": "idea_001",
      "name": "PetPocket",
      "oneLine": "A daily pet care planner for busy owners.",
      "targetUsers": [
        "busy pet owners",
        "first-time dog owners"
      ],
      "why": "Pet owners need simple reminders and routines, making this niche easy to understand and market.",
      "signalSummary": {
        "summary": "Apps in this niche often emphasize routines and reminders.",
        "source": "app_store_lightweight",
        "confidence": "low"
      },
      "aso": {
        "title": "PetPocket Planner",
        "subtitle": "Daily pet care made simple",
        "description": "Track routines and reminders for pet care.",
        "keywords": [
          "pet care",
          "dog routine",
          "pet reminders"
        ]
      },
      "buildPackage": null,
      "isLocked": false
    },
    {
      "id": "idea_003",
      "name": "PetBudget",
      "oneLine": "A budgeting app for recurring pet expenses.",
      "targetUsers": [],
      "why": null,
      "signalSummary": {
        "summary": "Recurring pet costs appear as a consistent pain point.",
        "source": "app_store_lightweight",
        "confidence": "low"
      },
      "aso": {
        "title": null,
        "subtitle": null,
        "description": null,
        "keywords": []
      },
      "buildPackage": null,
      "isLocked": true
    }
  ]
}
```

### Response When Completed And Unlocked

`200 OK`

```json
{
  "taskId": "task_9fd2b",
  "keyword": "pet care",
  "market": "Japan",
  "locale": "ja",
  "status": "completed",
  "isUnlocked": true,
  "entitlementType": "one_time_pack",
  "freeIdeaCount": 2,
  "totalIdeaCount": 6,
  "lockedIdeaCount": 0,
  "subscription": null,
  "ideas": [
    {
      "id": "idea_001",
      "name": "PetPocket",
      "oneLine": "A daily pet care planner for busy owners.",
      "targetUsers": [
        "busy pet owners",
        "first-time dog owners"
      ],
      "why": "Pet owners need simple reminders and routines, making this niche easy to understand and market.",
      "signalSummary": {
        "summary": "Apps in this niche often emphasize routines and reminders.",
        "source": "app_store_lightweight",
        "confidence": "low"
      },
      "aso": {
        "title": "PetPocket Planner",
        "subtitle": "Daily pet care made simple",
        "description": "Track routines and reminders for pet care.",
        "keywords": [
          "pet care",
          "dog routine",
          "pet reminders"
        ]
      },
      "buildPackage": {
        "productSummary": "A focused routine app for busy pet owners.",
        "mvpFeatures": [
          "Daily reminders",
          "Care checklist",
          "Basic history"
        ],
        "v1Roadmap": [
          "Shared household support",
          "Vet prep flows",
          "Premium templates"
        ],
        "devPromptKit": [
          "Build the MVP architecture for this app."
        ],
        "launchPromptKit": [
          "Write launch copy for this product."
        ]
      },
      "isLocked": false
    }
  ]
}
```

## 3. GET /api/ideas/:taskId/preview

Returns preview-safe results for the result page before purchase.

### Purpose

- Simplify frontend integration for the unpaid state
- Guarantee that locked ideas never leak paid details
- Provide one stable endpoint for card rendering before checkout

### Behavior

- First 2 ideas return core idea fields, `signalSummary`, and free ASO fields
- Remaining ideas return teaser fields plus `signalSummary`
- `buildPackage` must be `null` for locked ideas
- If entitlement is already active, this endpoint may return full content

## 4. POST /api/payment/checkout

Creates a checkout order for unlocking an idea pack or starting a subscription.

### Purpose

- Create a payment order tied to a specific `taskId`
- Support one-time purchase or subscription purchase
- Return checkout information

### Request Body

```json
{
  "taskId": "task_9fd2b",
  "purchaseType": "one_time_pack"
}
```

### Allowed Purchase Types

- `one_time_pack`
- `subscription`

### Validation Rules

- `taskId` is required
- `purchaseType` is required
- Task must exist
- Task must be `completed`
- Task must not already be unlocked by one-time entitlement

### Success Response

`201 Created`

```json
{
  "order": {
    "id": "order_4k2la",
    "taskId": "task_9fd2b",
    "status": "created",
    "purchaseType": "subscription",
    "amount": 29,
    "currency": "USD",
    "provider": "stripe",
    "checkoutUrl": "https://payment.example.com/checkout/session_123"
  }
}
```

## 5. POST /api/payment/webhook

Receives payment provider events.

### Purpose

- Confirm payment success
- Mark order as paid
- Grant one-time entitlement or subscription entitlement

### Notes

- This endpoint is for the payment provider, not the frontend
- Validate webhook signature before processing
- Ignore duplicate events safely
- Webhook processing must be idempotent

### Webhook Side Effects

On successful payment:

- Update order status to `paid`
- Set `paidAt`
- If `purchaseType = one_time_pack`, mark current task unlocked
- If `purchaseType = subscription`, activate subscription and consume no pack-specific purchase immediately

## 6. GET /api/payment/order/:id

Returns the current status of an order.

### Purpose

- Let frontend confirm checkout result
- Support post-payment polling
- Help result page transition from locked to unlocked

### Success Response

`200 OK`

```json
{
  "id": "order_4k2la",
  "taskId": "task_9fd2b",
  "status": "paid",
  "purchaseType": "one_time_pack",
  "amount": 9,
  "currency": "USD",
  "provider": "stripe",
  "checkoutUrl": "https://payment.example.com/checkout/session_123",
  "createdAt": "2026-04-29T10:00:00Z",
  "paidAt": "2026-04-29T10:02:11Z"
}
```

## Export Behavior

Export is supported after entitlement is granted.

MVP recommendation:

- Reuse `GET /api/ideas/:taskId` for full data retrieval
- Let frontend transform the response into markdown or plain text
- Include `signalSummary`, full ASO, and `buildPackage` in exports

If a backend export endpoint is needed later, add:

```txt
GET /api/ideas/:taskId/export?format=md
GET /api/ideas/:taskId/export?format=txt
```

## Preview vs Full Result Behavior

### Before Payment

- `GET /api/ideas/:taskId/preview` is the recommended endpoint
- First 2 ideas are complete enough to create trust
- Remaining ideas return teaser-safe JSON
- Locked ideas may show `signalSummary`
- `buildPackage` stays hidden

### After One-Time Payment

- `GET /api/ideas/:taskId` returns all ideas fully unlocked for that pack
- `isLocked` must be `false` for every idea
- Full ASO and `buildPackage` are visible

### After Subscription Activation

- `GET /api/ideas/:taskId` should return the full pack if quota allows
- Response may include subscription usage status

## Storage Recommendation

Minimal backend storage for MVP:

### idea_tasks

- `task_id`
- `keyword`
- `market`
- `locale`
- `status`
- `is_unlocked`
- `entitlement_type`
- `free_idea_count`
- `total_idea_count`
- `error_message`
- `created_at`
- `updated_at`

### ideas

- `id`
- `task_id`
- `position`
- `name`
- `one_line`
- `target_users_json`
- `why_text`
- `signal_summary_json`
- `aso_title`
- `aso_subtitle`
- `aso_description`
- `aso_keywords_json`
- `build_package_json`

### payment_orders

- `id`
- `task_id`
- `purchase_type`
- `provider`
- `provider_session_id`
- `status`
- `amount`
- `currency`
- `checkout_url`
- `created_at`
- `paid_at`

### subscriptions

- `id`
- `user_ref`
- `plan`
- `status`
- `monthly_generation_limit`
- `monthly_download_limit`
- `remaining_generations`
- `remaining_downloads`
- `renews_at`

## Frontend Integration Notes

- Call `POST /api/ideas/generate` on submit
- Poll `GET /api/ideas/:taskId/preview` until `status = completed`
- Render cards directly from the returned `ideas` array
- Render `signalSummary` as a short snippet only
- Trigger checkout with `POST /api/payment/checkout`
- Let user choose `one_time_pack` or `subscription`
- After checkout, poll `GET /api/payment/order/:id`
- When entitlement becomes active, call `GET /api/ideas/:taskId`

## Suggested HTTP Codes

- `200 OK` for successful reads
- `201 Created` for checkout creation
- `202 Accepted` for async generation start
- `400 Bad Request` for invalid input
- `404 Not Found` for missing task or order
- `409 Conflict` for already unlocked state
- `500 Internal Server Error` for unexpected failures

## MVP Summary

This API is sufficient for the updated first version of App Idea Finder because it supports:

- Keyword-based idea generation
- Async polling by `taskId`
- Lightweight App Store signal summaries
- Free preview logic
- Locked idea handling
- One-time purchase checkout
- Subscription checkout
- Webhook-based entitlement activation
- Full result retrieval after purchase
- Export via frontend using stable JSON

The backend remains intentionally lightweight while preserving the richer paid value model.
