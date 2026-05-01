---
layout: post
title: "You Didn't Know GEO: AI Visibility Principles, Practices, and Trade-offs"
date: 2026-05-01 16:00:00
summary: Friends told me AI was recommending my projects unprompted. I hadn't done anything special, so I spent an hour structuring my content for AI readability. What I did, what works, and what to skip.
feature: https://gw.alipayobjects.com/zos/k/ka/ai.png
categories: Share
---

## One Hour to Make AI Find Your Content

A few friends pinged me recently saying my open source tools were showing up when they asked AI questions. I hadn't done anything deliberate, so I figured: why not spend an hour structuring things properly? After doing it, I fired off a quick tweet, but the notes were messy. People seemed genuinely interested, so I decided to write it up as a proper article for reference.

I hate gaming rankings or generating junk content. This article won't teach you shortcuts. It's about helping AI better understand the content you already have.

I looked into why it happened and found that AI search runs on entirely different logic. Traditional SEO is about fighting into the top 10, but 83% of AI Overview citations come from pages outside the top 10. AI rewards clear structure and reliable sourcing, not PageRank. My projects aren't big, but the READMEs and docs are well-written enough that AI picks them up where bigger sites have thin content. That's probably why friends were seeing Pake and MiaoYan in their AI results.

AI search is growing fast: 527% year-over-year in the first half of 2025, ChatGPT hit 900 million weekly active users by February 2026, and referral traffic converts at roughly 5x the rate of traditional search. But it still accounts for less than 1% of total referral traffic. This is a brand visibility strategy, not a traffic strategy. Worth an hour of setup, not a week, because your product is your real competitive advantage, not this.

<img src="https://gw.alipayobjects.com/zos/k/lq/6.png" width="900" alt="AI visibility roadmap: from robots.txt to main domain mirroring">

---

## Use robots.txt to Sort Out Crawler Types

Most people treat robots.txt as a switch: either block AI crawlers or allow them all. But AI crawlers come in several types, and they do different things.

**Training crawlers** (GPTBot, ClaudeBot, Meta-ExternalAgent, CCBot) take your content to train models. Blocking them keeps your content out of training data but doesn't affect current AI search results.

**Search and retrieval crawlers** (OAI-SearchBot, Claude-SearchBot, PerplexityBot) fetch content in real time to answer user queries. Block these and you vanish from AI search.

**User-triggered fetchers** (ChatGPT-User, Claude-User, Perplexity-User, Google-Agent) only fire when someone pastes your URL into a chat window. Block them and users asking "summarize this page" get nothing.

**Opt-out tokens** (Google-Extended, Applebot-Extended) aren't real crawlers. They're signals you declare in robots.txt to opt out of AI training.

