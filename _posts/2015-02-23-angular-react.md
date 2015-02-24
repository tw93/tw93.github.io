---
layout:     post
title:      使用react提高angular的渲染性能(译) 【未完】
date:       2015-02-23 21:47:29
summary:    当你使用AngularJs的时候你遇到过性能问题吗？使用ReactJs可以使页面渲染得更快。下面通过几个案例来对比用react来渲染AngularJs和直接使用ReactJs来渲染之间的性能区别。  
categories: 我的前端总结分享 
---
原文来自：[aster AngularJS Rendering (AngularJS and ReactJS)](http://www.williambrownstreet.net/blog/2014/04/faster-angularjs-rendering-angularjs-and-reactjs/){:target="_blank"}

当你使用AngularJs的时候你遇到过性能问题吗？使用ReactJs可以使页面渲染得更快。下面通过几个案例来对比用react来渲染AngularJs和直接使用ReactJs来渲染之间的性能区别。

我喜欢AngularJs,我在我的一些有趣的小项目中使用它，同时也在一些大型的专业项目中来使用AngularJs。我同时也使用其他的框架，像BackboneJs和EmberJs，这俩也是很好的工具，以上三种都属于一类叫做MVC的框架(可以叫MVVC),但是每当我使用它们的时候，我都会遇到在渲染性能方面的一些不足，双向数据绑定和单项数据绑定并没有实际的区别。不考虑双向数据绑定，我觉得BackboneJS渲染性能好于AngularJs。

现在这个伟大的工具被称为ReactJs，这个看起来不强大的库在最近的几个月中肯定会对JavaScript的MVC框架造成很大的影响。简而言之，这个库终于使渲染性能提升了，ReactJs自称是MVC中的那个V，起初我在想，为什么它会把MC这两部分给抛弃，难道EmberJs, BackboneJS 和AngularJS框架中最有趣的部分不就是MC吗？仔细观察后，你可以看到ReactJs在controller部分也有很特色的地方，然而ReactJs并不是一个全功能的MVC框架，ReactJs的工作原理是保持一个虚拟的DOM,渲染只有在当UI更新时才会改变，这是否有意义呢，听起来新颖但是很真实，发送指令来更新UI,React只改变和更新现存的DOM（使用虚拟DOM超级快），通过虚拟DOM技术变化的差异可以很快的被展现，Facebook和Instagram已经在实际项目中开始使用ReactJs了。

我听过ReactJs的开发者Pete Hunt的谈论ReactJs意图一个播客，很建议你也去听一下这个播客，他在开源reactjs意图是在现有框架的V部分制造一些噪音，我发现这些现存的框架在UI部分打算采取相同的策略，一些可以使用的新库将会出现的。

ReactJs当中的那个V很容易在现在现存的框架中那个V，backbone，还有angular的ngRepeat，可以和Coffeescript一起使用，所以使用React来渲染可以在你应用性能上面派上用场，例如通过ng-repeat来重复几百项，在我以前的[文章](http://www.williambrownstreet.net/blog/2013/07/angularjs-my-solution-to-the-ng-repeat-performance-problem/){:target="_blank"}中,我写了一篇如何使长列表在AngularJs有效，但是所有的使渲染更快的技术是通过渲染列表中的一部分实现的，使用ReactJS来渲染AngularJs，可以使你的**渲染时间较少80%**，我玩ngReact的时候那种性能的提升然后觉得是不是哪儿出错了，渲染时间从原来直接使用AngularJs的4200ms降低到通过使用ReactJs渲染的120ms，你自己也可以去尝试下，或者直接看这篇文章下面的例子。

我仍然经历这一些问题当使用AngularJs进行大量的DOM绑定，但是另外一个问题是特殊的双向数据绑定。如果你对这个问题有些担心，或许你应该去使用比AngularJs更强大的框架，然后ReactJs一个伟大的作用将就是帮助我们使东西尽可能快的显示在用户屏幕上面。

我将会用一个小案例来向你们解释如何来使用ReactJs来渲染一个AngularJs的应用。
 
 - 默认你已经安装了Bower，新建目录，安装reactjs和AngularJs：
  <blockquote>$ mkdir fast-angular</blockquote>  
  <blockquote>$ cd fast-angular</blockquote>  
  <blockquote>$ bower install --save react </blockquote>  
  <blockquote>$ bower install --save angular</blockquote>  

 - 当这些命令运行好后，我们需要的AngularJs和ReactJs已经在我们本地安装好了，接着我们建立一个简单的HTML文件，将这两个脚本引入。

    {%highlight html%}
        <!doctype html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <title></title>
            <meta name="description" content="">
            <meta name="viewport" content="width=device-width">

          </head>
          <body>
            <h1>Fast AngularJs</h1> <h3>AngularJs with ReactJs</h3>


            <script src="bower_components/angular/angular.js"></script>
            <script src="bower_components/react/react.js"></script>

        </body>
        </html>
    {%endhiglight%}
 
 - 我们需要创建一个来渲染我们输入的字符串的ReactJs组件，所以我们使用ReactJs来渲染我们的模型，创建一个名叫做MYAPP的组件，传递给它来呈现一个props，接着我们创建一个传统的angular指令和控制器（增加标记在我们的html来启动这个应用），通过使用指令来告诉它渲染，而不是去调用ReactJs的组件，我们使用$watch来重新渲染和更新我们的框架，当组件已安装更新现有的实例中我们叫做createComponent 。  
    {%highlight html%}
        <!doctype html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <title></title>
            <meta name="description" content="">
            <meta name="viewport" content="width=device-width">

          </head>
          <body ng-app="fasterAngular">
            <h1>Fast AngularJs</h1> <h3>AngularJs with ReactJs</h3>
            <div ng-controller="mycontroller">
                <input ng-model="framework"/>
                <hr>
                <fast-ng framework="framework"></fast-ng>
                <hr>
                Rendering with traditional AngularJs {{framework}}
            </div>

            <script src="bower_components/angular/angular.js"></script>
            <script src="bower_components/react/react.js"></script>
            <script >
                var MYAPP = React.createClass({
                    displayName:'MYAPP',
                    render:function(){
                        return React.DOM.div(null, "Rendering faster in AngularJs with ", this.props.framework);

                    }
                });
            </script>

            <script>
                angular.module('fasterAngular', []).
                controller('mycontroller', ['$scope', function($scope){
                    $scope.framework = 'ReactJs';
         
                }]).directive('fastNg', function(){
                    return{
                        restrict:'E',
                        scope:{
                            framework:'='
                        },
                        link:function(scope, el, attrs){
                            scope.$watch('framework', function(newValue, oldValue){
                                React.renderComponent(
                                    MYAPP({framework:newValue}),
                                    el[0]
                                );
                            })
                        }
                    }
                })
            </script>
        </body>
        </html>
    {%endhighlight%}  