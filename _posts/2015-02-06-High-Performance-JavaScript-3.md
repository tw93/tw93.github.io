---
layout: post
title: JavaScript 的 DOM 编程性能优化
date: 2015-02-06 21:47:29
summary: DOM 是 Document Object Model 的缩写，中文叫做文档对象模型，是一个与语言无关的，用户操作 XML 和 HTML 文档的应用程序接口。在浏览器中，主要与HTML文档打交道，在 Web 应用中也经常需要检索XML文档，DOM API用于访问文档中的数据。John Hevatin有一次演讲说过一个贴切的比喻，把 DOM 和 JavaScript 各自想象成一个岛屿，它们直接用收费桥梁连接，ECMAScript 每次访问DOM，都要经过这个桥，并交纳“过桥费”，过的桥越多交的费用也越多，因此要想减少费用就得少过桥，我们这里就来学习如何来优化这个问题 ...
categories: Study
---

DOM 是 Document Object Model 的缩写，中文叫做文档对象模型，是一个与语言无关的，用户操作 XML 和 HTML 文档的应用程序接口。在浏览器中，主要与 HTML 文档打交道，在 Web 应用中也经常需要检索 XML 文档，DOM API 用于访问文档中的数据。John Hevatin 有一次演讲说过一个贴切的比喻，把 DOM 和 JavaScript 各自想象成一个岛屿，它们直接用收费桥梁连接，ECMAScript 每次访问 DOM，都要经过这个桥，并交纳“过桥费”，过的桥越多交的费用也越多，因此要想减少费用就得少过桥，我们这里就来如何来优化这个问题。

#### 最小化 DOM 访问次数，尽可能在 JavaScript 端处理

- 访问 DOM 元素是有代价的--前面提到的过桥费。修改元素则更加昂贵，因为它会导致浏览器重新计算页面的集合变化。
- 也就是说访问 DOM 次数越多，代码的运行速度就越慢，因此一般的经验法则是：减少 DOM 的访问次数，把运算尽量留在 ECMAScript 这一段处理。

{% highlight javascript %}
 //最坏的情况是在循环中访问和修改元素
 //尤其是对 HTML 元素集合循环操作。
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

#### 多次访问 DOM 节点，使用局部变量存储它的引用

这些方法返回值是一个集合

- document.getElementByName()
- document.getElementByClassName()
- document.getElementByTagName()

下面属性也同样返回 HTML 集合

- document.images
- document.links
- document.forms
- document.forms[0].elements

这些集合是一些昂贵的东西，一般来说，对于任何类型的 DOM 访问，当同一个 DOM 属性或方法需要多次访问时候，最好把一个局部变量缓存此成员。<span class="orange">当遍历一个集合时，首先优化原则是把集合存储在局部变量中，并把 length 缓存在循环外部，然后使局部变量访问这些需要多次访问的元素。</span>

#### 使用速度最快的 API

浏览器提供了一个名为<span class="orange">querySelectorAll()的原生 DOM 方法</span>，这种方法自然比使用 JavaScript 和 DOM 来遍历查找元素要快很多。

{% highlight javascript %}
//查找 id="menu"的元素中的所有 a 元素
//我们习惯做法
var elements=document.getElementById('menu').getElementsByTagName('a');

//建议做法
var elements=document.querySelectAll('#menu a')；
{% endhighlight %}

还有一个遍历方法--<span class="orange">querySelector()</span>来获取第一个匹配的节点。

#### 留意重绘和重排

好吧我之前一直没有听过重绘和重排，书上是这么讲的。
浏览器下载完页面中所有组件--HTML 标记、JavaScript、CSS、图片--之后会解析并生成两个内部数据结构：

- DOM 树：表示页面结构
- 渲染树：表示 DOM 节点如何显示

一旦 DOM 和渲染树构建完成，浏览器就开始显示（绘制）页面元素了，当 DOM 的变化影响的元素的<span class="orange">几何属性（宽或高）</span>，比如修改边框宽度或给段落增加元素，导致行数增加--浏览器需要重新计算元素的集合属性，同样其他元素的几何属性和位置也会因此受到影响，浏览器会使渲染树中受到影响的部分失效，并重新构造渲染树。这个过程就称为“<span class="orange">重排(reflow)</span>”。完成重排后，浏览器重新绘制受影响的部分到屏幕中，这个过程就叫做<span class="orange">重绘(repaint)</span>

重排和重绘操作都是代缴昂贵的操作，应当减少发生，为了减少发生次数，应当合并 DOM 和样式的修改，然后一次性处理掉。还可以通过缓存布局信息的方法：尽量减少布局信息的获取次数，获取后把它赋值给局部变量，然后再操作局部变量。
