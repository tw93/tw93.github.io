---
layout: post
title: Algorithm and Flow Control Performance Optimization of JavaScript
date: 2015-02-07 21:47:29
summary: Like other programming languages, code writing and algorithms will affect the running time of JavaScript. Unlike other languages, JavaScript has limited available resources, so optimization techniques are more important. this study note mainly optimizes JavaScript performance from three aspects of JavaScript loops, conditional statements, and recursion ...
categories: Study
---

Like other programming languages, code writing and algorithms will affect the running time of JavaScript. Unlike other languages, JavaScript has limited available resources, so optimization techniques are more important. This study note mainly optimizes JavaScript performance from three aspects: JavaScript loops, conditional statements, and recursion.

### Loops

#### Performance characteristics of for, while, and do-while loops are similar, but for-in is slower than the first three

- Since each iteration operation simultaneously searches instances or prototype properties, each iteration of the for-in loop generates more overhead, making it slower than other loop types. Compared with loops with the same number of iterations, the for-in loop is eventually only 1/7 the speed of other types. Therefore, unless you explicitly <span class="orange">need to iterate over an object with an unknown number of properties</span>, you should avoid using for-in loops. Also, don't use for-in to loop through array members.
- The best way to improve loop performance is to reduce the amount of calculation in each iteration and reduce the number of loop iterations.
- forEach(), this method is a new native array method introduced by ECMA-262. This method traverses all members of an array and executes a function on each member.

{% highlight javascript %}
//Function-based iteration method
item.forEach(function(value,index,array){
    process(value);
})
//Convenient!! But slow, this needs to be considered.
{% endhighlight%}

### Conditional Statements

#### Generally speaking, switch is always faster than if-else, but it's not always the best solution

- Whether to use if-else or switch is judged based on the number of test conditions: the larger the number of conditions, the more inclined to use switch (considering readability of the code), conversely if-else is more readable.
- It turns out that in most cases switch runs faster than if-else, but only <span class="orange">when the number of conditions is large is it significantly faster</span>.

#### Optimize if-else, ensure the most likely one is placed first

- The goal of optimization is to minimize the number of conditions judged to reach the correct branch. The simplest is to ensure the most likely one is placed first.
- Another way to reduce the number of judgments is to form if-else into a series of nested if-else statements.

#### When there are many judgment conditions, using lookup tables is faster than if-else and switch

- When you use a lookup table, you must completely discard condition judgment statements. This process becomes array item lookup or object member lookup.
- Advantages: No need to write any condition judgment statements, even when the number of candidates increases, it almost produces no extra performance overhead.

{% highlight javascript %}  
//Store return values in an array
var results=[result0,result1,result2,result3,result4,result5,
            result6,result7,result8,result09]
//Return current result
return results[value];
{% endhighlight %}

### Recursion

- The browser's call stack size limits the application of recursive algorithms in JavaScript. Stack overflow errors cause other code to stop running.
- If you encounter a stack overflow error, you can change the method to an iterative algorithm, or use Memoization to avoid repeated calculations.
