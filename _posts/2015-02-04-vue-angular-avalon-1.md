---
layout:     post
title:      Vue.js，AngularJS，Avalon.js框架比较
date:       2015-02-04 10:21:29
summary:    前端开发已经不是前几年的那种前端开发了，已经有农业时代进入工业时代了，这几年出现了很多优秀的JavaScript方面的MVVM框架，今天我来比较下Vuejs，AngularJS，Avalon.js这些框架优缺点 ...
categories: Technology
---

前端开发已经不是前几年的那种前端开发了，已经有农业时代进入工业时代了，这几年出现了很多优秀的JavaScript方面的MVVM框架，今天我们来比较下Vuejs，AngularJS，Avalon.js这些框架优缺点。

### Vue.js

Vue.js 尤雨溪老师写的一个用于创建 web 交互界面的库，是一个精简的 MVVM。从技术角度讲，[Vue.js](http://vuejs.org/){:target="_blank"} 专注于 MVVM 模型的 ViewModel 层。它通过双向数据绑定把 View 层和 Model 层连接了起来。实际的 DOM 封装和输出格式都被抽象为了Directives 和 Filters。Vue.js和其他库相比是一个小而美的库，作者的主要目的是通过一个尽量简单的 API 产生可反映的数据绑定和可组合的视图组件，感觉作者的思路非常清晰。

#### 优点

1. 简单：官方文档很清晰，比 Angular 简单易学。
2. 快速：异步批处理方式更新 DOM。
3. 组合：用解耦的、可复用的组件组合你的应用程序。
4. 紧凑：~18kb min+gzip，且无依赖。
5. 强大：表达式 & 无需声明依赖的可推导属性 (computed properties)。
6. 对模块友好：可以通过 NPM、Bower 或 Duo 安装，不强迫你所有的代码都遵循 Angular 的各种规定，使用场景更加灵活。  

#### 缺点

1. 新生儿：Vue.js是一个新的项目，2014年3月20日发布的0.10.0ReleaseCandidate版本，目前github上面最新的是0.11.4版本，没有angular那么成熟。
2. 影响度不是很大：google了一下，有关于Vue.js多样性或者说丰富性少于一些有名的库。
3. 不支持IE8：哈哈不过AngularJS 1.3也抛弃了对IE8的支持，但是 @司徒正美 老师的avalon是支持IE6+的，应该下了很多努力去优化。这一点对于那些需要支持IE8的项目就不好了，不过这也是web前端开发的一个趋势，像IE低版本就应该退出历史舞台了，通过改变我们的前端思维，而不是顺应那些使用老版本而不去升级的人。玉伯老师就说过一句话，我觉得说的非常好“这年头，支持IE6、7早就不再是特性，而是耻辱。努力推动支付宝全面不支持IE6、7，期待更多兄弟加盟”。

### AngularJS

AngularJS最近很火，追随者也很多，[Superheroic JavaScript MVW Framework](https://angularjs.org/){:target="_blank"}。官方说得很朴素：“完全使用JavaScript编写的客户端技术。同其他历史悠久的Web技术（HTML、CSS和JavaScript）配合使用，使Web应用开发比以往更简单、更快捷“。当你学习它的时候，我相信你会被它的很多新特效所吸引。  

#### 优点

1. 动态视图：以前从来没有想过js可以如此扩展HTML的属性，但是AngularJs做到了，它替我们静态的HTML加了很多扩展性功能，有一种让HTML由死变活的感觉。
2. 完善：是一个比较完善的前端MVW框架，包含模板，数据双向绑定，路由，模块化，服务，依赖注入等所有功能，模板功能强大丰富，并且是声明式的，自带了丰富的 Angular 指令。
3. Google维护：AngularJS有Google来维护，无疑有了一个强大的后台，对于推广和维护明显比Vue.js和avalon有优势，社区也非常活泼，能够很好促进它的发展。
4. AngularJS & Ionic：[Ionic](http://ionicframework.com/){:target="_blank"}，这俩就是一个好基友，Ionic通过用AngularJS为了创建一个框架，最适合开发的丰富和强大的应用程序。上次于知乎回答了[链接](http://www.zhihu.com/question/27210335/answer/35713635){:target="_blank"}。

#### 缺点

1. 大而全：学习起来有难度，对于我来讲学习曲线很曲折，比较难理解一些。
2. 推翻重写：前段时候逛社区发现AngularJS2会把之前的推翻重写，两个框架的改变很大，基本是两个框架了，等于是说等到2.0出来后又需要从头开始。正如徐飞所说2.0的流行至少还要3年。不跳票的情况下，1年
之后才有稳定版，这个稳定版应该不支持很多浏览器了，稳定版一段时间内是没有任何周边的，所以，目前学1.3不能算是无效投资。
3. 不支持IE8以下，貌似2.0变得只支持移动端了，等到出来后再看吧。

### Avalon.js

[Avalon.js](https://github.com/RubyLouvre/avalon){:target="_blank"}是司徒正美老师所写的个简单易用迷你的MVVM框架，它最早发布于2012.09.15，为解决同一业务逻辑存在各种视图呈现而开发出来的。常常可以看到老师推广他的Avalon.js，出了很多教程，无疑对国内学习Avalon.js的人提供了巨大方便。  

#### 优点

1. 使用简单，在HTML中添加绑定，在JS中用avalon.define定义ViewModel，再调用avalon.scan方法，它就能动了！
2. 兼容到 IE6 (其他MVVM框架，KnockoutJS(IE6), AngularJS(IE9), EmberJS(IE8), WinJS(IE9) )，另有avalon.mobile，它可以更高效地运行于IE10等新版本浏览器中。
3. 没有任何依赖，不到5000行，压缩后不到50KiB。
4. 支持管道符风格的过滤函数，方便格式化输出。
5. 局部刷新的颗粒度已细化到一个文本节点，特性节点。
6. 要操作的节点，在第一次扫描就与视图刷新函数相绑定，并缓存起来，因此没有选择器出场的余地。
7. 让DOM操作的代码近乎绝迹。
8. 使用类似CSS的重叠覆盖机制，让各个ViewModel分区交替地渲染页面。
9. 节点移除时，智能卸载对应的视图刷新函数，节约内存。
10. 操作数据即操作DOM，对ViewModel的操作都会同步到View与Model去。
11. 自带AMD模块加载器，省得与其他加载器进行整合。  

#### 缺点

1. 不能监听数组元素的属性变化，在ng中我们可以通过$watch一个表达式实现这功能（这是引起ng性能瓶颈的元凶之一），但avalon的$watch只能监听当前VM的当前这一层的属性变动。
2. 没有公开出来的前端集成解决方案（负责生成当前项目的手脚架，上线代码检测，JS，CSS合并，图片合并，压缩，上传到目标服务器……）。
3. OniUI的皮肤不够好看，许多人说要配合boostrap，但社区还没有人主动站出来做这事。

### 备注

这其实是我知乎上面答得一个问题的总结，写了一个晚上，故收藏下来了。
