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

## Flex容器

### display:flex
当我们使用flexbox布局时候，需要先给父容器的display值定位flex（块级）或者inline-flex（行内级）。

当使用了这个值以后，伸缩容器会为内容建立新的伸缩格式化上下文（FFC），它的上下文展示效果和BFC根元素相同（BFC特性：浮动不会闯入伸缩容器，且伸缩容器的边界不会与其内容边界叠加）。

伸缩容器不是快容器，因此有些设计用来控制块布局的属性，在伸缩布局中不适用，特别是多栏（column)，float，clear，vertical-align这些属性。

### flex-direction

flex-direction属性用来控制上图中伸缩容器中**主轴的方向**，同时也决定了伸缩项目的方向。
flex-direction:row;也是默认值，即主轴的方向和正常的方向一样，从左到右排列。
flex-direction:row-reverse;和row的方向相反，从右到左排列。
flex-direction:column;从上到下排列。
flex-direction:column-reverse;从下到上排列。
以上只针对ltr书写方式，对于rtl正好相反了。
网页展示效果如下：

![flex-direction](http://tw93.github.io/images/flex-direction.png)


