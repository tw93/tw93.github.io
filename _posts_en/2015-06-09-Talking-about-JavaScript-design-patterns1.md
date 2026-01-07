---
layout: post
title: Brief Talk on Object-Oriented JavaScript
date: 2015-06-09 21:47:29
summary: Recently I have been learning "JavaScript Design Patterns" written by Ross Harmes/Dustin Diaz. I read this book about twice and gained a lot. This book is suitable for students who want to study JavaScript deeply to increase your internal strength. It can help you enhance your understanding of JavaScript object-oriented, while learning various specific design patterns, knowing what occasions these design patterns should be used in, and how to implement them, to write more elegant code. This article is used to summarize my reading notes ...
categories: Study
---

Recently I have been learning ["JavaScript Design Patterns"](http://book.douban.com/subject/3329540/){:target="_blank"} written by Ross Harmes/Dustin Diaz. I read this book about twice and gained a lot. This book is suitable for students who want to study JavaScript deeply to increase your internal strength. It can help you enhance your understanding of JavaScript object-oriented, while learning various specific design patterns, knowing what occasions these design patterns should be used in, and how to implement them, to write more elegant code. This article is used to summarize my reading notes.

#### Expressive JavaScript

Why is JavaScript expressive?

- Flexibility of JavaScript: It allows you to imitate programming patterns and idioms of other languages, while also having its own unique programming patterns and idioms. This way you can choose the way to write code according to your own technical background and preferences.
- Weak typing: There is no need to declare its type when defining a variable. Its type depends on the data it contains; meanwhile JavaScript variables can change types according to the assigned value.
- Functions are first-class objects: They can be stored in variables, passed as parameters to other functions, returned as results from other functions, and constructed at runtime. At the same time, anonymous functions are used in JavaScript to create closures and protect variable spaces.
- Mutability of objects: All objects in JavaScript are mutable. Techniques that are not allowed in most languages can be used, such as adding properties to functions; meanwhile it also has the concept of introspection, which can check properties and methods of objects at runtime; everything in JavaScript can be modified at runtime.
- Inheritance: JavaScript uses object-based (prototypal) inheritance, which can be used to imitate class inheritance.
- Design patterns in JavaScript: Reasons for use: 1) Maintainability, reducing coupling between modules. 2) Communication, discussion can be done at a higher level without involving too many details. 3) Performance: Appropriate design patterns can significantly improve program speed and reduce the amount of code sent to the client.

#### Interfaces

Interface is one of the most useful tools in the toolbox of object-oriented JavaScript programmers. But there is no built-in method for creating or implementing interfaces in JavaScript, nor is there a built-in method for determining whether an object implements the same set of methods as another object.

**What is an interface?**

For JavaScript beginners, interfaces are rarely used in their own js code. So what is an interface? An interface provides a means to specify what methods an object should have, indicating the semantics of the method, but not specifying how the method is implemented.

**What are the benefits of interfaces?**

- A given set of objects are self-describing and can promote code reuse. An interface can tell a programmer what methods a class has implemented, thereby helping them use this class.
- Interfaces help stabilize the communication method between different classes. Knowing the interface beforehand can reduce problems occurring in the process of integrating two objects.
- Make testing and debugging easier, used to detect type mismatches, and can also make code more solid.

But interfaces are not without disadvantages. Using interfaces strengthens the role of types to a certain extent and reduces the flexibility of the language. Due to extra method call overhead brought by interfaces, it has a certain impact on performance. And JavaScript does not provide built-in support for interfaces (no interface and implements keywords in JavaScript), needing to imitate interfaces of some other languages, resulting in inability to force other programmers to follow the interface you defined. This is also the biggest problem I think exists in the use of interfaces.

**Imitating interfaces in JavaScript**

