---
layout: post
title: Can We Do Better Than The Click?
date: 2015-03-30 21:47:29
summary: 响应用户的输入可以说是我们做界面开发的核心。为了构建可响应的 Web 产品，g关键是理解触摸、鼠标、指针、键盘操作和浏览器的工作原理是。你可能在手机浏览器中经历过 300 ms 的延迟或者通过触摸来滚动带来的不爽。在本文中，我们将介绍事件级联和使用这些知识来实现演示一个点击事件，支持许多输入方法但是又没有违反像 Opera Mini 这一类的代理浏览器规则...
categories: Study
---

原文来自：[Browser Input Events: Can We Do Better Than The Click?](https://www.smashingmagazine.com/2015/03/better-browser-input-events/)

响应用户的输入可以说是我们做界面开发的核心。为了构建可响应的 Web 产品，理解触摸、鼠标、指针、键盘操作和浏览器的工作原理是解决问题的关键。你可能在手机浏览器中经历过[300-millisecond delay](http://ionicframework.com/blog/hybrid-apps-and-the-curse-of-the-300ms-delay/){:target="_blank"}(300 ms 延迟)或者[wrestled with touchmove versus scrolling](https://docs.google.com/document/d/12k_LL_Ot9GjF8zGWP9eI_3IMbSizD72susba0frg44Y/){:target="_blank"}(触摸滚动导致页面卡顿)。

在本文中，我们将介绍事件级联和使用这些知识来实现演示一个 tap 点击事件，支持多种输入方法但是又没有违反像 Opera Mini 这一类的代理浏览器规则。

<small>注：tap 也翻译为点击，tap 和 click 都是在点击时候触发，但在手机 Web 端 click 会有 200~300ms 延迟，为了避免歧义，下文将” tap event“翻译成“tap 点击事件“</small>

### 概况

目前被用于与 Web 交互的 3 种主要的交互方式是：数字光标（鼠标）、触觉（直接触摸或者手写笔）、键盘。在 JavaScript 中我们可以通过[触摸事件](http://www.w3.org/TR/touch-events/){:target="_blank"},[鼠标事件](http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-eventgroupings-mouseevents){:target="_blank"},[指针事件](http://www.w3.org/TR/pointerevents/){:target="_blank"}和[键盘事件](http://www.w3.org/TR/2014/WD-DOM-Level-3-Events-20140925/#keys){:target="_blank"}来使用它们。在这篇文章中我们主要讨论触摸和基于鼠标的交互，虽然这里有键盘事件已经形成标准，如 click 和 submit 事件。

你很有可能已经实现过鼠标和触摸事件的处理程序，在过去我们推荐的做法是这样：  
{% highlight javascript %}
/** DO NOT EVER DO THIS! */
$('a', ('ontouchstart' in window)?'touchend':'click',handler);
{% endhighlight %}

微软已经负责创建了一个更好的，更有前途的“指针事件”的事件模型规范。指针事件是一个抽象的输入机制,现在是 W3C 推荐标准。指针事件给用户代理(UA)带来灵活性，给一个事件系统提供丰富的输入机制。鼠标、触摸、手写笔是今天很容易想到的输入方式，但实现延伸到[myo](https://www.thalmic.com/en/myo/){:target="_blank"}（肌）和[Ring](http://logbar.jp/ring/en/){:target="_blank"}（环）也是可实现的。虽然 Web 开发者对这些似乎很兴奋，但并不是所有的浏览器开发者也会这样以为。就像苹果和谷歌现在就没有打算来实现指针事件。  
谷歌的这个决定并不是他们最终的决定，但是目前在指针事件上没有活跃的工作。我们通过 polyfills 输入和使用指针事件和替代解决方案将成为等式的一部分，可能最终起决定作用。苹果在 2012 年发表申明反对指针事件，我现在没有从 Safari 的工程师那里得到任何公众回应。

### 事件级联

当用户在移动设备上面 tap 点击一个元素时，浏览器会触发一系列事件：

> touchstart → touchend → mouseover → mousemove → mousedown → mouseup → click

这是由于 Web 的向后兼容性，指针事件采取的一种可替代方案来触发事件内联的兼容性：

> mousemove → pointerover → mouseover → pointerdown → mousedown → gotpointercapture → pointerup → mouseup → lostpointercapture → pointerout → mouseout → focus → click

事件规范允许用户代理们用不同的方式来实现兼容性的事件，Patrick Lauke 和 Peter-Paul Koch 维护着关于这一主题的广泛的参考材料（资源链接位于文章底部）。
以下图片显示下列行为的事件串：

1. 首次 tap 点击一个元素,
2. 第二次 tap 点击一个元素,
3. tap 点击关闭元素,

请注意：为了适应这个栈这个事件栈故意忽略了 focus 和 blur 事件。

![iOS Touch Events](http://tw93.github.io/images/01-ios-opt-small.png)

<small>在 iOS 设备上的 tap 点击一个元素两次和松开的事件级联</small>
<br><br>
![Android4.4 Touch Events](http://tw93.github.io/images/02-android-opt-small.png)

<small>在 Android 4.4 设备上的 tap 点击一个元素两次和松开的事件级联</small>
<br><br>
![Android4.4 Touch Events](http://tw93.github.io/images/03-pointer-opt-small.png)

<small>在 Internet Explorer 11（在兼容的触摸事件实现）上 tap 点击元素两次然后松开的事件级联</small>

### 应用事件级联

由于浏览器工程师的工作，大多数现在建成的桌面网站“只是可以工作而已”。尽管级联看起来有点粗糙，但建立鼠标事件是我们以前通常工作的保守做法。  
当然，300ms 的延迟问题比起在滚动和 touchmove 和 pointermove 事件相互作用，还有浏览器渲染问题这些额外的问题更加臭名昭著。避免 300 ms 的延迟很容易，如果：

- 我们只为现代的 Android 和桌面端的 Chrome 优化，通过使用<meta name="viewport" content="width=device-width">来启动禁用延迟这一功能。
- 我们只为 iOS 设备优化，用户有一个明确的点击，不是那种快速的点击或者长按，仅仅是一个元素良好的、正常的、明确的点击。

如果我们的目标是建立一个能在用户体验和本地应用媲美的 Web 应用，那么我们需要减少交互响应的延迟。为了达到这个目标，我们需要在原始事件（如 down,move,up）上创建我们属于自己的复合事件(click,double-click),当然我们还需要对本地事件的回退处理提供广泛和可行的支持。

做这些需要不少的代码和知识。为了避免在浏览器中的 300ms 延迟，我们需要处理全部生命周期内的自我交互。对于一个给定｛类型｝的 down 事件，我们需要绑定所有必需的事件来完成这个功能，当交互已经完成后，我们需要清理自己解绑的起始事件。

网站开发人员，你是唯一一个知道页面是否应该放大或另一个双击事件是否必须等待的人。如果只有你需要回调推迟你应该允许一个预定的动作来延迟。

在接下来链接中，你会发现一个小的、相互间无依赖的 tap 事件 Demo 来创造一个多输入、低延迟的 tap 点击事件。Polymer-gestures 是一个为 tap 点击和其他事件生产开发的库。尽管是这个名字有 Polymer，但是它是不依赖 Polymer 库而且很容易被隔离。

明确的说，实施这个从一开始来说就是一个坏主意，以下这些应该仅仅用于教育而不是用于生产环境。用于生产环境的库已经存在，例如：[FastClick](https://github.com/ftlabs/fastclick/){:target="_blank"},[polymer-gestures](https://github.com/Polymer/polymer-gestures){:target="_blank"}和[Hammer.js](http://hammerjs.github.io/){:target="_blank"}。

- Demo：[The tap event](https://github.com/Skookum/smashing-input-events/blob/gh-pages/taps.html){:target="_blank"}
- Code:[taps.js](https://github.com/Skookum/smashing-input-events/blob/gh-pages/taps.js#L1){:target="_blank"}

### 重要部分

在所有开始的地方绑定你的初始事件，这下面处理多输入的模式是被认为一种保险的方式。
{% highlight javascript%}
/**

* If there are pointer events, let the platform handle the input
* mechanism abstraction. If not, then it’s on you to handle
* between mouse and touch events.
 */

if (hasPointer) {
  tappable.addEventListener(POINTER_DOWN, tapStart, false);
  clickable.addEventListener(POINTER_DOWN, clickStart, false);
}

else {
  tappable.addEventListener('mousedown', tapStart, false);
  clickable.addEventListener('mousedown', clickStart, false);

  if (hasTouch) {
    tappable.addEventListener('touchstart', tapStart, false);
    clickable.addEventListener('touchstart', clickStart, false);
  }
}

clickable.addEventListener('click', clickEnd, false);
{%endhighlight%}

绑定 touch 事件需要和渲染性能妥协，即使它们没有做任何事，但为了减少这种影响，通常推荐在处理程序开始时候绑定跟踪事件。别忘了在完成你的事件处理后要清理自己的环境和解绑跟踪事件。

{% highlight javascript%}
/**

* On tapStart we want to bind our move and end events to detect
* whether this is a “tap” action.
* @param {Event} event the browser event object
 */

function tapStart(event) {
  // bind tracking events. “bindEventsFor” is a helper that automatically
  // binds the appropriate pointer, touch or mouse events based on our
  // current event type. Additionally, it saves the event target to give
  // us similar behavior to pointer events’ “setPointerCapture” method.

  bindEventsFor(event.type, event.target);
  if (typeof event.setPointerCapture === 'function') {
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  // prevent the cascade
  event.preventDefault();
  
  // start our profiler to track time between events
  set(event, 'tapStart', Date.now());
}

/**

* tapEnd. Our work here is done. Let’s clean up our tracking events.
* @param {Element} target the html element
* @param {Event} event the browser event object
 */

function tapEnd(target, event) {
  unbindEventsFor(event.type, target);
  var _id = idFor(event);
  log('Tap', diff(get(_id, 'tapStart'), Date.now()));
  setTimeout(function() {
    delete events[_id];
  });
{%endhighlight%}

剩下的这些代码应该能够很好的自我解释，事实上，它有很多簿记，实现自定义手势要求你用浏览器事件系统来紧密合作。为了挽救你的受伤和心痛，不要在你自己的代码库里做事情。相反你应该建立或使用一个强大的抽象，例如[Hammer.js](http://hammerjs.github.io/){:target="_blank"},jQuery polyfill 的[Pointer Events](https://github.com/jquery/PEP){:target="_blank"}或者[polymer-gestures](https://github.com/Polymer/polymer-gestures){:target="_blank"}。

### 总结

一些曾经很清楚的事件现在却是有歧义的，以前 click 事件用来指有且只有一件事，但是现在在触摸屏上面需要辨别是双击、滚动或者其他操作系统的手势。

好消息是，我们现在明白了很多用户的操作习惯和浏览器的响应之间的事件级联和相互作用，通过在工作中认识的原语，我们自己能够在我们的项目中为我们的用户和 Web 的未来做出更好的决策。

你在构建多设备的网站时，有遇到什么意想不到的问题？你采取什么样的方法来解决 Web 上众多的交互模式？

### 参考链接

- [“Pointer Events Finalized, But Apple’s Lack of Support Still a Deal Breaker,”](http://arstechnica.com/information-technology/2015/02/pointer-events-finalized-but-apples-lack-of-support-still-a-deal-breaker/){:target="_blank"}Peter Bright
- Getting Touchy: An Introduction to Touch and Pointer Events,包括[slides](http://patrickhlauke.github.io/getting-touchy-presentation/){:target="_blank"}和[talk](https://www.youtube.com/watch?v=QYLC8o3U_XY){:target="_blank"} Patrick E. Lauke
- [“Apple’s Web?”](http://timkadlec.com/2015/02/apples-web/){:target="_blank"} by Tim Kadlec
- [“Avoiding the 300ms Click Delay, Accessibly,”](http://timkadlec.com/2013/11/Avoiding-the-300ms-click-delay-accessibly/){:target="_blank"} Tim Kadlec
- [“Touch taple,”](http://www.quirksmode.org/mobile/tapleTouch.html){:target="_blank"} Peter-Paul Koch
- [“Making the Web ‘Just Work’ With Any Input: Mouse, Touch, and Pointer Events,”](http://blogs.msdn.com/b/ie/archive/2014/09/05/making-the-web-just-work-with-any-input.aspx){:target="_blank"} Jacob Rossi
- [FastClick library](https://github.com/ftlabs/fastclick){:target="_blank"}
- [Hammer.js](http://hammerjs.github.io/){:target="_blank"}
- [polymer-gestures](https://github.com/Polymer/polymer-gestures){:target="_blank"}
- [Pointer Events](https://github.com/jquery/PEP){:target="_blank"}jQuery polyfill
- [“Implement Custom Gestures,”](https://developers.google.com/web/fundamentals/input/touch/touchevents/){:target="_blank"} Google Developers
