---
layout:     post
title:      Generators and Channels in JavaScript
date:       2016-09-20 21:47:29
summary:    以下这篇文章是对Generator和Channel的一个介绍，如果你对Promise，Generator，Coroutine和Channel有过了解，可以直接跳到Using Generators and Channels with React这部分，虽然接下来这些案例可能不是很适合真实的项目环境，但是它可以看成一个起点，尝试通过这种方法来实践可能出现的地方 ...
categories: Technology
---

![]({{ site.assetUrl }}1-smaK057Fp29kcTJPN5DdCg%20%281%29.png)

原文来自：[Generators and Channels in JavaScript](https://medium.com/javascript-inside/generators-and-channels-in-javascript-594f2cf9c16e#.pvgt62ocb)

### 简介

以下这篇文章是对Generator和Channel的一个介绍，如果你对Promise，Generator，Coroutine和Channel有过了解，可以直接跳到Using Generators and Channels with React这部分，接下来这些代码可能不能直接用于实际生产环境，但是它应该被看成一个起点，可以尝试把这种方案用在可以用到的地方。

稍微花点时间看看这个listen函数。
{% highlight javascript %}
const listen = (el, type) => {
  const ch = chan()
  el.addEventListener(type, e => putAsync(ch, e))
  return ch
}
{% endhighlight %}

它会将每个在Dom元素上面的事件转换一个Channel，我们可以从这个基础点开始。

### Why Generators and Channels?

在我们学习Generator，Coroutine和Channel之前，先了解下常规的Promise。
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

当getUsers函数成功时候会返回一个Promise对象，Promise的resolves会携带着必要的数据。同时我们能很好的处理超过一个Promise的情况，或者一个Promise依赖于另外一个Promise和一个操作需要所有的Promise一起运行才能解决问题的情况，以上这两种情况，其实标准的Promise实现就可以覆盖到。第一种链式情况可以使用Promise的then实现，后一种可以使用Promise.all来实现。

Promise可以被看成是回调（回调地狱）的一种更加简洁的替换方案，假如你不清楚什么是回调地狱，可以看看下面的代码。
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

当我们处理不是很复杂代码的时候用嵌套函数看起来还不错，但是嵌套代码不利于扩展和维护，这里有一种更好的方式从一开始就可以避免回调地狱，就是使用Promise，它可以有效地避免回调嵌套，还可以更好的处理异常。
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

在运行所有的异步函数后再来使用Then也是可以的。
{% highlight javascript %}
Promise.all([
     asyncCallOne,
     asyncCallTwo,
     asyncCallThree
    ]).then(values => {
      // do something with the values...
    });
{% endhighlight %}

现在我们已经复习了一下Callback和Promise的基本用法，接下来可以介绍下ES6中的Generator。

### Generator

在我们讲what,why,how之前，我们可以先看看Generator简短定义。

> “Generators are functions that can be paused and resumed, which enables a variety of applications.”

([http://www.2ality.com/2015/03/es6-generators.html]((http://www.2ality.com/2015/03/es6-generators.html)))

为了快速的总结Generator，它们可以使我们通过调用在一个迭代器对象上面调用yield和通过next获取到值生成一个值的序列。

这一小段很基础的代码可以用来示范怎么使用Generator。
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

我们可以通过Generator来做迭代，也可以用它们用来observe数据，同时也很适合lazy evaluation和control flow。

这儿有一组关于如何从Generator获取值的例子，最后一个还展示了如何通过reduce获取数据。
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

此外Generator可以让我们通过next传递数据，比较奇葩的是第一个next只会开启这个迭代，第二个next才可以取到正常的值，此例子可以很好说明地上面问题。
{% highlight javascript %}
function* setGetNumbers() {
  const input = yield
    yield input
}
const setThoseNumbers = setGetNumbers()
console.log(setThoseNumbers.next(1)) //{value:undefined, done:false}
console.log(setThoseNumbers.next(2)) //{value: 2, done: false}
console.log(setThoseNumbers.next()) //{value: undefined, done: true}
{% endhighlight %}

从上面的输出我们可以看到，第一个next是可以忽略的，仅仅从第二个next开始考虑就好。

终止一个Generator是很简单的，只需要在Generator里面定义一个return就好。同时，这里还有一个很好的特性，Generator函数可以调用其他的Generator函数。
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

现在大家应该对Generator有一个基础的理解了。
关于ES6中Generator更详细的的介绍，可以阅读 [Axel Rauschmayer](https://medium.com/u/7fab51e62203)这篇更全面的文章[ES6 Generators in depth](http://www.2ality.com/2015/03/es6-generators.html)。

### Generator, Promise and Coroutine

现在我们已经基本了解Promise和Generator了，下面我们看看如何将这两者结合起来使用。
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

显而易见，我们需要一些机制来确保不用手动来运行循环。这就是Coroutine发挥作用的地方了，它们可以使我们写能够处理异步的行为，包括Promise,Thunk或者其它的operate，[co](https://github.com/tj/co)就是处理这种情况的一个典型的库。

接下来的代码是对co的一种很简单粗糙的实现，但是我们可以从这里看到co函数是怎么运行的。
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

接下来，我们使用简化co函数来实现之前fetch数据的那个例子。
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

我们可以看到Coroutine能让我们写那种看起来是同步的代码来实现异步，如下
{% highlight javascript %}
const get = co(function* getData() {
  const otherData = yield fetchOtherData()
  console.log('fetched other data: ', otherData)
  const users = yield fetchUsers(otherData)
  console.log('fetched users: ', users)
  return users
}).then(data => console.log(data))
{% endhighlight %}

从上面我们可以看到，通过Coroutine这种方式可以用来合并Generator和Promise。这样看起来不错，其实还有一种更好的实现方案，就是使用Channel来合并Generator。

### Generator and Channel

> Don’t combine Generators with Promises, combine them with Channels!   -- David Nolen

[(http://swannodette.github.io/2013/08/24/es6-generators-and-csp)](http://swannodette.github.io/2013/08/24/es6-generators-and-csp)

在之前所以处理异步的方法大家基本都知道（比如神奇的setTimeout），有趣的是channel像是事后才给js加上去的。Clojure 通过 core.async 以及 Go 通过 goroutines 已经对 channels 提供支持有一段时间了。

这里有很多关于这方面的文章，其中最显著的一篇是James Longster的[Taming the Asynchronous Beast with CSP Channels in JavaScript](http://jlongster.com/Taming-the-Asynchronous-Beast-with-CSP-in-JavaScript)这篇文章。通过这篇文章可以对Channel有一个更深的理解。

这是我直接从James Longster那篇文章中摘抄的一句话：

> Typically channels are useful for coordinating truly concurrent tasks that might run at the same time on separate threads. They are actually just as useful in a single-threaded environment because they solve a more general problem of coordinating anything asynchronous, which is everything in JavaScript.--James Longster

[Taming the Asynchronous Beast with CSP in JavaScript](http://jlongster.com/Taming-the-Asynchronous-Beast-with-CSP-in-JavaScript)

当你阅读Channel这个词的时候，你也会经常会看到CSP ，它的意思是指Communicating Sequential Processes，我推荐读David Nolen的[Communicating Sequential Processes](http://swannodette.github.io/2013/07/12/communicating-sequential-processes)这篇文章对CSP有一个更好的理解。

我们将会使用[js-csp](https://github.com/ubolonton/js-csp)这个库来演示使用Channel对我们到底有什么好处。

通过Channel来进行进程通信，典型的Channel常常会提供一组函数，但是到目前为止，我们只需知道put和take的用法就好，入栈使用push，通过take有一个过程在另一边等待。很快我们将会看到更清晰的细节，首先我们需要考虑的是我们有一个channel和consumer，如下是js-csp文档中的简化版例子：

{% highlight javascript %}
const ch = csp.chan(1);
yield csp.put(ch, 42);
yield csp.take(ch); // 42
ch.close()
yield csp.take(ch); // csp.CLOSED
{% endhighlight %}

我们可以创建一个缓冲区大小为1的Channel，接着我们通过前缀yield调用put，将42这个值传递到Channel。接着我们从Channel中take这个值并最后关闭Channel，在Channel已经关闭后，接下来yield不会产生影响。

下面这个例子是直接从js-csp文档中拿过来的。
{% highlight javascript %}
var ch = go(function*(x) {
  yield timeout(1000);
  return x;
}, [42]);
console.log((yield take(ch)));
{% endhighlight %}

通过调用go我们生成了一个Goroutine，它会立即返回一个Channel，使我们通过take从Channel获取任何值。

为了了解这一切如何和UI相搭配，可以看看下面这个listen函数。
{% highlight javascript %}
const listen = (el, type) => {
  const ch = chan()
  el.addEventListener(type, e => putAsync(ch, e))
  return ch
}
{% endhighlight %}

我们可以通过使用listen将一个元素转换成channel。可以通过在channel上面使用take来监听所有的改动。无论我们在input框里面输入什么，我们可以通过channel获取到改动并更新到显示元素上。

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

到目前为止，已经将基础部分介绍完毕，同时对为什么Channel和Generator在Javascript中有意义有一个更深的理解，我们可以将学到Channel和Generator用到实际代码情景中。

一个经典的例子就是计数器组件，虽然很基础，只能够增加和减少数字并将当前数字显示出来，但是通过这个可以帮助我们对React渲染Component获得更清晰的认识。

你可以从 [Stefan Oestreicher](https://medium.com/u/749b96458fd8)的[React/Elm-Architecturezh](https://github.com/steos/elmar.js/blob/master/src/examples/SimpleCounter.js)中获得完整代码。

AppStart用来处理顶层React Component的初始化渲染，和开启一个用来等待任何在AppChannel上的更新的Goroutine。

AppChannel是一个没有任何缓冲或其他特殊性的函数。所以我们可以做的是一旦有一个event引发了一个action变化，我们在AppChannel使用put方法都获取到。

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

现在我们有一个基础的例子已经启动在运行中，还可以在上面做一些复杂的事情，例如fetch操作。我们可以创建一个简单列表，可以从其他资源地方fetch获取数据，一旦state发生变化后，重新渲染结果。为了完成此任务，同时为了更好的体验将传递一个loading信息给用户。

上面这个需求，我们需要单独的处理Action和Channel，同时也需要在一个干净的、良好组织下的代码下处理其一些额外的情况。

#### Building the App…

实际上我们需要定义一个函数来处理fetch操作和通知loading什么时候开启和结束。

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

 编写一个创建Channel的函数。
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

现在已经有createChannel了，我们还需定义一组Action。
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

接下来我们写App的Component部分，这里没什么特殊的，仅仅就是一个list和两个button和一个input，第一个button用于获取列表数据，另外一个用于添加文本到input里。
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

现在已经基本上写好了，类似于我们之前这样，创建一个AppStart函数，同时它还希望有一个component和一个类型store。store就是一个用于存放getter和setter的简单对象。

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

现在我们需要做的是为先前定义的Actions创建我们的Channels。

{% highlight javascript %}
const { isLoading, items, addItem } = createChannels(Actions, store)
{% endhighlight %}

我们在return中获得一个isLoading，一个items和一个addItem的channel，现在我们可以通过channel来更新我们的状态，还有需要注意的是，AppChannel被称为一个只处理最新值的滑动缓冲。
{% highlight javascript %}
// create App channel... and render function
const AppChannel = chan(buffers.sliding(1))
const doRender = createRender(document.getElementById('mountNode'))
{% endhighlight %}

最后我们只需要调用AppStart就好了。
{% highlight javascript %}
AppStart(App, store)
{% endhighlight %}

以上只是一个快速的案例来解释React怎么结合Channel一起使用，我们需要更多的时间来思考和验证这种方案怎么弄才对于我们有什么好处。

通过之前那节中的listen函数，我们怎么将一个元素转换成一个Channel，从而抛砖引玉，引出其他的想法，包括对window的反应，改变你的App的结构，样式或布局。

以上提供的例子可以看成一个使用该新特性可能性的新起点。

### 总结

这是一篇介绍Generator和Channel的文章，我们任然缺少一些重要的部分，比如Transducer，接下来的文章将会覆盖Channels和Transducer，包括更多使用React的例子。

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
