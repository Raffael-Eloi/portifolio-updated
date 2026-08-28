# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Rules

Always read and follow `.claude/rules/behavior.md` before responding to any request.

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

This is a **Next.js 16 static-export portfolio** (React 19, TypeScript 5). `next.config.ts` sets `output: "export"` and `reactCompiler: true` (via `babel-plugin-react-compiler`), so `npm run build` produces a static `out/` directory that CI deploys directly to Azure Static Web Apps.

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

Terraform is split into two independent roots under `infrastructure/`:

- **Main module** (`infrastructure/*.tf`): provisions the app's resource group and an `azurerm_static_web_app` (`main.tf`), using the `azurerm` provider `~> 5.2.0` with a remote `azurerm` backend (`providers.tf`). Per-environment config lives in `infrastructure/env/` — `development.tfvars`/`production.tfvars` set `environment_name`, and the matching `azurerm-config-*.tfbackend` files point at that environment's state storage account/container. `outputs.tf` exposes the static web app's deploy `api_key` (marked `sensitive`).
- **Bootstrap module** (`infrastructure/bootstrap/`): a separate Terraform root, pinned to `azurerm = 4.1.0`, that provisions the remote-state backend itself — a locked resource group (`RaffaLabRG`) and a locked storage account/container for `.tfstate`. Run before the main module can `init` against remote state; changes here are rare.

See `docs/infrastructure-review-*.md` for DevOps analysis and recommended improvements (these are point-in-time snapshots — verify findings against current `.tf` files before acting on them).

## Testing

Tests live in `src/__tests__/`. The Jest environment is `jsdom`. `portfolioService` is mocked in tests — mock it at module level:

```ts
jest.mock('@/services/portfolioService');
```

## CI/CD

`.github/workflows/ci-cd-pipeline.yml` runs on push to `main` (Node 24) as four sequential jobs: **build** (`npm ci && npm run build`, uploads `out/`) → **tests** (`npm run test`) → **terraform_plan** (Azure OIDC login, `terraform fmt -check`/`validate`/`plan` against the main module using `env/development.tfvars`, uploads the plan) → **terraform_apply** (gated on the `production` GitHub environment; applies the uploaded plan, reads `web_app_api_key` from Terraform output, then deploys `out/` to Azure Static Web Apps via `Azure/static-web-apps-deploy`).

`.github/workflows/bootstrap.yml` is a manual (`workflow_dispatch`-only) plan/apply pipeline for the `infrastructure/bootstrap/` module — used to stand up or change the remote-state backend itself.

A `Dockerfile` (Node 25 Alpine → Nginx Alpine multi-stage) exists in the repo but is not used by either workflow.
