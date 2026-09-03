# Waza

> Engineering habits turned into eight skills AI coding agents can run.

Waza is an open source project by [Tw93](https://tw93.fun) with 6.9K GitHub stars. Waza is a pack of eight skills that give an AI coding agent a repeatable workflow for planning, UI work, review, debugging, prose, research, reading sources, and config audits. One install writes a canonical copy into the shared ~/.agents/skills store, so Claude Code, Codex, Cursor, Antigravity CLI, and other agents reading that directory pick it up.

License: MIT

Latest release: v3.35.0 (2026-09-02)

## Key Features

- Eight skills: /think, /ui, /check, /hunt, /write, /learn, /read, /health
- One canonical copy in ~/.agents/skills, shared across agents
- Native plugin for Claude Code and Codex, plus a Claude Desktop ZIP and a Pi npm package
- Each skill ships reference docs, helper scripts, and gotchas from real failures

## Alternatives Comparison

Waza is often compared to: custom prompts, slash commands.

## When to Use

- add skills to Claude Code
- add skills to Codex or Cursor
- code review workflow for an AI coding agent
- Claude Code slash commands
- reusable AI coding prompts

## Install

```
npx skills add tw93/Waza -a claude-code codex cursor antigravity-cli -g -y
```

## FAQ

**What is a Waza skill?**

A skill is a folder holding a playbook, reference docs, and helper scripts that an AI coding agent runs as one workflow. In Claude Code it is a slash command; in Codex and other agents you invoke the installed skill by name and it follows the same playbook.

**What skills does Waza include?**

Eight: /think (pressure-tests a design into a decision-complete plan), /ui (frontend interfaces with screenshot-driven iteration), /check (diff review, release and publish follow-through), /hunt (root-cause debugging), /write (natural Chinese and English prose), /learn (six-phase research), /read (URLs and PDFs), /health (audits Codex, Claude Code, Pi, and project instructions).

**How do I install Waza?**

Run `npx skills add tw93/Waza -a claude-code codex cursor antigravity-cli -g -y`. One canonical copy lands in ~/.agents/skills with Claude Code symlinked in, so every agent reading that directory picks it up. Update later with `npx skills update -g -y`.

**Can I use individual Waza skills without installing all of them?**

The install command adds all eight at once. Each skill is independent and only activates when you invoke it, so unused skills have zero overhead.

**Does Waza work with AI coding tools besides Claude Code?**

Yes. Waza installs into the shared ~/.agents/skills directory, so Codex, Cursor, Kimi Code CLI, Amp, Cline, and Antigravity CLI pick it up automatically. Claude Code and Codex also have native plugin marketplaces, Claude Desktop takes the released waza.zip, and Pi installs it with `pi install npm:@tw93/waza`.

## Links

- GitHub: https://github.com/tw93/Waza
- Canonical HTML: https://faberon.io/projects/waza
- Author: [Tw93](https://tw93.fun)
- All projects: https://tw93.fun/api/projects.json
- Full knowledge base: https://tw93.fun/llms-full.txt
