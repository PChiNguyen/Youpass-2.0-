# ROADMAP.md — YouPass 2.0 Incremental Milestones

Focused on completing and hardening the core IELTS MVP loop before adding advanced features.

---

## Milestone 1: Core Reading & Auth MVP *(Current — Mostly Complete)*
- [x] Backend models, repos, services, and REST APIs (`auth`, `tests`, `submissions`)
- [x] Seed script (`backend/seed_tests.py`) with Reading & Listening sample tests
- [x] Clean frontend foundation (`types/`, `store/`, `lib/api/client.ts`, `Navbar.tsx`)
- [x] Email & Google Login (`features/auth/` + `/login`)
- [x] Live Reading catalog with search, passage filters, and completed band badges (`features/skills/` + `/skills/reading/*`)
- [x] Interactive split-pane Reading practice room + 4 question renderers + auto-graded submission review (`features/practice/` + `/practice/reading/[id]`)
- [ ] **TODO:** Build `/register` (`features/auth/components/RegisterForm.tsx` + `app/register/page.tsx`) wired to `POST /api/auth/register`
- [ ] **TODO:** Restore Dashboard cleanly (`features/dashboard/` + `app/dashboard/page.tsx`) for target band goals, exam countdown, and submission history

---

## Milestone 2: MVP Hardening & Band Accuracy
- [ ] **TODO:** Add proportional scoring or test-length awareness in `backend/services/grading_service.py` for single-passage drills (`< 40` questions)
- [ ] **TODO:** Hide `correct_answer` from `GET /api/tests/{test_id}` response and return per-question review data from `POST /api/submissions/` / `GET /api/submissions/{submission_id}`
- [ ] **TODO:** Add optional `category` query filter to `GET /api/tests/` in `backend/api/test_api.py`
- [ ] **TODO:** Add shared UI primitives (`frontend/components/ui/LoadingCard.tsx`, `ErrorCard.tsx`) to remove repeated loading/error markup

---

## Milestone 3: Expand to Listening Skill
- [ ] **TODO:** Generalize `ReadingCatalog.tsx` into `features/skills/components/SkillCatalog.tsx` supporting both Reading and Listening
- [ ] **TODO:** Add `/skills/listening` (+ `section1`–`section4`) routes
- [ ] **TODO:** Build `AudioPlayerPane.tsx` and `/practice/listening/[id]/page.tsx` reusing `QuestionItem`, `PracticeHeader`, `PracticeFooter`, and `SubmissionResultView`

---

## Milestone 4: Writing & Speaking (Async AI Grading)
- [ ] **TODO:** Clean up `backend/workers/tasks.py` and wire Celery + Gemini (`AIService`) for Writing Task 1/2 & Speaking rubric scoring
- [ ] **TODO:** Build Writing workspace (`PromptPane` + word-counting `EssayEditorPane` + AI feedback view)
- [ ] **TODO:** Build Speaking workspace (cue card + browser `MediaRecorder` audio capture)
- [ ] **TODO:** Implement Reading tools sidebar (text Highlight `H` and Vocabulary lookup `T`)