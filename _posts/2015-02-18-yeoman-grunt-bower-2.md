---
layout: post
title: 前端开发流程工具 Grunt
date: 2015-02-18 21:47:29
summary: 在上面一篇文章中，我们介绍了前端的包管理器 Bower，这次我们来了解前端应用开发流程工具 Grunt，在JavaScript 开发过程中，我们常常会遇到一些重复性的任务，譬如检查语法是否正确，压缩代码，合并文件，要是以前我们会选择不同的工具来完成不同的任务，但是这样感觉既复杂又耗时，但是现在有了 Grunt，Grunt 就是为了解决这些问题而发明的一个工具，可以帮助我们自动管理和运行各种 JavaScript 任务，简化我们的工作流程 ...
categories: Study
---

在上面一篇文章中，我们介绍了前端的包管理器 Bower，这次我们来了解前端应用开发流程工具 Grunt，在 JavaScript 开发过程中，我们常常会遇到一些重复性的任务，譬如检查语法是否正确，压缩代码，合并文件，要是以前我们会选择不同的工具来完成不同的任务，但是这样感觉既复杂又耗时，但是现在有了 Grunt，Grunt 就是为了解决这些问题而发明的一个工具，可以帮助我们自动管理和运行各种 JavaScript 任务，简化我们的工作流程。

### [Grunt](http://www.gruntjs.org/){:target="_blank"}

#### 为什么使用任务运行工具?

简而言之，自动化。当你处理诸如代码最小化, 代码编译, 单元测试, 代码规范校验等等重复任务时, 你必须要做的工作越少，你的工作就变得越简单。在你完成配置后，不费吹灰之力，一个任务运行工具可以替你和你的团队完成绝大部分日常工作。(官网资料)

#### 为什么使用 Grunt?

Grunt 是一个庞大的生态系统，每天都在成长。你可以自由的选择数以百计的插件以帮助你自动化的处理任务。如果你所需要的插件还被有人创建，那么你可以自己创建插件并通过 npm 很方便的发布以供更多人使用并一起完善。（官网资料）

下面我们来看看当我们运行 Grunt 的样子吧，下面这图是我使用 Grunt 自动运行我一个[Nodejs 项目](https://github.com/tw93/twMovie){:target="_blank"}的截图:

![grunt](http://tw93.github.io/images/grunt1.jpg)

#### 如何安装 Grunt？

1. Grunt 和 Grunt 的插件都是通过 Node.js 的包管理器 npm 来安装和管理的。Grunt 0.4.x 要求 Node.js 的版本>=0.8.0(也就是 0.8.0 及以上版本的 Node.js 才能很好的运行 Grunt)。

2. 为了方便使用 Grunt，我们可以把我们的 Grunt 安装到我们的全局变量中，这样我们就可以在每个项目都使用 Grunt。

<blockquote>npm install -g  grunt-cli</blockquote>

通过以上这两步，我们就将 Grunt 安装好了，以后直接在我们命令行中就可以使用了。

注意，安装 grunt-cli 并不等于安装了 grunt 任务运行器！Grunt CLI 的工作很简单：在 Gruntfile 所在目录调用运行已经安装好的相应版本的 Grunt。这就意味着可以在同一台机器上同时安装多个版本的 Grunt。

#### 如和使用 grunt 来管理项目？

- 首先需要往项目里添加两个文件：package.json 和 Gruntfile.js。其中 package.json 是用来为 npm 存放项目配置的元数据的，可以通过这里来学习[npm init](https://docs.npmjs.com/cli/init){:target="_blank"}。可以通过这个命令来生成我们项目的 package.json，与 grunt 关系最大的配置在 devDependencies 中。这是我的一个[Nodejs 项目](https://github.com/tw93/twMovie){:target="_blank"}的 package.json：
{% highlight json%}
{
  "name": "twMovie",
  "version": "0.0.1",
  "description": "twMovie is builded by node and mongodb",
  "main": "app.js",
  "dependencies": {
    "body-parser": "^1.10.2",
    "connect-mongo": "^0.7.0",
    "cookie-parser": "^1.3.3",
    "crypto": "0.0.3",
    "express": "^4.11.1",
    "express-session": "^1.10.1",
    "grunt-concurrent": "^1.0.0",
    "jade": "^1.9.1",
    "moment": "^2.9.0",
    "mongoose": "^3.8.22",
    "morgan": "^1.5.1",
    "path": "^0.11.14",
    "serve-favicon": "^2.2.0",
    "underscore": "^1.7.0"
  },
  "devDependencies": {
    "grunt": "^0.4.5",
    "grunt-concurrent": "^1.0.0",
    "grunt-contrib-watch": "^0.6.1",
    "grunt-nodemon": "^0.3.0"
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/tw93/twMovie.git"
  },
  "keywords": [
    "twmovie",
    "movie"
  ],
  "author": "tw93",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/tw93/twMovie/issues"
  },
  "homepage": "https://github.com/tw93/twMovie"
}

{%endhighlight%}

- 然后在命令行进入项目所在目录，键入如下命令即可，npm 会根据 devDependencies 中的配置，将需要的 grunt 及其插件下载到你的项目目录中。
<blockquote>npm install grunt --save-dev</blockquote>

- 接着需要新建一个叫做 Gruntfilejs 的文件，它用于配置或者定义 Grunt 任务和加载 Grunt 插件，这个文件就是当我们在命令行里面运行 grunt 时候的一个“入口文件”，我们需要在这个文件里面设置好我们的自定义任务，具体可以看 Grunt 的[官方文档](http://www.gruntjs.org/docs/sample-gruntfile.html){:target="_blank"}。

 - 最后通过grunt命令就可以自动化运行我们的项目了。 
注：一个比较完整的Gruntfile.js我是这样写的：
{%highlight javascript%}
module.exports = function(grunt) {
    grunt.initConfig({
        watch: {
            jade: {
                files: ['views/**'],
                options: {
                    livereload: true
                }
            },
            js: {
                files: ['public/js/**', 'models/**/*.js', 'schemas/**/*.js'],
                // tasks: ['jshint'],
                options: {
                    livereload: true
                }
            }
        },
        nodemon: {
            dev: {
                script: 'app.js',
                options: {
                    file: 'app.js',
                    args: [],
                    ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],
                    watchedExtensions: ['js'],
                    watchedFolders: ['./'],
                    debug: true,
                    delayTime: 1,
                    env: {
                        PORT: 3000
                    },
                    cwd: __dirname
                }
            }
        },
        concurrent: {
            target: {
                tasks: ['nodemon', 'watch'],
                options: {
                    logConcurrentOutput: true
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.option('force', true);
    grunt.registerTask('default', ['concurrent:target']);
};
{%endhighlight%}

还是建议大家多看看 Grunt 的官方文档，通过官方文档来学习会快一点。
