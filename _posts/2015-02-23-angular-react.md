---
layout:     post
title:      使用react提高angular的渲染性能(译) 
date:       2015-02-23 21:47:29
summary:    当你使用AngularJs的时候你遇到过性能问题吗？使用ReactJs可以使页面渲染得更快。下面通过几个案例来对比用react来渲染AngularJs和直接使用ReactJs来渲染之间的性能区别。  
categories: 我的前端总结分享 
---
原文来自：[aster AngularJS Rendering (AngularJS and ReactJS)](http://www.williambrownstreet.net/blog/2014/04/faster-angularjs-rendering-angularjs-and-reactjs/){:target="_blank"}

当你使用AngularJs的时候你遇到过性能问题吗？使用ReactJs可以使页面渲染得更快。下面通过几个案例来对比用react来渲染AngularJs和直接使用ReactJs来渲染之间的性能区别。

我喜欢AngularJs,我在我的一些有趣的小项目中使用它，同时也在一些大型的专业项目中来使用AngularJs。我同时也使用其他的框架，像BackboneJs和EmberJs，这俩也是很好的工具，以上三种都属于一类叫做MVC的框架(可以叫MVVC),但是每当我使用它们的时候，我都会遇到在渲染性能方面的一些不足，双向数据绑定和单项数据绑定并没有实际的区别，不考虑双向数据绑定的话，我觉得BackboneJS渲染性能好于AngularJs。
