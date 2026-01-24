---
layout: post
title: Hello Weex
date: 2017-01-06 16:00:00
summary: This week, I shared the Topic "Hello Weex" with my department colleagues. Now I have organized it into a text version to share with students who follow Weex. It mainly involves Module && Component, Weex Architecture, Weex Others ...
categories: Share
---

<img data-src="http://img.alicdn.com/tfs/TB1qlHxPXXXXXaFaXXXXXXXXXXX-2880-1800.jpg" class="lazyload" />

This week, I shared the Topic "Hello Weex" with my department colleagues. Now I have organized it into a text version to share with students who follow Weex. It mainly involves:

1. Module && Component
2. Weex Architecture
3. Weex Others

*To ensure information confidentiality, some other information has been removed. Please understand.* Sharing begins.

## **Module && Component**

I believe some students cannot distinguish between Module and Component clearly. Through Google search, I got the following two explanations:

> Module: An implementation unit of software that provides a coherent set of responsibilities.
> Component:A component is a reusable building block that can be combined with other components in the same or other computers in a distributed network to form an application.

<img data-src="http://img.alicdn.com/tfs/TB1T6zwPXXXXXa2aXXXXXXXXXXX-440-317.png" class="lazyload" />

Roughly meaning, Module refers to the implementation unit of software that provides a coherent set of responsibilities; Component is a reusable program building block that can be combined with other components in the same or other computers in a distributed network to form an application.

The above explanations are more biased towards computer science level.

In the article [Thinking about the concepts of "Module" and "Component" in front-end development · Issue #21 · hax/hax.github.com\*\*](https://github.com/hax/hax.github.com/issues/21) by [@He Shijun](https://www.zhihu.com/people/3ec3b166992a5a90a1083945d2490d38), it is summarized roughly as follows:

Module refers to the code organization mechanism provided by the programming language. Using this mechanism, the program can be disassembled into independent and general code units. **Biased towards static code structure, Module emphasizes responsibilities more**.

Component refers to functional unit. Its meaning is biased towards runtime structure, and has more complex control. **Core meaning lies in reuse**. Compared with Module, it has higher requirements for dependency.

So in Weex, what exactly are Module and Component? You can first look at what Module and Component in Weex contain.

**Module is a set of APIs that can be called by JS Framework. Some of them can call JS Framework in an asynchronous way.**

<img data-src="//img.alicdn.com/tfs/TB10Qn_PXXXXXXFXXXXXXXXXXXX-1172-458.png" class="lazyload" />

**Component refers to being visible on the screen, having specific behaviors, being able to be configured with different properties and styles, and being able to respond to user interactions.**

<img data-src="//img.alicdn.com/tfs/TB1NvfQPXXXXXcLXFXXXXXXXXXX-1322-766.png" class="lazyload" />

## **Weex Architecture**

The official website describes Weex as *"A framework for building Mobile cross-platform UI"*, a lightweight mobile cross-platform dynamic technical solution. Actually, to put it plainly, it is Vue-Native.

I believe students who have paid attention to Weex should have seen the following Weex architecture diagram.

<img data-src="//img.alicdn.com/tfs/TB1EITwPXXXXXaCaXXXXXXXXXXX-852-566.png" class="lazyload" />

Looking at the picture and speaking is like this:

1. The transform tool in weex-toolkit converts the .we file we wrote into JS Bundle, and then deploys the JS Bundle to Server.
2. JS Framework in Weex SDK gets JS Bundle and executes it, performs instance initialization work on it, and simultaneously performs data binding, template compilation, and provides callNative and callJS methods.
3. JS Framework and native communicate through these two methods callNative and callJS, jointly relying on the same JSON configuration table (this time you can associate with the implementation principle of RN)

**The work done by Transform** is actually converting DSL into a JSON-like tree structure, and aggregating and combining it into a JavaScript AMD module, facilitating subsequent processing by JS Framework. Can see the work done by transform from the figure below:

<img data-src="//img.alicdn.com/tfs/TB1_hLfPXXXXXbgaVXXXXXXXXXX-2880-1800.jpg" src="{{site.defaultImage}}" class="lazyload img-zoom" />

The left part above is actually a DSL, a domain-specific language, which can directly use concepts in its object domain, focusing on describing the "What" part, without having to describe "How" (How).

> A domain-specific language (DSL) is a computer language specialized to a particular application domain.

**JS Framework** initialization of an instance involves the following process, see [**vanilla/index.js**](https://link.zhihu.com/?target=https%3A//github.com/alibaba/weex/blob/master/html5/vanilla/index.js) for details

<img data-src="//img.alicdn.com/tfs/TB1CjTtPXXXXXa0apXXXXXXXXXX-1268-630.png" class="lazyload" />

People who see here must love learning.....

<img data-src="//img.alicdn.com/tfs/TB1Hc6BPXXXXXa1aXXXXXXXXXXX-400-361.png" class="lazyload" />

## **Weex Others**

**1. Why not use scroller ?**

Why not recommend using scroller? Native students must know ScrollView in Android and UIScrollView in Ios. See the picture for details:

<img data-src="//img.alicdn.com/tfs/TB1dgbFPXXXXXbDXVXXXXXXXXXX-1344-516.png" class="lazyload" />

You can imagine the things in scroller as a big sub-View. If the list is too long, it can be imagined that the completion of first screen rendering and interface operability need to wait until all lists are loaded before use. No memory recovery, undoubtedly will cause certain impact on performance and experience.

**2. Why use list ?**

Why use list? The reason is that this component only renders visible area, and can perform memory reuse at the same time.

<img data-src="//img.alicdn.com/tfs/TB1ObPUPXXXXXasXFXXXXXXXXXX-1168-824.png" class="lazyload" />

If it is still not very easy to understand, you can look at the principle diagram of UITableView in Ios:

<img data-src="//img.alicdn.com/tfs/TB1eSL4PXXXXXaPXXXXXXXXXXXX-1914-1485.jpg" class="lazyload" />

**UITableView control uses cell to display data. A cell corresponds to a row, but cell and row are not exactly the same. First cell is a view. The number of cells is determined by the number of rows that can be seen at a certain moment. When a row of data is moved up and moved out of the screen and becomes invisible, cell will be reused, and then used to display those row data newly appearing on the screen.**

list is only suitable for vertical long list rolling scenarios, but if horizontal rolling is needed, scroller must be used.

**3. Weex App**

Weex can now also generate APP like RN. See [**weexteam/weex-hackernews**](https:/github.com/weexteam/weex-hackernews) for details. The following is my running result, truly achieving one code running in multiple places.

<img data-src="//img.alicdn.com/tfs/TB1cpfCPXXXXXbWaXXXXXXXXXXX-2822-1708.jpg" class="lazyload" />

**4. Weex-x**

People writing RN might laugh at people writing Weex, "See how you handle complex data management stuff? 👹👹". RN developers can achieve good state management through Redux. weex actually can too. Try [**Jinjiang/weex-x**](https://link.zhihu.com/?target=https%3A//github.com/Jinjiang/weex-x). Can see corresponding data flow management from the following example.

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

**5. Weex Vue 2.0** **Looking forward to it..........**

**End. Welcome everyone to point out any incorrect descriptions or unclear places.**
