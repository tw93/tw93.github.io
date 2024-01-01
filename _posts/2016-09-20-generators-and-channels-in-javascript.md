---
layout: post
title: Generators and Channels in JavaScript
date: 2016-09-20 21:47:29
summary: 以下这篇文章是对 Generator 和 Channel 的一个介绍，如果你对 Promise，Generator，Coroutine 和 Channel 有过了解，可以直接跳到 Using Generators and Channels with React 这部分，虽然接下来这些案例可能不是很适合真实的项目环境，但是它可以看成一个起点，尝试通过这种方法来实践可能出现的地方 ...
categories: Study
---

![]({{ site.assetUrl }}1-smaK057Fp29kcTJPN5DdCg%20%281%29.png)

原文来自：[Generators and Channels in JavaScript](https://medium.com/javascript-inside/generators-and-channels-in-javascript-594f2cf9c16e#.pvgt62ocb)

### 简介

以下这篇文章是对 Generator 和 Channel 的一个介绍，如果你对 Promise，Generator，Coroutine 和 Channel 有过了解，可以直接跳到 Using Generators and Channels with React 这部分，接下来这些代码可能不能直接用于实际生产环境，但是它应该被看成一个起点，可以尝试把这种方案用在可以用到的地方。

稍微花点时间看看这个 listen 函数。
{% highlight javascript %}
const listen = (el, type) => {
  const ch = chan()
  el.addEventListener(type, e => putAsync(ch, e))
  return ch
}
{% endhighlight %}

它会将每个在 Dom 元素上面的事件转换一个 Channel，我们可以从这个基础点开始。

### Why Generators and Channels?

在我们学习 Generator，Coroutine 和 Channel 之前，先了解下常规的 Promise。
{% highlight javascript %}
function getUsers() {
 return new Promise((resolve, reject) => {
  setTimeout(() => {
   resolve({
    users: [{
     id: 1,
     name: 'test'
    }]
   })
  }, 1000)
 })
}
{% endhighlight %}

当 getUsers 函数成功时候会返回一个 Promise 对象，Promise 的 resolves 会携带着必要的数据。同时我们能很好的处理超过一个 Promise 的情况，或者一个 Promise 依赖于另外一个 Promise 和一个操作需要所有的 Promise 一起运行才能解决问题的情况，以上这两种情况，其实标准的 Promise 实现就可以覆盖到。第一种链式情况可以使用 Promise 的 then 实现，后一种可以使用 Promise.all 来实现。

Promise 可以被看成是回调（回调地狱）的一种更加简洁的替换方案，假如你不清楚什么是回调地狱，可以看看下面的代码。
{% highlight javascript %}
asyncCallOne(() => {
    asyncCallTwo(() => {
        asyncCallThree(() => {
            asyncCallFour(() => {
                asyncCallFive(() => {
                  // do something here...
                })
            })
        })
    })
})
{% endhighlight %}

当我们处理不是很复杂代码的时候用嵌套函数看起来还不错，但是嵌套代码不利于扩展和维护，这里有一种更好的方式从一开始就可以避免回调地狱，就是使用 Promise，它可以有效地避免回调嵌套，还可以更好的处理异常。
{% highlight javascript %}
asyncCallOne(() => { // do some something... } )
    .then(asyncCallTwo)
    .then(asyncCallThree)
    .then(asyncCallFour)
    .then(asyncCallFive)
    .catch(() => {
        // handle any errors that happened a long the way
    })
{% endhighlight %}

在运行所有的异步函数后再来使用 Then 也是可以的。
{% highlight javascript %}
Promise.all([
     asyncCallOne,
     asyncCallTwo,
     asyncCallThree
    ]).then(values => {
      // do something with the values...
    });
{% endhighlight %}

现在我们已经复习了一下 Callback 和 Promise 的基本用法，接下来可以介绍下 ES6 中的 Generator。

### Generator

在我们讲 what,why,how 之前，我们可以先看看 Generator 简短定义。

> “Generators are functions that can be paused and resumed, which enables a variety of applications.”

([http://www.2ality.com/2015/03/es6-generators.html](<(http://www.2ality.com/2015/03/es6-generators.html)>))

为了快速的总结 Generator，它们可以使我们通过调用在一个迭代器对象上面调用 yield 和通过 next 获取到值生成一个值的序列。

这一小段很基础的代码可以用来示范怎么使用 Generator。
{% highlight javascript %}
function* getNumbers() {
  yield 1
  yield 5
  yield 10
}
// retrieving
const getThoseNumbers = getNumbers()
console.log(getThoseNumbers.next()) // {value:1, done:false}
console.log(getThoseNumbers.next()) // {value:5, done:false}
console.log(getThoseNumbers.next()) // {value:10, done:false}
console.log(getThoseNumbers.next()) // {value:undefined, done:true}
{% endhighlight %}

我们可以通过 Generator 来做迭代，也可以用它们用来 observe 数据，同时也很适合 lazy evaluation 和 control flow。

这儿有一组关于如何从 Generator 获取值的例子，最后一个还展示了如何通过 reduce 获取数据。
{% highlight javascript %}
// iterate
for (let i of getNumbers()) {
console.log(i) // 1 5 10
}
// destructering
let [a, b, c] = getNumbers()
console.log( a, b, c) // 1 5 10
// spread operator
let spreaded = [...getNumbers()]
console.log(spreaded) // [1, 5, 10]
// even works with reduce
// Ramda reduce for example
const reducing = reduce((xs, x) => [...xs, x], [], getNumbers())
console.log(reducing) // [1, 5, 10]
{% endhighlight %}

此外 Generator 可以让我们通过 next 传递数据，比较奇葩的是第一个 next 只会开启这个迭代，第二个 next 才可以取到正常的值，此例子可以很好说明地上面问题。
{% highlight javascript %}
function\* setGetNumbers() {
const input = yield
yield input
}
const setThoseNumbers = setGetNumbers()
console.log(setThoseNumbers.next(1)) //{value:undefined, done:false}
console.log(setThoseNumbers.next(2)) //{value: 2, done: false}
console.log(setThoseNumbers.next()) //{value: undefined, done: true}
{% endhighlight %}

从上面的输出我们可以看到，第一个 next 是可以忽略的，仅仅从第二个 next 开始考虑就好。

终止一个 Generator 是很简单的，只需要在 Generator 里面定义一个 return 就好。同时，这里还有一个很好的特性，Generator 函数可以调用其他的 Generator 函数。

{% highlight javascript %}
function*callee() {
  yield 1
}
function* caller() {
  while (true) {
    yield* callee();
  }
}
const callerCallee = caller()
console.log(callerCallee.next()) // {value: 1, done: false}
console.log(callerCallee.next()) // {value: 1, done: false}
console.log(callerCallee.next()) // {value: 1, done: false}
console.log(callerCallee.next()) // {value: 1, done: false}
{% endhighlight %}

现在大家应该对 Generator 有一个基础的理解了。
关于 ES6 中 Generator 更详细的的介绍，可以阅读 [Axel Rauschmayer](https://medium.com/u/7fab51e62203)这篇更全面的文章[ES6 Generators in depth](http://www.2ality.com/2015/03/es6-generators.html)。

### Generator, Promise and Coroutine

现在我们已经基本了解 Promise 和 Generator 了，下面我们看看如何将这两者结合起来使用。
{% highlight javascript %}
function fetchUsers() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        users: [{id: 1, title: 'test'}]
      })
    }, 1000)
  })
}
function* getData() {
  const data = yield fetchUsers()
  yield data
}
{% endhighlight %}

