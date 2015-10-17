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
        border: 1px solid red;
        position: relative;
    }
    .box{
        width: 200px;
        height: 100px;
        border: 1px solid blue;
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