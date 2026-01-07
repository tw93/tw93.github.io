---
layout:     post
title:      Performance Optimization in JavaScript Programming Practices
date:       2015-02-16 21:47:29
summary:    Every programming language has its "pain points," and over time, its existing inefficient patterns also continue to develop. JavaScript presents some unique performance challenges, which are related to the way your code is organized. As web applications become more advanced and contain more and more JavaScript code, various patterns and anti-patterns gradually appear. To write more efficient code, please keep these programming practices in mind ...
categories: Study 
---

Every programming language has its "pain points," and over time, its existing inefficient patterns also continue to develop. JavaScript presents some unique performance challenges, which are related to the way your code is organized. As web applications become more and more advanced and contain more and more JavaScript code, various patterns and anti-patterns also gradually appear. To write more efficient code, please keep these programming practices in mind:

### Avoid Double Evaluation
Avoid performance overhead caused by double evaluation by avoiding the use of eval() and function() constructors. similarly, pass functions instead of strings as parameters to setTimeout() and setInterval().
Double evaluation is an expensive operation, which is much slower than directly including code for execution.

### Use Object/Array Literals
There are many ways to create objects and arrays in JavaScript, but using object and array literals is the fastest way, and literals can help save code volume to reduce the size of the entire file.
{% highlight JavaScript%}
//Create an object
var myObject = {
    name: "Tangwei",
    age: 21,
    count: 50
};

//Create an array
var myArray = ["Tangwei", 21, 50];
{%endhighlight%}

### Don't Repeat Work
One of the major optimization techniques in the field of computer science is "work avoidance".
The concept of avoiding unnecessary work has two meanings: **don't do irrelevant work**, and **don't repeat work that has already been completed**.

#### Lazy Loading
The first way to eliminate repetitive work in functions is lazy loading. Lazy loading means no operation is performed before information is used. When a function is not called immediately in the page, lazy loading is the best choice.

#### Conditional Preloading
It will detect in advance during script loading, instead of waiting until the function is called. The detection operation is still only once, just the process comes earlier. Conditional preloading ensures that all function calls consume the same time. The cost is the need to detect when the script is loaded instead of after loading. Preloading is suitable for situations where a function is used immediately and appears frequently throughout the life of the page.

### Use Fast Parts

#### Bitwise Operations
There are several ways to take advantage of bitwise operators to improve JavaScript speed.

 - Use arithmetic instead of pure mathematical operations
  {% highlight javascript %}
        //Usually adopt modulo 2 way to realize table color exchange
    for (var i = 0, len = rows.length; i < len; i++) {
        if (i % 2) {
            className = "even";
        } else {
            className = "odd";
        }
    }

    //By using bitwise operation way, it is 50% faster than the original version (depending on the browser)
    for (var i = 0, len = rows.length; i < len; i++) {
        if (i & １) {
            className = "even";
        } else {
            className = "odd";
        }
    }
  {%endhighlight%}

 - Use "Bitmask"
    Bitmask is a commonly used technique in computer science for handling situations where multiple boolean options exist simultaneously. Its idea is to use each bit of a single number to determine whether an option is established, thereby effectively converting numbers into an array composed of boolean flags. The value of each option in the mask is equal to a power of 2.
    For example:
  {%highlight javascript%}
         var OPTION_A = 1;
         var OPTION_B = 2;
         var OPTION_C = 4;
         var OPTION_D = 16;
         //By defining these options, you can create a number with bitwise OR operation to contain multiple setting options
         var options = OPTION_A | OPTION_C | OPTION_D;
         //Then determine whether a given option is available through bitwise AND operation
         //If the option is not set, the result is 0, otherwise 1

         //Is option A in the list?
         if (options & OPTION_A) {
             //Code processing
         }

         //Mask calculation like this is very fast
    {%endhighlight%}

#### Native Methods
No matter how your code is optimized, it will never be faster than the native methods provided by the JavaScript engine. Mathematical operations can be faster by using the **built-in Math object**. Also for selector APIs, when native methods are available, they should be used as much as possible.



