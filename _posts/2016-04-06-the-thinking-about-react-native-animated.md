---
layout:     post
title:      React Native动画研究
date:       2016-04-05 21:47:29
summary:    研究React Native动画的基本使用、支持度、和native对比；包括React Native动画的基本使用，还有动画性能相关的对比。
categories: ReactNative
---

### 问题抛出
- RN动画支持的怎么样?
- 看是否足以支撑我们的业务需要，实现与Native等同的交互体验，需不需要我们二次开发 ？
- 动画应用上呢，使用起来方便么，需不需要二次封装 ？
- 性能上呢？有明显性能问题吗？

### 论证过程

- RN动画功能总结脑图：
![RN动画](//img.alicdn.com/tps/TB1YZoRMXXXXXXaapXXXXXXXXXX-1061-1759.png)

- native动画相关汇总
 ![Native动画](//img.alicdn.com/tps/TB1IFRXMpXXXXcKXVXXXXXXXXXX-906-563.png)

- 应用
  - RN动画的可以按照如下步骤进行：
     - 使用基本的Animated组件，如Animated.View Animated.Image Animated.Text 
     - 使用Animated.Value设定一个或多个初始化值（透明度，位置等等）
     - 将初始化值绑定到动画目标的属性上（如style）
     - 通过Animated.spring等函数设定动画参数
     - 调用start启动动画
  
  - 具体Demo:

{% highlight javascript %}
import React, {
    AppRegistry,
    Component,
    StyleSheet,
    Text,
    View,
    Animated
} from 'react-native';
export default class demo extends React.Component {
    constructor(props:any) {
        super(props);
        this.state = {
            bounceValue: new Animated.Value(0)
        };
    }
    render() {
        return (
            <Animated.Text
                style={{fontSize: 28,flex:1,transform: [{scale: this.state.bounceValue}]}}>
                文字抖动
            </Animated.Text>
        );
    }
    componentDidMount() {
        this.state.bounceValue.setValue(3);
        Animated.spring(
            this.state.bounceValue,
            {
                toValue: 0.6,
                friction: 1,
            }
        ).start();
    }
}
{% endhighlight %}


  - 从上面demo可以到达，动画的使用逻辑还算清晰，虽然比不上css3动画编写简单，同时不需要二次分装，直接向上面使用即可。

- RN动画和H5动画对比
  - RN中的的动画均为 JavaScript 动画，即通过 JavaScript 代码控制图像的各种参数值的变化，从而产生时间轴上的动画效果。 RN通过封装一个Animated的元素，内部通过数据绑定和DOM操作变更元素，结合React的生命周期完善内存管理，解决条件竞争问题，对外表现则与原生组件相同，实现了高效流畅的动画效果。
  - **性能对比待续..........**

  
  
### 结论
- RN的动画很强大，而且性能很好
- 客户端的大部分动画不复杂，90%可以使用RN动画实现，对于比较特殊的动画可以采用和设计师讨论，换一种动画实现，或者使用[react-native-animatable](https://github.com/oblador/react-native-animatable)补充多余的动画类型。
- 对于有些组件的动画，涉及到绘制方面，建议直接使用RN绘图库REACT NATIVE ART实现。

### 参考链接
- [https://facebook.github.io/react-native/docs/animations.html#content](https://facebook.github.io/react-native/docs/animations.html#content)
- [https://facebook.github.io/react-native/docs/navigator.html#content](https://facebook.github.io/react-native/docs/navigator.html#content)
- [https://facebook.github.io/react-native/docs/layoutanimation.html#content](https://facebook.github.io/react-native/docs/layoutanimation.html#content)
- [ReactNative Animated动画详解 - Web前端腾讯AlloyTeamBlog](http://www.alloyteam.com/2016/01/reactnative-animated/)
- [react-native-animation-book](http://browniefed.com/react-native-animation-book/)



