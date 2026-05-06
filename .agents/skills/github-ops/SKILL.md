---
name: github-ops
description: Use this skill for tw93.github.io issue, PR, and publishing operations via gh CLI.
---

# tw93.github.io GitHub Operations

Use this skill when working with GitHub issues, pull requests, or publishing tasks for the blog.

## Golden Rule

Always inspect live GitHub state with `gh` before acting.

## Common Commands

```bash
gh issue view 123
gh issue list --state open
gh pr view 123
gh pr diff 123
gh run list --limit 10
gh run list --workflow=jekyll.yml --limit 10
gh run list --workflow=sync-ai-data.yml --limit 10
```

## Safety Rules

- Do not comment on issues or PRs without explicit maintainer approval.
- Do not delete or rewrite existing posts unless the task explicitly asks.
- Draft replies in the same language as the thread.
- Run `npm run build` before release or deployment-adjacent changes.
- For AI data sync work, inspect `.github/workflows/sync-ai-data.yml` and confirm required secrets before proposing a run.

## Output

Summarize the GitHub state, the proposed action, and any verification command that should run before publishing.
