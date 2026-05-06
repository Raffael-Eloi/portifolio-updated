# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start development server
npm run build        # Production build (static export to out/)
npm run lint         # ESLint
npm test             # Run Jest test suite
npm run test:watch   # Jest in watch mode
```

To run a single test file:
```bash
npx jest src/__tests__/Home.test.tsx
```

## Architecture

This is a **Next.js 16 static-export portfolio** (React 19, TypeScript 5). `next.config.ts` sets `output: "export"`, so `npm run build` produces a static `out/` directory served by Nginx via Docker.

### Data flow

All portfolio content lives in `src/data/portfolio.json`. The service layer (`src/services/portfolioService.ts`) exposes `getPortfolioData()`, which currently returns the static JSON directly but is intentionally abstracted as a future API integration point. Components never import the JSON directly — they go through the service.

### Component structure

```
src/components/
  common/       # Primitive UI: Button, Card, Tag, Typography, TimelineEntry, InfoItem
  layout/       # MainLayout (header + main + footer shell)
  pages/        # HomePage — orchestrates all portfolio sections
  portfolio/    # Section components: BasicInfoSection, ExperienceSection,
                #   EducationSection, ExtrasSection
```

Each component uses a co-located CSS Module (`.module.css`). The `@/*` path alias maps to `src/`.

### Models

TypeScript interfaces in `src/models/` define the shape of `portfolio.json`: `PortfolioData`, `BasicInfo`, `Experience`, `Education`, `Extra`, `Contact`. All exported from `src/models/index.ts`.

### Infrastructure

`infrastructure/terraform.tf` provisions an Azure Resource Group (`RaffaLabRG`, East US 2) using the `azurerm` provider pinned at `= 4.1.0`. State is currently local. See `docs/infrastructure-review-*.md` for DevOps analysis and recommended improvements.

## Testing

Tests live in `src/__tests__/`. The Jest environment is `jsdom`. `portfolioService` is mocked in tests — mock it at module level:

```ts
jest.mock('@/services/portfolioService');
```

## CI/CD

`.github/workflows/ci-cd-pipeline.yml` runs on push to `main`: installs dependencies, builds, then runs tests. The Docker image uses a multi-stage build (Node 25 Alpine → Nginx Alpine).
