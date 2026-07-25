---
layout: page
title: Privacy
permalink: /privacy.html
hideHomeActive: true
lang_equivalent: /en/privacy.html
comments: false
---

## 隐私说明

tw93.fun 是一个纯静态的个人博客，没有账号系统，没有登录，没有表单，也不做任何商业化的数据收集。这里说明本站会经手哪些数据、经手方是谁，以及你可以怎么关掉它们。

## 本站不收集什么

本站没有自己的服务器端逻辑，所有页面和接口都是静态文件。我不要求你注册，不设置自有的追踪 Cookie，不做用户画像，也不会把访客数据卖给或分享给任何第三方做广告。文章下方的邮箱、GitHub、Twitter 都是我本人的联系方式，不是数据收集入口。

## 本站用到的第三方服务

- **Vercel**：站点托管与 CDN。和任何 Web 服务器一样，Vercel 会在访问日志里记录 IP 地址、User-Agent、请求路径等标准信息，用于分发和防滥用。
- **Google Analytics 4**（衡量 ID `G-KS7EDB6BRM`）：统计页面浏览量和大致来源。它会写入 Cookie。如果你使用浏览器的「Do Not Track」、拦截插件，或安装 Google 官方的 [GA 停用插件](https://tools.google.com/dlpage/gaoptout)，本站的统计就不会记录你。
- **giscus**：文章评论，基于 GitHub Discussions。只有当你主动点击评论区去登录 GitHub 时，才会涉及你的 GitHub 账号信息，评论内容公开保存在本仓库的 Discussions 里，受 GitHub 的隐私政策约束。不评论就不会产生任何关联。
- **CDN 静态资源**：图片、字体等托管在 `cdn.tw93.fun`、`gw.alicdn.com`、`gw.alipayobjects.com`，加载时这些服务商会看到常规的 HTTP 请求信息。

## 机器可读接口

本站对 AI 爬虫和 agent 开放了一批只读接口（`/llms.txt`、`/openapi.json`、`/api/*.json` 等）。这些接口不需要鉴权、不设配额、不做任何调用方记录，也不会返回任何私人信息。它们的完整清单见 [/openapi.json](/openapi.json)，抓取策略见 [robots.txt](/robots.txt)。

## 你的选择

不想被统计到，可以用拦截插件或隐私模式访问，站点功能不受影响。想删除已发布的评论，直接在 GitHub Discussions 里删即可。其他任何和隐私相关的问题，发邮件到 tw93@qq.com，我会处理。

本页面如有更新会直接改这里，不另行通知。
