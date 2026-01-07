---
layout: post
title: DOM Programming Performance Optimization of JavaScript
date: 2015-02-06 21:47:29
summary: DOM is an abbreviation for Document Object Model. It is a language-independent application program interface for users to manipulate XML and HTML documents. In browsers, it mainly deals with HTML documents. In web applications, XML documents also often need to be retrieved. DOM API is used to access data in documents. John Hevatin once gave a pertinent metaphor in a speech, imagining DOM and JavaScript as islands respectively, they are directly connected by a toll bridge. Every time ECMAScript accesses DOM, it has to pass through this bridge and pay a "bridge fee". The more bridges passed, the more fees paid. Therefore, if you want to reduce costs, you have to cross the bridge less. Here we come to learn how to optimize this problem ...
categories: Study
---

DOM is an abbreviation for Document Object Model. It is a language-independent application program interface for users to manipulate XML and HTML documents. In browsers, it mainly deals with HTML documents. In web applications, XML documents also often need to be retrieved. DOM API is used to access data in documents. John Hevatin once gave a pertinent metaphor in a speech, imagining DOM and JavaScript as islands respectively, they are directly connected by a toll bridge. Every time ECMAScript accesses DOM, it has to pass through this bridge and pay a "bridge fee". The more bridges passed, the more fees paid. Therefore, if you want to reduce costs, you have to cross the bridge less. Here we come to learn how to optimize this problem.

#### Minimize the number of DOM accesses, process on the JavaScript side as much as possible

- Accessing DOM elements has a cost - the bridge fee mentioned before. Modifying elements is even more expensive because it causes the browser to recalculate geometric changes of the page.
- In other words, the more DOM accesses, the slower the code runs. Therefore, a general rule of thumb is: reduce the number of DOM accesses and leave calculations as much as possible to the ECMAScript side.

{% highlight javascript %}
 //The worst case is accessing and modifying elements in a loop
 //Especially looping through HTML element collections.
 //Method 1
 function innerHTMLLoop() {
    for (var count = 0; count < 15000; count++) {
        document.getElementById('here').innerHTML += 'a';
    }
 }
//Method 2
function innerHTMLLoop() {
    var content = '';
    for (var count = 0; count < 15000; count++) {
        content += 'a';
    }
    document.getElementById('here').innerHTML += content;
}
//Obviously, the implementation of method 2 is much better
{% endhighlight %}

#### Accessing DOM nodes multiple times, use local variables to store its reference

The return values of these methods is a collection

- document.getElementByName()
- document.getElementByClassName()
- document.getElementByTagName()

The following properties also return HTML collections

- document.images
- document.links
- document.forms
- document.forms[0].elements

These collections are expensive things. Generally speaking, for any type of DOM access, when the same DOM attribute or method needs to be accessed multiple times, it is best to cache this member in a local variable. <span class="orange">When traversing a collection, the first optimization principle is to store the collection in a local variable, and cache the length outside the loop, then use the local variable to access these elements that need to be accessed multiple times.</span>

#### Use the fastest API

The browser provides a native DOM method called <span class="orange">querySelectorAll()</span>, which is naturally much faster than using JavaScript and DOM to traverse and find elements.

{% highlight javascript %}
//Find all a elements in elements with id="menu"
//Our common practice
var elements=document.getElementById('menu').getElementsByTagName('a');

//Recommended practice
var elements=document.querySelectAll('#menu a')；
{% endhighlight %}

There is another traversal method - <span class="orange">querySelector()</span> to get the first matching node.

#### Pay attention to Repaint and Reflow

Well, I have never heard of repaint and reflow before. The book says this.
After the browser finishes downloading all components in the page - HTML markup, JavaScript, CSS, images - it will parse and generate two internal data structures:

- DOM tree: represents page structure
- Render tree: represents how DOM nodes are displayed

Once the DOM and render tree are constructed, the browser starts displaying (painting) page elements. When changes in the DOM affect the <span class="orange">geometric properties (width or height)</span> of an element, such as modifying border width or adding elements to a paragraph, leading to an increase in lines - the browser needs to recalculate the geometric properties of elements. Similarly, other elements' geometric properties and positions will also be affected because of this. The browser will invalidate the affected parts in the render tree and reconstruct the render tree. This process is called "<span class="orange">Reflow</span>". After completing reflow, the browser repaints the affected parts to the screen. This process is called <span class="orange">Repaint</span>.

Reflow and repaint operations are both expensive operations and should be reduced. To reduce occurrence frequency, DOM and style modifications should be merged and then handled at once. You can also cache layout information: try to reduce the number of times layout information is obtained. After obtaining it, assign it to a local variable, and then manipulate the local variable.
