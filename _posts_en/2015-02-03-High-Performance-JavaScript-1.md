---
layout: post
title: Loading and Execution Performance Optimization of JavaScript
date: 2015-02-03 11:21:29
summary: Managing JavaScript code in browsers is a tricky problem because code execution blocks other browser processes, such as user interface painting. Every time a script tag is encountered, the page must stop and wait for the code to download (if it is an external file) and execute, and then continue to process other parts. Despite this, there are still some ways to reduce the impact of JavaScript on performance ...
categories: Study
---

Managing JavaScript code in browsers is a tricky problem because code execution blocks other browser processes, such as user interface painting. Every time a script tag is encountered, the page must stop and wait for the code to download (if it is an external file) and execute, and then continue to process other parts.
Despite this, there are still some ways to reduce the impact of JavaScript on performance.

### Script Location

Most browsers use a single process to handle user interface (UI) updates and JavaScript script execution, so only one thing can be done at the same time. IE8, firefox, safari, chrome all allow parallel downloading of JavaScript files. Regrettably, JavaScript downloading will still block the downloading of other resources, so it is recommended that all script tags be placed as much as possible at the bottom of the /body tag.

### Organize Scripts

Since the initial download of each script tag blocks page rendering, reducing the number of script tags contained in the page helps reduce this situation, whether it is an external file or an inline script.
Here you can use the built-in concat tool of [Grunt](http://www.gruntjs.org/){:target="_blank"} to merge our scripts, and compress our scripts through the min tool.  
So what is Grunt? Grunt is a task-based JavaScript project command line build tool running on the Node.js platform. Grunt can quickly create projects from templates, merge, compress and verify CSS & JS files, run unit tests and start static servers.

### Non-blocking Scripts

Although downloading a larger javascript file only produces one HTTP request, it will lock the browser for a long time. To avoid this, we need to load javascript files gradually. We can load javascript code after the page is loaded, that is, download the script after the window object's load triggers.  
1.defer:  
The Defer attribute indicates that the script contained in this element will not modify the DOM, so the code can be safely delayed execution. (Only E4+ and Firefox 3.5+ support, and scripts with defer attribute are called before onload event processing execution).  
2.Dynamic Script Elements
{% highlight javascript %}
//Regardless of when the download is started, the file download and execution process will not block other processes on the page
var script = document.createElement("script");
script.type = "text/javascript";
script.src = "file.js";
document.getElementsByTagName["head"](0).appendChild(script);

//Compatible with IE and advanced browsers, listen to obtain the status when script loading is completed
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
3.Dynamic Script Elements
{% highlight javascript %}
var xhr = new XMLHttpRequest();
xhr.open("get", "file.js", true);
xhr.onreadystatechange = function() {
  if (xhr.readyState == 4) {
    if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
      //2XX represents valid response, 304 represents reading from cache
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.text = xhr.responseText;
      document.body.appendChild(script);
    }
  }
};
//Advantages: Can not execute first after downloading, same code supports all mainstream browsers
//Disadvantages: javascript file and requested page must be in same domain, so not suitable for CDN download.
//Therefore generally large web applications will not adopt XHR script injection technology.
{% endhighlight %}

4.Recommend a non-blocking way  
{% highlight javascript %}
//First add code required for dynamic loading, then load remaining code required for initializing page.
//Because the first part is as concise as possible, maybe even only containing loadScript() function,
//its download execution speed is very fast, so it will not cause too much impact on the page.
//Once initialization code is in place, use it to load remaining javascript.

<script type="text/javascript" src="loader.js"></script>
<script type="text/javascript">
  loadScript("the-rest.js", function() {
    Application.init(); //Refer to dynamic loading script
  });
</script>
//There is another way to directly embed loadScript() function into page, avoiding one more request
//Some libraries compressing initialization code to minimum size  YUI Compressor,
//YUI3 way, LazyLoad, LABjs
//Highly suggest using grunt tool to optimize your js
{% endhighlight %}

These methods above can improve some JavaScript loading and execution performance. The next article wants to summarize performance optimization regarding data access.