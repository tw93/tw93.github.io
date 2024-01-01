---
layout: post
title: 浅谈面向对象的 JavaScript
date: 2015-06-09 21:47:29
summary: 最近在学习 Ross Harmes/Dustin Diaz 写的《JavaScript 设计模式》，大概将此书看了两遍，很有收获。此书适合于想深入学习JavaScript的同学，用来增加你的内功。能够帮助你增强对JavaScript面向对象的理解，同时学习各种具体的设计模式，懂得应该在什么场合使用这些设计模式，以及如何实现它们，写出更优雅的代码。这篇文章用于总结我的读书笔记 ...
categories: Study
---

最近在学习 Ross Harmes/Dustin Diaz 写的[《JavaScript 设计模式》](http://book.douban.com/subject/3329540/){:target="_blank"}，大概将此书看了两遍，很有收获。此书适合于想深入学习 JavaScript 的同学，用来增加你的内功。能够帮助你增强对 JavaScript 面向对象的理解，同时学习各种具体的设计模式，懂得应该在什么场合使用这些设计模式，以及如何实现它们，写出更优雅的代码。这篇文章用于总结我的读书笔记。

#### 富有表现力的 JavaScript

为什么说 JavaScript 是富有表现力的呢？

- JavaScript 的灵活性：它允许你模仿其他语言的编程模式和惯用法，同时也具备自己独特的编程模式和惯用法。这样你可以根据自己的技术背景和喜好选择编写代码的方式。
- 弱语言类型：定义变量的时候不需要申明其类型，其类型取决于其包含的数据；同时 JavaScript 变量可以根据所赋值改变类型。
- 函数是一等对象：它们可以存储在变量中，可以作为参数传递给其他函数，可以作为返回值从其他函数传出，还可以在运行时进行构造。同时 JavaScript 中使用匿名函数来创建闭包，保护变量空间。
- 对象的易变性：JavaScript 中所有对象都是易变的，可以使用一些在大多数语言中不允许的技术，例如为函数增加属性；同时还具备内省的概念，可以在运行时检查对象的属性和方法；而已在 JavaScript 中，任何东西都可以在运行时候修改。
- 继承：JavaScript 使用的是基于对象的（原型式（prototypal））继承，它可以用了模仿类的继承。
- JavaScript 中的设计模式：使用原因：1）可维护性，降低模块间的耦合。2）沟通，可以在较高层面上对其进行讨论，而不必涉及过多的细节。3）性能：合适的设计模式可以大幅提高程序的运行速度，并减少传送到客户端的代码量。

#### 接口

接口是面向对象 JavaScript 程序员工具箱中最有用的工具之一。但是 JavaScript 中没有内置创建或者实现接口的方法，也没有内置的方法用于判断一个对象是否实现了与另一个对象相同的一套方法。

**什么是接口呢？**

对于 JavaScript 初学者很少在自己的 js 代码中使用接口，那么到底什么是接口呢？接口提供了一种用以说明一个对象应该具有哪些方法的手段，用来表明方法的语义，但是不规定方法是如何实现的。

**接口的好处是啥呢？**

- 既定的一批对象具有自我描述性，并能促进代码的重用。接口可以告诉一个程序员一个类实现了哪些方法，从而帮助其使用这个类。
- 接口有助于稳定不同类之间的通信方式，事先知道了接口，就能减少在集成两个对象过程中出现的问题。
- 使测试和调试变得更加轻松，用于检测类型不匹配，同时还能使代码变得更加稳固。

但是接口并非没有缺点，使用接口在一定程度上面强化了类型的作用，降低了语言的灵活性。由于接口带来额外的方法调用开销，对性能造成一定影响。而且 JavaScript 没有提供对接口的内置支持（JavaScript 中没有 interface 和 implements 关键字），需要去模仿一些其他语言的接口，导致无法强迫其他程序员遵循你定义的接口，这也是我认为接口在使用中存在的最大问题。

**在 JavaScript 中模仿接口**

注释法、属性检查法和鸭式辨形法（把对象的实现方法集作为判断它是不是某个类实例的唯一标准。也就是说如果对象具有与接口定义的方法同名的所有方法，那么就可以认为它实现了这个接口，“像鸭子一样走路并且嘎嘎叫的就是鸭子，_外国程序员真会玩_”）。没有哪种技术是完美的，但三者的结合使用基本上 可以令人满意。

建议采用注释法和鸭式辨形法这两种方法综合使用，我们用注释申明类支持的接口，从而提高代码的可重用性及其文档的完善性。我们还用辅助类 Interface 及其类方法 Interface.ensureImplements 来对对象实现方法进行显示检查。如果对象未能通过检查，这个方法将返回一条错误的消息。

下面是结合使用 Interface 类与注释的实例。

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
    //如果一个调用的方法没有被执行，函数将会扔出一个错误
    //中断程序的执行
    //只有在检查正确通过后，之后的代码才会被执行
}
{% endhighlight %}

判断在代码总是否使用接口是否划算是最后重要也是最困难的一步，对于小型的、不太费事的项目来说，接口的好处并不明显，只是徒增复杂度而已。你需要自行权衡其利弊。

对于工厂模式、组合模式、装饰者模式、命令模式尤其依赖接口。使用接口使代码耦合度降低，在对代码进行优化和重构时候将获得更大的自由。

#### 封装和信息隐藏

为对象创建私用成员是任何面向对象语言中的最基本和有用的特性之一。通过将一个方法或属性声明为私用，可以让对象的实现细节对其他对象保密以降低对象之间的耦合程度，可以保持数据完整性并对其修改方式加以约束。也即封装是面向对象设计的基石。

