# Waza

> Reusable Claude Code skill pack for engineering workflows.

Waza is an open source project by [Tw93](https://tw93.fun) with 4.2K GitHub stars. Waza is a collection of Claude Code skills (slash commands) that automate common engineering tasks: code review, debugging, design, writing, and more. Install once, use across all projects.

Latest release: v3.11.0 (2026-04-27)

## Key Features

- Modular skill system for Claude Code
- Skills for review, debug, design, writing, and research
- One-line install via npx

## Alternatives Comparison

Waza is often compared to: custom prompts, slash commands.

## When to Use

- add skills to Claude Code
- code review workflow for Claude Code
- Claude Code slash commands
- reusable AI coding prompts

## Install

```
npx skills add tw93/Waza -a claude-code -g -y
```

## FAQ

**What is a Claude Code skill?**

A skill is a reusable prompt template that Claude Code can execute as a slash command. Waza bundles multiple skills for common engineering workflows.

**What skills does Waza include?**

/check (code review), /hunt (debugging), /design (UI design), /write (prose editing), /learn (research), /think (planning), /health (config audit), /read (URL fetching), /kami (document typesetting). Each skill has a focused workflow with multiple phases.

**How do I install Waza?**

Run `npx skills add tw93/Waza -a claude-code -g -y`. This installs all skills globally for Claude Code. Skills appear as slash commands in your Claude Code session.

**Can I use individual Waza skills without installing all of them?**

The install command adds all skills at once. Each skill is independent and only activates when you invoke its slash command, so unused skills have zero overhead.

**Does Waza work with other AI coding tools besides Claude Code?**

Waza is built specifically for Claude Code's skill system. The prompt templates use Claude Code's tool access (file reading, editing, bash, web search). They are not directly portable to other tools.

## Links

- GitHub: https://github.com/tw93/Waza
- Author: [Tw93](https://tw93.fun)
- All projects: https://tw93.fun/api/projects.json
- Full knowledge base: https://tw93.fun/llms-full.txt
