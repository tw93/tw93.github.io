---
layout: post
title: Hello Weex
poem: 海闊憑魚躍，天高任鳥飛
date: 2017-01-06 16:00:00
summary: This week I gave an internal sharing on "Hello Weex" to my department colleagues, and adapted it into an article for anyone following Weex development. It covers Modules vs. Components, Weex Architecture, and best practices.
categories: Share
---

<img src="http://img.alicdn.com/tfs/TB1qlHxPXXXXXaFaXXXXXXXXXXX-2880-1800.jpg" loading="lazy" decoding="async" />

This week I gave an internal sharing on "Hello Weex" to my department colleagues, and adapted it into an article for anyone following Weex development:

1. Module && Component
2. Weex Architecture
3. Weex Best Practices

*Confidential internal information has been removed.* Let's dive in.

## **Module && Component**

The distinction between a Module and a Component is often a point of confusion. Standard definitions from computer science distinguish them as follows:

> Module: An implementation unit of software that provides a coherent set of responsibilities.
> Component:A component is a reusable building block that can be combined with other components in the same or other computers in a distributed network to form an application.

<img src="http://img.alicdn.com/tfs/TB1T6zwPXXXXXa2aXXXXXXXXXXX-440-317.png" loading="lazy" decoding="async" />

Roughly meaning, Module refers to the implementation unit of software that provides a coherent set of responsibilities; Component is a reusable program building block that can be combined with other components in the same or other computers in a distributed network to form an application.

The above explanations are more biased towards computer science level.

In the article [Thinking about the concepts of "Module" and "Component" in front-end development · Issue #21 · hax/hax.github.com\*\*](https://github.com/hax/hax.github.com/issues/21) by [@He Shijun](https://www.zhihu.com/people/3ec3b166992a5a90a1083945d2490d38), it is summarized roughly as follows:

Module refers to the code organization mechanism provided by the programming language. Using this mechanism, the program can be disassembled into independent and general code units. **Biased towards static code structure, Module emphasizes responsibilities more**.

Component refers to functional unit. Its meaning is biased towards runtime structure, and has more complex control. **Core meaning lies in reuse**. Compared with Module, it has higher requirements for dependency.

So in Weex, what exactly are Module and Component? You can first look at what Module and Component in Weex contain.

**Module is a set of APIs that can be called by JS Framework. Some of them can call JS Framework in an asynchronous way.**

<img src="//img.alicdn.com/tfs/TB10Qn_PXXXXXXFXXXXXXXXXXXX-1172-458.png" loading="lazy" decoding="async" />

**Component refers to being visible on the screen, having specific behaviors, being able to be configured with different properties and styles, and being able to respond to user interactions.**

<img src="//img.alicdn.com/tfs/TB1NvfQPXXXXXcLXFXXXXXXXXXX-1322-766.png" loading="lazy" decoding="async" />

## **Weex Architecture**

The official website describes Weex as *"A framework for building Mobile cross-platform UI"*, a lightweight mobile cross-platform dynamic technical solution. Actually, to put it plainly, it is Vue-Native.

Anyone who has looked into Weex has likely come across this architecture diagram:

<img src="//img.alicdn.com/tfs/TB1EITwPXXXXXaCaXXXXXXXXXXX-852-566.png" loading="lazy" decoding="async" />

In brief:

1. `weex-toolkit`'s transform tooling converts `.we` source files into a JS Bundle, which is published to a CDN/server.
2. The JS Framework within the Weex SDK executes the bundle, initializes instances, binds data, compiles templates, and provides bidirectional `callNative` and `callJS` communication channels.
3. The JS Framework and native platform communicate across these channels backed by a synchronized JSON bridge (very similar conceptually to React Native).

**The Transform stage** compiles the high-level DSL into a JSON-like AST and bundles it as an AMD module. The figure below illustrates the transformation:

<img src="//img.alicdn.com/tfs/TB1_hLfPXXXXXbgaVXXXXXXXXXX-2880-1800.jpg" class="img-zoom" loading="lazy" decoding="async" />

The left panel represents a domain-specific language (DSL) that declaratively specifies "what" to render rather than "how".

> A domain-specific language (DSL) is a computer language specialized to a particular application domain.

**JS Framework instance initialization** follows this lifecycle (see [vanilla/index.js](https://github.com/alibaba/weex/blob/master/html5/vanilla/index.js)):

<img src="//img.alicdn.com/tfs/TB1CjTtPXXXXXa0apXXXXXXXXXX-1268-630.png" loading="lazy" decoding="async" />

If you've read this far, you must genuinely love technical deep dives...

<img src="//img.alicdn.com/tfs/TB1Hc6BPXXXXXa1aXXXXXXXXXXX-400-361.png" loading="lazy" decoding="async" />

## **Weex Best Practices**

**1. Why avoid `scroller` for large lists?**

Why recommend against `scroller`? Native mobile engineers will recognize this from Android's `ScrollView` and iOS's `UIScrollView`:

<img src="//img.alicdn.com/tfs/TB1dgbFPXXXXXbDXVXXXXXXXXXX-1344-516.png" loading="lazy" decoding="async" />

You can imagine the things in scroller as a big sub-View. If the list is too long, it can be imagined that the completion of first screen rendering and interface operability need to wait until all lists are loaded before use. No memory recovery, undoubtedly will cause certain impact on performance and experience.

**2. Why use list ?**

Why use list? The reason is that this component only renders visible area, and can perform memory reuse at the same time.

<img src="//img.alicdn.com/tfs/TB1ObPUPXXXXXasXFXXXXXXXXXX-1168-824.png" loading="lazy" decoding="async" />

If it is still not very easy to understand, you can look at the principle diagram of UITableView in Ios:

<img src="//img.alicdn.com/tfs/TB1eSL4PXXXXXaPXXXXXXXXXXXX-1914-1485.jpg" loading="lazy" decoding="async" />

**UITableView control uses cell to display data. A cell corresponds to a row, but cell and row are not exactly the same. First cell is a view. The number of cells is determined by the number of rows that can be seen at a certain moment. When a row of data is moved up and moved out of the screen and becomes invisible, cell will be reused, and then used to display those row data newly appearing on the screen.**

list is only suitable for vertical long list rolling scenarios, but if horizontal rolling is needed, scroller must be used.

**3. Weex App**

Weex can now also generate APP like RN. See [**weexteam/weex-hackernews**](https://github.com/weexteam/weex-hackernews) for details. The following is my running result, truly achieving one code running in multiple places.

<img src="//img.alicdn.com/tfs/TB1cpfCPXXXXXbWaXXXXXXXXXXX-2822-1708.jpg" loading="lazy" decoding="async" />

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
