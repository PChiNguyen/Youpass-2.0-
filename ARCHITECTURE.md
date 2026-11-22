# ARCHITECTURE.md — YouPass 2.0 System Architecture

**Status:** Active MVP (Authentication, Reading Catalog, Interactive Reading Practice, and Auto-Graded Submissions).  
*Note: Items marked `TODO` are planned or awaiting migration and do not yet exist in the active build.*

---

## 1. High-Level Overview

YouPass 2.0 is a monorepo with a decoupled REST backend and Next.js App Router frontend:
- **`backend/`** — Python / FastAPI REST API backed by PostgreSQL (SQLAlchemy + Alembic), JWT authentication, and automated IELTS Reading/Listening band grading.
- **`frontend/`** — Next.js 16 (App Router), TypeScript, Tailwind CSS v4, and Zustand for client auth persistence.

---

## 2. Backend Architecture (`backend/`)

### Directory Map (Verified)
```text
backend/
├── main.py                         # FastAPI app, CORS, router registration, / and /health
├── seed_tests.py                   # Idempotent script seeding mock Reading & Listening tests
├── create_user.py                  # Helper script to seed an initial test user
├── alembic/                        # Database schema migrations
├── core/
│   ├── config.py                   # Pydantic Settings (.env / .env.test)
│   ├── security.py                 # bcrypt password hashing + JWT create_access_token
│   ├── exceptions.py               # AppException, ResourceNotFoundError, ConflictError, DatabaseValidationError, ThirdPartyServiceError
│   ├── exception_handlers.py       # Maps domain exceptions to JSON responses (+ optional AI suggestion)
│   ├── redis.py                    # Redis client helper
│   ├── celery_app.py               # Celery worker config (broker/backend via REDIS_URL)
│   ├── rate_limiter.py             # Redis-backed RateLimiter dependency
│   ├── cache_decorator.py          # Reusable Redis cache/invalidation decorators
│   └── lock_decorator.py           # Redis distributed lock decorator
├── db/
│   ├── base.py                     # SQLAlchemy DeclarativeBase
│   ├── session.py                  # SQLAlchemy engine & Sessionlocal / get_db()
│   └── models/
│       ├── user.py                 # User (id, email, full_name, password, avatar_url, target_*, exam_date)
│       ├── test.py                 # Test (id, title, skill_type Enum, category, content JSON/JSONB)
│       └── submission.py           # Submission (id, user_id, test_id, user_answers JSONB, raw_score, achieved_band, submitted_at)
├── schemas/
│   ├── auth_schemas.py             # Token, TokenPayload, LoginRequest, GoogleLoginRequest
│   ├── user_schemas.py             # UserRegister, UserCreate, UserUpdate, UserResponse
│   ├── test_schemas.py             # TestCreate, TestUpdate, TestResponse
│   ├── submission_schemas.py       # SubmissionCreate, SubmissionUpdate, SubmissionResponse
│   └── ai_schemas.py               # AIExplanationSchema, PayloadDetail
├── repo/
│   ├── user_repo.py                # UserRepo
│   ├── test_repo.py                # TestRepo
│   └── submission_repo.py          # SubmissionRepo
├── services/
│   ├── user_service.py             # UserService (registration, Google upsert, profile updates)
│   ├── test_service.py             # TestService (CRUD + skill filtering)
│   ├── grading_service.py          # GradingService (raw score match + 40-question band scale)
│   ├── submission_service.py       # SubmissionService (auto-grades via GradingService + persists)
│   └── ai_service.py               # AIService (Gemini fallback wrapper for error diagnostics)
├── api/
│   ├── deps.py                     # OAuth2PasswordBearer + get_current_user
│   ├── auth.py                     # /api/auth/*
│   ├── test_api.py                 # /api/tests/*
│   └── submission_api.py           # /api/submissions/*
├── workers/
│   └── tasks.py                    # Legacy/broken Celery task referencing removed classroom/student models (TODO: clean up or replace)
└── tests/                          # Pytest suite (SQLite test DB via conftest.py & TESTING=1)
```

### Active API Endpoints
| Prefix | File | Endpoints | Auth |
| :--- | :--- | :--- | :--- |
| `/api/auth` | `backend/api/auth.py` | `POST /register`, `POST /login`, `POST /google-login`, `GET /me`, `PATCH /me` | `/me` requires Bearer JWT |
| `/api/tests` | `backend/api/test_api.py` | `GET /` (optional `skill_type`), `GET /{test_id}`, `POST /`, `PATCH /{test_id}`, `DELETE /{test_id}` | `POST`, `PATCH`, `DELETE` require Bearer JWT |
| `/api/submissions` | `backend/api/submission_api.py` | `POST /`, `GET /me`, `GET /{submission_id}`, `DELETE /{submission_id}` | All require Bearer JWT |
| `/` & `/health` | `backend/main.py` | `GET /`, `GET /health` | Public |

### `Test.content` JSON Contract
To work with both the frontend renderer and `GradingService.calculate_raw_score()`, Reading/Listening `Test.content` follows this shape:
- `meta`: `{ attempts_count, duration_minutes, cover_gradient, question_types[] }`
- `passage` *(Reading)*: `{ title, paragraphs[] }`
- `audio_url` / `transcript` *(Listening)*
- `question_groups`: `[{ id, title, type, instructions, question_ids[] }]`
- `questions`: flat array `[{ id, number, type, prompt, options?, correct_answer }]`

---

## 3. Frontend Architecture (`frontend/`)

