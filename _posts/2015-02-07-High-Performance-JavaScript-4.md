---
layout: post
title: JavaScript 的算法和流程控制性能优化
date: 2015-02-07 21:47:29
summary: 如同其他编程语言，代码的写法和算法会影响 JavaScript 的运行时间，与其他语言的不同的是，JavaScript 的可用资源有限，因此优化技术更为重要，这个学习笔记主要是从 JavaScript 的循环、条件语句、递归这三个方面的一些奇淫技巧来优化 JavaScript 的性能 ...
categories: Study
---

如同其他编程语言，代码的写法和算法会影响 JavaScript 的运行时间，与其他语言的不同的是，JavaScript 的可用资源有限，因此优化技术更为重要，这个学习笔记主要是从 JavaScript 的循环、条件语句、递归这三个方面的一些奇淫技巧来优化 JavaScript 的性能。

### 循环

#### for、while 和 do-while 循环性能特性相似，for-in 相比前三者慢

- 由于每次迭代操作会同时搜索实例或者原型属性，for-in 循环的每次迭代都会产生更多的开销，因此比其他循环类型要慢，对比相同迭代次数的循环，for-in 循环最终只有其他类型速度的 1/7，因此，除非你明确<span class="orange">需要迭代一个属性数量未知的对象</span>,否则应该避免使用 for-in 循环。还有不要使用 for-in 来循环数组成员。
- 改善循环性能的最佳方式是减少每次迭代的运算量和减少循环迭代次数。
- forEach(),此方法是 ECMA-262 引入的一新的原生数组方法，此方法遍历一个数组的多有成员，并且在每个成员上面执行一个函数。

{% highlight javascript %}
//基于函数的迭代方法
item.forEach(function(value,index,array){
    process(value);
})
//方便！！但是慢，这个要考虑。
{% endhighlight%}

### 条件语句

#### 通常来说，switch 总是比 if-else 快，并不总是最佳解决方案

- 使用 if-else 还是 switch，基于测试条件的数量来判断：条件数量越大，越倾向于使用 switch（考虑到代码的易读性），反之 if-else 更易读。
- 事实证明，大多数情况下 switch 比 if-else 运行得要快，但只有<span class="orange">当条件数量很大时候才快得明显</span>。

#### 优化 if-else，确保最可能出现的放在首位

- 优化的目标是使最小化到达正确分支所需判断的条件数量，最简单的就是确保最可能出现的放首位。
- 还有一种减少判断次数的方法是把 if-else 组成一系列的嵌套的 if-else 语句。

#### 在判断调节较多的时候，使用查找表比 if-else 和 swich 更快

- 当你使用查找表时候，必须完全抛弃条件判断语句，这个过程变成数组项查询或者对象成员查询。
- 优点：不用写任何条件判断语句，既是候选值增加时，也几乎不会产生额外的性能开销。

{% highlight javascript %}  
//将返回值存入数组
var results=[result0,result1,result2,result3,result4,result5,
            result6,result7,result8,result09]
//返回当前结果
return results[value];
{% endhighlight %}

### 递归

- 浏览器的调用栈大小限制了递归算法在 JavaScript 中的应用，栈溢出错误会导致其他代码中断运行。
- 如果你遇到栈溢出错误，可以将方法改为迭代算法，或使用 Memoization 来避免重复计算。
