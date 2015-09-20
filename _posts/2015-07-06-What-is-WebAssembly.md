---
layout:     post
title:      What is WebAssembly?(译)
date:       2015-07-09 21:47:29
summary:    Google, Microsoft, Mozilla和其他一群人已经在偷偷地为 W3C WebAssembly这个新社区组织挥汗如雨地工作，而且这已经不是一件小的事情。如需更深理解，请看接下来这篇文章Why We Need WebAssembly:An Interview with Brendan Eich”.
categories: 我的翻译
---

Google, Microsoft, Mozilla和其他一群人已经在偷偷地为 [W3C WebAssembly](https://www.w3.org/community/webassembly/){:target="_blank"}这个新社区组织挥汗如雨地工作，而且这已经不是一件小的事情。如需更深理解，请看接下来这篇文章[Why We Need WebAssembly:An Interview with Brendan Eich”.](https://medium.com/javascript-scene/why-we-need-webassembly-an-interview-with-brendan-eich-7fb2a60b0723){:target="_blank"}.

### 什么是WebAssembly：

- **对JavaScript的一个改进**：在WebAssembly中可以性能至关重要的地方得到提升，可以像一个标准的JavaScript模块导入它。
- **一门新的语言**：WebAssemebly代码定义了一个通过二进制格式表示的AST(JavaScript同样如此)，你可以通过可读的文本格式对其进行编写和调试。
- **一个浏览器的改进**：浏览器可以运行二进制格式，也就是说可以编译成二进制集，比我们现在使用的JavaScript压缩更小。更小的负载意味着可以更快的传递，取决于编译的优化因素，WebAssembly包可能比JavaScript运行得更快!
- 一个编译的目标： 在整个web平台中一种方式为一个其他的语言获得一流的二进制支持。

### WebAssembly的出现对于JavaScript意味着什么？

在我回答这个问题之前，让我们把时间倒退倒退，在React之前、Angular之前、Backbone之前，jQuery之前

> Web是由各个分散的超文本文档电子公告板组成，还没有互联起来，第一个Web服务器在欧洲核子研究中心的NEXT项目中研究出来...

![NeXT-Computer-used-by-Tim-Berners-Lee-at-CERN](http://tw93.github.io/images/NeXT-Computer-used-by-Tim-Berners-Lee-at-CERN.jpeg)

1991那年，我的头发还不是褐色的时候，我正在设计我十万行代码的冒险游戏。对于这个我使用了一门罕见的语言，我很厌倦使用Basic和Pascal，我想使用C语言，但是我任然在存钱去为了买一本Borland软件公司的Turbo C++的盒装图书。我甚至也还没有Turbo编译程序。