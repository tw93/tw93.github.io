---
layout: post
title: 深入浅出 Nodejs 读书笔记
date: 2015-03-01 08:47:29
summary: 今天终于把朴灵老师写的《深入浅出 Node.js》给学习完了, 这本书不是一本简单的 Node 入门书籍，它没有停留在 Node 介绍或者框架、库的使用层面上，而是从不同的视角来揭示 Node 自己内在的特点和结构。建议有一定 Node 基础或者做过 Node 方面的小项目的同学阅读，看完以后你的思维会有很奇特的碰撞，我看的时候就常常会有这样的想法:“哦，原来这个功能是这样实现的哦”。下面这篇文章是我第二次阅读《深入浅出 Node.js》的一些学习记录，并且通过百度脑图这个工具来画出思维导图，每天将自己的学习总结写在这篇文章下面 ...
categories: Study
---

今天终于把朴灵老师写的《深入浅出 Node.js》给学习完了, 这本书不是一本简单的 Node 入门书籍，它没有停留在 Node 介绍或者框架、库的使用层面上，而是从不同的视角来揭示 Node 自己内在的特点和结构。建议有一定 Node 基础或者做过 Node 方面的小项目的同学阅读，看完以后你的思维会有很奇特的碰撞，我看的时候就常常会有这样的想法:“哦，原来这个功能是这样实现的哦”。下面这篇文章是我第二次阅读《深入浅出 Node.js》的一些学习记录，并且通过[百度脑图](http://naotu.baidu.com/){:target="_blank"}这个工具来画出思维导图，每天将自己的学习总结写在这篇文章下面。

**图片文字太小可以右键从新标签页打开图片，然后点击就可以放大显示。**
**_新增原始文件脑图地址，这样大家就可以直接到脑图去看思维导图_**

### Node 简介

这一章简要介绍了 Node，从中可以了解 Node 的发展历程及其带来的影响和价值。

为什么叫 Node?起初，Ryan Dahl 称他的项目为 web.js，就是一个 Web 服务器，但是项目的发展超过了他当初单纯开发一个 Web 服务器的想法，变成构建网络应用的一个基本框架,这样可以在它的基础上构建更多的东西,诸如服务器、客户端、命令行工具等。Node 发展为一个强制不共享任何资源的单线程、单进程系统，包括十分适宜网络的库，为构建大型分布式应用程序提供了基础设施，其目标也是成为一个构建快速、可伸缩的网络应用平台。它自身非常简单，通过通信协议来组织很多 Node，非常容易通过扩展来达成构建大型网络应用的目的。**每一个 Node 进程都构成这个网络应用中的一个节点，这是它名字所含意义的真谛。** [脑图](http://naotu.baidu.com/viewshare.html?shareId=atyzcu65ssw8){:target="_blank"}

![Node简介]({{ site.assetUrl }}Node1.png){:class="img-zoom"}

### 模块机制

这一章主要介绍 Node 的模块机制，从中了解到 Node 如何实现 CommonJS 模块和包规范的。在这一章中，我们详细的解释了模块在引用过程中的编译、加载规则。另外，我们还能读到更深度的关于 Node 自身源代码的组织架构。  
CommonJS 规范为 JavaScript 定制了一个美好的愿景---希望 JavaScript 能够在任何地方运行。[脑图](http://naotu.baidu.com/viewshare.html?shareId=au9i3m5vx0gk){:target="_blank"}
![Node模块机制]({{ site.assetUrl }}Node2.png){:class="img-zoom"}

### 异步 I/O

这一章展示了 Node 中我们将异步 I/O 作为主要设计理念的原因。另外，还会介绍到异步 I/O 的详细实现过程。
事件循环是异步实现的核心，它与浏览器中的执行模型基本上保持一致。而向古老的[Rhino](https://developer.mozilla.org/zh-CN/docs/Mozilla/Projects/Rhino){:target="_blank"}，尽管是较早就能在服务器运行的 JavaScript 运行时但是执行模型并不像浏览器采用事件驱动，而是使用像其他语言一样采用同步 I/O 作为主要模型，这造成它在性能上面无法发挥。**Node 正是依靠构建了一套完善的高性能异步 I/O 框架，打破了 JavaScript 在服务器止步不前的局面。** [脑图](http://naotu.baidu.com/viewshare.html?shareId=au9i4efc4u0w){:target="_blank"}

![Node异步I/O]({{ site.assetUrl }}Node3.png){:class="img-zoom"}

### 异步编程

这一章主要介绍异步编程，其中最常见的异步编程问题介绍，也有详细的解决方案。在这一章中我们可以接触到 Promise、事件、高阶函数是如何进行流程控制的。 （这一章建议多看书）[脑图](http://naotu.baidu.com/viewshare.html?shareId=au9i54fq5q80){:target="_blank"}
![Node异步I/O]({{ site.assetUrl }}Node4.png){:class="img-zoom"}

### 内存控制

这一章主要介绍了 Node 的内存控制，主要内容有垃圾回收、内存限制、查看内存、内存泄漏、大内存应用等细节。
Node 将 JavaScript 的主要应用场景帮到了服务器端，相应要考虑的细节也与浏览器端不同，在服务器端，资源向来是寸土寸金，要为海量用户服务，就使得一切资源都要高效循环利用，需要更严谨为每一份资源作出安排。[脑图](http://naotu.baidu.com/viewshare.html?shareId=au9r3m20x0gg){:target="_blank"}

![Node内存控制]({{ site.assetUrl }}Node5.png){:class="img-zoom"}

### 理解 Buffer

这一章主要介绍了前端 JavaScript 里不能遇到的 Buffer。由于 Node 中会涉及频繁的网络和磁盘 I/O，处理字节流数据会是很常见的行为，这部分的场景与纯粹的前端开发完全不同。  
体会过 JavaScript 友好字符串操作后，有些开发者可能会形成思维定势，将 Buffer 当作字符串来理解。但字符串与 Buffer 之间有实质性的差异，即 Buffer 是二进制数据，字符串与 Buffer 之间存在编码关系。因此，理解 Buffer 的诸多细节十分必要，对于如何高效处理二进制十分有用。[脑图](http://naotu.baidu.com/viewshare.html?shareId=au9r8oahp0c0){:target="_blank"}
![Node理解Buffer]({{ site.assetUrl }}Node6.png){:class="img-zoom"}

### 网络编程

这一章介绍了 Node 支持的 TCP,UDP,HTTP 编程，还讲了有关于 Websocket 与 TSL、HTTPS 的介绍。  
利用 Node 可以十分方便地搭建网络服务器，不需要专门的 Web 服务器作为容器，仅仅需要几行代码就可以构建服务器。Node 提供了 net、dgram、http、https 这 4 个模块，分别用于处理 TCP、UDP、HTTP、HTTPS，适用于服务端和客户端。[脑图](http://naotu.baidu.com/viewshare.html?shareId=atyz5qrrmbcw){:target="_blank"}

![Node网络编程]({{ site.assetUrl }}Node7.png){:class="img-zoom"}

### 构建 Web 应用

这一章主要介绍了构建 Web 应用过程中用到的大多数技术细节，如数据处理、路由、MVC、模板、RESTful 等。
我觉得这一章对于我么开发一个 Nodejs 方面的应用很有指导性作用，整理本章细节就可以完成一个功能的 Web 开发框架，这章的目的也就是希望读者学习过这一章后能够对 Node 开发带来地图式的启发，在开发 Web 应用时能够心有轮廓，明了细微。[脑图](http://naotu.baidu.com/viewshare.html?shareId=au9r5vt0lkkc){:target="_blank"}

![Node构建Web应用]({{ site.assetUrl }}Node8.png){:class="img-zoom"}

### 玩转进程

这一章主要介绍 Node 的多进程技术，以及如何借助多进程方式来提升应用的可用性和性能。从严格意义上面来讲,Node 并非真正的单线程架构，在第 3 章我们还叙述过 Node 自身还有一定的 I/O 线程存在，这些 I/O 线程由底层 libuv 处理，这部分线程对于 JavaScript 开发者是透明的，只在 C++扩展开发时才会关注到。JavaScript 代码永远运行在 V8 上，是单线程的。本章将围绕 JavaScript 部分展开，所以屏蔽底层细节的讨论。[脑图](http://naotu.baidu.com/viewshare.html?shareId=au9r6aoa5bks){:target="_blank"}
![Node玩转进程]({{ site.assetUrl }}Node9.png){:class="img-zoom"}

### 测试

这一章主要介绍 Node 的单元测试和性能测试技巧。测试的意义在于，在用户消费产出的代码之前，开发者首先消费他，给予其重要的质量保证。
测试包括单元测试、性能测试、安全测试和功能测试等几个方面，本章将从 Node 实践的角度来介绍单元测试和性能测试。[脑图](http://naotu.baidu.com/viewshare.html?shareId=au9r6j3xqfsc){:target="_blank"}
![Node玩转进程]({{ site.assetUrl }}Node10.png){:class="img-zoom"}

### 产品化

“行百里路半九十”，完成产品开发的代码编写后，才完成了项目的第一步。这是一章介绍了将 Node 产品化所需要的注意到的细节，如项目工程化、代码部署、日志、性能、监控报警、稳定性、异构共存。
对于 Node 开发者而言，很多其他语言走过的路需要开发者带着 Node 特效重新践行一遍。这并不是坏事，Node 更接近底层使得开发者对于细节的可控性非常高。[脑图](http://naotu.baidu.com/viewshare.html?shareId=au9tg4f38wkw){:target="_blank"}
![Node玩转进程]({{ site.assetUrl }}Node11.png){:class="img-zoom"}
