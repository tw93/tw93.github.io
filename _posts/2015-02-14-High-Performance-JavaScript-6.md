---
layout: post
title: Ajax 性能的优化
date: 2015-02-14 21:47:29
summary: Ajax 是高性能 JavaScript 的基础，它可以通过延迟下载体积较大的资源文件来使页面加载更快，它通过异步的方式在客户端和服务器之间传递数据，从而避免页面资源一窝蜂的下载。它甚至可以只用一个 HTTP 请求就获得整个页面的资源。选择合适的传输方式和最有效的数据格式，可以显著改善用户和网站的交互体验 ...
categories: Study
---

Ajax 是高性能 JavaScript 的基础，它可以通过延迟下载体积较大的资源文件来使页面加载更快，它通过异步的方式在客户端和服务器之间传递数据，从而避免页面资源一窝蜂的下载。它甚至可以只用一个 HTTP 请求就获得整个页面的资源。选择合适的传输方式和最有效的数据格式，可以显著改善用户和网站的交互体验。我们这里主要讨论从服务器接收发数据速度最快的技术，以及最为有效的数据编码格式。

### 常用的向服务器请求数据的技术

#### XMLHttpRequest(XML)

使用范例：
{% highlight javascript %}
var url = '/data.php';
var params = [
    'id=9798',
    'limit=20'
];
var req = new XMLHttpRequest();
req.onreadystatechange = function() {
    if (req.readyState === 4) {
        //获取响应的头信息
        var responseHeaders = req.getAllResponseHeaders();
        //获取数据
        var data = req.responseText;
        //数据处理

    }
}
req.open('GET', url + '?' + params.join('&'), true);
//设置请求头信息
req.setRequestHeader('X-Request-With', 'XMLHttpRequest')；
req.send(null); //发送一个请求
{%endhighlight%}

当使用 XHR 请求数据时候，对于那些不会改变服务器状态，只会获取数据的请求，应该使用 GET。经 GET 请求的数据会被缓存起来，如果需要多次请求统一数据，它会有助于提高性能。
只有当请求 URL 加上参数长度接近或者超过 2048 个字符时候，才应该使用 POST 获取数据，这是因为**IE 限制了 URL 长度**，过长请求会被截断。

#### 动态脚本注入

这种方法克服了 XHR 的最大限制：它能跨域请求。你不需要实例化一个专用对象，而可以使用 JavaScript 创建一个新的脚本标签，并设置它的属性为不同域的 URL,但是和 XHR 相比，动态脚本注入提供的控制是有限的，你不能设置请求头信息，传递参数也只能使用 GET，不能设置请求的超时处理和重试，也就是说失败了你也不一定知道。你必须等到所有数据都返回你才可以访问它们。你不能请求头信息，也不能把整个响应信息作为字符串来处理。还有必须是可执行的 JavaScript 源码，而且必须封装在一个回调函数中。
{% highlight javascript %}
var scriptElement=document.createElement('script');
scriptElement.src='http://any-domain.com/javascript/lib.js';
document.getElementByTagName('head')[0].appendChild(scriptElement);

function jsonCallback(jsonString){
    var data=eval('('+jsonString+')');
    //处理数据...
    }
{% endhighlight %}
在上面那个例子里，lib.js 必须把数据封装在jsonCallback 函数里面：
{% highlight javascript %}
jsonCallback({"status":1,"color":["#fff","#000","f00"]});
//尽管有很多限制，但是这项技术的速度非常快。
{%endhighlight%}

#### Multipart XHR

MXHR 允许客户端只使用一个 HTTP 请求就可以从服务端向客户端传送多个资源，它通过在服务端将资源（CSS 文件，HTML 片段，JavaScript 代码，或 base64 编码的图片）打包成一个双方约定的字符串并发送到客户端，然后用 JavaScript 代码处理这个长字符串，并根据它的 mime-type 类型和传入其他头信息解析出每个资源。
但是以这种技术获得的资源不能够被浏览器缓存 ，但是某些情况下 MXHR 依然能显著提高页面的整体性能。

### 发送数据给服务器

#### XMLHttpRequest

数据可以使用 GET 或 POST 的方式传回来，包括任意数量的 HTTP 头信息，当使用 XHR 发送数据给服务器时候，使用 GET 会更快，只需要发送一个数据包，POST 至少两个数据包，一个装载头信息，一个装载 POST 正文。POST 更适合发送大量数据到服务器。
{% highlight javascript %}
var url = '/data.php';
var params = [
    'id=9798',
    'limit=20'
];
var req = new XMLHttpRequest();
req.onerror=function(){
    //出错
    };
req.onreadystatechange = function() {
    if (req.readyState === 4) {
        //成功
    }
}
req.open('POST',url, true);
req.setRequstHeader('Content-Type','application/x-www-form-urlencoded');
req.setRequstHeader('Content-Length',params.length);
req.send(params.join('&'));
{%endhighlight%}

#### Beacons（图片信标）

这项技术非常类似动态脚本注入。使用 JavaScript 创建一个新的 Image 对象，并把 src 属性设置为服务器上传脚本的 URL。该 URL 包含我们通过 GET 传回的键值对数据。请注意并没有创建 img 元素或把它插入 DOM。
{% highlight javascript%}
var url='/status_tracker.php';
var params=[
'step=2',
'time=123241223'
];
(new Image()).src=url+'?'+params.join('&');
{% endhighlight %}

服务器会接收数据并保存下来，它无需向客户端发送任何回馈信息，因为没有图片会实际显示出来，这是往服务器回传信息最有效的方式。它的性能消耗很小，而且服务器的错误完全不会影响客户端。如果你需要返回大量数据给客户端，那么请使用 XHR，如果你只关心发送数据给服务器（可能需要极少的返回信息），那么请使用图片信标。

### 数据格式的选择

通常来说数据格式越轻量越好，JSON 和字符串分割的自定义格式是最好的。如果数据集很大并且对解析时间有要求，那么请从如下两种格式中做出选择。

- JSON-P 格式：使用动态脚本注入获取他把数据当作可以执行的 JavaScript 而不是字符串，解析速度极快。它能够跨域使用，但涉及敏感数据的时候不应该使用它。
- 字符分割的自定义格式：使用 XHR 或动态脚本注入获取，用 split()解析。这种技术解析大数据集比 JSON-P 略快，而且通常文件尺寸更小。

### Ajax 性能指南

一旦选择了最合适和数据传输技术和数据格式，那么你就得开始考虑其他优化技术了：

- 减少请求数，可以通过合并 JavaScript 和 CSS 文件，或者使用 MXHR。
- 缩小页面的加载时间，页面主要内容加载完成后，用 Ajax 获取那些次要的文件。
- 确保你的代码错误不会输出给用户，并在服务端处理错误。
- 知道何时使用成熟的 Ajax 类库，以及编写自己的底层 Ajax 代码。