### Directory Map (Current Rebuilt Structure)
```text
frontend/
├── next.config.ts                  # cacheComponents: true, partialPrefetching: true, allowedDevOrigins
├── tsconfig.json                   # Strict TS + "@/*": ["./*"] path alias
├── types/                          # Domain interfaces mirroring backend/schemas/
│   ├── test.ts                     # SkillType, QuestionType, TestItem, TestContent, QuestionGroup, TestQuestion
│   ├── user.ts                     # UserProfile, UserGoalsUpdate
│   └── submission.ts               # SubmissionItem, SubmissionCreatePayload
├── store/
│   └── useAuthStore.ts             # Zustand store persisted to localStorage ("youpass-auth-storage")
├── lib/
│   ├── api/client.ts               # API_BASE_URL, ApiError, apiFetch<T>()
│   └── utils/format.ts             # formatDuration(totalSeconds) -> "HH:MM:SS"
├── components/
│   └── Navbar.tsx                  # Persistent top nav (hidden on /practice/* routes)
├── features/
│   ├── auth/
│   │   ├── api.ts                  # loginWithEmail(), loginWithGoogle()
│   │   ├── hooks/useLoginAuth.ts   # Email/Google auth state & redirect
│   │   └── components/             # LoginBanner, LoginForm, SocialLogins, LoginView
│   ├── skills/
│   │   ├── api.ts                  # getTestsBySkill(), getMySubmissions()
│   │   ├── hooks/useSkillCatalog.ts# Fetches catalog + user completed bands + search/filter state
│   │   └── components/             # TestCard (links to /practice/<skill>/<id>), ReadingCatalog
│   └── practice/
│       ├── api.ts                  # getTestById(), submitTestAnswers()
│       ├── hooks/useReadingPractice.ts # Fetch test, timer, answers dict, Notes shortcut, submit/guest/retake
│       └── components/             # PracticeHeader, PracticeFooter, QuestionItem, ReadingPracticeView, SubmissionResultView
└── app/                            # Next.js App Router (thin routes & layouts)
    ├── globals.css
    ├── layout.tsx                  # Wraps <Navbar /> in <Suspense>
    ├── page.tsx                    # Landing homepage (/)
    ├── login/page.tsx              # Renders <LoginView />
    ├── skills/
    │   ├── layout.tsx              # Sidebar layout for /skills/*
    │   ├── page.tsx                # /skills hub
    │   └── reading/                # /skills/reading + passage1/passage2/passage3
    └── practice/
        └── reading/[id]/page.tsx   # Server Component awaiting params inside <Suspense> -> <ReadingPracticeView />
```

### Question Rendering Strategy (`QuestionItem.tsx`)
`QuestionItem.tsx` dispatches rendering by `question.type` while normalizing every user answer into a `string` inside `answers: Record<string, string>` (compatible with `GradingService`):
- `true_false_not_given`, `yes_no_not_given`, `multiple_choice` → Radio options (`multiple_choice` extracts option key e.g. `"B"` from `"B. ..."`).
- `multiple_choice_many` → Checkboxes serialized as sorted comma-separated keys (e.g. `"A,C"`).
- `gap_filling`, `sentence_completion`, `summary_completion` → Splits prompt on `_____` to render inline `<input>` blanks.
- `matching_information`, `matching_headings`, `matching_features` → `<select>` dropdown extracting option key.

---

## 4. Core End-to-End Data Flow (Reading MVP)

1. **Auth:** User submits credentials on `/login` → `useLoginAuth` calls `loginWithEmail` (`POST /api/auth/login`) → backend verifies bcrypt hash and returns JWT `access_token` → saved in `useAuthStore` (`localStorage`).
2. **Catalog:** User visits `/skills/reading` → `useSkillCatalog` calls `GET /api/tests/?skill_type=reading` (and `GET /api/submissions/me` if logged in) → `TestCard` renders each test with a `<Link href="/practice/reading/<id>">`.
3. **Practice:** User clicks a card → `app/practice/reading/[id]/page.tsx` resolves `id` inside `<Suspense>` → `useReadingPractice` fetches `GET /api/tests/{id}` → user answers questions in `answers` state (`Record<string, string>`).
4. **Submit & Grade:** User clicks **Finish** → `submitTestAnswers` sends `POST /api/submissions/` with `{ test_id, user_answers }` + Bearer token → `SubmissionService` grades via `GradingService` and stores the `Submission` row in Postgres → `SubmissionResultView` renders the raw score, band score, and question-by-question answer review.

---

## 5. Known Gaps & Explicit `TODO` Items
- **TODO — Dashboard Restoration:** `frontend/app/dashboard/` existed prior to the frontend reset; it needs to be rebuilt cleanly under `frontend/features/dashboard/` + `frontend/app/dashboard/page.tsx` (consuming `GET /api/auth/me`, `PATCH /api/auth/me`, and `GET /api/submissions/me`).
- **TODO — Registration Page:** `LoginView.tsx` links to `/register`, and `POST /api/auth/register` exists on the backend, but `frontend/app/register/page.tsx` is not yet built.
- **TODO — Listening / Writing / Speaking:** `backend/seed_tests.py` already includes 1 Listening test, and `types/test.ts` supports `audio_url`/`transcript`, but `frontend/app/skills/{listening,writing,speaking}/` and `frontend/app/practice/{listening,writing,speaking}/[id]/` are not yet implemented in the rebuilt frontend.
- **TODO — Security Hardening:** Strip `correct_answer` from public `GET /api/tests/{test_id}` responses and return answer keys only in a dedicated submission review endpoint.
- **TODO — Band Scale Calibration:** `GradingService.convert_raw_to_band()` assumes a 40-question test; single-passage drills (`< 40` questions) currently map to base Band `4.5`.
- **TODO — Legacy Celery Task:** `backend/workers/tasks.py` references removed models (`classroom`, `student`, `GradingRepo`) and is unused by `main.py`; replace when implementing async AI Writing/Speaking grading.