---
layout: post
title: Reading Notes on "Pro Node.js"
date: 2015-03-01 08:47:29
summary: "Today I finally finished learning \"Pro Node.js\" (深入浅出 Node.js) written by Mr. Pu Ling. This book is not a simple Node introductory book. It does not stay at the level of Node introduction or usage of frameworks and libraries, but reveals Node's own internal characteristics and structure from different perspectives. It is recommended for students who have a certain Node foundation or have done small projects in Node. After reading it, your thinking will have very peculiar collisions. When I read it, I often had such thoughts: \"Oh, so this function is implemented like this\". The following article is some learning records of my second reading of \"Pro Node.js\", and draw mind maps through the Baidu mind map tool, writing my learning summary under this article every day ..."
categories: Study
---

Today I finally finished learning "Pro Node.js" (深入浅出 Node.js) written by Mr. Pu Ling. This book is not a simple Node introductory book. It does not stay at the level of Node introduction or usage of frameworks and libraries, but reveals Node's own internal characteristics and structure from different perspectives. It is recommended for students who have a certain Node foundation or have done small projects in Node. After reading it, your thinking will have very peculiar collisions. When I read it, I often had such thoughts: "Oh, so this function is implemented like this". The following article is some learning records of my second reading of "Pro Node.js", and draw mind maps through the [Baidu mind map](http://naotu.baidu.com/){:target="_blank"} tool, writing my learning summary under this article every day.

**If the picture text is too small, you can right-click to open the picture from a new tab, and then click to enlarge it.**
**_Added mind map addresses for original files, so everyone can go directly to the mind map to see the mind map_**

### Introduction to Node

This chapter briefly introduces Node, from which you can understand the development process of Node and its impact and value.

