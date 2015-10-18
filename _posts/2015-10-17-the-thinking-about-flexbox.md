---
layout:     post
title:      我对Flexbox布局模式看法
date:       2015-10-17 21:47:29
summary:    上班已经将近3个月了，但是文章产出值几乎为0，这样是不行的，常常总结学习才会有收获，不然就走马观花了，以后争取每周有一篇文章的产出。进入正题，Flexbox，一种CSS3的布局模式，也叫做弹性盒子模型，用来为盒装模型提供最大的灵活性。
categories: Flexbox布局模式
---

上班已经将近3个月了，但是文章产出值几乎为0，这样是不行的，常常总结学习才会有收获，不然就走马观花了，以后争取每周有一篇文章的产出。进入正题，Flexbox，一种CSS3的布局模式，也叫做弹性盒子模型，用来为盒装模型提供最大的灵活性。

首先举一个栗子，之前我们是这样实现一个div盒子水平垂直居中的。在知道对象高宽的情况下，对居中元素绝对百分比定位，然后通过margin偏移的方式来实现。

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

假如使用了flex后，实现起来就简单了，而且不需要自己去算，也不需要绝对定位，只需要通过对伸缩容器定义两个属性，justify-content定义伸缩项目沿着主轴线的对齐方式为center， align-items定义伸缩项目在侧轴（垂直于主轴）的对齐方式为center，具体如下：
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


其实Flexbox的优秀特性并不是这一些，首先来一张它的属性图吧~

![flexbox](http://tw93.github.io/images/flexbox.png)

首先我们来分析下这一张图，从第一个子节点可以看到Flexbox由Flex容器和Flex项目组成，容器即父元素，项目即子元素。他们之间的一些关系可以这样来表示：

![Flex-direction-terms-new.zh-hans](http://tw93.github.io/images/Flex-direction-terms-new.zh-hans.png)

这张图可以在接下来的属性分析中用到。

### Flex容器

#### display:flex
当我们使用flexbox布局时候，需要先给父容器的display值定位flex（块级）或者inline-flex（行内级）。

当使用了这个值以后，伸缩容器会为内容建立新的伸缩格式化上下文（FFC），它的上下文展示效果和BFC根元素相同（BFC特性：浮动不会闯入伸缩容器，且伸缩容器的边界不会与其内容边界叠加）。

伸缩容器不是块容器，因此有些设计用来控制块布局的属性，在伸缩布局中不适用，特别是多栏（column)，float，clear，vertical-align这些属性。

#### flex-direction

[flex-direction]属性用来控制上图中伸缩容器中**主轴的方向**，同时也决定了伸缩项目的方向。

- flex-direction:row;也是默认值，即主轴的方向和正常的方向一样，从左到右排列。
- flex-direction:row-reverse;和row的方向相反，从右到左排列。
- flex-direction:column;从上到下排列。
- flex-direction:column-reverse;从下到上排列。
以上只针对ltr书写方式，对于rtl正好相反了。
	
网页展示效果如下：

![flex-direction](http://tw93.github.io/images/flex-direction.png)

#### flex-warp

「flex-wrap」属性控制伸缩容器是单行还是多行，也决定了侧轴方向（新的一行的堆放方向）。

- flex-wrap:nowrap;伸缩容器单行显示，默认值；
- flex-wrap:wrap;伸缩容器多行显示；伸缩项目每一行的排列顺序由上到下依次。
- flex-wrap:wrap-reverse;伸缩容器多行显示，但是伸缩项目每一行的排列顺序由下到上依次排列。

网页效果见图；

![flex-wrap](http://tw93.github.io/images/flex-wrap.png)

#### flex-flow

[flex-flow]属性为flex-direction（主轴方向）和flex-wrap（侧轴方向）的缩写，两个属性决定了伸缩容器的主轴与侧轴。

- flex-flow:[flex-direction][flex-wrap];默认值为row  nowrap；

举两个栗子：

- flex-flow:row;也是默认值；主轴是行内方向，单行显示，不换行；
- flex-flow:row-reverse wrap;主轴和行内方向相反，从右到左，项目每一行由上到下排列（侧轴）。

网页效果如下：

![flex-flow](http://tw93.github.io/images/flex-flow.png)

这里大家可以多自己去试试不同的组合。

### justify-content
[justify-content]:用于定义伸缩项目在主轴上面的的对齐方式，当一行上的所有伸缩项目都不能伸缩或可伸缩但是已经达到其最大长度时，这一属性才会对多余的空间进行分配。当项目溢出某一行时，这一属性也会在项目的对齐上施加一些控制。

- justify-content:flex-start;伸缩项目向主轴的起始位置开始对齐，后面的每元素紧挨着前一个元素对齐。
- justify-content:flex-end;伸缩项目向主轴的结束位置对齐，前面的每一个元素紧挨着后一个元素对齐。
- justify-content:center;伸缩项目相互对齐并在主轴上面处于居中，并且第一个元素到主轴起点的距离等于最后一个元素到主轴终点的位置。以上3中都是“捆绑”在一个分别靠左、靠右、居中对齐。
- justify-content:space-between;伸缩项目平均的分配在主轴上面，并且第一个元素和主轴的起点紧挨，最后一个元素和主轴上终点紧挨，中间剩下的伸缩项目在确保两两间隔相等的情况下进行平分。
- justify-content:space-around;伸缩项目平均的分布在主轴上面，并且第一个元素到主轴起点距离和最后一个元素到主轴终点的距离**相等**，且等于中间元素两两的间距的**一半**。完美的平均分配，这个布局在阿里系中很常见。

还是看demo理解起来快一点：

![justify-content1](http://tw93.github.io/images/justify-content1.png)

![justify-content2](http://tw93.github.io/images/justify-content2.png)

### 
