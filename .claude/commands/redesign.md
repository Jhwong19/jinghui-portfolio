---
description: Kick off (or continue) the monopo-inspired portfolio redesign. Dispatches the redesign-orchestrator agent which reads prd.md, picks the next unfinished feature, and runs the implement → review → ship loop. Safe to run in any new session — orchestrator resumes from prd.md state.
---

You are starting (or continuing) the redesign loop.

1. Read `prd.md` at the repo root. If it does not exist, stop and tell the user the PRD is missing.
2. Run `git branch --show-current` to know where we are.
3. Dispatch the `redesign-orchestrator` agent with this brief:
   - "Continue the portfolio redesign. Read `prd.md`, identify the next unfinished feature, and run the loop. Use parallel Agent dispatch where allowed by the Parallelism section of your prompt."
4. Surface the orchestrator's status output to the user verbatim.
5. Do not edit any files yourself — orchestration only.

If the user passed an argument (e.g. `/redesign sprint 3`), pass it to the orchestrator as a constraint on what to start next.
