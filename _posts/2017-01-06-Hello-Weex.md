---
layout: post
title: Hello Weex
date: 2017-01-06 16:00:00
summary: 本周给部门同学分享了《Hello Weex》这个 Topic，现整理成文字版本，分享给关注 Weex 的同学，主要涉及 Module && Component、Weex Architecture、 Weex Others ...
categories: Share
---

<img data-src="http://img.alicdn.com/tfs/TB1qlHxPXXXXXaFaXXXXXXXXXXX-2880-1800.jpg" class="lazyload" />

本周给部门同学分享了《Hello Weex》这个 Topic，现整理成文字版本，分享给关注 Weex 的同学，主要涉及：

1. Module && Component
2. Weex Architecture
3. Weex Others

*为了确保信息保密，已经将一些其他信息去除，请谅解，*分享开始 👨‍👨‍👧‍👧 🤣。

## **Module && Component**

Module 和 Component 相信有些同学区分不清楚，通过 google 搜索得到如下两个解释：

> Module: An implementation unit of software that provides a coherent set of responsibilities.
> Component:A component is a reusable building block that can be combined with other components in the same or other computers in a distributed network to form an application.

<img data-src="http://img.alicdn.com/tfs/TB1T6zwPXXXXXa2aXXXXXXXXXXX-440-317.png" class="lazyload" />

大致意思是说，Module 是指提供一组连贯的职责的软件的实现单元；Component 是可重复使用的程序构建块，它可以与分布式网络中相同或其他计算机中的其他组件相结合，形成应用程序。

以上的解释更加偏向计算机科学层面。

