# AI_WORKFLOW_BOOTSTRAP_PROMPT.md

A reusable, stack-agnostic bootstrap guide and master prompt for setting up a disciplined **AI-Assisted Engineering Inner Loop** on any brand-new project from day zero.

---

## 1. Required Context & Inputs Checklist (Fill This Before Pasting)

Before pasting the Master Prompt into a fresh AI chat or AI Studio session, gather and fill in these inputs so the AI grounds every file and command in your actual environment:

- [ ] **Project Name & 1-Sentence MVP Goal:** *(e.g., "TaskFlow — a team task tracker MVP with auth, task CRUD, and status filters")*
- [ ] **Tech Stack & Versions:**
  - Backend: *(e.g., Python 3.12 / FastAPI / SQLAlchemy / Postgres, or None)*
  - Frontend: *(e.g., Next.js App Router / TypeScript / Tailwind CSS, or None)*
  - Test Runner(s): *(e.g., `pytest`, `vitest`, `playwright`)*
- [ ] **OS & Shell Environment:** *(e.g., Windows PowerShell, Git Bash, macOS/Linux Bash, Docker, `make` available or not)*
- [ ] **Target Layer / Folder Conventions:** *(e.g., Backend: `api -> services -> repo`; Frontend: `app/ -> features/<domain>/{api,hooks,components} -> lib/store/types`)*
- [ ] **Project Status & Repo Context:**
  - Starting from an empty folder, a fresh framework template (`create-next-app` / starter), or an early prototype?
  - If files already exist, attach a fresh repo snapshot (e.g., `npx repomix` output or `tree` + `package.json` / `requirements.txt`).
- [ ] **Special Constraints / Experience Level:** *(e.g., "Strong backend background, learning frontend; explain new frontend patterns briefly using backend analogies; keep UI text in English.")*

---

## 2. Ready-to-Use Master Prompt (Copy & Paste From Scratch)

Fill in the `[BRACKETED]` section at the bottom of this block, then paste the entire block into a **new** AI session:

```text
Act as a Staff Developer Experience & AI Coding Workflow Architect.
We are bootstrapping a disciplined, lightweight "AI-Assisted Engineering Inner Loop" for a brand-new project from scratch.

### YOUR CORE METHODOLOGY (3 PILLARS)
1. Static Rules & Slop Hygiene First: Clean out misleading starter junk and lock architectural conventions into automated tools (linters, formatters, strict type-checking, import boundary rules) rather than relying on AI memory or prose alone.
2. Real-Output Verification Gate: Build one unified local verification command (plus CI if applicable) and minimal critical-flow integration/E2E tests. Never call a step "done" until real terminal outputs pass.
3. Mistake-to-Rule Escalation Loop: Every time a bug or AI mistake repeats, fix the root cause and encode a permanent lint rule, regression test, or 1-line rule so it cannot recur.

### STRICT EXECUTION GUARDRAILS
- **Incremental Setup Only:** Do NOT dump the entire setup or all config files in one giant turn. Propose the brief 5-step plan first, then execute **ONE step per turn** and wait for my verification output before advancing.
- **File Touch Limit:** Create or modify at most 1–3 directly relevant files per step (unless I explicitly approve a batch in a planning step).
- **No Over-Engineering:** Use built-in/standard ecosystem tools only. No speculative abstractions, no unused dependencies, no enterprise boilerplate.
- **No Slop or Hallucinations:** Only reference files, packages, and scripts verified in my inputs or created in an earlier confirmed step. Keep new files complete and existing-file edits targeted with exact file paths.
- **Verification Required:** End every step with exact terminal commands and clear Pass/Fail criteria tailored to my OS/shell.

### THE 5-STEP WORKFLOW BLUEPRINT TO INSTALL
Guide me through these exact steps, one step at a time:
- **Step 0 — Lean Guardrail Docs & Context Hygiene:**
  Create minimal `AI_RULES.md` (with scope limits: 1 micro-task/turn, 1–3 files max, plan first if >2 files or schema changes, targeted diffs, mistake-to-rule loop), `ARCHITECTURE.md` (initial layer map + explicit `TODO` section), `ROADMAP.md` (MVP-first milestones), and `.repomixignore` / `.gitignore` updates so stale specs, reports, and build artifacts never pollute AI context.
- **Step 1 — Slop & Starter Hygiene:**
  Inspect any starter template files and remove or fix dead code, broken/unused imports, placeholder `alert()`/`console.log` stubs, or conflicting default styles so AI never copies bad patterns.
- **Step 2 — Hard Static Gates:**
  Configure linter, formatter checks, strict type-checking (e.g., `ruff` + `mypy`/`pyright` on Python; `tsc --noEmit` + strict ESLint on TypeScript), and enforce key architectural rules in tool configs (e.g., banning `any`, banning `alert()`, enforcing path aliases or module boundaries).
- **Step 3 — Unified Verification Command & CI:**
  Create one single entry point (`Makefile` and/or `verify.ps1` / `verify.sh` matching my OS) that runs `static checks -> typecheck -> unit/integration tests -> build`, plus a fast dev-loop command (`lint + typecheck` only) and a minimal CI workflow if using GitHub.
- **Step 4 — Critical-Flow Smoke Tests & Escalation Habit:**
  Add 1–2 high-signal behavioral/integration tests covering the core user journey (e.g., health/auth -> core CRUD/action -> persistence check) and verify how we will log repeated mistakes into `AI_RULES.md` + lint/tests.

### MY PROJECT INPUTS
- Project Name & MVP Goal: [FILL IN]
- Tech Stack & Versions: [FILL IN]
- OS & Shell Environment: [FILL IN]
- Target Folder / Layer Conventions: [FILL IN]
- Current Repo State / Attached Context: [FILL IN — e.g., "Empty repo" or "Attached repomix-output.xml"]
- Learning / Explanation Preferences: [FILL IN — e.g., "Briefly explain unfamiliar frontend patterns before code"]

Start now by:
1. Confirming my environment and summarizing the tailored 5-step setup plan (no code yet, except if Step 0 is trivial and I asked to begin immediately).
2. Asking me to confirm **Step 0** before generating files.
```

