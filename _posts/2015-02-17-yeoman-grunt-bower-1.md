---
layout: post
title: 前端开发流程工具 Cmder 和 Bower
date: 2015-02-17 21:47:29
summary: 前端开发的确不是以前那种前端开发，如果说我们过去的前端开发是处于“刀耕火种”时代，那么现在的前端开发无疑已经进入了"工厂生产"的时代。近几年，随着Nodejs的出现，伴随着出现了很多优秀的前端开发管理工具，极大的方便着我们的前端开发，的确 Nodejs 是上帝送给我们前端开发工程师最好的礼物。下面几篇文章我给大家来介绍一些前端开发过程中需要用到的优秀的工具：Cmder、Bower、grunt、Yeoman ...
categories: Study
---

前端开发的确不是以前那种前端开发，如果说我们过去的前端开发是处于“刀耕火种”时代，那么现在的前端开发无疑已经进入了"工厂生产"的时代。近几年，随着 Nodejs 的出现，伴随着出现了很多优秀的前端开发管理工具，极大的方便着我们的前端开发，的确 Nodejs 是上帝送给我们前端开发工程师最好的礼物。下面几篇文章我给大家来介绍一些前端开发过程中需要用到的优秀的工具：cmder、Bower、grunt、Yeoman。

### [Cmder](https://cmder.app/){:target="_blank"}

看起来 cmder 貌似和我们的前端开发流程关系不大，假如说 bower、grunt、Yeoman 这些工具是“马”的话，那么 cmder 这个工具就是一个好“鞍”（好马配好鞍）。

你一定会被这个 cmd 代替工具所吸引，首先上图：

![Cmder](http://tw93.github.io/images/main.jpg)

只能用优雅来形容这个软件，色彩非常性感，在使用上面也明显方便于 windows 自带的那个蹩脚的 cmd。官方是这个介绍的：Cmder is a software package created out of pure frustration over the absence of nice console emulators on Windows. It is based on amazing software, and spiced up with the Monokai color scheme and a custom prompt layout. Looking sexy from the start.

全安装版 cmder 自带了 msysgit, 压缩包 23M, 除了 git 本身这个命令之外,里面可以使用大量的 linux 命令，譬如下面我用它来提交我今天这篇博客到我的 github。
![Cmder](http://tw93.github.io/images/cmder1.jpg)  
由于这里仅仅是一个介绍，对于有很多配置方面的，建议大家 google 查找对应的设置方案，我相信你会喜欢上这个工具的。

### [Bower](http://bower.io/){:target="_blank"}

Bower 是 twitter 推出的一款包管理工具，官网是这样概括的：Web sites are made of lots of things — frameworks, libraries, assets, utilities, and rainbows. Bower manages all these things for you.翻译大家应该可以看懂。

![Bower](http://tw93.github.io/images/bower1.jpg)

我们为什么要使用这个工具呢？我的理解有如下几个原因：

- 可以极大的节省我们的时间，它可以节省我们寻找客户端的依赖关系时间，譬如我们需要 angular 的时候，直接输入 bower install angular 就可以直接将 angular 下载到我们本地目录,你不需要去记版本号之类的东西，你也可以通过 Bower 的 info 命令去查看任意库的信息。
- 通过 bower init 初始化，建立一个 bower.json 的文件，你可以很轻松的展示客户端的依赖关系，在这个文件里你可以指定所有客户端的依赖关系，任何时候你需要弄清楚你正在使用哪些库，你可以参考这个文件。
- 管理更加简单，包括卸载一个包，更新一个包，都可以直接通过命令方式进行。

如何使用呢？我简单地介绍一下：

1.由于 Bower 要求你的系统中已经安装了 Node、npm 和 git，然后我们将 Bower 安装到我们的全局变量中。

<blockquote>npm install -g bower</blockquote>

2.安装包时候我们使用 bower install 这个命令，运行这个命令后我们的包会被安装到 bower_components/这个目录里面。

<blockquote>bower install package </blockquote>

3.譬如我要安装 angular 这个库，见下图：

![Bower](http://tw93.github.io/images/angular1.jpg)

最后还有一些详细的使用方法，请访问官网学习更加详细的知识。
