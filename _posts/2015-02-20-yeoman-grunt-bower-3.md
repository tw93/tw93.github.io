---
layout:     post
title:      前端开发流程工具(Yeoman)
date:       2015-02-21 21:47:29
summary:    在上一篇文章中我们介绍了可以帮助我们自动管理和运行各种JavaScript任务的Grunt，再上一篇文章我们介绍了前端包管理器Bower，这篇文章我们来介绍Yeoman这个神奇的脚手架，Yeoman是Google的团队和外部贡献者团队合作开发的，他的目标是通过Grunt（一个用于开发任务自动化的命令行工具）和Bower（一个HTML、CSS、Javascript和图片等前端资源的包管理器）的包装为开发者创建一个易用的工作流。下面我给大家大致来介绍下这个神奇的工具。
categories: 我的前端总结分享 
---
在上一篇文章中我们介绍了可以帮助我们自动管理和运行各种JavaScript任务的Grunt，再上一篇文章我们介绍了前端包管理器Bower，这篇文章我们来介绍Yeoman这个神奇的脚手架，Yeoman是Google的团队和外部贡献者团队合作开发的，他的目标是通过Grunt（一个用于开发任务自动化的命令行工具）和Bower（一个HTML、CSS、Javascript和图片等前端资源的包管理器）的包装为开发者创建一个易用的工作流。下面我给大家大致来介绍下这个神奇的工具。

###[Yeoman](http://yeoman.io/){:target="_blank"}

####什么是Yeoman？   
Yeoman---用于构建现代Web应用的脚手架（一种提高开发效率的工具的代名词）。

![Yeoman](http://tw93.github.io/images/yeoman1.jpg)
Yeoman主要由以下3部分组成：

 - yo：Yo 是一个 Web 应用的架构（scaffolding）工具。它提供了非常多的模板，用来生成不同类型的 Web 应用。这些模板称为生成器（generator）。
 - [Grunt](http://tw93.github.io/2015-02-18/yeoman-grunt-bower-2.html){:target="_blank"}：一个帮助我们自动管理和运行JavaScript的任务之执行工具，可以用了检查代码语法是否正确，压缩代码，合并文件，通过Grunt可以简化我们的工作流程。
 - [Bower](http://tw93.github.io/2015-02-17/yeoman-grunt-bower-1.html){:target="_blank"}：Bower是一个js的包管理器，可以管理各个包之间的依赖关系，有了它以后你再也不需要手动下载和管理你的脚本文件。
