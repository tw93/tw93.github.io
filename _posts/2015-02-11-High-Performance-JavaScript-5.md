---
layout: post
title: 高性能 JavaScript - 快速响应的用户界面
date: 2015-02-12 21:47:29
summary: 有一句话很有道理：“如果 JavaScript运行了整整几秒钟，那么很有可能是你做错了什么......”，如果界面在 100 毫秒内响应用户输入，用户会认为自己在“直接操作界面中的对象”。超过 100 毫秒意味着用户感觉自己与界面失去了联系。JavaScript 和用户界面更新在同一个进程中运行，因此一次只能处理一件事情。这意味着当 JavaScript 代码在运行时，用户界面不能响应输入，反之亦然。高效地管理UI线程就是要确保 JavaScript 不能运行太长时间，以免影响用户体验。管理好 JavaScript 的运行时间对 Web 应用的性能非常重要 ...
categories: Study
---

有一句话很有道理：“如果 JavaScript 运行了整整几秒钟，那么很有可能是你做错了什么......”，如果界面在 100 毫秒内响应用户输入，用户会认为自己在“直接操作界面中的对象”。超过 100 毫秒意味着用户感觉自己与界面失去了联系。JavaScript 和用户界面更新在同一个进程中运行，因此一次只能处理一件事情。这意味着当 JavaScript 代码在运行时，用户界面不能响应输入，反之亦然。高效地管理 UI 线程就是要确保 JavaScript 不能运行太长时间，以免影响用户体验。管理好 JavaScript 的运行时间对 Web 应用的性能非常重要。

### 浏览器 UI 线程

#### 定义

共用于执行 JavaScript 和更新用户界面的进程通常被称为“浏览器 UI 线程”（尽管对所有浏览器来说，称为“线程”不一定准确）。

#### 工作原理

UI 线程的工作基于一个简单的队列系统，任务会保存到队列中直至进程空闲。一旦空闲，队列中的下一个任务就被重新提取出来并运行，这些任务要么是运行 JavaScript 代码，要么是执行 UI 更新，包括重绘和重排。也许这个进程中最有趣的部分在于每一次输入可能会导致一个或多个任务被加到队列。

#### 优化

当所有的 UI 线程任务都执行完毕，进程进入空闲状态，并等待更多任务加入队列。**空闲状态是理想的**，因为用户所有的交互都会立即触发 UI 更新。如果用户试图在任务运行期间于页面交互，不紧没有即时的 UI 更新，甚至可能新的 UI 更新不会被创建并不会被加到队列。事实上，太多事浏览器在 JavaScript 运行时会停止把新任务加到 UI 线程中，也就是说**JavaScript 任务必须尽快结束**，以避免对用户体验造成不良影响。

### 浏览器限制

浏览器为了确保某些恶意代码不能通过永不停止的密集操作锁住用户的浏览器或计算机，因此浏览器限制了 JavaScript 的运行时间。
此类限制分两种：调用栈大小限制（记录脚本开始以来执行语句的数量）和长时间运行脚本限制（记录脚本执行的总时长）。

### 使用定时器让出时间片段

尽管你尽了最大努力，但难免会有一些复杂的 JavaScript 任务不能在 100 毫秒或者更短的时间完成。这个时候，最理想的方法是让出 UI 线程的控制权，使得 UI 可以更新，

#### 使用定时器

定时器与 UI 线程的交互有助于把长时间运行的脚本拆分成更短的片段，调用 setTimeOut()或 setInterval()会告诉 JavaScript 先等待一段时间，然后再添加一个任务到 UI 队列。
{% highlight javascript %}
function greeting() {
    alert("hello world");
}
setTimeout(greeting, 250);
//这段代码会在250毫秒后
//向UI队列中插入一个执行greeting()函数的JavaScript任务
{% endhighlight %}

**但是记住，第二个参数表示任务何时被添加到 UI 队列，而不是一定会在这段时间后执行；这个任务会等待其他所有任务执行完毕后才执行。**

### Web Workers(又是一个我接触的新东西)

自 JavaScript 诞生以来，还没有办法在浏览器 UI 线程之外运行代码。Web Workers API 改变了这种状态，它引入了一个接口，能使代码运行企鹅不占浏览器 UI 线程的时间。

#### Web Worker 运行环境

- 一个 navigation 对象，只包括四个属性：appName,appVersion,user Agent 和 platform。
- 一个 location 对象（与 window.location 相同，不过所有属性都是可读的）。
- 一个 self 对象，指向全部 worker 对象。
- 一个 importScripts()方法，用来加载 Worker 所用到的 JavaScript 文件。
- 所有的 ECMAScript 对象，诸如：Object,Array,Date 等。
- XMLHttpRequest 构造器。
- setTimeout()和 setInterval()方法。
- 一个 close()方法，它能立即停止 Worker 运行。

由于 Web Worker 有着不同的全局运行环境，因此你无法从 JavaScript 代码中创建它。事实上，你需要创建一个完全独立的 JavaScript 文件，其中包括需要在 Worker 中运行的代码。要创建网页工人线程，你必须传入这个 JavaScript 的 URL：
{% highlight javascript %}
var worker=new Worker("code.js");
{% endhighlight %}

#### 与 Worker 通信

网页代码可以通过 postMessage()方法给 Worker 传递数据，它接受一个参数，即需要传递给 Worker 的数据。此外 Worker 还有一个用来接收 onmessage 事件处理器。**消息系统是网页和 Worker 通信的唯一途径。**
{% highlight javascript %}
/*
    Description:
    The Worker() constructor creates a Worker that executes the script at the specified URL. This script must obey the same-origin policy.

    Syntax:
    webWorker = new Worker(aURL);
*/
var worker = new Worker("code.js");
worker.onmessage = function(event) {
    alert(event.data);
};
worker.postMessage("Tangwei");

//Worker 可以通过它自己的 postMessage()方法把消息传回页面
self.onmessage = function(event) {
    self.postMessage("Hello", event.data + "!");
};
{% endhighlight %}
注意：只有特定类型的数据才可以使用 postMessage()传递。

#### 加载外部文件

Worker 通过 importScripts()方法加载外部的 JavaScript 文件，该方法可以接收一个或多个 JavaScript 文件 URL 作为参数。importScripts()的调用过程是阻塞式的，直到所有文件加载执行完成之后，脚本才会继续运行。由于 Worker 在 UI 线程之外运行，所以这种阻塞并不会影响 UI 响应。
{% highlight javascript %}
importScripts("file1.js","file2.js");
self.onmessage = function(event) {
    self.postMessage("Hello", event.data + "!");
};
{% endhighlight %}
