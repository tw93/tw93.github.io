---
layout: post
title: Generators and Channels in JavaScript
date: 2016-09-20 21:47:29
summary: The following article is an introduction to Generator and Channel. If you have learned about Promise, Generator, Coroutine and Channel, you can skip directly to the Using Generators and Channels with React part. Although these cases may not be very suitable for real project environments, it can be seen as a starting point, try to practice possible places through this method ...
categories: Study
---

![]({{ site.assetUrl }}1-smaK057Fp29kcTJPN5DdCg%20%281%29.png)

Original article from: [Generators and Channels in JavaScript](https://medium.com/javascript-inside/generators-and-channels-in-javascript-594f2cf9c16e#.pvgt62ocb)

### Introduction

The following article is an introduction to Generator and Channel. If you have learned about Promise, Generator, Coroutine and Channel, you can skip directly to the Using Generators and Channels with React part. Although these codes may not be directly used in actual production environments, it should be seen as a starting point, try to use this solution in places where it can be used.

Take a little time to look at this listen function.
{% highlight javascript %}
const listen = (el, type) => {
  const ch = chan()
  el.addEventListener(type, e => putAsync(ch, e))
  return ch
}
{% endhighlight %}

It will convert every event on the Dom element into a Channel. We can start from this basic point.

### Why Generators and Channels?

Before we learn Generator, Coroutine and Channel, let's understand the conventional Promise first.
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

When the getUsers function succeeds, it returns a Promise object. The Promise resolves carry the necessary data. At the same time, we can handle situations with more than one Promise very well, or situations where one Promise depends on another Promise and an operation requires all Promises to run together to solve the problem. The above two situations can actually be covered by standard Promise implementation. The first chain situation can be implemented using Promise's then, and the latter can be implemented using Promise.all.

Promise can be seen as a more concise replacement for callback (callback hell). If you are not sure what callback hell is, you can look at the code below.
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

When we deal with code that is not very complex, using nested functions looks okay, but nested code is not conducive to extension and maintenance. Here is a better way to avoid callback hell from the beginning, which is using Promise. It can effectively avoid callback nesting and can handle exceptions better.
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

It is also possible to use Then after running all asynchronous functions.
{% highlight javascript %}
Promise.all([
     asyncCallOne,
     asyncCallTwo,
     asyncCallThree
    ]).then(values => {
      // do something with the values...
    });
{% endhighlight %}

Now we have reviewed the basic usage of Callback and Promise. Next, we can introduce Generator in ES6.

### Generator

Before we talk about what, why, how, we can first look at the short definition of Generator.

> “Generators are functions that can be paused and resumed, which enables a variety of applications.”

([http://www.2ality.com/2015/03/es6-generators.html](<(http://www.2ality.com/2015/03/es6-generators.html)>))

To quickly summarize Generator, they allow us to generate a sequence of values by calling yield on an iterator object and getting values via next.

This small piece of very basic code can be used to demonstrate how to use Generator.
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

We can do iteration through Generator, and we can also use them to observe data. It is also very suitable for lazy evaluation and control flow.

Here is a set of examples on how to get values from Generator. The last one also shows how to get data through reduce.
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

In addition, Generator allows us to pass data via next. What is weirder is that the first next will only start this iteration, and the second next can get the normal value. This example can illustrate the above problem well.
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

From the output above, we can see that the first next can be ignored, just consider starting from the second next.

Terminating a Generator is very simple, just define a return inside the Generator. At the same time, there is another good feature here, Generator functions can call other Generator functions.

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

Now everyone should have a basic understanding of Generator.
For a more detailed introduction to Generator in ES6, you can read [Axel Rauschmayer](https://medium.com/u/7fab51e62203)'s more comprehensive article [ES6 Generators in depth](http://www.2ality.com/2015/03/es6-generators.html).

### Generator, Promise and Coroutine

Now we have a basic understanding of Promise and Generator. Let's see how to combine the two.
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

Obviously, we need some mechanism to ensure that we don't have to manually run the loop. This is where Coroutine comes into play. They enable us to write code that can handle asynchronous behavior, including Promise, Thunk or other operate. [co](https://github.com/tj/co) is a typical library dealing with this situation.

The following code is a very simple and crude implementation of co, but we can see from here how the co function runs.
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

Next, we use the simplified co function to implement the previous fetch data example.
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

We can see that Coroutine allows us to write asynchronous code that looks like synchronous code, as follows
{% highlight javascript %}
const get = co(function* getData() {
  const otherData = yield fetchOtherData()
  console.log('fetched other data: ', otherData)
  const users = yield fetchUsers(otherData)
  console.log('fetched users: ', users)
  return users
}).then(data => console.log(data))
{% endhighlight %}

From the above we can see that Coroutine can be used to combine Generator and Promise. This looks good. Actually there is a better implementation plan, which is using Channel to combine Generator.

### Generator and Channel

> Don’t combine Generators with Promises, combine them with Channels! -- David Nolen

[(http://swannodette.github.io/2013/08/24/es6-generators-and-csp)](http://swannodette.github.io/2013/08/24/es6-generators-and-csp)

Everyone basically knows all the methods to handle asynchronous before (such as the magical setTimeout). Interestingly, channel seems to be added to js as an afterthought. Clojure via core.async and Go via goroutines have supported channels for a while.

There are many articles about this aspect. One of the most notable is James Longster's [Taming the Asynchronous Beast with CSP Channels in JavaScript](http://jlongster.com/Taming-the-Asynchronous-Beast-with-CSP-in-JavaScript). Through this article, you can have a deeper understanding of Channel.

This is a sentence I copied directly from James Longster's article:

> Typically channels are useful for coordinating truly concurrent tasks that might run at the same time on separate threads. They are actually just as useful in a single-threaded environment because they solve a more general problem of coordinating anything asynchronous, which is everything in JavaScript.--James Longster

[Taming the Asynchronous Beast with CSP in JavaScript](http://jlongster.com/Taming-the-Asynchronous-Beast-with-CSP-in-JavaScript)

When you read the word Channel, you will also often see CSP, which stands for Communicating Sequential Processes. I recommend reading David Nolen's [Communicating Sequential Processes](http://swannodette.github.io/2013/07/12/communicating-sequential-processes) article to have a better understanding of CSP.

We will use the [js-csp](https://github.com/ubolonton/js-csp) library to demonstrate what benefits using Channel really has for us.

Process communication is carried out through Channel. Typical Channel often provides a set of functions, but so far, we only need to know the usage of put and take. Push is used for stack entry, and there is a process waiting on the other side through take. Soon we will see clearer details. First we need to consider that we have a channel and consumer. The following is a simplified example from js-csp documentation:

{% highlight javascript %}
const ch = csp.chan(1);
yield csp.put(ch, 42);
yield csp.take(ch); // 42
ch.close()
yield csp.take(ch); // csp.CLOSED
{% endhighlight %}

We can create a Channel with a buffer size of 1. Then we call put via prefix yield, passing the value 42 to the Channel. Then we take this value from the Channel and finally close the Channel. After the Channel is closed, subsequent yield will not have an effect.

The following example is taken directly from the js-csp documentation.
{% highlight javascript %}
var ch = go(function*(x) {
  yield timeout(1000);
  return x;
}, [42]);
console.log((yield take(ch)));
{% endhighlight %}

By calling go we generated a Goroutine, which will immediately return a Channel, enabling us to get any value from the Channel via take.

To understand how all this works with UI, look at the listen function below.
{% highlight javascript %}
const listen = (el, type) => {
  const ch = chan()
  el.addEventListener(type, e => putAsync(ch, e))
  return ch
}
{% endhighlight %}

We can convert an element into a channel by using listen. All changes can be listened to by using take on the channel. No matter what we input in the input box, we can get changes through the channel and update to the display element.

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

So far, the basic part has been introduced, and at the same time have a deeper understanding of why Channel and Generator make sense in Javascript. We can use the learned Channel and Generator in actual code scenarios.

A classic example is the counter component. Although very basic, only able to increase and decrease numbers and display the current number, but through this can help us gain a clearer understanding of React rendering Component.

You can get the complete code from [Stefan Oestreicher](https://medium.com/u/749b96458fd8)'s [React/Elm-Architecturezh](https://github.com/steos/elmar.js/blob/master/src/examples/SimpleCounter.js).

AppStart is used to handle the initial rendering of the top-level React Component, and start a Goroutine used to wait for any updates on AppChannel.

AppChannel is a function without any buffering or other specificities. So what we can do is once an event triggers an action change, we fetch it using the put method in AppChannel.

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

Now we have a basic example up and running. We can also do some complex things on it, such as fetch operations. We can create a simple list, fetch data from other resources, and re-render the result once the state changes. To complete this task, and for better experience, a loading message will be passed to the user.

For the above requirement, we need to handle Action and Channel separately, and also need to handle some of its extra situations under clean and well-organized code.

#### Building the App…

Actually we need to define a function to handle fetch operation and notify when loading starts and ends.

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

Write a function to create Channel.
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

Now we have createChannel, we also need to define a set of Actions.
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

Next we write the Component part of the App. Nothing special here, just a list and two buttons and an input. The first button is used to get list data, and the other is used to add text to input.
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

Now it is basically written. Similar to before, create an AppStart function. At the same time, it also expects a component and a type store. Store is a simple object used to store getter and setter.

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

Now what we need to do is create our Channels for the previously defined Actions.

{% highlight javascript %}
const { isLoading, items, addItem } = createChannels(Actions, store)
{% endhighlight %}

We get an isLoading, an items and an addItem channel in return. Now we can update our state through channel. Also need to note that AppChannel is called a sliding buffer that only processes the latest value.
{% highlight javascript %}
// create App channel... and render function
const AppChannel = chan(buffers.sliding(1))
const doRender = createRender(document.getElementById('mountNode'))
{% endhighlight %}

Finally we just need to call AppStart.
{% highlight javascript %}
AppStart(App, store)
{% endhighlight %}

The above is just a quick case to explain how React is used in combination with Channel. We need more time to think and verify how to make this solution beneficial to us.

Through the listen function in the previous section, how we convert an element into a Channel, throwing a brick to attract jade, leading to other ideas, including reacting to window, changing the structure, style or layout of your App.

The examples provided above can be seen as a new starting point for the possibility of using this new feature.

### Summary

This is an article introducing Generator and Channel. We are still missing some important parts, such as Transducer. Subsequent articles will cover Channels and Transducer, including more examples using React.

#### Update

Currently released [Introduction into Channels and Transducers in JavaScript](https://medium.com/javascript-inside/introduction-into-channels-and-transducers-in-javascript-a1dfd0a09268#.nfmcntwy7).

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
