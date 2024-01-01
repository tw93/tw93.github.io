---
layout: post
title: JavaScript 的加载和执行性能优化
date: 2015-02-03 11:21:29
summary: 管理浏览器中的JavaScript代码是一个棘手的问题，因为代码在执行过程中会阻塞浏览器的其他进程，比如用户界面的绘制。每次遇到 script 标签，页面都必须停下来等待代码下载（如果是外链文件）并执行，然后继续处理其他部分。尽管如此，还是有一些方法减少 JavaScript 对性能的影响 ...
categories: Study
---

管理浏览器中的 JavaScript 代码是一个棘手的问题，因为代码在执行过程中会阻塞浏览器的其他进程，比如用户界面的绘制。每次遇到 script 标签，页面都必须停下来等待代码下载（如果是外链文件）并执行，然后继续处理其他部分。
尽管如此，还是有一些方法减少 JavaScript 对性能的影响。

### 脚本位置

大多数浏览器都使用单一进程来处理用户界面（UI）更新和 JavaScript 脚本执行，所以同一时刻只能进行其中一件事情。IE8，firefox，safari，chrome 都允许并行下载 JavaScript 文件，遗憾的是，JavaScript 的下载仍会阻塞其他资源的下载，所以推荐所有的 script 标签都尽可能放到/body 标签的底部。

### 组织脚本

由于每个 script 标签的初始下载时候都会阻塞页面渲染，所以减少页面包含的 script 标签数量有助于减少这一情况，无论是外链文件还是内嵌脚本都是如此。
这里可以使用[Grunt](http://www.gruntjs.org/){:target="_blank"}的内置 concat 工具来合并我们的脚本，通过 min 工具来压缩我们的脚本。  
那么什么是 Grunt 呢？Grunt 是一个基于任务的 JavaScript 项目命令行构建工具，运行于 Node.js 平台。Grunt 能够从模板快速创建项目，合并、压缩和校验 CSS & JS 文件，运行单元测试以及启动静态服务器。

### 无阻塞的脚本

由于尽管下载一个较大的 javascript 文件只产生一次 HTTP 请求，却会锁死浏览器一大段时间，为了避免，需要逐步加载 javascript 文件，我们可以在页面加载完成后才加载 javascript 代码，也就是说 window 对象的 load 触发后再下载脚本。  
1.defer:  
Defer 属性指明本元素所含脚本不会修改 DOM，因此代码能够安全地延迟执行。（只有 E4+和火狐 3.5+支持，还有 defer 属性的 script 是在 onload 事件处理执行之前被调用）。  
2.动态脚本元素
{% highlight javascript %}
//无论何时启动下载，文件的下载和执行过程都不会阻塞页面其他进程
var script = document.createElement("script");
script.type = "text/javascript";
script.src = "file.js";
document.getElementsByTagName["head"](0).appendChild(script);

//兼容 IE 和高级浏览器的，侦听获取脚本加载完成时的状态
function loadScript(url, callback) {
  var script = document.createElement("script");
  script.type = "text/javascript";
  if (script.readyState) { //IE
    script.onreadystatechange = function() {
      if (script.readyState === "load" || script.readyState === "complete") {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {
    script.onload = function() {
      callback();
    };
  }
  script.src = url;
  document.getElementsByTagName["head"](0).appendChild(script);
}
{% endhighlight %}  
3.动态脚本元素
{% highlight javascript %}
var xhr = new XMLHttpRequest();
xhr.open("get", "file.js", true);
xhr.onreadystatechange = function() {
  if (xhr.readyState == 4) {
    if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
      //2XX表示有效响应，304表示从缓存读取
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.text = xhr.responseText;
      document.body.appendChild(script);
    }
  }
};
//优点：下载后可以先不执行，同样的代码支持全部主流浏览器
//缺点：javascript 文件和所请求的页面必须在同一个域中，因此不适合 CDN 下载。
//故一般大型的 web 应用都不会采用 XHR 脚本注入技术。
{% endhighlight %}

4.推荐一种无阻塞方式  
{% highlight javascript %}
//先添加动态加载所需的代码，然后加载初始化页面所需要的剩下的代码。
//因为第一部的尽量精简，甚至可能只包含 loadScript()函数，
//它的下载执行速度都很快，所以不会对于页面造成太多影响。
//一旦初始化代码就位，就用它来加载剩余的 javascript。

<script type="text/javascript" src="loader.js"></script>
<script type="text/javascript">
  loadScript("the-rest.js", function() {
    Application.init(); //参考动态加载脚本
  });
</script>
//还有一种方式直接将loadScript()函数嵌入页面，避免多一次请求
//初始化代码压缩到最小尺寸的一些库  YUI Compressor,
//YUI3的方式，LazyLoad，LABjs
//很建议使用grunt工具来优化你的js
{% endhighlight %}

以上这些方法可以提高一些 JavaScript 的加载和执行的性能，下一篇文章想总结下关于数据访问方面的性能优化。
