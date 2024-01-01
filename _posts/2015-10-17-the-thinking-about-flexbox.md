---
layout: post
title: 我对 Flexbox 布局模式的理解
date: 2015-10-17 21:47:29
summary: Flexbox，一种 CSS3 的布局模式，也叫做弹性盒子模型，用来为盒装模型提供最大的灵活性 ...
categories: Study
---

Flexbox，一种 CSS3 的布局模式，也叫做弹性盒子模型，用来为盒装模型提供最大的灵活性。

首先举一个栗子，之前我们是这样实现一个 div 盒子水平垂直居中的。在知道对象高宽的情况下，对居中元素绝对百分比定位，然后通过 margin 偏移的方式来实现。

{% highlight html %}
<style>
    .container{
        width: 600px;
        height: 400px;
        border: 1px solid #000;
        position: relative;
    }
    .box{
        width: 200px;
        height: 100px;
        border: 1px solid #000;
        position: absolute;
        left: 50%;
        top: 50%;
        margin-left: -100px;
        margin-top:-50px;
    }
</style>
<div class="container">
    <div class="box"></div>
</div>
{% endhighlight %}

假如使用了 flex 后，实现起来就简单了，而且不需要自己去算，也不需要绝对定位，只需要通过对伸缩容器定义两个属性，justify-content 定义伸缩项目沿着主轴线的对齐方式为 center， align-items 定义伸缩项目在侧轴（垂直于主轴）的对齐方式为 center，具体如下：
{% highlight html %}
<style>
 .container{
     width: 600px;
     height: 400px;
     border: 1px solid #000;
     display: flex;
     justify-content:center;
     align-items:center;
 
 }
 .box{
     width: 200px;  //宽度可以为任意
     height: 100px; //高度可以为任意
     border: 1px solid #000;
 
 }
</style>
<div class="container">
    <div class="box"></div>
</div>
{% endhighlight %}

其实 Flexbox 的优秀特性并不是这一些，首先来一张它的属性图吧~

<img data-src="{{site.assetUrl}}flexbox.png" class="lazyload img-zoom" src="{{site.defaultImage}}"/>

首先我们来分析下这一张图，从第一个子节点可以看到 Flexbox 由 Flex 容器和 Flex 项目组成，容器即父元素，项目即子元素。他们之间的一些关系可以这样来表示：

![](https://gw.alipayobjects.com/zos/k/ig/33.png)

这张图可以在接下来的属性分析中用到。

### Flex 容器

#### display:flex

当我们使用 flexbox 布局时候，需要先给父容器的 display 值定位 flex（块级）或者 inline-flex（行内级）。

当使用了这个值以后，伸缩容器会为内容建立新的伸缩格式化上下文（FFC），它的上下文展示效果和 BFC 根元素相同（BFC 特性：浮动不会闯入伸缩容器，且伸缩容器的边界不会与其内容边界叠加）。

伸缩容器不是块容器，因此有些设计用来控制块布局的属性，在伸缩布局中不适用，特别是多栏（column)，float，clear，vertical-align 这些属性。

#### flex-direction

[flex-direction]属性用来控制上图中伸缩容器中**主轴的方向**，同时也决定了伸缩项目的方向。

- flex-direction:row;也是默认值，即主轴的方向和正常的方向一样，从左到右排列。
- flex-direction:row-reverse;和 row 的方向相反，从右到左排列。
- flex-direction:column;从上到下排列。
- flex-direction:column-reverse;从下到上排列。
  以上只针对 ltr 书写方式，对于 rtl 正好相反了。

网页展示效果如下：