Comment method, property checking method and duck typing (taking the object's implementation method set as the only standard to judge whether it is an instance of a class. That is to say, if an object has all methods with the same name as methods defined in the interface, then it can be considered to have implemented this interface, "What walks like a duck and quacks like a duck is a duck, _foreign programmers really know how to play_"). None of the techniques are perfect, but the combination of the three can basically be satisfactory.

It is recommended to use the comment method and duck typing together. We use comments to declare interfaces supported by the class, thereby improving code reusability and documentation perfection. We also use the helper class Interface and its class method Interface.ensureImplements to perform display checks on object implementation methods. If the object fails the check, this method will return an error message.

Below is an instance of using Interface class and comments together.

{% highlight javascript %}
//Interface
var Composite=new Interface('Composite',['add','remove','getChild']);
var FormItem=new Interface('FormItem',['save']);

// CompositeForm class
var CompositeForm=function(id,method,action){
//implements Composite,FormItem
    ...
};
...

function addForm(formInstance){
    Interface.ensureImplements(formInstance,Composite,FormItem);
    //If a called method is not executed, the function will throw an error
    //interrupting program execution
    //Only after the check passes correctly, the subsequent code will be executed
}
{% endhighlight %}

Judging whether it is worthwhile to use interfaces in code is the final important and most difficult step. For small, not too troublesome projects, the benefits of interfaces are not obvious, just increasing complexity. You need to weigh the pros and cons yourself.

Particularly factory pattern, composite pattern, decorator pattern, and command pattern rely on interfaces. Using interfaces reduces code coupling, and you will gain greater freedom when optimizing and refactoring code.

#### Encapsulation and Information Hiding

Creating private members for objects is one of the most basic and useful features in any object-oriented language. By declaring a method or property as private, the implementation details of the object can be kept secret from other objects to reduce the coupling between objects, maintain data integrity and constrain modification methods. That is, encapsulation is the cornerstone of object-oriented design.

Encapsulation and information hiding can be seen as two expressions of the same concept. Information hiding is the purpose, and encapsulation is the technique to achieve this purpose. Encapsulation can be defined as hiding internal data representation and implementation details of an object.

**Basic patterns for creating objects**
There are 3 basic patterns for creating objects in JavaScript:

- Portal wide open type: Create a class according to the traditional type, use a function as its constructor, all properties and methods are public and accessible. The following example adds getter and setter methods for each property.
{% highlight javascript %}
    var Book = function(isbn, title, author) {
        this.setIsbn(isbn);
        this.setTitle(title);
        this.setAuthor(author);
    }
    Book.prototype = {
        checkIsbn: function(isbn) {
            ...
        };
        getIsbn = function() {
            return this.isbn;
        },
        setIsbn: function(isbn) {
            if (!this.checkIsbn(isbn)) {
                throw new Error('Book:Invalid ISBN');
            }
            this.isbn = isbn;
        },
        getTitle: function() {
            return this.title;
        },
        setTitle: function(title) {
            this.title = title || 'No title specified';
        },
        getAuthor: function() {
            return this.author;
        },
        setAuthor: function(title) {
            this.author =author || 'No author specified';
        },
        display:function(){
            ...
        }
    };
    {%endhighlight%}

- Using naming conventions to distinguish private members: Essentially this pattern is identical to portal wide open object creation, except that underscores are added in front of some method and property names to indicate their privacy.
{% highlight javascript %}
    var Book = function(isbn, title, author) {
        this.setIsbn(isbn);
        this.setTitle(title);
        this.setAuthor(author);
    }
    Book.prototype = {
        checkIsbn: function(isbn) {
            ...
        };
        getIsbn = function() {
            return this._isbn;
        },
        setIsbn: function(isbn) {
            if (!this.checkIsbn(isbn)) {
                throw new Error('Book:Invalid ISBN');
            }
            this.isbn = isbn;
        },
        getTitle: function() {
            return this._title;
        },
        setTitle: function(title) {
            this._title = title || 'No title specified';
        },
        getAuthor: function() {
            return this._author;
        },
        setAuthor: function(title) {
            this._author =author || 'No author specified';
        },
        display:function(){
            ...
        }
    };
    {%endhighlight%}

This use of underscore indicates that a property (or method) is only used internally by the object. Accessing it directly or setting it may lead to unexpected consequences. But this is only a convention, effective only when followed. Mainly suitable for non-sensitive internal methods and properties.

- Using closures to implement private members: Closures can be used to create variables that only certain functions are allowed to access, and the relationships of these variables in various calls in these functions still exist. We use var to declare these variables, meaning they only exist in that constructor.
{% highlight javascript %}
var Book = function(newIsbn, newTitle, newAuthor) {
    //implements Publication
    //Private attributes
    var isbn, title, author;

    //Private method
    function checkIsbn() {
        ...
    }

    //privileged methods
    this.getIsbn = function() {
        return isbn;
    };
    this.setIsbn: function(isbn) {
        if (!this.checkIsbn(newIsbn)) {
            throw new Error('Book:Invalid ISBN');
        }
        this.isbn = newIsbn;
    };
    this.getTitle: function() {
        return title;
    };
    this.setTitle: function(title) {
        title = newTitle || 'No title specified';
    };
    this.getAuthor: function() {
        return author;
    };
    this.setAuthor: function(title) {
        this.author = newAuthor || 'No author specified';
    };
    //Constructor code
    this.setIsbn(newIsbn);
    this.setTitle(newTitle);
    this.setAuthor(newAuthor);
};

//Public,non-privileged methods
Book.prototype = {
    display: function() {
        ...
    }
};
{%endhighlight%}

Variables and functions that need access only need to be declared in Book. These methods are called privileged methods because they are public methods but can access private properties and methods. To access these privileged functions externally, they are all prefixed with the this keyword.

**Advantages and disadvantages of encapsulation**

Encapsulation protects the integrity of internal data. By restricting access to data to getter and setter methods, full control over fetching and assignment can be obtained; at the same time, encapsulation can make refactoring easier; by only exposing methods specified in the interface, coupling between modules can be weakened, which is one of the most important principles of object-oriented design.

But private methods are difficult to test because they and their internal variables are private, so they are difficult to access externally; meanwhile encapsulation means having to deal with complex scope chains, which will make error debugging more difficult; at the same time implementing encapsulation in JavaScript is difficult, without built-in support for encapsulation, having to rely on some other techniques.

#### Inheritance

Inheritance is a very complex topic in JavaScript, much more complex than inheritance in any other object-oriented language. in too many other object-oriented languages, inheritance only needs one keyword. But in JavaScript, to achieve the purpose of inheriting common members, a series of measures need to be taken. Inheritance can reduce repetitive code and weaken coupling between objects as much as possible.

**Class-based inheritance**

First to do is creating constructor. By convention, its name is the class name, the first letter should be capitalized. Creating instance properties in constructor uses the this keyword. Class methods are added to its prototype object. To create an instance of the class, just call this constructor in combination with the new keyword. Then you can access all instance properties and call all instance methods.
{%highlight javascript%}
/*Class Person*/
function Person(name){
    this.name=name;
}
Person.prototype.getName=function(){
    return this.name
}

var reader=new Person('John Smith');
reader.getName();
{%endhighlight%}

Creating a class inheriting Person is more complex:
{%highlight javascript%}
/*Class Author*/
function Author(name,books){
    //Call the superclass's constructor in the scope of this
    Person.call(this.name);
    //add an attribute to Author
    this.books=books;
}

//set up the prototype chain
Author.prototype=new Person();
//set the constructor attribute to Author
Author.prototype.constructor=Author;
Author.prototype.getBooks=function(){
    //add a method to Author
    return this.books;
}
{%endhighlight%}

To let Author inherit Person, the prototype of Author must be set to an instance of Person manually. The final step is to reset the constructor property of the prototype to Author (when defining a constructor, its default prototype object is an instance of Object type, and its constructor property is automatically set to the constructor itself. If its prototype is set to another object manually, the new object naturally will not have the constructor value of the original object, so its constructor value needs to be reset)

To simplify class declaration, the entire process of deriving subclasses can be wrapped in a function called **extend**, whose role is similar to the extend keyword in other languages, i.e., creating a new class based on a given class structure.

{%highlight javascript%}
/*Extend functions.*/
function Extend(subClass,superClass){
    var F=function(){};
    F.prototype=superClass.prototype;
    subClass=prototype=new F();
    subClass.prototype.constructor=subClass;
}
{%endhighlight%}
What this function does is the same as what we did manually before. it sets the prototype, and then resets its constructor to the appropriate value. As an improvement, it adds an empty function F and inserts an object instance created by it into the prototype chain, doing so can avoid creating new instances of the superclass.
After using the extend function, that previous Person/Author example becomes like this:
{%highlight javascript%}
/*Class Person*/
function Person(name){
    this.name=name;
}
Person.prototype.getName=function(){
    return this.name
}

/*Class Author*/
function Author(name,books){
    Person.call(this.name);
    this.books=books;
}
extend(Author,Person);
Author.prototype.getBooks=function(){
    return this.books;
}
{%endhighlight%}

**Prototypal inheritance**

When using prototypal inheritance, you don't need to use class objects to define object structures, you only need to create an object directly. This object can subsequently be reused by new objects, thanks to the working mechanism of prototype chain lookup. Below we use prototype chain inheritance to redesign Person and Author:

{%highlight javascript%}
/*Person Prototype Object*/
var Person={
    name:'default name',
    getName:function(){
        return this.name;
    }
};

var reader=clone(Person);
alert(reader.getName());//default name
reader.name='Tang Wei';
alert(reader.getName());//Tang Wei

/*Author Prototype Object*/
var Author=clone(Person);
Author.books=[];//default value
Author.getBooks=function(){
    return this.books;
}
{%endhighlight%}

A constructor named Person is not used here to define the class structure. Person is now an object literal. It is the prototype variable for various Person objects needed to be created. Properties and methods that all Person objects have are defined in it, and default values are provided for them. Default values of methods may not be changed, but default values of properties are generally changed.

**Mixin Classes**

There is a way to reuse code that doesn't need strict inheritance. If you want to use a function in multiple classes, you can let these classes share the function through augmentation. The specific practice is: create a class containing various common methods first, and then extend other classes. Such a class containing common methods is called a mixin class. They are usually not instantiated or called directly. The purpose of their existence is only to provide their own methods to other classes. See the instance below for details:

{%highlight javascript%}
/*Mixin class.*/

var Mixin = function() {};
Mixin.prototype() {
    serialize: function() {
        var output = [];
        for (key in this) {
            output.push(key + ': ' + this[key]);
        }
        return output.path.join(', ');
    }
}
//Use augment function to add this method to each class needing it
augment(Author,Mixin);

var author=new Author('Ross Harmes',['JavaScript Design Patterns']);
var serializedString=author.serialize();

/*Augment function*/
function augment(receivingClass, givingClass) {
    if (arguments[2]) { //Only give certain methods.
        for (var i = 2, len = arguments.length; i < len; i++) {
            receivingClass.prototype[arguments[i]] = givingClass.prototype[arguments[i]];
        }
    } else {
        for (methodName in givingClass.prototype) {
            if (!receivingClass.prototype[methodName]) {
                receivingClass.prototype[methodName] = givingClass.prototype[methodName];
            }
        }
    }
}
{%endhighlight%}

Various inheritance paradigms have their own advantages and disadvantages:

- Prototypal inheritance (and clone function) is the best choice in occasions where memory efficiency is important.
- If programmers who deal with objects are only familiar with inheritance mechanism in other object languages, then it is best to use class-based inheritance (and extend function).
- Both methods above are suitable for class hierarchy systems with small differences between classes. If differences between classes are large, then the mixin class method to augment these classes is often a more reasonable choice.