Why call it Node? Initially, Ryan Dahl called his project web.js, which was a Web server. But the development of the project exceeded his original idea of simply developing a Web server, becoming a basic framework for building network applications. In this way, more things can be built on its basis, such as servers, clients, command line tools, etc. Node developed into a single-threaded, single-process system that mandatorily does not share any resources, including libraries very suitable for networks, providing infrastructure for building large distributed applications. Its goal is also to become a platform for building fast, scalable network applications. It is very simple itself, organizing many Nodes through communication protocols, and it is very easy to achieve the purpose of building large network applications through expansion. **Every Node process constitutes a node in this network application, which is the true meaning contained in its name.** [Mind Map](http://naotu.baidu.com/viewshare.html?shareId=atyzcu65ssw8){:target="_blank"}

![Introduction to Node]({{ site.assetUrl }}Node1.png){:class="img-zoom"}

### Module Mechanism

This chapter mainly introduces Node's module mechanism, learning how Node implements CommonJS module and package specifications. In this chapter, we explained in detail the compilation and loading rules of modules in the process of reference. In addition, we can also read deeper about the organization structure of Node's own source code.
CommonJS specification customized a beautiful vision for JavaScript --- hoping that JavaScript can run anywhere. [Mind Map](http://naotu.baidu.com/viewshare.html?shareId=au9i3m5vx0gk){:target="_blank"}
![Node Module Mechanism]({{ site.assetUrl }}Node2.png){:class="img-zoom"}

### Asynchronous I/O

This chapter shows the reasons why we take asynchronous I/O as the main design concept in Node. In addition, the detailed implementation process of asynchronous I/O will also be introduced.
The event loop is the core of asynchronous implementation, which is basically consistent with the execution model in browsers. Compared to the ancient [Rhino](https://developer.mozilla.org/zh-CN/docs/Mozilla/Projects/Rhino){:target="_blank"}, although it is a JavaScript runtime that could run on servers earlier, the execution model does not adopt event-driven like browsers, but uses synchronous I/O as the main model like other languages, which makes it unable to exert in performance. **It is by building a complete set of high-performance asynchronous I/O framework that Node broke the situation of JavaScript standing still on servers.** [Mind Map](http://naotu.baidu.com/viewshare.html?shareId=au9i4efc4u0w){:target="_blank"}

![Node Asynchronous I/O]({{ site.assetUrl }}Node3.png){:class="img-zoom"}

### Asynchronous Programming

This chapter mainly introduces asynchronous programming, including introductions to common asynchronous programming problems and detailed solutions. In this chapter, we can come into contact with how Promise, events, and high-order functions perform flow control. (Suggest reading the book for this chapter) [Mind Map](http://naotu.baidu.com/viewshare.html?shareId=au9i54fq5q80){:target="_blank"}
![Node Asynchronous Programming]({{ site.assetUrl }}Node4.png){:class="img-zoom"}

### Memory Control

This chapter mainly introduces Node's memory control. Main contents include details of garbage collection, memory limits, viewing memory, memory leaks, large memory applications, etc.
Node moved the main application scenarios of JavaScript to the server side. Corresponding details to be considered are also different from the browser side. On the server side, resources have always been extremely precious. Serving massive users makes everything must be efficiently recycled and reused. It is necessary to make arrangements for every resource more rigorously. [Mind Map](http://naotu.baidu.com/viewshare.html?shareId=au9r3m20x0gg){:target="_blank"}

![Node Memory Control]({{ site.assetUrl }}Node5.png){:class="img-zoom"}

### Understanding Buffer

This chapter mainly introduces Buffer, which cannot be encountered in front-end JavaScript. Since frequent network and disk I/O are involved in Node, processing byte stream data will be a very common behavior. This part of the scenario is completely different from pure front-end development.
After experiencing JavaScript friendly string operations, some developers may form a mind-set, understanding Buffer as a string. But there is a substantial difference between string and Buffer, that is, Buffer is binary data, and there is an encoding relationship between string and Buffer. Therefore, understanding many details of Buffer is very necessary and very useful for how to efficiently process binary. [Mind Map](http://naotu.baidu.com/viewshare.html?shareId=au9r8oahp0c0){:target="_blank"}
![Understanding Buffer]({{ site.assetUrl }}Node6.png){:class="img-zoom"}

### Network Programming

This chapter introduces TCP, UDP, HTTP programming supported by Node, and also talks about introductions to Websocket, TSL, and HTTPS.
Utilizing Node can very conveniently build network servers. It doesn't need a dedicated Web server as a container, only a few lines of code can build a server. Node provides net, dgram, http, https these 4 modules, respectively used to process TCP, UDP, HTTP, HTTPS, suitable for server and client sides. [Mind Map](http://naotu.baidu.com/viewshare.html?shareId=atyz5qrrmbcw){:target="_blank"}

![Node Network Programming]({{ site.assetUrl }}Node7.png){:class="img-zoom"}

### Building Web Applications

This chapter mainly introduces most technical details used in the process of building Web applications, such as data processing, routing, MVC, templates, RESTful, etc.
I think this chapter has a very guiding role for us to develop a Nodejs application. Organizing the details of this chapter can complete a functional Web development framework. The purpose of this chapter is also to hope that readers after learning this chapter can bring map-like inspiration to Node development, and have an outline in mind when developing Web applications, knowing fine details. [Mind Map](http://naotu.baidu.com/viewshare.html?shareId=au9r5vt0lkkc){:target="_blank"}

![Building Web Applications]({{ site.assetUrl }}Node8.png){:class="img-zoom"}

### Mastering Processes

This chapter mainly introduces Node's multi-process technology, and how to improve application availability and performance through multi-process methods. In a strict sense, Node is not a true single-threaded architecture. In Chapter 3 we also stated that Node itself still has some I/O threads existing. These I/O threads are handled by the underlying libuv. This part of the threads is transparent to JavaScript developers, and only focused on during C++ extension development. JavaScript code always runs on V8 and is single-threaded. This chapter will center on the JavaScript part, so underlying details discussion is shielded. [Mind Map](http://naotu.baidu.com/viewshare.html?shareId=au9r6aoa5bks){:target="_blank"}
![Mastering Processes]({{ site.assetUrl }}Node9.png){:class="img-zoom"}

### Testing

This chapter mainly introduces unit testing and performance testing techniques for Node. The meaning of testing lies in that before users consume the produced code, developers consume it first, giving it important quality assurance.
Testing includes unit testing, performance testing, security testing and functional testing, etc. This chapter will introduce unit testing and performance testing from the perspective of Node practice. [Mind Map](http://naotu.baidu.com/viewshare.html?shareId=au9r6j3xqfsc){:target="_blank"}
![Testing]({{ site.assetUrl }}Node10.png){:class="img-zoom"}

### Productionalization

"The last ten miles of a hundred-mile journey are half of the way." Only after finishing the code writing of product development is the first step of the project completed. This chapter introduces details needing attention for productionalizing Node, such as project engineering, code deployment, logging, performance, monitoring and alarm, stability, and heterogeneous coexistence.
For Node developers, many roads traveled by other languages need to be re-practiced by developers with Node features. This is not a bad thing. Node being closer to the bottom layer makes developers' controllability over details very high. [Mind Map](http://naotu.baidu.com/viewshare.html?shareId=au9tg4f38wkw){:target="_blank"}
![Productionalization]({{ site.assetUrl }}Node11.png){:class="img-zoom"}
