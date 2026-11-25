# AI_RULES.md — Engineering & Scope Rules for YouPass 2.0

Any AI assistant working in this repo must follow these rules strictly.

---

## 1. Execution & Scope Limits (Anti-Overwork Rules)
1. **One Micro-Task Per Turn:** Implement only the exact single feature, endpoint, bugfix, or component requested. Do NOT proactively refactor, "improve", or touch unrelated files.
2. **File Touch Limit:** Create or modify at most **1–3 directly relevant files** per response unless a larger batch was explicitly approved in a prior plan.
3. **Plan First for Bigger Changes:** If a task requires editing **more than 2 files** or changing a database schema, Pydantic model, or TypeScript API contract, output a brief bulleted plan first and wait for confirmation before writing code.
4. **No Unrequested Additions:** Do NOT add new npm/pip packages, speculative helper abstractions, extra folders, or placeholder mock data unless explicitly asked.
5. **Concise Output & Targeted Edits:**
   - For **new files**, provide the complete file with its exact path.
   - For **existing files**, show only the changed function/section with its exact file path and enough surrounding lines to locate it unambiguously (do not reprint massive unchanged files unless asked).
6. **Context Hygiene:** Finish the requested task, give **1–2 concrete verification steps**, and stop. Do not dump a long list of unrequested next features.

---

## 2. Grounding & Anti-Hallucination
1. **Verify Before Referencing:** Only reference files, models, hooks, stores, and endpoints that exist in `ARCHITECTURE.md` or the latest `repomix` snapshot. Label anything unbuilt explicitly as `TODO`.
2. **Use the Existing Stack Only:**
   - Backend: Python 3.12, FastAPI, SQLAlchemy 2.0, Pydantic v2, Alembic, PostgreSQL/SQLite, `python-jose`, `passlib[bcrypt]`.
   - Frontend: Next.js 16 (App Router), React 19, TypeScript (`strict: true`), Tailwind CSS v4, Zustand v5, Lucide React, native `fetch` via `frontend/lib/api/client.ts`.
3. **Strict Types & Clean English:** Never use `any` or `as any` in TypeScript. Keep all UI labels, placeholders, and error messages in natural English.

---

## 3. Architecture Boundaries
- **Backend (`backend/`):** `api/` (HTTP + auth deps only) → `services/` (business logic + domain exceptions) → `repo/` (SQLAlchemy queries). Keep `Test.content["questions"]` as a flat list with `id` and `correct_answer` so `GradingService.calculate_raw_score()` stays compatible.
- **Frontend (`frontend/`):**
  - `app/` — Thin routes and layouts only (`page.tsx`, `layout.tsx`). No `fetch()` or business state here.
  - `features/<domain>/` — Colocated `api.ts` (pure `apiFetch` calls, zero React), `hooks/` (state/effects), and `components/` (focused UI).
  - `lib/`, `store/`, `types/`, `components/` — Shared client (`apiFetch`), formatters, Zustand store (`useAuthStore.ts`), shared domain types, and app-wide UI (`Navbar.tsx`).
  - Always import using the `@/` alias (`frontend/*`) rather than deep relative paths (`../../../`).

---

## 4. Next.js 16 & Auth Guardrails
1. **`cacheComponents: true` (`frontend/next.config.ts`):** Never export `instant` inside `'use client'` files. Wrap components reading runtime URL data (`usePathname()`, dynamic `[id]` `params`) in `<Suspense>`, or await `params` inside a Server Component boundary and pass `id` as a plain prop.
2. **Auth & Secrets:** Protected backend routes require `Depends(get_current_user)`; frontend handles `401` via `ApiError` (`logout()`). Keep dev URL aligned with `ALLOWED_ORIGINS` in `backend/main.py` (`http://localhost:3000`). Never commit `.env` or `.env.local`.
3. **Known MVP Boundary:** `GET /api/tests/{test_id}` currently returns `correct_answer` inside `TestResponse` for client review (`TODO`: move to a review-only endpoint).

---

## 5. Mentorship Style
- The developer has strong Python/FastAPI experience and is learning frontend architecture. Briefly explain *why* a new React/Next.js pattern exists and how data flows (using backend analogies when helpful), without writing walls of theory.
## 6. Mistake-to-Rule Escalation Loop
Whenever an AI edit causes a repeated bug or drift, do NOT just fix it verbally:
1. **Catch:** Identify the exact failure mode (e.g., `usePathname()` breaking build, `any` cast, wrong endpoint payload).
2. **Automate first:** Add an ESLint rule (`frontend/eslint.config.mjs`), Ruff/Mypy rule (`backend/pyproject.toml`), or regression test (`backend/tests/` or `frontend/e2e/`).
3. **Document second:** Add a 1-line constraint in `AI_RULES.md` only if a static tool cannot enforce it.

## 7. Systems Thinking & Flow Trace
When implementing a feature, fixing a bug, or touching shared contracts:
1. **Trace the Full Chain First (Before Editing):** List every layer and file involved across the flow (e.g., `UI/Component -> Hook/Store -> API client -> FastAPI router -> Service -> Repo/DB/Seed` and corresponding tests). Never patch just one file without checking downstream/upstream effects.
2. **Check Contract & State Drift:** Verify that field names, types, enums, auth states (`token` / `401` / guest vs. logged-in), and user-facing copy/notes still match across backend schemas, frontend types, and UI components.
3. **Name Assumptions & Trade-offs Explicitly:** When touching temporary MVP shortcuts or edge cases (e.g., `< 40` question drill band logic, `correct_answer` exposure, or unbuilt routes), state the trade-off in 1 line and keep related UI/tests in sync.
4. **Verify Across Layers:** After editing, run the relevant static gates (`verify` / `typecheck` / `lint`) plus targeted unit/integration or flow tests—not just a single isolated check.