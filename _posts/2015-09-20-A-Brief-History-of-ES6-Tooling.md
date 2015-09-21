---
layout:     post
title:      A Brief History of ES6 Tooling
date:       2015-09-20 21:47:29
summary:    最近一段时间关于React和ES6的文章我写得很少，今天我想增加更多上下文来解释我为什么似乎突然对待ES6，我已经对ES6感兴趣很长一段时间了，但是我总是没有勇气使用ES6来写代码，在这篇文章中我想简单的介绍下ES6工具的历史，还有解释为什么我们今天来使用ES6比半年前好在哪里。
categories: es6-in-depth
---

原文来自[A Brief History of ES6 Tooling](http://ponyfoo.com/articles/a-brief-history-of-es6-tooling).

最近一段时间关于React和ES6的文章我写得很少，今天我想增加更多上下文来解释我为什么似乎突然对待ES6，我已经对ES6感兴趣很长一段时间了，但是我总是没有勇气使用ES6来写代码，在这篇文章中我想简单的介绍下ES6工具的历史，还要说明为什么我们今天来使用ES6比半年前好在哪里。

对于大多数，我们感谢有Browserify,Babel和一些已经确定的规范，但是这些工具刚刚产生的时候并没有现在这么成熟。

![babel](http://tw93.github.io/images/babel.png)

在**javascript-to-javascript**变成一（规则）的事情前，这里有很多模块可以让你在你的应用中使用ES6一些特殊的功能模块，像*gnode*，通过在运行中解释你的代码可以让你在node中使用generators。

> Trivia question: how many different names has ES6 accrued over the years?

然后接下来我们也看到一些ES6模块加载器的工具，例如[`es6-module-loader`](https://github.com/ModuleLoader/es6-module-loader){target=“_blank"}，这些库通过给开发者一些东西深入理解实现开始出现，有助于推进规范的发展。当然你也可以使用CoffeeScript或者TypeScript中一些已经实现的相当于ES6的语言特征。

我不在乎CoffeeScript的语法，这一事实也会减少我为[开源](http://bevacqua.io/opensource){target=“_blank"}的能力，所以它被排除了，TypeScript是好的，但是它有很多特性在将要来临的ES6上面，还有我想尽可能学一些东西对我很长一段时间有好处的。也就是说这两种语言对于ES6的形成有很大的贡献，我们应该感谢他们，还有很长一段时间，它们似乎可以让你尝试ES6语言任何类似的特性。

最终，transpilers开始出现，第一个是[Traceur](https://github.com/google/traceur-compiler),它出现在一个没有被规范锁定的时间，以致这是不断变化的，所以我认为这不是一个好的想法，把它当做玩具语言尝试了几分钟，当我在为我的应用程序设计书写实例代码时候，我很快就受到了挫折。大约在同一时间，[6to5](https://www.npmjs.com/package/6to5)开始兴风作浪，那时候还有[`esnext`](https://github.com/esnext/esnext),但是esnext从来没有实现ES6模块，在今年的早一些时候，这些项目被合并成我们今天所知的[Babel](http://babeljs.io/)。

> Come june, the spec was finalized.

[![es6](http://tw93.github.io/images/es6.png)](http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-262.pdf)

语言特性形成规范是至关重要的，这意味着编译器现在可以在下个月内实现一些并没有过时的语法。该规范所确定和Babel成为事实上*JavaScript-to-JavaScript*构建工具让我再次对ES6感兴趣，所以我开始觉得再尝试一遍。

我们现在有能力通过使用*babelify*将Browserify和Babel结合在一起，考虑到性能原因我们在开发过程中可以在服务器中使用*babel-node*将其编译成ES5。如果我们要使用CSS模块Webpack，还有一堆的ES6功能我们准备使用。我们要小心不要夸大我们的能力，虽然。有了如此多的东西，会很难保持我们代码的高质量，不要因为它的一些新的特征和闪亮的技巧而强行的将其塞入我们的代码中。

> There’s plenty of room in front-end tooling for feature creep, unfortunately, but **we need to battle against that**now.
> 
> Tomorrow I’ll be publishing an article about the parts of the future of JavaScript I’m most excited about and the concerns I have about mindlessly adopting ES6 features.