---
layout: post
title: Ajax Performance Optimization
date: 2015-02-14 21:47:29
summary: Ajax is the foundation of high-performance JavaScript. It can make page loads faster by delaying the download of larger resource files. It passes data between the client and the server asynchronously, thereby avoiding batch downloading of page resources. it can even get resources for the entire page with just one HTTP request. Choosing appropriate transmission methods and most effective data formats can significantly improve the interaction experience between users and websites ...
categories: Study
---

Ajax is the foundation of high-performance JavaScript. It can make page loads faster by delaying the download of larger resource files. It passes data between the client and the server asynchronously, thereby avoiding batch downloading of page resources. it can even get resources for the entire page with just one HTTP request. Choosing appropriate transmission methods and most effective data formats can significantly improve the interaction experience between users and websites. Here we mainly discuss the technologies that send and receive data from the server the fastest, as well as the most effective data encoding formats.

### Common Technologies for Requesting Data from the Server

#### XMLHttpRequest(XHR)

Usage example:
{% highlight javascript %}
var url = '/data.php';
var params = [
    'id=9798',
    'limit=20'
];
var req = new XMLHttpRequest();
req.onreadystatechange = function() {
    if (req.readyState === 4) {
        //Get response header information
        var responseHeaders = req.getAllResponseHeaders();
        //Get data
        var data = req.responseText;
        //Data processing

    }
}
req.open('GET', url + '?' + params.join('&'), true);
//Set request header information
req.setRequestHeader('X-Request-With', 'XMLHttpRequest')；
req.send(null); //Send a request
{%endhighlight%}

When using XHR to request data, for requests that do not change server state and only get data, GET should be used. Data requested via GET will be cached. If you need to request uniform data multiple times, it will help improve performance.
Only when the request URL plus parameter length is close to or exceeds 2048 characters should POST be used to get data, because **IE limits URL length**, and over-long requests will be truncated.

#### Dynamic Script Injection

This method overcomes the biggest limitation of XHR: it can request across domains. You don't need to instantiate a dedicated object, but can use JavaScript to create a new script tag and set its property to URLs of different domains. However, compared with XHR, the control provided by dynamic script injection is limited. you can't set request header information, pass parameters only using GET, and can't set request timeout processing and retries, which means you may not necessarily know if it fails. You must wait until all data is returned before you can access them. You can't request header information, nor can you handle the entire response information as a string. Also, it must be executable JavaScript source code, and must be encapsulated in a callback function.
{% highlight javascript %}
var scriptElement=document.createElement('script');
scriptElement.src='http://any-domain.com/javascript/lib.js';
document.getElementByTagName('head')[0].appendChild(scriptElement);

function jsonCallback(jsonString){
    var data=eval('('+jsonString+')');
    //Process data...
    }
{% endhighlight %}
In the example above, lib.js must encapsulate the data in the jsonCallback function:
{% highlight javascript %}
jsonCallback({"status":1,"color":["#fff","#000","f00"]});
//Despite many limitations, this technology is very fast.
{%endhighlight%}

#### Multipart XHR

MXHR allows the client to transmit multiple resources from the server to the client using only one HTTP request. it packages resources (CSS files, HTML fragments, JavaScript code, or base64 encoded images) into a string agreed upon by both parties on the server side and sends it to the client, then uses JavaScript code to handle this long string and parses out each resource according to its mime-type and other incoming headers.
However, resources obtained with this technology cannot be cached by the browser, but in some cases MXHR can still significantly improve the overall performance of the page.

### Sending Data to the Server

#### XMLHttpRequest

Data can be passed back using GET or POST, including any number of HTTP header information. When using XHR to send data to the server, GET will be faster, requiring only one data packet, while POST requires at least two data packets, one for header information and one for POST body. POST is more suitable for sending large amounts of data to the server.
{% highlight javascript %}
var url = '/data.php';
var params = [
    'id=9798',
    'limit=20'
];
var req = new XMLHttpRequest();
req.onerror=function(){
    //Error
    };
req.onreadystatechange = function() {
    if (req.readyState === 4) {
        //Success
    }
}
req.open('POST',url, true);
req.setRequstHeader('Content-Type','application/x-www-form-urlencoded');
req.setRequstHeader('Content-Length',params.length);
req.send(params.join('&'));
{%endhighlight%}

#### Beacons (Image Beacons)

This technology is very similar to dynamic script injection. Use JavaScript to create a new Image object and set the src property to the URL of the server upload script. This URL contains the key-value pair data we pass back through GET. Note that the img element was not created or inserted into the DOM.
{% highlight javascript%}
var url='/status_tracker.php';
var params=[
'step=2',
'time=123241223'
];
(new Image()).src=url+'?'+params.join('&');
{% endhighlight %}

The server will receive the data and save it. It doesn't need to send any feedback to the client because no image will actually be displayed. This is the most effective way to send information back to the server. Its performance overhead is very small, and server errors completely do not affect the client. If you need to return a large amount of data to the client, please use XHR. If you only care about sending data to the server (possibly requiring minimal return information), then please use image beacons.

### Choice of Data Format

Generally speaking, the lighter the data format the better. JSON and custom formats split by strings are the best. If the dataset is large and has requirements for parsing time, please choose between the following two formats.

- JSON-P format: Use dynamic script injection to get it treats data as executable JavaScript instead of string, parsing speed is extremely fast. It can be used across domains, but should not be used when sensitive data is involved.
- Custom format split by characters: Use XHR or dynamic script injection to get it, parse with split(). This technology parses large datasets slightly faster than JSON-P, and usually file sizes are smaller.

### Ajax Performance Guide

Once the most appropriate data transmission technology and data format are chosen, you have to start considering other optimization technologies:

- Reduce request count, can be done by merging JavaScript and CSS files, or using MXHR.
- Shrink page load time, after the main content of the page is loaded, use Ajax to get those secondary files.
- Ensure that your code errors are not output to users, and handle errors on the server side.
- Know when to use mature Ajax libraries and write your own underlying Ajax code.
