---
layout: post
title: Data Access Performance Optimization of JavaScript
date: 2015-02-05 11:21:29
summary: "There are four basic data storage locations in JavaScript: literals, variables, array elements, and object members. Like other languages, the storage location of data will greatly affect its reading speed ..."
categories: Study
---

There are four basic data storage locations in JavaScript: literals, variables, array elements, and object members. Like other languages, the storage location of data will greatly affect its reading speed. So how to determine the storage location of data to improve performance? Let's understand this problem one by one.

### Four Basic Data Storage Locations

- Literals: Literals only represent themselves and are not stored in a specific location. As you can imagine, the access speed of using literals will be a bit faster than others. Literals in JavaScript include: strings, numbers, booleans, objects, arrays, functions, regular expressions, and null and undefined values.
- Variables: Data storage units defined by us using var.
- Array elements: Stored inside JavaScript array objects, indexed by <span class="orange">numbers</span>.
- Object members: Stored inside JavaScript objects, indexed by <span class="orange">strings</span>.

Overall, accessing literals and local variables in JavaScript is faster than accessing array items and member objects. So how to use literals and local variables as much as possible and reduce the use of array items and member objects? Here are some suggestions from "High Performance JavaScript":

#### Manage Scope

##### Scope Chain and Identifier Resolution

What is scope? When code is executed in an environment, a scope chain of function objects is created. The purpose of the scope chain is to ensure <span class="orange">ordered</span> access to all functions that the execution environment has access to. The variable object of the environment where the current code is executed is at the head of the scope chain. The next variable object in the scope chain comes from the containing environment, and the next environment variable comes from the next containing environment, and so on until the global execution environment, which is the last execution environment. Global objects include window, navigator, and document.

The resolution process of identifiers can be understood as a search process for the scope chain. The search process starts from the head. if it is found, the variable corresponding to this identifier is used, and the search stops. If it is not found, the next object in the scope is searched until it is found. If it is not found even in the global execution environment, it is not found, meaning it was not defined.

##### Performance of Identifier Resolution

As mentioned above, identifier resolution is a search process. As you can imagine, if the variable we need is found in the first search, the time will be the shortest. That is to say, the deeper the position of an identifier, the slower its reading speed. However, on the other hand, the V8 engine has already optimized this problem, but in browsers without optimized JavaScript engines, it is recommended to use local variables as much as possible. Another good suggestion is: <span class="orange">if a cross-scope value is referenced more than once in a function, then store it in a local variable.</span>

##### Changing the Scope Chain

Both the with statement and try-catch can be used to change the scope chain.
When the code executes to the with statement, the scope chain of the runtime context is temporarily changed. A new variable object is created, which contains all the attributes of the object specified by the parameter. This object is pushed to the head of the scope chain, which means that all the local variables of the function are now in the second scope object, so accessing the object is higher.

The try statement also has the same effect. When an error occurs in the code block in try, the execution process will automatically jump to the catch clause, and then push the exception object into a variable object and place it at the head of the scope, which causes the same problem as the with statement (all local variables are now in the second scope object).

{% highlight javascript %}
try {
    methodThatMightCauseAnError();
} catch (ex) {
    alert(ex.message); //Scope chain changes here
}
{% endhighlight %}  

These two methods should be used carefully, or should be avoided.

#### Member Objects

- Nested object members will significantly affect performance, use them as little as possible.
- The deeper the position of an attribute or method in the prototype chain, the slower the speed of accessing it.
- Generally speaking, if you want to read the same attribute object multiple times in a function, the best practice is to save the attribute value to a local variable. Local variables can be used to replace attributes to avoid performance overhead caused by multiple lookups, especially when using nested member objects, which will significantly change the execution speed.

{% highlight javascript %}
//JavaScript namespaces, such as the technique used in YUI,
//is one of the causes of frequent access to nested attributes.
function toggle(element) {
  if (YAHOO.util.Dom.hasClass(element, "slected")) {
    YAHOO.util.Dom.removeClass(element, "selected");
    return false;
  } else {
    YAHOO.util.Dom.addClass(element, "selected");
    return true;
  }
}
//In the code above, YAHOO.util.Dom is read 3 times repeatedly to access 3 different methods.
//Each method has 3 member lookups, a total of 9 times, which makes the code very inefficient.
//A better method is to save YAHOO.util.Dom in a local variable and then access the local variable.
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
//This change reduces the number of object member accesses in the code from 9 to 5.
//So, don't look up the same object member multiple times in the same function,
//unless its value has changed.
{% endhighlight %}
