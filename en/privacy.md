---
layout: page
title: Privacy Notice
permalink: /en/privacy.html
hideHomeActive: true
lang: en-US
lang_equivalent: /privacy.html
comments: false
summary: How tw93.fun handles visitor data through Vercel, Google Analytics 4, and giscus; the site has no accounts, forms, or first-party profiling.
---

## Privacy

tw93.fun is a static personal blog. There is no account system, no login, no form, and no commercial data collection. This page explains what data passes through the site, who handles it, and how you can turn it off.

## What this site does not collect

The site has no server-side logic of its own; every page and endpoint is a static file. You are never asked to register. I set no first-party tracking cookies, build no user profiles, and sell or share nothing with advertisers. The email address, GitHub, and Twitter links in the footer are my own contact details, not data collection points.

## Third-party services in use

- **Vercel**: hosting and CDN. Like any web server, Vercel records standard access log information such as IP address, User-Agent, and request path, used for delivery and abuse prevention.
- **Google Analytics 4** (measurement ID `G-KS7EDB6BRM`): page view and rough traffic source statistics. It sets cookies. If you use your browser's Do Not Track setting, a blocker extension, or Google's official [opt-out add-on](https://tools.google.com/dlpage/gaoptout), your visit is not recorded.
- **giscus**: comments, backed by GitHub Discussions. Your GitHub account is only involved if you choose to sign in from the comment area. Comments are stored publicly in this repository's Discussions and are governed by GitHub's privacy policy. If you never comment, nothing is linked to you.
- **CDN assets**: images and fonts are served from `cdn.tw93.fun`, `gw.alicdn.com`, and `gw.alipayobjects.com`. Those providers see the usual HTTP request information when the assets load.

## Machine-readable endpoints

A set of read-only endpoints is published for AI crawlers and agents (`/llms.txt`, `/openapi.json`, `/api/*.json`, and others). They require no authentication, apply no quota, keep no record of who called them, and return no personal information. The full list is in [/openapi.json](/openapi.json); the crawl policy is in [robots.txt](/robots.txt).

## Your options

If you would rather not be counted, use a blocker or a private window; nothing on the site breaks. To remove a comment you posted, delete it directly in GitHub Discussions. For anything else related to privacy, email tw93@qq.com and I will handle it.

Updates to this page are made here directly, without separate notice.