显而易见，我们需要一些机制来确保不用手动来运行循环。这就是 Coroutine 发挥作用的地方了，它们可以使我们写能够处理异步的行为，包括 Promise,Thunk 或者其它的 operate，[co](https://github.com/tj/co)就是处理这种情况的一个典型的库。

接下来的代码是对 co 的一种很简单粗糙的实现，但是我们可以从这里看到 co 函数是怎么运行的。
{% highlight javascript %}
function co(fn) {
  const obj = fn()
  return new Promise((resolve, reject) => {
    const run = result => {
      const { value, done } = obj.next(result)
      // check if done and return if finished
      if (done) return resolve(result)
      // retrieve the promise and call next with the result
      value
        .then(res => run(res))
        .catch(err => obj.throw(err))
    }
    // start
    run()
  })
}
{% endhighlight %}

接下来，我们使用简化 co 函数来实现之前 fetch 数据的那个例子。
{% highlight javascript %}
function fetchUsers() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        users: [{id: 1, name: 'test'}]
      })
    }, 1000)
  })
}

function fetchOtherData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        other: [{id: 2, title: 'other data'}]
      })
    }, 1000)
  })
}

const get = co(function* getData() {
  const getAll = yield Promise.all([fetchOtherData(), fetchUsers()])
  // do something else...
  return getAll
}).then(data => console.log(data))
{% endhighlight %}

