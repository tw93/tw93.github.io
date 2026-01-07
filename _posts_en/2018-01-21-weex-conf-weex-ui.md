---
layout: post
title: Weex + Ui - Weex Conf 2018
date: 2018-01-21 16:00:00
summary: This article is the organized content document of the topic "Weex + Ui" in Weex Conf 2018. Mainly introduces the process of Fliggy Weex technology system from scratch, including the development and growth of Weex Ui component library, focusing on sharing some experiences in Weex Ui layer construction.
categories: Share
---

This article is the organized content document of the topic "Weex + Ui" in Weex Conf 2018. Mainly introduces the process of Fliggy Weex technology system from scratch, including the development and growth of Weex Ui component library, focusing on sharing some experiences in Weex Ui layer construction.

The article is long. First put the open source address of Weex Ui. Welcome everyone to submit PR, and can also express your like through Star.

> <https://github.com/alibaba/weex-ui>

## Why Weex ?

#### Weex vs H5

Why do we choose Weex as our primary cross-end development technology? Students who have written H5 will definitely be attracted by its **simple and efficient**, **publish implies update**, **one URL adapts to multiple ends** etc. these **fast** features. But students who have written Native will definitely also be attracted by Native's **rich interaction**, **performance experience**, **call native capabilities**, **manage memory** etc. features bringing better experience to our business.

#### Want Fast and Experience at the Same Time

But many times, we want to have both H5's **fast** and Native's **experience**. Fliggy has also been exploring in this direction in the past few years.

Including Hybrid development at the very beginning, providing partial Native capabilities through Bridge to improve H5 experience. For example, in H5 we can directly get App's location information, use camera, play video, navigation jump etc. capabilities. Industry also has Cordova, Ionic, Meteor these mature solutions.

<img data-src="https://gw.alipayobjects.com/zos/rmsportal/YKtilLIfWxAyFhSrFzBi.jpeg" src="{{site.defaultImage}}" class="lazyload img-zoom"/>

Also utilizing offline package system by downloading resource files in advance, route interception loading local resources when accessing, allowing our H5 pages to reach instant display, dynamic update, weak network usability effects. Internally have Mobile Taobao Zcache, Fliggy Pigeon, Alipay Kyushu these mature systems.

Around 16 years, after cross-platform development technology gradually became popular, a brand new development idea attracted us, that is writing Native with JS, building high performance, extensible Native applications with Web development experience, while truly obtaining **fast** and **experience** mentioned above.

#### Business Comparison Analysis

So why choose Weex? Actually very related to Fliggy business characteristics, meanwhile can solve these pain points very well.

Fliggy **business iteration speed is fast**, also need fast launch; meanwhile many times **scenic spots and overseas weak network use**, meanwhile want good experience; one of the most important points is **multi-container access, adapting to Fliggy, Mobile Taobao, Tmall, Alipay**, that is, one important business development requires one iOS, one Android student to develop two ends, meanwhile one H5 student to develop Web version compatible with Mobile Taobao, Alipay, UC. That is, one business release involves multi-end simultaneous development, launch.

<img data-src="https://gw.alipayobjects.com/zos/rmsportal/tTdJRPRQpdIPkIVvmUyU.jpeg" src="{{site.defaultImage}}" class="lazyload img-zoom"/>

Weex actually solved some of the above problems very well, including completely **Native experience** in Fliggy, Mobile Taobao, Tmall Weex environment, meanwhile Bundle resource size **much smaller than H5**, plus rich interactive experience, good long list performance very suitable for product list page and Double Eleven scenarios. Most importantly truly let us reduce from 3 people development to 1 person. The other 2 people can go do more meaningful things.

