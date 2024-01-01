---
layout: post
title: 使用 React 提高 Angular 的渲染性能
date: 2015-02-23 21:47:29
summary: 当你使用 Angular 的时候你遇到过性能问题吗？使用 React 可以使页面渲染得更快。下面通过几个案例来对比用React 来渲染 Angular 和直接使用 Angular 来渲染之间的性能差异 ...
categories: Study
---

原文来自：[Faster Angular Rendering (Angular and React)](http://www.williambrownstreet.net/blog/2014/04/faster-Angular-rendering-Angular-and-reactjs/){:target="_blank"}

当你使用 Angular 的时候你遇到过性能问题吗？使用 React 可以使页面渲染得更快。下面通过几个案例来对比用 React 来渲染 Angular 和直接使用 Angular 来渲染之间的性能差异。

我喜欢[Angular](http://angularjs.org/){:target="_blank"},我不仅在一些有趣的小项目中使用它，同时也在一些大型的专业项目中来使用AngularJs。我同时也尝试其他框架，像[BackboneJs](http://backbonejs.org/){:target="_blank"}和[EmberJs](http://emberjs.com/){:target="_blank"}，这俩也是很好的工具，以上三种都属于一类叫做MVC的框架(可以叫MVVC),但是每次使用它们的时候，我都会在渲染方面遇到的一些性能的不足。对于渲染列表项目，双向数据绑定和单向数据绑定并没有实际的区别。对我而言在不考虑双向数据绑定情况下BackboneJS渲染性能优于AngularJs。

最近出现一个叫做[React](http://facebook.github.io/react/){:target="_blank"}的优秀框架，一个看起来有点弱小的库接下来一段时间将对 JavaScript MVC 框架造成很大的影响。简而言之，这个库能够使网页渲染性能得到提升，ReactJs 主要使用的部分是针对 MVC 框架中的 View 部分，刚开始我不明白设计者为什么会把 Model 和 Controller 这两部分给抛弃呢，难道像 EmberJs, BackboneJS 和 Angular 这些框架中最有趣的地方不就是 Model 和 Controller 部分吗？仔细思考后，其实 React 在 Controller 部分也有很特色的地方，然而 React 不是一个大而全的 MVC 框架，ReactJs 的工作原理是保持一个虚拟的 DOM,渲染只有在当 UI 更新时才会改变，这是否有意义呢，听起来新颖但又有理，通过发送指令来更新 UI，React 只改变和更新现存的 DOM（使用虚拟 DOM 超级快），通过虚拟 DOM 技术可以使变化的差异很快的被展现，Facebook 和 Instagram 已经开始在实际项目中使用 React 了。

我听过 React 的开发者 Pete Hunt 的谈论 React 意图的一个[podcast](http://codewinds.com/podcast/004.html){:target="_blank"}，很建议你也去听一下这个[podcast](http://codewinds.com/podcast/004.html){:target="_blank"}，他开源 reactjs 目的是在现有框架的 View 部分制造一些噪音，我发现这些现存的框架在 UI 部分将打算采取这种相同的策略，一些可以使用的新库将会出现。

React 当中的那个 V 很容易和现存的框架中那个 V 做比较，backbone，还有 angular 的 ngRepeat，可以和 Coffeescript 一起使用，所以使用 React 来渲染可以在你应用性能上面派上用场，例如通过 ng-repeat 来重复几百项，在我以前的[文章](http://www.williambrownstreet.net/blog/2013/07/Angular-my-solution-to-the-ng-repeat-performance-problem/){:target="_blank"}中,我写了一篇如何使长列表在 Angular 有效，但是所有的使渲染更快的[技术](https://github.com/webux/ux-Angular-datagrid){:target="_blank"}是通过渲染列表中的一部分实现的，使用 React 来渲染 Angular，可以使你的**渲染时间较少 80%**，我玩 ngReact 的时候那种性能的提升让我质疑代码是不是哪儿出错了，渲染时间从原来直接使用 Angular 的 4200ms 降低到通过使用 React 渲染的 120ms，你也可以去尝试下，或者直接看这篇文章下面的例子。

我仍然经历这一些问题当使用 Angular 进行大量的 DOM 绑定，但是另外一个问题是特殊的双向数据绑定。如果你对这个问题有些担心，或许你应该考虑使用比 Angular 更强大的框架，然而 React 的重大作用将就是帮助我们尽可能快的渲染元素到用户的屏幕上。

我将会用一个小案例来向你们解释如何来使用 React 来渲染一个 Angular 的应用，步骤如下：

- 默认你已经安装了[Bower](http://bower.io/){:target="_blank"}，然后新建目录，安装 React 和 Angular 到你的目录下：

  <blockquote>$ mkdir fast-angular</blockquote>  
  <blockquote>$ cd fast-angular</blockquote>  
  <blockquote>$ bower install --save react </blockquote>  
  <blockquote>$ bower install --save angular</blockquote>  

- 当这些命令运行好后，我们需要的 Angular 和React 已经在我们本地安装好了，接着我们建立一个简单的 HTML 文件，将这两个脚本引入。

    {% highlight html  %}
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
    {%endhighlight%}

- 我们需要创建一个来渲染我们输入的字符串的ReactJs组件，所以我们使用ReactJs来渲染我们的模型，创建一个名叫做MYAPP的组件，传递给它来呈现一个props，接着我们创建一个传统的angular指令和控制器（增加标记在我们的html来启动这个应用），通过使用指令来告诉它渲染，而不是去调用ReactJs的组件，我们使用$watch来重新渲染和更新我们的框架，当组件已安装更新现有的实例中我们叫做createComponent 。
 实际代码演示[http://plnkr.co/edit/FXK3lU?p=preview](http://plnkr.co/edit/FXK3lU?p=preview){:target="_blank"}  
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
                return React.DOM.div(null, 
                "Rendering faster in AngularJs with ", 
                this.props.framework);

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

- 当然上面这个例子没有使我们看到性能上面的提升，但是它阐述了如何通过ReactJs来渲染我们的模块。下面这个渲染一长串数字例子就是展现出性能的例子，是一个来自ng-react的例子，我们生成了一个含有1500个数据的数组并将其渲染到表格中，假如使用Angular中原生的ng-repeat通常会带来一些性能上面的问题，看这个使用ReactJs来渲染的[Plunkr](http://plnkr.co/edit/ykYILa?p=preview){:target="_blank"}，另外一个是使用原生ng-repeat来渲染的[Plunkr](http://plnkr.co/edit/YnF7Vn){:target="_blank"}。使用ReactJs渲染的代码如下：

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

        <fast-repeat data="data"></fast-repeat>

    </div>

    <script src="bower_components/angular/angular.js"></script>
    <script src="bower_components/react/react.js"></script>

    <script >
        var MYLIST = React.createClass({displayName: 'MYLIST',
            render: function() {

              var data = this.props.data;

              var rows = data.map(function(datum) {
                var clickHandler = function(ev){
                    console.log("Still in reactJs");
                    console.log(ev);
                }

                return (
                  React.DOM.tr( {onClick:clickHandler},
                    React.DOM.td(null, datum['0']),
                    React.DOM.td(null, datum['1']),
                    React.DOM.td(null, datum['2']),
                    React.DOM.td(null, datum['3']),
                    React.DOM.td(null, datum['4'])
                  )
                );
              });

              return (
                React.DOM.table(null,
                  rows
                )
              );
            }
        });
    </script>
    <script>
        angular.module('fasterAngular', []).
        controller('mycontroller', ['$scope', function($scope){
            $scope.framework = 'ReactJs';
            $scope.data = [];
            // Fill the data map with random data
            for(var i = 0; i < 1500; ++i) {
                $scope.data[i] = {};
                for(var j = 0; j < 5; ++j) {
                    $scope.data[i][j] = Math.random();
                }
            }
        }]).directive('fastRepeat', function(){
            return{
                restrict: 'E',
                scope:{
                    data: '='
                },
                link:function(scope, el, attrs){
                    scope.$watch('data', function(newValue, oldValue){
                        React.renderComponent(
                            MYLIST({data:newValue}),
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

- 我们可以通过一个按钮来更新我们的数据，对于原生的Angular 和使用 React 的:

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
        <button ng-click="refresh()">Refresh Data</button>
        <fast-repeat data="data"></fast-repeat>
        <!-- <table>
          <tr ng-repeat="line in data" ng-click="clickHandler(ev)">
            <td>{{line[0]}}</td>
            <td>{{line[1]}}</td>
            <td>{{line[2]}}</td>
            <td>{{line[3]}}</td>
            <td>{{line[4]}}</td>
          </tr>
        </table> -->
    </div>

    <script src="bower_components/angular/angular.js"></script>
    <script src="bower_components/react/react.js"></script>

    <script >
        var MYLIST = React.createClass({displayName: 'MYLIST',
            render: function() {

              var data = this.props.data;

              var rows = data.map(function(datum) {
                var clickHandler = function(ev){
                    console.log("Still in reactJs");
                    console.log(ev);
                }

                return (
                  React.DOM.tr( {onClick:clickHandler},
                    React.DOM.td(null, datum['0']),
                    React.DOM.td(null, datum['1']),
                    React.DOM.td(null, datum['2']),
                    React.DOM.td(null, datum['3']),
                    React.DOM.td(null, datum['4'])
                  )
                );
              });

              return (
                React.DOM.table(null,
                  rows
                )
              );
            }
        });
    </script>
    <script>
        angular.module('fasterAngular', []).
        controller('mycontroller', ['$scope', function($scope){
            $scope.framework = 'ReactJs';
            $scope.data = [];
            // Fill the data map with random data

            $scope.clickHandler = function(){
                console.log("in AngularJS");
            }
            $scope.refresh = function(){
                for(var i = 0; i < 1500; ++i) {
                    $scope.data[i] = {};
                    for(var j = 0; j < 5; ++j) {
                        $scope.data[i][j] = Math.random();
                    }
                }
            }
            $scope.refresh()
        }]).directive('fastRepeat', function(){
            return{
                restrict: 'E',
                scope:{
                    data: '='
                },
                link:function(scope, el, attrs){
                    scope.$watchCollection('data', function(newValue, oldValue){
                        React.renderComponent(
                            MYLIST({data:newValue}),
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

- 使用 Angular 渲染 1500 行大概用了 1.35 秒，然而使用 React 渲染仅仅用了 320ms，详细见下面两张从 chrome 开发者工具的截图：
 ***使用ReactJs渲染320ms***
 ![Rendering with ReactJs, 320ms](http://tw93.github.io/images/with-react-chromedev.png)

 ***使用原生AngularJs渲染1200ms***
 ![Native AngularJs rendering 1200ms](http://tw93.github.io/images/native-angularjs-chromedev.png)

#### 总结

这仅仅是关于使用使用 React 提高 Angular 的渲染性能一个简短的介绍，在我接下来的一些项目中，毫无疑问我会使用 React 来渲染我认为性能不足的部分。正如 Pete Hunt 所说，ReactJs 是完全改变游戏规则的，背后的意图是希望改变人们对于内部运作的一般想法，我确信不久所有主流的框架将会有一个类似的想法来使用 React 思维，或者设计成很容易和 React 集成,我喜欢 React,使用虚拟 DOM 这种想法让我觉得它意义非凡。