![flex-direction](http://tw93.github.io/images/flex-direction.png)

#### flex-warp

[flex-wrap]属性控制伸缩容器是单行还是多行，也决定了侧轴方向（新的一行的堆放方向）。

- flex-wrap:nowrap;伸缩容器单行显示，默认值；
- flex-wrap:wrap;伸缩容器多行显示；伸缩项目每一行的排列顺序由上到下依次。
- flex-wrap:wrap-reverse;伸缩容器多行显示，但是伸缩项目每一行的排列顺序由下到上依次排列。

网页效果见图；

![flex-wrap](http://tw93.github.io/images/flex-wrap.png)

#### flex-flow

[flex-flow]属性为 flex-direction（主轴方向）和 flex-wrap（侧轴方向）的缩写，两个属性决定了伸缩容器的主轴与侧轴。

- flex-flow:[flex-direction][flex-wrap];默认值为 row nowrap；

举两个栗子：

- flex-flow:row;也是默认值；主轴是行内方向，单行显示，不换行；
- flex-flow:row-reverse wrap;主轴和行内方向相反，从右到左，项目每一行由上到下排列（侧轴）。

网页效果如下：

![flex-flow](http://tw93.github.io/images/flex-flow.png)

这里大家可以多自己去试试不同的组合。

#### justify-content

[justify-content]用于定义伸缩项目在主轴上面的的对齐方式，当一行上的所有伸缩项目都不能伸缩或可伸缩但是已经达到其最大长度时，这一属性才会对多余的空间进行分配。当项目溢出某一行时，这一属性也会在项目的对齐上施加一些控制。

- justify-content:flex-start;伸缩项目向主轴的起始位置开始对齐，后面的每元素紧挨着前一个元素对齐。
- justify-content:flex-end;伸缩项目向主轴的结束位置对齐，前面的每一个元素紧挨着后一个元素对齐。
- justify-content:center;伸缩项目相互对齐并在主轴上面处于居中，并且第一个元素到主轴起点的距离等于最后一个元素到主轴终点的位置。以上 3 中都是“捆绑”在一个分别靠左、靠右、居中对齐。
- justify-content:space-between;伸缩项目平均的分配在主轴上面，并且第一个元素和主轴的起点紧挨，最后一个元素和主轴上终点紧挨，中间剩下的伸缩项目在确保两两间隔相等的情况下进行平分。
- justify-content:space-around;伸缩项目平均的分布在主轴上面，并且第一个元素到主轴起点距离和最后一个元素到主轴终点的距离**相等**，且等于中间元素两两的间距的**一半**。完美的平均分配，这个布局在阿里系中很常见。

还是看 demo 理解起来快一点：

![justify-content1](http://tw93.github.io/images/justify-content1.png)

![justify-content2](http://tw93.github.io/images/justify-content2.png)

#### align-items

[align-items]用来定义伸缩项目在侧轴的对齐方式，这类似于[justify-content]属性，但是是另一个方向。（flex-directon 和 flex-wrap 是一对，justify-content 和 align-items 是一对，前者分别定义主轴和侧轴的**方向**，后者分别定义主轴和侧轴中项目的**对齐**方式）。

- align-items:flex-start;伸缩项目在侧轴起点边的外边距紧靠住该行在侧轴起点的边。
- align-items:flex-end;伸缩项目在侧轴终点边的外边距靠住该行在侧轴终点的边。
- align-items:center;伸缩项目的外边距在侧轴上居中放置。
- align-items:baseline;如果伸缩项目的行内轴与侧轴为同一条，则该值与[flex-start]等效。 其它情况下，该值将参与基线对齐。
- align-items:stretch;伸缩项目拉伸填充整个伸缩容器。此值会使项目的外边距盒的尺寸在遵照「min/max-width/height」属性的限制下尽可能接近所在行的尺寸。

下面 demo 只展示 center 和 stretch 的栗子，其他几个可以参考 flex-start 和 flex-end 那样。

![align-items](http://tw93.github.io/images/align-items.png)

#### align-content

[align-content]属性可以用来调准伸缩行在伸缩容器里的对齐方式，这与调准伸缩项目在主轴上对齐方式的[justify-content]属性类似。只不过这里元素是以一行为单位。请注意本属性在只有一行的伸缩容器上没有效果。当使用 flex-wrap:wrap 时候多行效果就出来了。
{% highlight css %}
align-content: flex-start || flex-end || center || space-between || space-around || stretch;
{% endhighlight %}

- align-content: stretch;默认值,各行将会伸展以占用剩余的空间。
- 其他可以参考[justify-content]用法。

具体图片来至 w3.org 官方文档；

![align-content](http://tw93.github.io/images/align-content.png)

太麻烦。写不下去了，摔。

### Flex 项目

终于写到关于伸缩项目的相关属性了，主要是 3 个，order，flex（flex-grow，flex-shrink，flex-basis 的组合），align-self；用来比较多的是前两个。

#### order

有一种用法比较多，想设置一组中有两个元素一个排第一，另外一个排最后，主需要将第一个的 order:-1；另一个为 order:0;这样就好了。

譬如我们想控制一个 container 中有 4 个 box，想 box4 为一个显示，box1 为最后一个显示。只需要
这样
{% highlight html %}
<style>
.container{
        display: flex;
    }
    .box1{
        order:1;
    }
    .box4{
        order:-1;
    }
</style>
<div class="container">
    <div class="box1">1</div>
    <div class="box2">2</div>
    <div class="box3">3</div>
    <div class="box4">4</div>
</div>

{% endhighlight %}

显示效果就这样了：

![order](http://tw93.github.io/images/order-flex.png)

#### flex

[flex]属性可以用来指定可伸缩长度的部件，是 flex-grow（扩展比例）,flow-shrink（收缩比例）,flex-basis（伸缩基准值）这个三个属性的缩写写法，建议大家采用缩写的方式而不是单独来使用这 3 个属性。
{% highlight html %}
flex:none | [ <'flex-grow'> ?<'flew-shrink'> || <'flow-basis'>]
// flex-grow 是必须得 flex-shrink 和 flow-basis 是可选的
{%endhighlight%}

- flex-grow:<number>;其中 number 作为扩展比例，没有单位，初始值是 0，主要用来决定伸缩容器剩余空间按比例应扩展多少空间。
- flex-grow:<number>;其中 number 作为收缩比例，没有单位，初始值是 1，也就是剩余空间是负值的时候此伸缩项目相对于伸缩容器里其他伸缩项目能收缩的空间比例，在收缩的时候收缩比率会以[flex-basis]伸缩基准值加权。
- flex-basis:<length>|auto;默认是 auto 也就是根据可伸缩比率计算出剩余空间的分布之前，伸缩项目主轴长度的起始数值。若在「flex」缩写省略了此部件，则「flex-basis」的指定值是长度零。

flex-basis 用图来表示就是这样：

![basis](http://tw93.github.io/images/rel-vs-abs-flex.svg)

#### align-self

[align-self]用来在单独的伸缩项目上覆写默认的对齐方式，这个属性是用来覆盖伸缩容器属性 align-items 对每一行的对齐方式。也就是说在默认的情况下这两个值是相等的。

{% highlight html %}
align-self: auto | flex-start | flex-end | center | baseline | stretch
{%endhighlight%}

### 我的看法

讲了这么多他们的使用，我们来看一看 flexbox 布局的兼容性。

具体大家可以见这个网站：[caniuse](http://caniuse.com/#search=flexbox)

![img](http://tw93.github.io/images/caniuse.png){:class="img-zoom"}

在 PC 端其实很乐观了，基本上主流的浏览器都已经兼容了 flex 的使用，但是到了移动端就不是那么好了，特别是国内浏览器，考虑到 uc 浏览器占了大头，但是 uc 从图中看到只兼容 flex 最老的一个版本，也就是 2009 年的版本，即 display:box;很多现在 flex 的优秀特性到了它上面都不兼容了，所以建议大家在使用的时候，假如 2009 版本可以满足开发要求的话，还是去使用 2009 版本，这样风险更小。

但是假如想兼容多个浏览器，可以采用优雅降级的方式来使用，这里推荐一个 scss 的[sass-flex-mixin](https://github.com/mastastealth/sass-flex-mixin),这样就可以使用最新的写法，并且兼容大部分浏览器了。

相信 flexbox 布局在以后的移动端会用得越来越多的。

### 补充一个神奇的 Flexbox playground

{::nomarkdown}

<p data-height="300" data-theme-id="27375" data-slug-hash="apEmpP" data-default-tab="css,result" data-user="tw93" data-embed-version="2" data-pen-title="Flexbox playground" class="codepen" data-preview="true">See the Pen <a href="http://codepen.io/tw93/pen/apEmpP/">Flexbox playground</a> by Tw93 (<a href="http://codepen.io/tw93">@tw93</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>
{:/nomarkdown}