**Undeclared crawlers** (Bytespider, xAI's Grok bot) don't identify themselves and don't necessarily follow the rules.

<img src="https://gw.alipayobjects.com/zos/k/kq/GjgBCz.png" width="900" alt="Five categories of AI crawlers: training, search and retrieval, user-triggered, opt-out tokens, and undeclared">

My approach: allow search/retrieval and user-triggered crawlers, block training and undeclared ones.

```
# Search & retrieval: allow
User-agent: OAI-SearchBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

# User-triggered: allow
User-agent: ChatGPT-User
Allow: /

User-agent: Claude-User
Allow: /

# Training: block
User-agent: GPTBot
Disallow: /

User-agent: CCBot
Disallow: /

# Opt-out tokens
User-agent: Google-Extended
Disallow: /

# Undeclared: block
User-agent: Bytespider
Disallow: /
```


## Write Your llms.txt and Cross-Link Your Sites

llms.txt is a new standard, similar to robots.txt but designed for AI consumption. You place a Markdown file at your site root describing what your site does, its key pages, and who's behind it. AI systems prioritize this file when they crawl your content.

BuiltWith tracks over 840,000 websites that have deployed llms.txt, including Anthropic, Cloudflare, Stripe, and Vercel. But in SE Ranking's survey of 300,000 domains, adoption is only 10%. It's still early, and being early is an advantage.

The format is simple:

```markdown
# Your Project Name

> One-line description of what this is.

## Links

- [Documentation](https://yoursite.com/docs)
- [GitHub](https://github.com/you/project)
- [Blog](https://yoursite.com/blog)

## About

Short paragraph explaining the project, its purpose, 
key features, and what makes it different.
```

<img src="https://gw.alipayobjects.com/zos/k/3f/4WQmuF.png" width="900" alt="Example llms.txt file with project overview, links, and content sections">

After creating yours, submit it to directory.llmstxt.cloud, llmstxt.site, and the llms-txt-hub repository on GitHub via PR.

I also did something interesting: I made each site's llms.txt reference the others. I maintain tw93.fun, weekly.tw93.fun, and yobi.tw93.fun. Each site's llms.txt links to the rest, forming a mesh. An AI crawler entering through any one site can follow the links and discover everything else.

<img src="https://gw.alipayobjects.com/zos/k/x4/Rt8NoI.png" width="900" alt="Four websites cross-linking their llms.txt files, forming a discovery mesh for AI crawlers">

These changes take effect after crawlers revisit your site, usually within a few days. After that, try searching for your project name in ChatGPT. The citation sources and description accuracy should improve.

![](https://gw.alipayobjects.com/zos/k/ci/3bugwW.png)

## Provide Full Content and Markdown Routes

llms.txt is the summary. llms-full.txt is the complete version, typically 30-60KB, containing project descriptions, FAQs, usage scenarios, competitive comparisons, and README excerpts. Mintlify's CDN analysis shows llms-full.txt gets 3-4x more traffic than llms.txt. AI systems that find the summary want the full version.

**Markdown routes** go further. Evil Martians recommend providing a `.md` version of every page on your site. A 15,000-token HTML page becomes a 3,000-token Markdown document, 80% less noise.

<img src="https://gw.alipayobjects.com/zos/k/st/AFayJg.png" width="900" alt="HTML page at 15,000 tokens versus Markdown at 3,000 tokens, 80% reduction in noise">

The simplest way to tell AI you have a Markdown version is adding this to your page's `<head>`:

```html
<link rel="alternate" type="text/markdown" href="/page.md" />
```

Claude Code and Cursor already send `Accept: text/markdown` headers when fetching docs. This is standard HTTP/1.1 content negotiation, around since 1997.

---

## Register Your Site with Search Platforms

The robots.txt and llms.txt work from the previous sections makes your content readable to AI, but AI has to find you first. ChatGPT's search runs on Bing, Google AI Overview uses Google's own index, and Perplexity also relies on search APIs. If your pages aren't indexed by search engines, none of the structuring work above matters. So the first step is making sure Google and Bing have indexed your site.

The setup is straightforward: go to [Google Search Console](https://search.google.com/search-console), verify your domain via DNS or HTML file upload, then submit your sitemap URL (usually `yoursite.com/sitemap.xml`). Check the "Pages" indexing report to see which pages are indexed and which have issues. If an important page isn't indexed, use the URL Inspection tool to manually request indexing.

You might think Bing doesn't matter, but Copilot, DuckDuckGo, and Yahoo all run on Bing's index underneath. Register with Bing Webmaster Tools, submit your sitemap, and check the AI Performance panel to see how often AI cites your content. While you're there, set up IndexNow so Bing gets notified immediately when you publish new content instead of waiting for a crawler to find it.

Setting up IndexNow means placing an API key file at your site root, then sending a POST request to `api.indexnow.org/indexnow` with the list of changed URLs whenever you publish. Bing picks them up within minutes. Many static site generators and CMS platforms have IndexNow plugins available.

<img src="https://gw.alipayobjects.com/zos/k/x3/7.png" width="900" alt="Bing Index powering Copilot, DuckDuckGo, Yahoo, and ChatGPT, with IndexNow for instant updates">

Google Search Console doesn't have an AI-specific panel yet, but submitting your sitemap and monitoring indexing status is still worth doing. Google's AI Overviews pull from a wider range than traditional results, so even pages that don't rank in the top 10 can appear in AI-generated answers.

Perplexity has more users than you'd expect. They run a publisher program at pplx.ai/publisher-program. Once approved, you get an 80/20 revenue share and access to citation analytics data.

---

## I Built a Dedicated Knowledge Site for AI

Instead of waiting for AI to scrape information from scattered sources, give it a single entry point with everything organized.

A knowledge site should provide three layers: an overview (llms.txt), a full version (llms-full.txt, 30-60KB), and standalone knowledge pages for each core project. Add structured JSON APIs so AI tools can fetch data programmatically. Pull data live from upstream sources like the GitHub API with caching that refreshes periodically, keeping maintenance cost near zero.

One thing that's easy to miss: give AI a narrative structure, not just a list of projects. If you have multiple projects, write a description that connects them, how they relate, your technical direction, the overall picture. When AI answers "who is this person" or "what does this team do," a coherent narrative works much better than a flat list.

My implementation is called Yobi (from the Japanese 呼び / よび, meaning "to call" or "to summon"). It serves an llms.txt overview, a 50KB llms-full.txt, per-project pages, and four JSON endpoints (`/api/profile`, `/api/projects`, `/api/blog`, `/api/weekly`) that pull live data from the GitHub API with ISR caching that refreshes hourly. Stack: Next.js + TypeScript on Vercel.

<img src="https://gw.alipayobjects.com/zos/k/e9/ndHtSI.png" width="900" alt="Yobi knowledge endpoint homepage showing project catalog and API endpoints">

The JSON API returns structured project data with live GitHub stats:

<img src="https://gw.alipayobjects.com/zos/k/an/2RQyzN.png" width="900" alt="JSON API response from yobi.tw93.fun showing structured project data with live GitHub stats">

## Give Each Project Its Own Page

Each project needs its own standalone page, not a row in a list, but a self-contained Markdown document with a citable summary, core features, competitive comparisons, use cases, and install commands. Ahrefs found that cited pages have titles with higher semantic similarity to user queries, and natural-language URL slugs (like /projects/pake) get cited more than opaque IDs (like /page?id=47).

<img src="https://gw.alipayobjects.com/zos/k/dj/EqrRKi.png" width="900" alt="Per-project knowledge page for Pake with citable summary, features, alternatives comparison, and install command">

URL structure matters. `/projects/pake` tells the model what the page is about before it reads a single line. `/page?id=47` tells it nothing.

## Sync Structured Data to Your Main Domain

Subdomains carry less authority than root domains. AI crawlers that discover example.com won't automatically find docs.example.com or api.example.com. If your llms.txt, project pages, and API data are spread across subdomains, AI may only see part of the picture.

The fix is to mirror key structured data onto your main domain so that `example.com/llms.txt`, `example.com/projects/xxx.md`, and `example.com/api/projects.json` all live under one roof. AI crawlers discover your main site through search indexing and find everything without leaving. Implementation options include scheduled CI sync, build-time fetching, or reverse proxying. I use a GitHub Action that syncs subdomain data to the blog repo nightly.

<img src="https://gw.alipayobjects.com/zos/k/ds/5.png" width="900" alt="GitHub Action syncing data daily from Yobi subdomain to tw93.fun main domain">

When launching a new site, use a checklist to avoid gaps. Core items: robots.txt (categorized crawler permissions), llms.txt (site summary with cross-references), sitemap (submitted to search engines), Bing Webmaster Tools (enable IndexNow), Google Search Console (monitor indexing). Each site's llms.txt should reference the others, forming a discovery mesh.

---

The easiest trap when doing this work is getting carried away with every GEO technique you come across and trying to add them all, creating a mess and losing sight of what matters.

## These Didn't Work

**`<meta name="ai-content-url">` and `<meta name="llms">`**: no spec, no adoption by any major AI system.

**`/.well-known/ai.txt`**: multiple competing proposals, no real adoption. Wait for a winner.

**HTML comments with AI hints**: parsers strip comments before AI sees the content.

**User-Agent sniffing to serve Markdown**: returning different content to bots versus humans is cloaking. Google will penalize you.

**Unofficial AI meta tags**: unless a major AI provider explicitly documents support, it's just noise.

## JSON-LD Isn't as Useful as You'd Think

I initially thought JSON-LD would be powerful for AI visibility. Deeper research showed a more complicated picture. SearchVIU ran an experiment where they put data only in JSON-LD without showing it on the page. All five AI systems they tested failed to find it. Mark Williams-Cook's follow-up experiment showed that LLMs treat `<script type="application/ld+json">` as plain text, reading whatever words are inside without understanding the structured semantics.

The one confirmed exception is Bing/Copilot, which uses JSON-LD to enrich its search index. Keep existing JSON-LD (it helps Bing/Copilot and traditional rich results), but don't add it expecting ChatGPT or Claude to cite you more.

## What the Research Data Says

The GEO paper from Princeton and IIT Delhi, published at KDD 2024, found that adding **authoritative citations** improves AI visibility by 115%, **relevant statistics** by 33%, and **direct quotations** from credible sources by 43%.

<img src="https://gw.alipayobjects.com/zos/k/g5/8.png" width="900" alt="GEO research: authoritative citations +115%, direct quotations +43%, relevant statistics +33%">

My friend [@yaojingang](https://github.com/yaojingang) has been doing serious research on GEO. His [geo-citation-lab](https://github.com/yaojingang/geo-citation-lab) ran 602 prompts across three platforms and scraped tens of thousands of pages for feature analysis. His [full report](https://github.com/yaojingang/geo-citation-lab/blob/main/04-repet/final_report.md) is worth reading. Here are the patterns most useful for content creators.

**Specificity.** Pages with real data, clear definitions, and side-by-side comparisons see over 50% higher impact than vague, general pages. Step-by-step structure also helps noticeably. Pure FAQ format actually hurts. Those GEO tools that tell you "add FAQ to boost your score" are giving advice the data contradicts, which also validates my decision to drop FAQ sections from my own pages.

**Content depth.** AI doesn't favor short summaries. It favors long content it can slice into reusable segments. High-impact pages average nearly 2,000 words with 10+ headings. Low-impact pages average just 170 words, over a 10x gap. The sweet spot is 1,000 to 3,000 words.

**Relevance.** All mechanical SEO metrics (heading hierarchy, meta descriptions, keyword density) predict less than one single variable: whether your page content actually answers the question the user asked.

**Platform differences.** ChatGPT cites fewer sources but uses each deeply; its per-citation impact is over 5x that of Google. Perplexity casts a wider net, citing more than twice as many sources. To get cited by ChatGPT, go deep on individual pages. To get cited by Perplexity, go wide.

**Content type.** Official websites, news, and industry verticals account for roughly 80% of citation sources. But encyclopedia-style and explainer pages have 3x the impact of news pages. English content accounts for over 83% of global citation samples, so projects targeting an international audience need English versions.

## Retrieved Doesn't Mean Cited

Of all the pages ChatGPT retrieves during a session, only 15% end up in the final answer. The other 85% are never cited. Getting into the retrieval pool is just the first hurdle. The model still has to decide which pages are worth citing.

Ahrefs found that cited pages have titles with noticeably higher semantic similarity to user queries, and pages with descriptive natural-language URL slugs get cited more than those with opaque IDs. This is why llms.txt and Markdown routes help: they give the model a clean, unambiguous signal about what your page covers.

Brands get cited 6.5x more often through third-party sources than through their own domains. Someone praising your project on Reddit or Hacker News carries more weight than your own marketing copy. That's exactly why having a well-structured llms.txt matters: it gives the model a citable anchor to point to, even when the conversation that triggered the query happened somewhere else.

There are AI SEO audit tools that score your site and tell you to add FAQ sections, trust pages, or more text. Don't let scores drive your decisions. The test is simple: does every paragraph you add contain information that isn't already on the page? If not, don't add it. I once added a FAQ to Yobi that just restated what the About section already said, purely to push the score up. That's padding. I removed it.

---

Everything here is about helping AI understand what you have accurately, giving it a clean working environment. That lasts longer than any shortcut.

The basic configuration takes about an hour. The knowledge endpoint and per-project pages take longer, but once the data structure is in place, maintenance is easy. The daily sync runs on its own.

Give it a few days for crawlers to pick up the changes, then try searching for your name or project in ChatGPT, Perplexity, or Claude. The citations should be more accurate.

<img src="https://gw.alipayobjects.com/zos/k/b4/Ejryss.png" width="900" alt="ChatGPT accurately describing an open source project with correct version, features, and latest release">

AI citation attribution is still unreliable. CJR and Tow Center tested 200 AI-generated citations and found 153 with partial or complete errors. Do the structural work because it makes your content easier to access accurately, but don't treat an AI citation as proof that users saw your exact words. The mechanism is still improving.

If you have your own products, blog, or website, give it a try. You can also hand this article to Claude Code and let it handle most of the setup.

---

## Further Reading

1. [GEO: Generative Engine Optimization - Princeton & IIT Delhi, KDD 2024](https://arxiv.org/abs/2311.09735)
2. [Overseas GEO Research - geo-citation-lab](https://github.com/yaojingang/geo-citation-lab)
3. [llms.txt standard specification](https://llmstxt.org/)
4. [Why ChatGPT Cites One Page Over Another - Ahrefs](https://ahrefs.com/blog/why-chatgpt-cites-pages/)
5. [GEO Benchmark Study 2026 - ConvertMate](https://www.convertmate.io/research/geo-benchmark-2026)
6. [Optimizing Content for AI Discovery - Evil Martians](https://evilmartians.com/chronicles/optimizing-content-for-ai-discovery)
7. [How LLMs Actually Use Schema Markup - SearchVIU](https://searchviu.com/en/how-llms-actually-use-schema-markup/)
8. [AI Search Has a Citation Problem - CJR / Tow Center](https://www.cjr.org/tow_center/we-compared-eight-ai-search-engines-theyre-all-bad-at-citing-news.php)
9. [LLMs.txt: Why Brands Rely On It and Why It Doesn't Work - SE Ranking](https://seranking.com/blog/llms-txt/)
10. [How Often Do LLMs Visit llms.txt? - Mintlify](https://www.mintlify.com/blog/how-often-do-llms-visit-llms-txt)
11. [IndexNow Protocol Documentation](https://www.indexnow.org/documentation)
