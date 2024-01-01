---
layout:     post
title:      前端开发流程工具 Yeoman
date:       2015-02-21 21:47:29
summary:    在上一篇文章中我们介绍了可以帮助我们自动管理和运行各种JavaScript任务的Grunt，再上一篇文章我们介绍了前端包管理器Bower，这篇文章我们来介绍Yeoman这个神奇的脚手架，Yeoman是Google的团队和外部贡献者团队合作开发的，他的目标是通过Grunt（一个用于开发任务自动化的命令行工具）和Bower（一个HTML、CSS、Javascript和图片等前端资源的包管理器）的包装为开发者创建一个易用的工作流。下面我给大家大致来介绍下这个神奇的工具 ...
categories: Study
---
在上一篇文章中我们介绍了可以帮助我们自动管理和运行各种JavaScript任务的Grunt，再上一篇文章我们介绍了前端包管理器Bower，这篇文章我们来介绍Yeoman这个神奇的脚手架，Yeoman是Google的团队和外部贡献者团队合作开发的，他的目标是通过Grunt（一个用于开发任务自动化的命令行工具）和Bower（一个HTML、CSS、Javascript和图片等前端资源的包管理器）的包装为开发者创建一个易用的工作流。下面我给大家大致来介绍下这个神奇的工具。

### [Yeoman](http://yeoman.io/){:target="_blank"}

#### 什么是Yeoman？   
Yeoman---用于构建现代Web应用的脚手架（一种提高开发效率的工具的代名词）。
Yeoman主要由以下3部分组成：
![Yeoman](http://tw93.github.io/images/yeoman1.jpg)

 - yo：Yo 是一个 Web 应用的架构（scaffolding）工具。它提供了非常多的模板，用来生成不同类型的 Web 应用。这些模板称为生成器（generator）。  
 - [Bower](http://tw93.github.io/2015-02-17/yeoman-grunt-bower-1.html){:target="_blank"}：Bower是一个js的包管理器，可以管理各个包之间的依赖关系，有了它以后你再也不需要手动下载和管理你的脚本文件。  
 - [Grunt](http://tw93.github.io/2015-02-18/yeoman-grunt-bower-2.html){:target="_blank"}：一个帮助我们自动管理和运行JavaScript的任务之执行工具，可以用了检查代码语法是否正确，压缩代码，合并文件，通过Grunt可以简化我们的工作流程。

#### 怎么来使用Yeoman？  
 1.首先你需要安装yo和其他一些要求的工具。（前提是那你已经安装了Nodejs和npm）
 <blockquote>$ npm install -g yo bower grunt-cli gulp</blockquote>
 ![Yeoman](http://tw93.github.io/images/yeoman2.jpg)
 有一个小彩蛋，在这里看到了Yeoman也很推荐[cmder](http://bliker.github.io/cmder/){:target="_blank"} （跑题了，逃）  

 2.为了搭建你的Web应用，你需要安装'generator-webapp'生成器。
 <blockquote>$ npm install -g generator-webapp</blockquote>
 这是一个默认的Web应用生成器，通过它你可以脚手架一个包含 HTML5 Boilerplate, jQuery, Modernizr,Bootstrap的项目，同时你也可以选择使用它们，这个generator将会使用Grunt来进行任务管理（当然你也可以使用gulp）。

 3.等到上面都安装好后，你就可以新建你的项目目录了。
 <blockquote>$ mkdir my-yo-webapp && cd my-yo-webapp</blockquote> 

 4.接着使用下面命令：
 <blockquote>$ yo webapp</blockquote> 
 ![Yeoman](http://tw93.github.io/images/yeoman3.jpg)
 然后选择你需要安装的东西，接着你就可以看到命令行开始飞起来了，完成后，你的目录下会生出如下文件：
 ![Yeoman](http://tw93.github.io/images/yeoman4.jpg)

 5.然后运行下面命令，你会发现有神奇的东西出现：
 <blockquote>$ grunt server</blockquote>

 6.最后你的浏览器就会自动打开一个页面：
 ![Yeoman](http://tw93.github.io/images/yeoman5.jpg)
 接着你就可以愉快的开发你的项目了。

 如果想进一步了解Yeoman，很建议你看官方的一个[Tutorial](http://yeoman.io/codelab.html
 ){:target="_blank"},这里有一个详细的例子，相信你通过它后，能够更了解Yeoman。
