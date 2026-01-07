---
layout: post
title: High Performance JavaScript - Rapidly Responding User Interface
date: 2015-02-12 21:47:29
summary: 'There is a saying that makes sense: "If JavaScript runs for whole seconds, then it is very likely that you have done something wrong...", if the interface responds to user input within 100 milliseconds, users will think they are "directly manipulating objects in the interface". More than 100 milliseconds means users feel they have lost contact with the interface. JavaScript and user interface updates run in the same process, so only one thing can be handled at a time. This means that when JavaScript code is running, the user interface cannot respond to input, and vice versa. Efficiently managing the UI thread is to ensure that JavaScript cannot run for too long, lest it affect the user experience. Managing the running time of JavaScript is very important for the performance of Web applications ...'
categories: Study
---

There is a saying that makes sense: "If JavaScript runs for whole seconds, then it is very likely that you have done something wrong...", if the interface responds to user input within 100 milliseconds, users will think they are "directly manipulating objects in the interface". More than 100 milliseconds means users feel they have lost contact with the interface. JavaScript and user interface updates run in the same process, so only one thing can be handled at a time. This means that when JavaScript code is running, the user interface cannot respond to input, and vice versa. Efficiently managing the UI thread is to ensure that JavaScript cannot run for too long, lest it affect the user experience. Managing the running time of JavaScript is very important for the performance of Web applications.

### Browser UI Thread

#### Definition

The process commonly used to execute JavaScript and update the user interface is often called the "Browser UI Thread" (although for all browsers, calling it a "thread" is not necessarily accurate).

#### Working Principle

The UI thread works based on a simple queue system, tasks are saved to the queue until the process is idle. Once idle, the next task in the queue is re-extracted and run. These tasks are either running JavaScript code or executing UI updates, including repaint and reflow. Perhaps the most interesting part of this process is that every input may cause one or more tasks to be added to the queue.

#### Optimization

When all UI thread tasks are executed, the process enters an idle state and waits for more tasks to join the queue. **The idle state is ideal**, because all user interactions will immediately trigger UI updates. If users try to interact with the page while a task is running, not only is there no instant UI update, but even new UI updates may not be created and not be added to the queue. In fact, many browsers will stop adding new tasks to the UI thread when JavaScript is running, which means **JavaScript tasks must finish as soon as possible** to avoid adverse effects on the user experience.

### Browser Restrictions

To ensure that certain malicious code cannot lock the user's browser or computer through non-stop intensive operations, browsers limit the execution time of JavaScript.
Such limits are of two types: call stack size limit (recording the number of statements executed since the script started) and long-running script limit (recording the total duration of script execution).

### Use Timers to Yield Time Slices

Despite your best efforts, it is inevitable that some complex JavaScript tasks cannot be completed in 100 milliseconds or less. At this time, the ideal method is to yield control of the UI thread so that the UI can update.

#### Using Timers

The interaction of timers with the UI thread helps to split long-running scripts into shorter segments. Calling setTimeOut() or setInterval() tells JavaScript to wait for a period of time first, and then add a task to the UI queue.
{% highlight javascript %}
function greeting() {
    alert("hello world");
}
setTimeout(greeting, 250);
//This code will insert a JavaScript task to execute the greeting() function into the UI queue after 250 milliseconds
{% endhighlight %}

**But remember, the second parameter indicates when the task is added to the UI queue, rather than necessarily executing after this time; this task will wait for all other tasks to finish executing before executing.**

### Web Workers (Another new thing I came into contact with)

Since the birth of JavaScript, there has been no way to run code outside the browser UI thread. The Web Workers API has changed this state, it introduces an interface that can run code without taking up the browser UI thread's time.

#### Web Worker Running Environment

- A navigation object, which only includes four attributes: appName, appVersion, user Agent, and platform.
- A location object (same as window.location, but all attributes are read-only).
- A self object, pointing to all worker objects.
- An importScripts() method, used to load JavaScript files used by the Worker.
- All ECMAScript objects, such as: Object, Array, Date, etc.
- XMLHttpRequest constructor.
- setTimeout() and setInterval() methods.
- A close() method, which can stop Worker operation immediately.

Since Web Workers have different global running environments, you cannot create it from JavaScript code. In fact, you need to create a completely independent JavaScript file, which includes the code that needs to be run in the Worker. To create a web worker thread, you must pass in the URL of this JavaScript:
{% highlight javascript %}
var worker=new Worker("code.js");
{% endhighlight %}

#### Communication with Worker

Web page code can pass data to the Worker through the postMessage() method, which accepts one parameter, the data that needs to be passed to the Worker. In addition, the Worker has an onmessage event handler for receiving messages. **The message system is the only way for web pages and Workers to communicate.**
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

//Worker can pass messages back to the page through its own postMessage() method
self.onmessage = function(event) {
    self.postMessage("Hello", event.data + "!");
};
{% endhighlight %}
Note: Only certain types of data can be passed using postMessage().

#### Loading External Files

Workers load external JavaScript files through the importScripts() method, which can receive one or more JavaScript file URLs as parameters. The call to importScripts() is blocking until all files are loaded and executed, then the script continues to run. Since the Worker runs outside the UI thread, this blocking does not affect UI responsiveness.
{% highlight javascript %}
importScripts("file1.js","file2.js");
self.onmessage = function(event) {
    self.postMessage("Hello", event.data + "!");
};
{% endhighlight %}
