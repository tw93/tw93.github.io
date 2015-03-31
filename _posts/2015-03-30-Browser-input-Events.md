---
layout:     post
title:      Browser Input Events: Can We Do Better Than The Click?（译）
date:       2015-03-30 21:47:29
summary:    响应用户的输入可以说是我们做界面开发的核心。为了构建可响应的Web产品，理解触摸、鼠标、指针、键盘操作和浏览器的工作原理是解决问题的关键。你可能在手机浏览器中经历过300 ms的延迟或者通过触摸来滚动带来的不爽。在本文中，我们将介绍事件级联和使用这些知识来实现演示一个点击事件，支持许多输入方法但是又没有违反像Opera Mini这一类的代理浏览器规则。  
categories: 我的翻译
---

响应用户的输入可以说是我们做界面开发的核心。为了构建可响应的Web产品，理解触摸、鼠标、指针、键盘操作和浏览器的工作原理是解决问题的关键。你可能在手机浏览器中经历过[300-millisecond delay]{http://ionicframework.com/blog/hybrid-apps-and-the-curse-of-the-300ms-delay/}{:target="_blank"}(300 ms延迟)或者[wrestled with touchmove versus scrolling]{https://docs.google.com/document/d/12k_LL_Ot9GjF8zGWP9eI_3IMbSizD72susba0frg44Y/}{:target="_blank"}(触摸滚动导致页面卡顿)。  

在本文中，我们将介绍事件级联和使用这些知识来实现演示一个点击事件，支持许多输入方法但是又没有违反像Opera Mini这一类的代理浏览器规则。

###概况
目前被用于与Web交互的3种主要的交互方式是：数字光标（鼠标）、触觉（直接触摸或者手写笔）、键盘。在JavaScript中我们可以通过[触摸事件]{http://www.w3.org/TR/touch-events/}{:target="_blank"},[鼠标事件]{http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-eventgroupings-mouseevents}{:target="_blank"},[指针事件]{http://www.w3.org/TR/pointerevents/}{:target="_blank"}和[键盘事件]{http://www.w3.org/TR/2014/WD-DOM-Level-3-Events-20140925/#keys}{:target="_blank"}来使用它们。在这篇文章中我们主要讨论触摸和基于鼠标的交互，虽然这里有键盘事件已经形成标准，如click和submit事件。  
你很有可能已经实现过鼠标和触摸事件的处理程序，在过去我们推荐的做法是这样：  
{% highlight javascript %}
/** DO NOT EVER DO THIS! */
$('a', ('ontouchstart' in window) ? 'touchend' : 'click', handler);
{% endhighlight %}

微软已经负责创建了一个更好的，更有前途的“指针事件”的事件模型规范。指针事件是一个抽象的输入机制,现在是W3C推荐标准。

