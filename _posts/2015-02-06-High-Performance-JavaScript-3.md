---
layout:     post
title:      JavaScript的DOM编程性能优化
date:       2015-02-06 21:47:29
summary:    DOM是Document Object Model的缩写，中文叫做文档对象模型，是一个与语言无关的，用户操作XML和HTML文档的应用程序接口。在浏览器中，主要与HTML文档打交道，在Web应用中也经常需要检索XML文档，DOM API用于访问文档中的数据。John Hevatin有一次演讲说过一个贴切的比喻，把DOM和JavaScript各自想象成一个岛屿，它们直接用收费桥梁连接，ECMAScript每次访问DOM，都要经过这个桥，并交纳“过桥费”，过的桥越多交的费用也越多，因此要想减少费用就得少过桥，我们这里就来如何来优化这个问题。
categories: JavaScript  学习笔记
---
DOM是Document Object Model的缩写，中文叫做文档对象模型，是一个与语言无关的，用户操作XML和HTML文档的应用程序接口。在浏览器中，主要与HTML文档打交道，在Web应用中也经常需要检索XML文档，DOM API用于访问文档中的数据。John Hevatin有一次演讲说过一个贴切的比喻，把DOM和JavaScript各自想象成一个岛屿，它们直接用收费桥梁连接，ECMAScript每次访问DOM，都要经过这个桥，并交纳“过桥费”，过的桥越多交的费用也越多，因此要想减少费用就得少过桥，我们这里就来如何来优化这个问题。
