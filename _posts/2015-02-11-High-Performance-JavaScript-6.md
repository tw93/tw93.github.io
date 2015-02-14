---
layout:     post
title:      高性能JavaScript--ajax
date:       2015-02-14 21:47:29
summary:    Ajax是高性能JavaScript的基础，它可以通过延迟下载体积较大的资源文件来使页面加载更快，它通过异步的方式在客户端和服务器之间传递数据，从而避免页面资源一窝蜂的下载。它甚至可以只用一个HTTP请求就获得整个页面的资源。选择合适的传输方式和最有效的数据格式，可以显著改善用户和网站的交互体验。
categories: JavaScript  学习笔记
---

ajax是高性能JavaScript的基础，它可以通过延迟下载体积较大的资源文件来使页面加载更快，它通过异步的方式在客户端和服务器之间传递数据，从而避免页面资源一窝蜂的下载。它甚至可以只用一个HTTP请求就获得整个页面的资源。选择合适的传输方式和最有效的数据格式，可以显著改善用户和网站的交互体验。我们这里主要讨论从服务器接收发数据速度最快的技术，以及最为有效的数据编码格式。  

###常用的向服务器请求数据的技术
####XMLHttpRequest(XML)
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

当使用XHR请求数据时候，对于那些不会改变服务器状态，只会获取数据的请求，应该使用GET。经GET请求的数据会被缓存起来，如何需要多次请求统一数据，它会有助于提高性能。
只有当请求URL加上参数长度接近或者超过2048个字符时候，才应该使用POST获取数据，这是因为**IE限制了URL长度**，过长请求会被截断。

####动态脚本注入
这种方法克服了XHR的最大限制：它能跨域请求。