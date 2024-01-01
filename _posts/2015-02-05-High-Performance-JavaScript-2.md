---
layout: post
title: JavaScript 的数据访问性能优化
date: 2015-02-05 11:21:29
summary: JavaScript 中有四种基本的数据存取位置：直接量、变量、数组元素和对象成员。和其他语言一样，数据的存储位置会很大的影响其读取速度 ...
categories: Study
---

JavaScript 中有四种基本的数据存取位置：直接量、变量、数组元素和对象成员，和其他语言一样，数据的存储位置会很大的影响其读取速度，那么该如何确定数据的存储位置来提高性能呢？我们一个一个来理解这个问题。

### 四种基本数据存储位置

- 直接量：直接量只代表自身，不存储特定位置，可想而知，使用直接量的访问速度会比其他会要快一点。JavaScript 中的直接量有：字符串，数字，布尔值，对象，数组，函数，正则，以及 null 和 undefined 值。
- 变量：我们用 var 定义的数据存储单元。
- 数组元素：存储在 JavaScript 数组对象内部，以<span class="orange">数字</span>作为索引。
- 对象成员：存储在 JavaScript 对象内部，以<span class="orange">字符串</span>作为索引。

总体来说，在 JavaScript 中访问直接量和局部变量的速度要快于数组项和成员对象的速度，那么如何来尽量使用直接量和局部变量，减少数组项和成员对象的使用呢？这里《高性能的 JavaScript》里面有这些建议：

#### 管理作用域

##### 作用域链和标识符解析

什么是作用域？当代码在一个环境中执行时候，会创建函数对象的一个作用域链，作用域链的用途是保证对执行环境有权访问的所有函数的<span class="orange">有序</span>访问，当前执行的代码所在环境的变量对象在作用域的头部。作用域中的下一个变量对象来自包含环境，而再下一次环境变量则来自下一个包含环境，一直延续到全局执行环境，也就是最后一个执行环境，全局对象包含 window、navigator 和 document 这些。

标识符的解析过程可以理解是对于作用域链的搜索过程，搜索过程从头部开始，假如找到了就使用这个标识符对应的变量，停止搜索，假如没有找到就搜索作用域中下一个对象，直到找到，假如到了全局执行环境都没有找到那就找不到了，也就是那个没有被定义。

##### 标识符解析的性能

上面说了，标识符解析是一个搜索的过程，可想而知，当我们需要的变量在第一次搜索的时候就找到了，那么时间也就会是最短的，也就是说，一个标识符的位置越深，它的读取速度就越慢，不过又说回来，V8 引擎已经优化了这个问题，但是在没有被优化的 JavaScript 引擎的浏览器中，建议尽可能使用局部变量。还有一个好的建议：<span class="orange">如果跨作用域的值在函数中被引用一次以上，那么就把它存到局部变量里面。</span>

##### 改变作用域链

with 语句和 try-catch 这两个语句都可以用来改变作用域链。  
当代码执行到 with 语句时候，运行期上下期的作用域链临时被改变了，一个新的可变对象被创立，它包了参数指定的对象所有属性，这个对象被推入所用域链的头部，这意味着函数所有的局部变量现在都处于第二个所用域对象中，因此访问对象更高了。

对于 try 语句也有同样的效果，当 try 中代码块发生错误时候执行过程会自动跳转到 catch 子句中，然后把异常对象推入一个可变对象并置于作用域的头部，这样就出现了和 with 语句一样的问题（所有的局部变量现在都处于第二个所用域对象中）。

{% highlight javascript %}
try {
    methodThatMightCauseAnError();
} catch (ex) {
    alert(ex.message); //作用域链在此处改变
}
{% endhighlight %}  

以上这两种方法得小心使用，或者说应该避免使用。

#### 成员对象

- 嵌套的对象成员会明显影响性能，尽量少用。
- 属性或方法在原型链中位置越深，访问他的速度也越慢。
- 通常来说，在函数中如果要多次读取同一个属性对象，最佳做法是将属性值保存到局部变量中。局部变量能用来替代属性以避免多次查找带来的性能开销，特别是在使用嵌套成员对象时候，这样会明显改变执行速度。

{% highlight javascript %}
//JavaScript 的命名空间，比如 YUI 中使用的技术，
//是导致频繁访问嵌套属性的起因之一。
function toggle(element) {
  if (YAHOO.util.Dom.hasClass(element, "slected")) {
    YAHOO.util.Dom.removeClass(element, "selected");
    return false;
  } else {
    YAHOO.util.Dom.addClass(element, "selected");
    return true;
  }
}
//上面代码中重复读取 YAHOO.util.Dom3 次来访问 3 个不同的方法。
//每个方法又有 3 此成员查找,一共就 9 此，导师代码十分低效。
//更好的方法是将 YAHOO.util.Dom 保存在局部变量中，再访问局部变量。
function toggle(element) {
  var Dom = YAHOO.util.Dom;
  if (Dom.hasClass(element, "slected")) {
    Dom.removeClass(element, "selected");
    return false;
  } else {
    Dom.addClass(element, "selected");
    return true;
  }
}
//这个改变，代码中对象成员访问次数右 9 次减少到 5 次
//所以，不要在同一个函数中多次查找同一个对象成员，
//除非它的值改变了.
{% endhighlight %}