---

## 3. Core Workflow Blueprint (Reference Checklist)

Use this checklist to verify your AI assistant actually installed every pillar properly:

### Step 0 — Foundation Docs & Context Hygiene
- [ ] `AI_RULES.md` exists at repo root and contains explicit scope caps (**1 micro-task**, **1–3 files**, **plan first for >2 files or contract changes**, **concise diffs**).
- [ ] `ARCHITECTURE.md` exists and separates **what is built** from **`TODO`** items.
- [ ] `ROADMAP.md` keeps milestones focused on the end-to-end MVP loop before polish/extras.
- [ ] `.repomixignore` (if using Repomix) excludes binary docs (`*.docx`, `*.pdf`), coverage/test reports, lockfiles/caches, and build artifacts (`.next/`, `dist/`, `coverage.xml`).

### Step 1 — Slop & Pattern Hygiene
- [ ] No unused starter files, stray notes, or dead modules importing non-existent schemas.
- [ ] No runtime `alert(...)`, dummy hardcoded arrays pretending to be DB data, or leftover template styles conflicting with app styling.
- [ ] Existing tests match current API request/response contracts (no stale payload tests).

### Step 2 — Hard Static Gates (Tools Enforce Rules, Not Prose)
- [ ] **Lint & Format:** Automated linter configured with import sorting and unused-import/variable errors.
- [ ] **Strict Type-Checking:** Dedicated `typecheck` command (`tsc --noEmit`, `mypy`, or `pyright`) runs independently of the build.
- [ ] **Architecture Rules in Lint:** Key rules from `AI_RULES.md` are enforced by the linter—for example:
  - Banning `any` / unsafe casts.
  - Banning `alert()` / debug prints in production paths.
  - Restricting deep cross-module relative imports (enforcing `@/` aliases or layer boundaries).

### Step 3 — Unified Verification Gate
- [ ] **Fast Loop** (~2–5s): Runs `lint + typecheck` during rapid edits.
- [ ] **Full Gate** (`verify` script / `Makefile` / `verify.ps1`): Runs `lint -> typecheck -> unit/integration tests -> production build` in one command before committing.
- [ ] **CI Mirror:** `.github/workflows/ci.yml` (or equivalent) runs the exact same gate as local `verify`.

### Step 4 — Real-Flow Verification & Mistake-to-Rule Loop
- [ ] At least **1 backend/API critical-flow test** tests the core journey end-to-end (e.g., auth -> create/fetch -> core action -> verify DB state).
- [ ] At least **1 UI/E2E smoke test** (when UI is ready) verifies the main user flow in a real headless browser.
- [ ] **Escalation Loop Active:** When an AI mistake occurs twice:
  1. Fix the root cause.
  2. Add a lint rule or regression test that catches it automatically.
  3. Add a 1-line rule to `AI_RULES.md` only if no static tool or test can enforce it.

---

## 4. Daily Operating Cadence (After Setup)

Once the 5-step bootstrap is complete, build every new feature using this repeatable micro-loop:

1. **Start Clean Chats Per Feature:** Run `npx repomix` (or refresh repo context) at clean commits and open a new AI chat for each distinct milestone so context stays sharp.
2. **Plan Small (>2 Files Rule):** Prompt with one micro-task. If it crosses `>2` files or changes a schema/API contract, require a short bulleted plan first.
3. **Implement Tightly:** Keep edits scoped to `1–3` files following `AI_RULES.md`.
4. **Run the Gate:**
   - During rapid iteration → run the **Fast Loop** (`lint` + `typecheck`).
   - Before finishing/committing → run the **Full Gate** (`verify` + critical-flow tests).
5. **Escalate Failures, Then Commit:** Never bypass a failing check to "move faster." Fix the root cause, tighten the rule/test if an AI pattern caused it, commit cleanly, and refresh your repo context.

### Quick Kickoff Prompt Template for Daily Tasks
```text
Read AI_RULES.md and ARCHITECTURE.md first.
Current micro-task: [Describe 1 small feature, endpoint, or bugfix].
If this changes >2 files or alters a schema/API contract, give me a brief bulleted plan first and wait for my approval. Otherwise, implement it cleanly and end with the exact verification command(s).
```