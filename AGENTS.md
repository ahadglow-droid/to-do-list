This file is read by automated agents (code analyzers, AI coding assistants) operating on this repository. It points them at the human-authored references they should consult before producing output.

# Development Process Guide
## Humans Steer, Agents Execute

Operate with harness-engineering principles:
- Humans provide intent: scope, constraints, priorities, acceptance criteria.
- Agents execute end-to-end: plan, implement, test, and document outcomes.
- Keep repository artifacts (`plans/`, `docs/`) as the permanent system of record.

---

## 1. Action Boundaries & Permissions
- **Autonomous (Always Do)**:
  - Create and update files within the defined scope.
  - Run linters, type checks, and automated tests.
  - Self-correct syntax, build, and test errors.
- **Ask Human First (Pause & Prompt)**:
  - Adding new external packages or dependencies.
  - Deleting existing files, tables, or database fields.
  - Changes that expand beyond the approved scope in `plans/active/`.
- **Hard Stops (Never Do)**:
  - Never commit or hardcode credentials, API keys, or secrets.
  - Never disable test suites, skip git hooks (`--no-verify`), or add broad ignore rules.

---

## 2. Plan Lifecycle Discipline
Keep plans in `plans/{pending,active,completed}`:
- `plans/pending/`: Approved specifications waiting to be worked on.
- `plans/active/`: Currently in-progress with live milestone status.
- `plans/completed/`: Validated deliverables with test pass logs and handoff notes.

### Mandatory Plan Structure
Every plan file must include these 10 sections in order:
1. **Objective**
2. **Implementation Goal**
3. **Scope** (In-scope vs. Out-of-scope)
4. **Architecture Diagram**
5. **Data Access Pattern**
6. **API Design** (endpoints, request/response contracts)
7. **Entity Design** (schemas, models, types)
8. **Key Design Decisions** (trade-offs and rationale)
9. **Test Coverage Plan** (unit, integration, edge cases)
10. **Verification Checklist** (exact test commands and pass criteria)

---

## 3. Required Agent Loop For Fixes & Features
1. **Plan First**: Confirm or create the plan in `plans/pending/` before touching code.
2. **Claim**: Move plan from `pending/` to `plans/active/` before editing files.
3. **Execute & Verify**:
   - Implement changes in small, reviewable increments.
   - Run verification commands: validate build, lint, and automated tests.
   - Self-heal any failures before reporting completion.
4. **Document & Close**:
   - Record test pass logs, risks, and follow-ups in the plan.
   - Move plan from `active/` to `plans/completed/`.

---

## 4. Verification Sensors (Feedback Loops)
Always execute these verification checks to prove correctness:
- **Build / Run**: Verify zero console errors and clean execution.
- **Lint & Format**: Run project linter without warnings.
- **Test Suite**: Run all automated tests with 100% pass rate.

---

## 5. Guardrails
- Prefer small, reviewable increments over giant monolithic changes.
- Encode recurring feedback into `AGENTS.md` or `.agents/rules/` instead of repeating manual instructions.
- If requirements are ambiguous, ask clarifying questions before writing code.