封装和信息隐藏之间可以看作同一个概念的两种表达。信息隐藏是目的，而封装则是借以达到这个目的的技术，封装可以定义为对象的内部数据表现形式和实现细节进行隐藏。

**创建对象的基本模式**
JavaScript 中创建对象的基本模式有 3 中：

- 门户大开型：按照传统类型创建一个类，用一个函数来做其构造器，所有属性和方法都是公开的，可访问的。以下示例是为每个属性增加了取值器和赋值器方法。
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

- 用命名规范区别私用成员：和本质上面此模式和门户大开型对象创建如出一辙，只不过在一些方法和属性的名称的前面加了下划线表示其私用性而已。
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

下划线的这种用法表示一个属性（或方法）仅对对象内部使用，直接访问它或者设置它可能会导致意想不到的后果。但是这只是一种约定，只有在遵循时候才有效果。主要适合于非敏感性的内部方法和属性。

- 用闭包实现私用成员：使用闭包可以创建只允许特定函数访问的变量，而且这些变量在这些函数中的各次调用关系依然存在。我么使用 var 来申明这些变量，意味着它们只存在那个构造器中。
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

需要访问这些变量和函数只需申明在 Book 中即可，这些方法被称为特权方法(privileged method)，因为它们是公开方法，但是能够访问私用属性和方法。为了在外部访问这些特权函数，它们的前面都被加上了关键字 this。

**封装的优缺点**

封装保护了内部数据的完整性。通过将数据的访问限制为取值器和赋值器这两个方法，可以获得对取值和赋值的完全控制；同时封装可以使重构变得更轻松；通过只公开那些在接口中规定的方法，可以弱化模块间的耦合，这是面向对象设计最重要的原则之一。

但是私用方法很难进行测试，因为它们及其内部变量都是私用的，所以在外部很难访问它们；同时封装意味着不得不与复杂的作用链打交道，而这会使错误调试更加困难；同时在 JavaScript 中实现封装很困难，没有对封装提供内置的支持，必须依赖一些其他的技术。

#### 继承

在 JavaScript 中继承是一个非常复杂的话题，比起其他任何面向对象的语言中继承都复杂得多。在太多事其他面向对象语言中，继承只需要一个关键字即可。但是在 JavaScript 中要想达到传承共用成员的目的，需要采取一系列措施。继承可以减少重复性的代码，并且尽量弱化对象之间的耦合。

**类式继承**

首先要做的是创建构造函数。按惯例，其名称就是类名，首字母应该大写。在构造函数中创建实例的属性要使用关键字 this。类的方法被添加到其 prototype 对象中，要创建该类的实例，只需结合关键字 new 调用这个构造函数即可。然后你可以访问所有的实例属性，也可以调用所有的实例方法。  
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

创建继承 Person 的类要复杂一些：
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

为了让 Author 继承 Person，必须手工将 Author 的 prototype 设置为 Person 的一个实例。最后一个步骤是将 prototype 的 constructor 属性重设为 Author(定义一个构造函数时，其默认的 prototype 对象是一个 Object 类型的实例，其 constructor 属性会自动设置为该构造函数本身。如果手工将其 prototype 设置为另一对象，那么新对象自然不会具有原对象的 constructor 值，所以需要重新设置其 constructor 值)

为了简化类的申明，可以将派生子类的整个过程包装在一个名为**extend**的函数中，它的作用和其他语言中的 extend 关键字类似，即基于一个给定的类结构创建一个新的类。

{%highlight javascript%}
/*Extend functions.*/
function Extend(subClass,superClass){
    var F=function(){};
    F.prototype=superClass.prototype;
    subClass=prototype=new F();
    subClass.prototype.constructor=subClass;
}
{%endhighlight%}
这个函数所做的事情和先前我们手工做的一样，它设置了 prototype，然后将其 constructor 重新设为恰当的值，作为一项改进，它添加了一个空函数 F，并将其创建的一个对象实例插入原型链中，这样做可以避免创建超类的新实例。
使用 extend 函数后，前面那个 Person/Author 例子变成了这个样子：
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

**原型式继承**

使用原型式继承时，并不需要用类的对象来定义对象的结构，只需要直接创建一个对象即可。这个对象随后可以被新的对象重用，这得意于原型链查找的工作机制。下面我们使用原型链继承来重新设计 Person 和 Author：

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

这里并没有使用一个名为 Person 的构造函数来定义类的结构，Person 现在是一个对象字面量。它是所需要创建的各种类 Person 对象的原型变量。其中定义了所有类 Person 对象都有具备的属性和方法，并为它们提供了默认值。方法的默认值可能不会被改变，而属性的默认值一般都会被改变。

**摻元类**

有一种重用代码的方法不需要用到严格的继承。如果想把一个函数用到多个类中，可以通过扩充(augmenttation)的方法让这些类共享该函数。其具体做法是：先创建一个包含各种通用方法的类，然后再扩展其他类。这种包含通用方法的类成为摻元类(mixin class)。他们通常不会被实例化或者直接调用。其存在的目的只是向其他类提供自己的方法。具体见下面实例：

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
//使用 augment 函数把这个方法添加到每一个需要它的类中
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

各种继承范型各有优缺点：

- 在内存效率比较重要的场合原型式继承（及 clone 函数）是最佳选择。
- 如果与对象打交道的都是那种只熟悉其他对象语言中的继承机制的程序员，那么最好使用类式继承（及 extend 函数）。
- 以上两种方法都适合于类间差异较小的类层次体系。如果类之间差异比较大，那么摻元类的方法来扩充这些类往往是一种更合理的选择。