[@贺师俊](https://www.zhihu.com/people/3ec3b166992a5a90a1083945d2490d38)在[关于前端开发中“模块”和“组件”概念的思考 · Issue #21 · hax/hax.github.com\*\*](https://github.com/hax/hax.github.com/issues/21)这篇文章归纳下大概是如下这样：

Module 是指编程语言所提供的代码组织机制，利用此机制可将程序拆解为独立且通用的代码单元。**偏向静态的代码结构，Module 更加强调职责**。

Component 指功能单元，其意义偏向运行时的结构，并有更复杂的控制，**核心意义在于复用**，相对于 Module 对依赖性有更高的要求。

那么在 Weex 中呢，Module 和 Component 具体是什么呢？可以先看下 Weex 中 Module 和 Component 所包含的东西。

**Module 是一组能被 JS Framework 调用的 API. 其中的一些能以异步的方式调用 JS Framework。**

<img data-src="//img.alicdn.com/tfs/TB10Qn_PXXXXXXFXXXXXXXXXXXX-1172-458.png" class="lazyload" />

**Component 是指在屏幕内可见，有特定行为，能被配置不同的属性和样式，能响应用户交互。**

<img data-src="//img.alicdn.com/tfs/TB1NvfQPXXXXXcLXFXXXXXXXXXX-1322-766.png" class="lazyload" />

## **Weex Architecture**

官网是这样描述 Weex 为*"A framework for building Mobile cross-platform UI"，*一款轻量级的移动端跨平台动态性技术解决方案，其实说的通俗点就是 Vue-Native 。🤔🤒

相信对 Weex 有过关注的同学应该都见过下面这个 Weex 架构图。

<img data-src="//img.alicdn.com/tfs/TB1EITwPXXXXXaCaXXXXXXXXXXX-852-566.png" class="lazyload" />

看图说话是这样的：

1. weex-toolkit 中的 transform 工具将我们所编写的.we 文件转换成 JS Bundle，然后将 JS Bundle 部署到 Server。
2. Weex SDK 中的 JS Framework 获取到 JS Bundle 并执行，对其进行实例初始化工作，同时进行数据绑定、模板编译，同时提供 callNative 和 callJS 方法。
3. JS Framework 和 native 通过 callNative 和 callJS 这两个方法进行通信，共同依赖于一份相同的 JSON 配置表（此次可以联想到 RN 的实现原理 😉😉）

**Transform 所做的工作**其实是将 DSL 转成类 JSON 树形结构，并汇总结合成一 JavaScript AMD 模块，便于后续过程中 JS Framework 的处理，可以从如下图看到 transform 所做的工作：

<img data-src="//img.alicdn.com/tfs/TB1_hLfPXXXXXbgaVXXXXXXXXXX-2880-1800.jpg" src="{{site.defaultImage}}" class="lazyload img-zoom" />

以上的左边部分其实就是一个 DSL，一种领域特定语言，可以直接使用其对象领域中的概念，集中描述“想要做到什么”（What）的部分，而不必对“如何做到”（How）进行描述。

> A domain-specific language (DSL) is a computer language specialized to a particular application domain.

**JS Framework** 初始化一个实例涉及如下过程，详细见[**vanilla/index.js**](https://link.zhihu.com/?target=https%3A//github.com/alibaba/weex/blob/master/html5/vanilla/index.js)

<img data-src="//img.alicdn.com/tfs/TB1CjTtPXXXXXa0apXXXXXXXXXX-1268-630.png" class="lazyload" />

看到这里的人一定是爱学习的.....

<img data-src="//img.alicdn.com/tfs/TB1Hc6BPXXXXXa1aXXXXXXXXXXX-400-361.png" class="lazyload" />

## **Weex Others**

**1. Why not use scroller ？**

为什么不推荐使用 scroller 呢？Native 的同学肯定知道 Android 中的 ScrollView 和 Ios 中的 UIScrollView 这两个东西，详细看图：

<img data-src="//img.alicdn.com/tfs/TB1dgbFPXXXXXbDXVXXXXXXXXXX-1344-516.png" class="lazyload" />

可以把 scroller 里面的东西想象成一个大的子 View，如果列表过长，可想而知首屏的渲染完成和界面可操作需要等到将所有列表加载完成后才能使用，没有内存回收，无疑会对性能和体验造成一定影响。

**2. Why use list ？**

为什么要使用 list 呢？原因是此 component 只渲染可见区域，同时可以进行内存复用。

<img data-src="//img.alicdn.com/tfs/TB1ObPUPXXXXXasXFXXXXXXXXXX-1168-824.png" class="lazyload" />

假如还是不是很好理解，可以看看 Ios 中 UITableView 的原理图：

<img data-src="//img.alicdn.com/tfs/TB1eSL4PXXXXXaPXXXXXXXXXXXX-1914-1485.jpg" class="lazyload" />

**UItableView 控件使用 cell 来展示数据。一个 cell 对应一个 row，但是 cell 和 row 不完全相同。首先 cell 是一个 view，cell 的数量是由在某一刻可以看到的 row（行）的数量决定的。当一行数据被往上移动移出屏幕不可见后，cell 会被重复利用，接着用来展示新出现在屏幕中的那些行数据。**

list 只适合垂直长列表的滚动场景，但是假如需要使用横向滚动就必须使用 scroller 了。

**3. Weex App**

Weex 现在也可以像 RN 那样生成 APP 了，详细可以见[**weexteam/weex-hackernews**](https:/github.com/weexteam/weex-hackernews)，以下是我的运行结果，真正做到了一份代码多处运行。

<img data-src="//img.alicdn.com/tfs/TB1cpfCPXXXXXbWaXXXXXXXXXXX-2822-1708.jpg" class="lazyload" />

**4. Weex-x**

写 RN 的人可能会嘲笑写 Weex 的，“看你怎么搞复杂数据管理的东西？👹👹”，RN 的开发者可以通过 Redux 来实现 state 的良好管理，weex 其实也可以的，试试[**Jinjiang/weex-x**](https://link.zhihu.com/?target=https%3A//github.com/Jinjiang/weex-x)吧，可以从如下的 example 中看到对于的数据流管理。

{% highlight javascript %}
import { Store } in 'weex-x'
const store = new Store({
  state: { firstName: 'Jinjiang', lastName: 'ZHAO' },
  getters: { fullName: state => `${state.firstName} ${state.lastName}` },
  mutations: {
    setFirstName (state, name) {
      state.firstName = name
    },
    setLastName (state, name) {
      state.lastName = name.toUpperCase()
    }
  },
  actions: {
    setFirstName: ({ commit }, payload) => commit('setFirstName', payload),
    setLastName: ({ commit }, payload) => commit('setLastName', payload),
    setFullName({ commit }, payload) {
      const result = payload.split(' ', 2)
      commit('setFirstName', result[0])
      commit('setLastName', result[1])
    }
  }
})
{% endhighlight %}

**5. Weex Vue 2.0****很期待..........**

**完，有描述不对或者不清楚的地方欢迎大家指出。**
