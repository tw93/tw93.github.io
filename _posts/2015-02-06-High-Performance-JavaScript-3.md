---
layout:     post
title:      JavaScript的DOM编程性能优化
date:       2015-02-06 21:47:29
summary:    DOM是Document Object Model的缩写，中文叫做文档对象模型，是一个与语言无关的，用户操作XML和HTML文档的应用程序接口。在浏览器中，主要与HTML文档打交道，在Web应用中也经常需要检索XML文档，DOM API用于访问文档中的数据。John Hevatin有一次演讲说过一个贴切的比喻，把DOM和JavaScript各自想象成一个岛屿，它们直接用收费桥梁连接，ECMAScript每次访问DOM，都要经过这个桥，并交纳“过桥费”，过的桥越多交的费用也越多，因此要想减少费用就得少过桥，我们这里就来学习如何来优化这个问题。
categories: JavaScript  学习笔记
---
DOM是Document Object Model的缩写，中文叫做文档对象模型，是一个与语言无关的，用户操作XML和HTML文档的应用程序接口。在浏览器中，主要与HTML文档打交道，在Web应用中也经常需要检索XML文档，DOM API用于访问文档中的数据。John Hevatin有一次演讲说过一个贴切的比喻，把DOM和JavaScript各自想象成一个岛屿，它们直接用收费桥梁连接，ECMAScript每次访问DOM，都要经过这个桥，并交纳“过桥费”，过的桥越多交的费用也越多，因此要想减少费用就得少过桥，我们这里就来如何来优化这个问题。

####最小化DOM访问次数，尽可能在JavaScript端处理####

 - 访问DOM元素是有代价的--前面提到的过桥费。修改元素则更加昂贵，因为它会导致浏览器重新计算页面的集合变化。
 - 也就是说访问DOM次数越多，代码的运行速度就越慢，因此一般的经验法则是：减少DOM的访问次数，把运算尽量留在ECMAScript这一段处理。

 {% highlight javascript %} 
 //最坏的情况是在循环中访问和修改元素
 //尤其是对HTML元素集合循环操作。
 //方法一
 function innerHTMLLoop() {
    for (var count = 0; count < 15000; count++) {
        document.getElementById('here').innerHTML += 'a';
    }
 }
//方法二
function innerHTMLLoop() {
    var content = '';
    for (var count = 0; count < 15000; count++) {
        content += 'a';
    }
    document.getElementById('here').innerHTML += content;
}
//显然方法二的实现要好很多
{% endhighlight %}

####多次访问DOM节点，使用局部变量存储它的引用####

这些方法返回值是一个集合
 - document.getElementByName()
 - document.getElementByClassName()
 - document.getElementByTagName()

下面属性也同样返回HTML集合：
 - document.images 
 - document.links 
 - document.forms 
 - document.forms[0].elements 