我们可以看到 Coroutine 能让我们写那种看起来是同步的代码来实现异步，如下
{% highlight javascript %}
const get = co(function* getData() {
  const otherData = yield fetchOtherData()
  console.log('fetched other data: ', otherData)
  const users = yield fetchUsers(otherData)
  console.log('fetched users: ', users)
  return users
}).then(data => console.log(data))
{% endhighlight %}

从上面我们可以看到，通过 Coroutine 这种方式可以用来合并 Generator 和 Promise。这样看起来不错，其实还有一种更好的实现方案，就是使用 Channel 来合并 Generator。

### Generator and Channel

> Don’t combine Generators with Promises, combine them with Channels! -- David Nolen

[(http://swannodette.github.io/2013/08/24/es6-generators-and-csp)](http://swannodette.github.io/2013/08/24/es6-generators-and-csp)

在之前所以处理异步的方法大家基本都知道（比如神奇的 setTimeout），有趣的是 channel 像是事后才给 js 加上去的。Clojure 通过 core.async 以及 Go 通过 goroutines 已经对 channels 提供支持有一段时间了。

这里有很多关于这方面的文章，其中最显著的一篇是 James Longster 的[Taming the Asynchronous Beast with CSP Channels in JavaScript](http://jlongster.com/Taming-the-Asynchronous-Beast-with-CSP-in-JavaScript)这篇文章。通过这篇文章可以对 Channel 有一个更深的理解。

这是我直接从 James Longster 那篇文章中摘抄的一句话：

> Typically channels are useful for coordinating truly concurrent tasks that might run at the same time on separate threads. They are actually just as useful in a single-threaded environment because they solve a more general problem of coordinating anything asynchronous, which is everything in JavaScript.--James Longster

[Taming the Asynchronous Beast with CSP in JavaScript](http://jlongster.com/Taming-the-Asynchronous-Beast-with-CSP-in-JavaScript)

当你阅读 Channel 这个词的时候，你也会经常会看到 CSP ，它的意思是指 Communicating Sequential Processes，我推荐读 David Nolen 的[Communicating Sequential Processes](http://swannodette.github.io/2013/07/12/communicating-sequential-processes)这篇文章对 CSP 有一个更好的理解。

我们将会使用[js-csp](https://github.com/ubolonton/js-csp)这个库来演示使用 Channel 对我们到底有什么好处。

通过 Channel 来进行进程通信，典型的 Channel 常常会提供一组函数，但是到目前为止，我们只需知道 put 和 take 的用法就好，入栈使用 push，通过 take 有一个过程在另一边等待。很快我们将会看到更清晰的细节，首先我们需要考虑的是我们有一个 channel 和 consumer，如下是 js-csp 文档中的简化版例子：

{% highlight javascript %}
const ch = csp.chan(1);
yield csp.put(ch, 42);
yield csp.take(ch); // 42
ch.close()
yield csp.take(ch); // csp.CLOSED
{% endhighlight %}

我们可以创建一个缓冲区大小为 1 的 Channel，接着我们通过前缀 yield 调用 put，将 42 这个值传递到 Channel。接着我们从 Channel 中 take 这个值并最后关闭 Channel，在 Channel 已经关闭后，接下来 yield 不会产生影响。

下面这个例子是直接从 js-csp 文档中拿过来的。
{% highlight javascript %}
var ch = go(function*(x) {
  yield timeout(1000);
  return x;
}, [42]);
console.log((yield take(ch)));
{% endhighlight %}

通过调用 go 我们生成了一个 Goroutine，它会立即返回一个 Channel，使我们通过 take 从 Channel 获取任何值。

为了了解这一切如何和 UI 相搭配，可以看看下面这个 listen 函数。
{% highlight javascript %}
const listen = (el, type) => {
  const ch = chan()
  el.addEventListener(type, e => putAsync(ch, e))
  return ch
}
{% endhighlight %}

我们可以通过使用 listen 将一个元素转换成 channel。可以通过在 channel 上面使用 take 来监听所有的改动。无论我们在 input 框里面输入什么，我们可以通过 channel 获取到改动并更新到显示元素上。

{% highlight javascript %}
go(function*() {
  const input = document.getElementById('title')
  const display = document.getElementById('display')
  const ch = listen(input, 'keyup')
  while(true) {
    const e = yield take(ch)
    display.innerHTML = `From Input: ${e.target.value}`
  }
})
{% endhighlight %}

### Using Generators and Channels with React

到目前为止，已经将基础部分介绍完毕，同时对为什么 Channel 和 Generator 在 Javascript 中有意义有一个更深的理解，我们可以将学到 Channel 和 Generator 用到实际代码情景中。

一个经典的例子就是计数器组件，虽然很基础，只能够增加和减少数字并将当前数字显示出来，但是通过这个可以帮助我们对 React 渲染 Component 获得更清晰的认识。

你可以从 [Stefan Oestreicher](https://medium.com/u/749b96458fd8)的[React/Elm-Architecturezh](https://github.com/steos/elmar.js/blob/master/src/examples/SimpleCounter.js)中获得完整代码。

AppStart 用来处理顶层 React Component 的初始化渲染，和开启一个用来等待任何在 AppChannel 上的更新的 Goroutine。

AppChannel 是一个没有任何缓冲或其他特殊性的函数。所以我们可以做的是一旦有一个 event 引发了一个 action 变化，我们在 AppChannel 使用 put 方法都获取到。

{% highlight javascript %}
// basic example demonstrating the power of channels and generators
import React from 'react'
import { render } from 'react-dom'
import { chan, go, take, put, putAsync } from 'js-csp'
import { curry } from 'ramda'
import Counter from './Counter'
// helper
const createRender = curry((node, app) => render(app, node))
// create one channel for now
const AppChannel = chan()
const doRender = createRender(document.getElementById('mountNode'))
// let start
const AppStart = ({ init, update, view }) => {
    let model = 0
    const signal = action => () => {
        model = update(action, model)
        putAsync(AppChannel, model)
    }
    // initial render...
    putAsync(AppChannel, init(model))
    go(function* () {
        while(true) {
            doRender(view(signal, yield take(AppChannel)))
        }
    })
}
// start
AppStart(Counter)
{% endhighlight %}

现在我们有一个基础的例子已经启动在运行中，还可以在上面做一些复杂的事情，例如 fetch 操作。我们可以创建一个简单列表，可以从其他资源地方 fetch 获取数据，一旦 state 发生变化后，重新渲染结果。为了完成此任务，同时为了更好的体验将传递一个 loading 信息给用户。

上面这个需求，我们需要单独的处理 Action 和 Channel，同时也需要在一个干净的、良好组织下的代码下处理其一些额外的情况。

#### Building the App…

实际上我们需要定义一个函数来处理 fetch 操作和通知 loading 什么时候开启和结束。

{% highlight javascript %}
const getItems = () => {
  go(function*() {
    yield put(isLoading, true)
    const fetchedItems = yield* fetchItems()
    yield put(items, fetchedItems)
    yield put(isLoading, false)
  })
}
{% endhighlight %}

编写一个创建 Channel 的函数。
{% highlight javascript %}
const createChannel = (action, store) => {
  const ch = chan()
  go(function* () {
    while(true) {
      const value = yield take(ch)
      yield put(AppChannel, action(store.get(), value));
    }
  })
  return ch
}

// helper function for passing an object and getting channels
const createChannels = (actions, store) =>
  mapObjIndexed(fn => createChannel(fn, store), actions)
{% endhighlight %}

现在已经有 createChannel 了，我们还需定义一组 Action。
{% highlight javascript %}
const Actions = {
  isLoading: (model, isLoading) =>
    assoc('isLoading', isLoading, model),
  items: (model, items) => assoc('items', items, model),
  addItem: (model, title) =>
    assoc('items',
      [ ...prop('items', model),
        {title, id: getNextId(prop('items', model))}
      ],
      model),
}
{% endhighlight %}

接下来我们写 App 的 Component 部分，这里没什么特殊的，仅仅就是一个 list 和两个 button 和一个 input，第一个 button 用于获取列表数据，另外一个用于添加文本到 input 里。
{% highlight javascript %}
const App = ({ items, isLoading }) => {
  if (isLoading) return (<p>loading...</p>)
  return (
    <div>
      <h2>Random Items List</h2>
      <ul>
        {items.map(item => (
          <li key={item.id} >{item.title}</li>
        ))}
      </ul>
      <input type='text' id='add' />
      <button onClick={() => putAsync(addItem, findText())}>
        Add Item
      </button>
      <button onClick={() => getItems()}>LoadItems</button>
    </div>
  )
}
{% endhighlight %}

现在已经基本上写好了，类似于我们之前这样，创建一个 AppStart 函数，同时它还希望有一个 component 和一个类型 store。store 就是一个用于存放 getter 和 setter 的简单对象。

{% highlight javascript %}
const AppStart = (Component, store) => {
  // initial render...
  putAsync(AppChannel, store.get())
  go(function* () {
    while(true) {
      store.set(yield take(AppChannel))
      doRender(<Component {...store.get() } />)
    }
  })
}
{% endhighlight %}

现在我们需要做的是为先前定义的 Actions 创建我们的 Channels。

{% highlight javascript %}
const { isLoading, items, addItem } = createChannels(Actions, store)
{% endhighlight %}

我们在 return 中获得一个 isLoading，一个 items 和一个 addItem 的 channel，现在我们可以通过 channel 来更新我们的状态，还有需要注意的是，AppChannel 被称为一个只处理最新值的滑动缓冲。
{% highlight javascript %}
// create App channel... and render function
const AppChannel = chan(buffers.sliding(1))
const doRender = createRender(document.getElementById('mountNode'))
{% endhighlight %}

最后我们只需要调用 AppStart 就好了。
{% highlight javascript %}
AppStart(App, store)
{% endhighlight %}

以上只是一个快速的案例来解释 React 怎么结合 Channel 一起使用，我们需要更多的时间来思考和验证这种方案怎么弄才对于我们有什么好处。

通过之前那节中的 listen 函数，我们怎么将一个元素转换成一个 Channel，从而抛砖引玉，引出其他的想法，包括对 window 的反应，改变你的 App 的结构，样式或布局。

以上提供的例子可以看成一个使用该新特性可能性的新起点。

### 总结

这是一篇介绍 Generator 和 Channel 的文章，我们任然缺少一些重要的部分，比如 Transducer，接下来的文章将会覆盖 Channels 和 Transducer，包括更多使用 React 的例子。

#### 更新

目前已经发布[Introduction into Channels and Transducers in JavaScript](https://medium.com/javascript-inside/introduction-into-channels-and-transducers-in-javascript-a1dfd0a09268#.nfmcntwy7) 。

### Links

[ES6 Generators in depth](http://www.2ality.com/2015/03/es6-generators.html)

[ES6 Generators Deliver Go Style Concurrency](http://swannodette.github.io/2013/08/24/es6-generators-and-csp)

[Callbacks vs. Coroutines](https://medium.com/@tjholowaychuk/callbacks-vs-coroutines-174f1fe66127#.ysrbpx5nb)

[js-csp](https://github.com/ubolonton/js-csp)

[Taming the Asynchronous Beast with CSP in JavaScript](http://jlongster.com/Taming-the-Asynchronous-Beast-with-CSP-in-JavaScript)

[Why coroutines won’t work on the web](http://calculist.org/blog/2011/12/14/why-coroutines-wont-work-on-the-web/)

[No promises: asynchronous JavaScript with only generators](http://www.2ality.com/2015/03/no-promises.html)

[CSP and transducers in JavaScript](http://phuu.net/2014/08/31/csp-and-transducers.html)

[core.async](https://github.com/clojure/core.async/)

[Communicating Sequential Processes](http://swannodette.github.io/2013/07/12/communicating-sequential-processes)

[CSP is responsive design](http://swannodette.github.io/2013/07/31/extracting-processes)

[A Study on Solving Callbacks with JavaScript Generators](http://jlongster.com/A-Study-on-Solving-Callbacks-with-JavaScript-Generators)