Next we can see a display, data comparison of Weex and H5 business from the display below. Detailed can watch this [recorded video>>>](https://gw.alipayobjects.com/os/rmsportal/FptvGkFpdBXRPtuNGMdk.mp4)

<video width="800" muted  muted preload="metadata"><source src="https://gw.alipayobjects.com/os/rmsportal/FptvGkFpdBXRPtuNGMdk.mp4" type="video/mp4"></video>

This is a page with complex business logic, including filtering, sorting, calendar selection, collection, long list, business logic is also very complex page. After refactoring to Weex, our **first screen usable time reduced 68%**, **Bundle size directly reduced 73%**. Due to experience becoming better and faster, let our **page conversion rate actually increased 14.5%**.

The above are also some important reasons why we choose Weex as our cross-end development. Next introduces Fliggy's weex technology system.

## Fliggy Weex Technology System

#### Architecture Diagram

<img data-src="https://gw.alipayobjects.com/zos/rmsportal/adNiyVpYLLOwVXUbrHFV.jpeg" src="{{site.defaultImage}}" class="lazyload img-zoom"/>

Can look from bottom up. Bottom layer composed of our APP's Framework / Libraries / OS Kernel etc. We designed a set of unified Api design with Mobile Taobao, Tmall on upper and lower layers of Weex, including interface request, data buried point, route jump, network status, payment function, navigation bar customization etc. series of general services. On Weex we encapsulated Weex Ui component library, business component library, UPX building marketing module, also Util function library smoothing multi-end differences. So on our upper layer can grow our numerous businesses.

Since Weex on our side is like H5, treated as page to release, rather than writing many sub Views in a View to organize. Meanwhile also highly suggest everyone not use vue-router to manage, using multi-page to jump experience will be better.

Speaking of build release process, we unify through Clam to perform initialization, build, debug, pre-release, release etc. work for our project. Meanwhile in launch aspect directly through Awpp command to directly release page to CDN. Meanwhile can push offline resources to APP through Pigeon. Operation students can also directly release page through building way.

#### How Weex page performs multi-end delivery in Fliggy, Mobile Taobao, Alipay?

Then you might ask how Weex page performs multi-end delivery in Fliggy, Mobile Taobao, Alipay?
There are two ways here. First is **decide render as Weex or H5 through front-end URL parameter**

<img data-src="https://gw.alipayobjects.com/zos/rmsportal/UAdGXDERTrhPuWCdUKyu.jpeg" src="{{site.defaultImage}}" class="lazyload img-zoom"/>

`xxxx.html?_wx_tpl=xxxx.js`: Front is H5 address when downgrading. Behind `_wx_tpl` carried parameter represents Weex JS address. When container discovers URL carries `_wx_tpl` parameter, will download JS address behind then render with Weex container.

Another one is **decide render as Weex or H5 through server returned content**:

`xxxx?wh_weex=true`: Front can be JS address or H5 address. Behind is fixed parameter `wh_weex=true`. When container discovers URL carries `wh_weex=true`, will request xxxx address in front. If find response mime type (HTTP header content-type) is `application/javascript`, then use Weex to render returned content. Otherwise use WebView to render as H5.

#### Fliggy Weex Business Overview

 <img data-src="https://gw.alipayobjects.com/zos/rmsportal/xodsBNArvXGQaMMOJyMu.jpeg" src="{{site.defaultImage}}" class="lazyload img-zoom"/>

Weex is not like rumors from some people outside saying no company is using Weex. Instead it exceeds your imagination. Above is a glance of related weex pages on our side before Dec 17. Everyone can find these pages in Fliggy, Mobile Taobao, Alipay. All are one page delivered to multi-ends simultaneously.

#### What business is suitable for using Weex?

Including numerous marketing businesses, homepage, channel, search list, positive process, simple details, rich interactive pages are all very suitable to use Weex to develop. Meanwhile on our side also have a corresponding principle including **Display type projects prioritize using Weex**, **Refactoring/New projects prioritize using Weex**, deep vertical categories try using Weex.

#### Weex not suitable for complex scenarios?

Everyone can look at the [video display>>>](https://gw.alipayobjects.com/os/rmsportal/SZwliPeMLRmyCyVvLYIp.mp4) of these following scenarios

<video width="800"  muted preload="metadata"><source src="https://gw.alipayobjects.com/os/rmsportal/SZwliPeMLRmyCyVvLYIp.mp4" type="video/mp4"></video>

Everyone might think Weex is not suitable for complex scenarios. Actually not necessarily. Through many ways can achieve support for complex scenarios, including **Double 11** super long list rolling, 30+ screens data, fast rolling very smooth.

Meanwhile including logic abnormally complex, multi-component international ticket list page, Weex can also be competent; including Fig 3 rich interactive usage scenario, sticky effect silky drag, fast slide, dynamic hide header etc. functions can all be done.

Through accumulation of using Weex pit stepping best practices in many business scenarios on our side, actually many things can be precipitated down. Through encapsulation provided to subsequent other businesses use, so subsequent businesses can achieve rapid production. This is also a big reason why we suggest Weex Ui component system.

## Development and Open Source of Weex Ui

#### Why establish Weex Ui component library system?

- In early stage of introducing Weex, through Weex Ui let students who have not contacted Weex have **reference effect** for its writing
- Refine public components in business, convenient for direct reference, **improve everyone's development efficiency**
- Timely synchronization of business specifications, visual specifications, **best practices**
- Encapsulate **difficult and complicated diseases** in Weex business through components, only expose simple logic externally

#### Weex Ui at a glance

After more than a year of construction, we optimized, organized [Weex Ui](https://github.com/alibaba/weex-ui) step by step, finally open sourced on 20170930. Can see how Weex Ui came through figure below

<img data-src="https://gw.alipayobjects.com/zos/rmsportal/HbThsElNGBLMMRbbTxyx.jpeg" src="{{site.defaultImage}}" class="lazyload img-zoom"/>

Currently Weex Ui component library includes 7 major categories 31 mature components. Meanwhile not directly open sourced for everyone to use, but open sourced for everyone to use after being used internally for more than 1 year and stabilized. Everyone can scan code to preview through Mobile Taobao, Fliggy, any browser

<img data-src="https://gw.alipayobjects.com/zos/rmsportal/MNIgWQQFnsXFVDgmXLrr.jpeg" src="{{site.defaultImage}}" class="lazyload img-zoom"/>

Meanwhile documentation of an open source library is actually a big factor whether users can get started quickly in subsequent development. Weex UI
includes component description, usage rules, Demo display, detailed usage API, upgrade documents etc., letting you use quickly.

#### Is Weex Ui only suitable for e-commerce system?

Recently we did a [questionnaire survey](https://render.alipay.com/p/f/weex-ui/questionnaire.html) on users of Weex Ui. Result surprised us very much. Not only e-commerce is using, many other systems are using, including tools, enterprise applications, entertainment, self-media, news these are actually all using.

<img data-src="https://gw.alipayobjects.com/zos/rmsportal/AEJVShlmkpZAtlondEMv.jpeg" src="{{site.defaultImage}}" class="lazyload img-zoom"/>

#### Componentize building your Weex page

Many times basic construction is actually to accelerate business development. For example the following Fliggy Dedicated Line page is built through our Weex Ui component library

<img data-src="https://gw.alipayobjects.com/zos/rmsportal/IXRdWHrLXhhKOcZSPIEu.jpeg" src="{{site.defaultImage}}" class="lazyload img-zoom"/>

However basic foundation can only solve general component problems. Actually also includes business component part, that is `your-item` component in the figure above, also Weex business componentization we are going to talk about below.

## Besides basic library, what else can be done at Weex Ui layer?

#### Weex Business Componentization

<img data-src="https://gw.alipayobjects.com/zos/rmsportal/dJgZKjtUqyJczzIbeUQJ.jpeg" src="{{site.defaultImage}}" class="lazyload img-zoom"/>

Business component library is more of an "agreement" between front-end, back-end, designers. Through certain specifications jointly make business components reusable. That is directly introduce this component in Weex code, directly insert raw data returned by backend, can generate product card designed by designer. Finally can achieve **ability to support any Weex business module delivered to any position in any Weex page**.

So how should it be done?

<img data-src="https://gw.alipayobjects.com/zos/rmsportal/JvdNJSPoMrpojagZAtut.jpeg" src="{{site.defaultImage}}" class="lazyload img-zoom"/>

#### Can automate test Weex?

Answer is yes. Previously through [macacajs](https://macacajs.github.io) test framework combined with Weex to do. Through defining a series of gestures, events, finally using json to indicate execution order, can do. Detailed visible [video address>>>](http://p.tb.cn/rmsportal_7819_2026c3a73abfb162-1.mov)

1. Install app
2. Automatically open native page
3. Login, auto input
4. Automatically test Fliggy Vacation homepage, including operations like click, jump, slide, pull down refresh etc.
5. Automatically test Fliggy Dedicated Line, including left slide, right slide operations
6. Automatically test Weex Ui, including open component, click interaction logic
7. Automatically screenshot each page running, and email test situation to tester

<video width="800" muted preload autoplay loop><source src="http://p.tb.cn/rmsportal_7819_2026c3a73abfb162-1.mov" type="video/mp4"></video>

#### Weex Accessibility Optimization

Weex actually also supports accessibility. That is let blind people find information they want in the shortest time through fastest way. Meanwhile when blind people access our Weex page, let them perceive, operate, understand Weex, meanwhile page is also robust. For example following [demo>>>](http://p.tb.cn/rmsportal_7819__E6_97_A0_E9_9A_9C_E7_A2_8D.mov):

<video width="240" muted preload autoplay loop><source src="http://p.tb.cn/rmsportal_7819__E6_97_A0_E9_9A_9C_E7_A2_8D.mov" type="video/mp4"></video>

Accessibility implementation in Weex is very simple. For example implemented as follows:

<img src="https://gw.alipayobjects.com/zos/rmsportal/RmDWBkEtfKDVZLXLgHEp.png" width="400" class="lazyload"/>

#### Fliggy Weex Double Eleven Performance Optimization

Double Eleven every year is also a battlefield for our Weex. Almost all venue pages are implemented by Weex. How to let users silky browse our pages? During the period we also put many previous experiences including optimization skills into Double Eleven venue pages, including organization of some experiences.

<img data-src="https://gw.alipayobjects.com/zos/rmsportal/xzxwfrgmwGKMaVRcTMXF.png" src="{{site.defaultImage}}" class="lazyload img-zoom"/>

## Back to Open Source

Actually Weex can be used in many many places, including various application scenarios. This is also a big reason why we open source Weex Ui. Give everyone more input on functions achievable by Weex, reference for best practice implementation.

Meanwhile external developers also urgently need a set of mature component library to improve development efficiency.

> <https://github.com/alibaba/weex-ui>

Starting from 20170930, we have been working on open source development of Weex Ui, including co-constructing weex-toolkit to make it support Weex Ui better, completion of missing components + enhancement of existing components, continue to expand boundaries + Qingzhou solution UI library, introduce more rich interactive experience + accessibility optimization of components, easy usage + detailed Chinese and English documents etc. work.

Actually more is wanting everyone to participate together, jointly promote development of our Weex.

Speaking of joint promotion, then what can you do? Actually can do many many things

<img data-src="https://gw.alipayobjects.com/zos/rmsportal/WrZhBcWwQnEHuorIASWC.jpeg" src="{{site.defaultImage}}" class="lazyload img-zoom"/>

## Summary of Roundtable Discussion on Weex Component Direction at Night

#### 1. What should be noted for encapsulation of Weex native components?

- Universality, only components used by multiple businesses simultaneously, meanwhile possessing extractable characteristics, such as Video/TabBar/TitleBar/ImageUpload these mature components in Native
- Stability, Native components are not like weex upper layer components with large adjustability, so need to pay attention that Native components must have no Bug, preventing trouble in repair and update. Meanwhile Native components should make most situations configurable at the beginning, preventing frequent updates, leading to need to adapt many versions
- Atomicity, not suggest one component doing many things at the same time. Should be single function, then obtain more functions through matching way

#### 2. Some experiences in weex component development and practice process?

- 811 principle, default 80% functions should not require user to configure many parameters, 10% places users can achieve purpose by configuring some parameters, 10% rare situations can temporarily not consider, maybe will spend a lot of time developing here, so can wait until business needs to use, then update up
- Unified closing principle, to avoid subsequent component becoming a hodgepodge, subsequent iteration visual interaction, addition of new functions need to consider universality. Here need one person to unify closing, develop and maintain this component, can avoid many "business characteristics" interfering with usability of component
- Performance experience optimization, Weex component should guarantee its performance experience more than page writing
- Trust mechanism: Many times a big reason why others use your component is because believing your component has no problem, is stable, meanwhile will be maintained frequently later

#### 3. What do everyone think Weex Ui component still lacks?

- Lack some scenarios gathered to use. Currently usage document of single component has been explained in detail, but for some usage of multiple components, or development at page level lacks related cases. Later need to gradually fill up [weex-ui-demo](https://github.com/tw93/weex-ui-demo)
- Theme configuration flexibility needs to be considered. Currently more is to change theme color through parameter configuration way. Actually can be modified through a unified external parameter configuration

#### 4. What will future cross-end development look like?

- Native layout way needs to learn from H5 development flexibility, gradually use automatic layout to implement, meanwhile introduce elastic thinking development, avoid absolute calculation
- Data binding aspect will be more and more convenient, for example like MVVM idea, after data changes, view modifies immediately, instead of manually triggering

## More

Everyone can scan the following QR code with DingTalk, everyone discuss and communicate together:

<img src="https://img.alicdn.com/tfs/TB1irfjlyqAXuNjy1XdXXaYcVXa-624-823.png" width="300" class="lazyload"/>

- This sharing PDF file: [《 Weex + Ui 》](http://p.tb.cn/rmsportal_7819_Weex_20_2B_20UI_20_20_20Weex_20Conf_20_E9_A3_9E_E7_8C_AA_20_E4_BE_91_E5_A4_95.pdf)
- Weex Ui Official Website: <https://alibaba.github.io/weex-ui>
- Weex Ui Github: <https://github.com/alibaba/weex-ui>
- Weex Conf Cloud Album: <http://v.alltuu.com/album?id=1004641019>
