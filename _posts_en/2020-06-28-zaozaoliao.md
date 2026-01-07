---
layout: post
title: Zaozaoliao - Micro Front-end Topic Sharing
date: 2020-06-28 16:00:00
summary: Sharing the topic <How to implement Micro Front-end Integrated Operation Workbench> on behalf of Fliggy at the Zaozaoliao Conference. This article is the transcript.
categories: Share
---

## Foreword

Hello everyone, I am Fliggy frontend Youxi. The theme shared today is "How to implement Micro Front-end Integrated Operation Workbench". First of all, briefly introduce myself. My nickname is Youxi, and my external network id is Tw93. Currently, I spend part of my time on Fliggy frontend technical external influence, operating the Fliggy frontend team's official account Fliggy F2E and [Juejin Column](https://juejin.im/user/55f593b160b2521fb5a02f6c/posts), taking this opportunity to introduce some Fliggy frontend systematic construction to everyone.

![](https://cdn.fliggy.com/upic/kfQb6n.jpg)

## Overview

Previously in 17, 18, and 19 years, I worked on Fliggy Weex, Interaction, and Serverless construction from 0 to 1 respectively. This year in 20, I am mainly working on the construction of Fliggy Micro Front-end Integrated Operation Workbench, which is also the theme shared today.

I will tell you from four parts: "**Why do we need to make Fliggy Integrated Operation Workbench, what should it look like, how to do it, and what we want to do later**".

![](https://cdn.fliggy.com/upic/ZMSRU0.jpg)

## Why do we need to make Fliggy Integrated Operation Workbench

### Development of Fliggy operation attributes

In 2012, during the process of Alibaba ALLIN Wireless, Fliggy App also came into being at that time, equivalent to tool attributes, used for users to quickly query ticket information; by around 2014, tool attributes gradually enriched, and with the popularity of Double Eleven, it slowly transformed into a marketing and selling attribute, and various marketing platforms slowly grew up at that time;

Around 2017, the main focus was on scene operation mentality, including outbound supermarkets, weekend good places and other theme mentalities. Shopping guide platforms gradually sprouted at this time; after 2018, with the popularity of Douyin/Live Streaming, Fliggy operation types also became richer, evolving from themes to content mentality.

![](https://cdn.fliggy.com/upic/CmxKu4.jpg)

With the gradual enrichment and development of business, various internal Xiaoer operation platforms are also developing from "usable efficiency" to "intensive cultivation". With the construction of integrated operation workbench, we are currently at the arrow in the figure below.

![](https://cdn.fliggy.com/upic/K6nedx.jpg)

### Pain points in the development process

Along with the development of Fliggy business, we have established operation platforms for multiple scenarios in the past two years to improve operation efficiency, satisfying operations to complete business appeals.

![](https://cdn.fliggy.com/upic/rPl9uy.gif)

**But as the business complexity of the product itself continues to increase, it can only solve the problem of food and clothing for operations. Coupled with the increasingly strong demand for mutual investment and intercommunication among various platforms, it is impossible to bring 1 + 1 > 2 value to the business under this system**, facing the following pain points that need to be solved:

![](https://cdn.fliggy.com/upic/ohv6qK.jpg)

## What should it look like

To solve the above pain points, we launched the integrated operation workbench construction project, aiming to explore and upgrade with new technologies to provide better and more efficient operation platform solutions for operation students. The first phase goal is technical exploration, completing the construction of the workbench framework, **satisfying multi-platform scenario usage, and precipitating a set of pan-operation platform micro front-end solutions based on existing businesses**.

![](https://gw.alipayobjects.com/zos/k/9n/k4EqLQ.jpg)

Based on this, we started from the actual business operation configuration scenario, combined with existing mid-backend technologies and micro front-end solutions, and produced the following solution architecture diagram:

![](https://cdn.fliggy.com/upic/icz3a8.jpg)

The bottom layer relies on the Ant Design system plus qiankun capabilities, the middle layer assists the specifications fitting existing business scenarios involved in the integrated workbench; the upper layer precipitates componentized widget capabilities for intercommunication of various functions, and at the same time becomes the combination source of existing sub-applications; at the top layer is the upper main application of Fliggy Operation Workbench, including the overall framework, quick navigation, permission login control, collection of operation scenarios, including the business operation SOP solution to be done later.

<a href="https://cdn.fliggy.com/upic/KjhvJ0.mp4" target="_blank"><img src="https://cdn.fliggy.com/upic/dKnYHV.gif" width=800/></a>

## How to do it

![](https://gw.alipayobjects.com/zos/k/b5/PiDL4U.jpg)

### Deep use and co-construction of qiankun on the front-end side

On the front-end side, we deeply use and co-construct qiankun. The loading between underlying applications of qiankun uses single-spa, and the upper layer implements style isolation, js sandbox, preloading and other upper-layer capabilities. At the same time, providing [umi-plugin-qiankun](https://github.com/umijs/umi-plugin-qiankun) to solve the quick use under umi, becoming our front-end choice solution.

![](https://gw.alipayobjects.com/zos/k/j7/noUIBg.jpg)

In the sub-application routing control, we integrated a common configuration config by leveraging existing antd pro routing configuration plus qiankun configuration items. Thereby, for sub-application access, only configuration here is needed, and at the same time, unified control can be achieved later.

![](https://gw.alipayobjects.com/zos/k/dk/5eqEYy.jpg)

Besides micro front-end and routing on the front-end side, actually there are more things that can be done, including integrating public resources such as antd, loadsh, router, etc. unified large versions, processing by writing umi-externals-url, thereby reducing resources by nearly 1/3; including experience measurement, we leverage internal capabilities to perform stratified analysis of users including error performance monitoring; at the same time, produce an online feedback system capable of screen recording and screenshots, facilitating direct feedback notification and direct issue submission to corresponding responsible students during use;

![](https://cdn.fliggy.com/upic/wPiC1r.jpg)

### Self-built unified gateway on the backend side to connect main and sub applications

**On the backend side, we built a Gateway middleware on the Node side of the operation workbench**, relying on [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware) capability implementation at the bottom layer, borrowing server-side proxy forwarding interface while adding tokens on requests to **solve interface login permissions and cross-domain** problems. At the same time, for the problem that internal network login permissions are not connected when main and sub applications are directly accessed, here we use the **login-free authorization** capability, letting the main application itself provide login for sub-applications. In this way, through the middle gateway layer combined with the Fetch custom capability and Slave Namebase we gave to **[qiankun pr](https://cdn.fliggy.com/upic/oxVRq7.jpg)**, compatible problems of requests and route jumps can be solved.

![](https://cdn.fliggy.com/upic/2rdzLW.jpg)

### Widget Business Componentization

Micro front-end can solve the seamless access problem between main and sub applications very well, but it is not mature for block scenarios, existing problems:

- With the mature development of business scenarios, plus the gradual increase in scenarios of block capability embedded configuration;
- Thereby decoupling and extracting original general recruitment, creation, investment and building capabilities, reducing maintenance pressure;
- Gradually enrich existing widget capabilities, meeting subsequent access use of more scenarios, as well as system integration.

![](https://cdn.fliggy.com/upic/WJ3lrn.jpg)

Based on this, we implement business components through widget-like npm component packages, including formulating corresponding protocols to drive corresponding widget rendering and display, facilitating backend students to be more controllable. At the same time, in visual specifications, we gather usage displays in various scenarios, facilitating a widget to be embedded into existing systems more seamlessly.

For example, if we want to configure interactive gameplay configuration in the building system, relying on interactive gameplay configuration widget can achieve the following integrated configuration:

![](https://cdn.fliggy.com/upic/Y7YiqX.gif)

### Interaction Experience of Operation Platform

Speaking of front-end display of mid-backend, most scenarios do not have design interaction students support, plus frontline R&D students have different understanding of interactive visual standards, **leading to many pages' usage experience barely reaching usable status, and there is still a long distance from good-looking and easy-to-use.**

![](https://cdn.fliggy.com/upic/hdezJS.jpg)

Based on this, we sorted out several types of operation scenarios visual specifications principles to grasp:

- Same type unified: Don't toss, follow Ant Design at the general level; maintain consistency for same type / same function module display
- Comfortable alignment: Alignment makes pages or OCD students look comfortable; titles, buttons, forms, tag multi-collection classes need to ensure alignment
- Collapse infrequently used: Collapse unimportant content to facilitate users finding key execution points; hide infrequently used content like tables or put them into drawers
- Simple and not hindering: Let new users know the next operation without reading the manual; cannot let users fail to reach the next step due to XXX reasons

For example, the following display:

![](https://cdn.fliggy.com/upic/RR1XDh.jpg)

By unifying existing atomic displays, and then moving forward, we unify existing out-of-the-box interactions, and then precipitate corresponding capabilities, including search lists, scenario card groups, form preview capabilities. With the precipitation of these capabilities, the generation of subsequent new pages can rise a big stage compared to before.

![](https://cdn.fliggy.com/upic/9g1mA6.gif)

**Like the precipitation of FormRender form, we can use this capability to produce a large number of form pages, and the display is completely controlled by the backend side, so that protocol-driven display can be achieved. For more details, see [alibaba/form-render](https://github.com/alibaba/form-render)**

![](https://cdn.fliggy.com/upic/Vf5NbW.gif)

### What we want to do later

The above is what we did in the first phase. For the next phase, the focus will be on the development of scenario SOP capabilities, and at the same time, crazy efficiency improvement out of the box at the middle layer, more abstraction and standardization at the bottom layer, and forming unified initialization and publishing capabilities in engineering at the lowest layer.

![](https://cdn.fliggy.com/upic/dJljfc.jpg)

For operation configuration scenarios, the ultimate goal is to improve the efficiency of operation configuration and continuously optimize business usage effects through data. Subsequently, we will gradually optimize operation side configuration in the form of SOP, finally forming integrated configuration capability;

![](https://cdn.fliggy.com/upic/URx6zj.jpg)

For the technical side, we will try more new technology exploration, especially in micro front-end specification unification, how to let existing systems access current mainstream micro front-end sub-application capabilities, including upper-layer sub-application management platform; meanwhile, the current new packaging system may give us many new ideas to expand existing packaging capabilities; and how the above out-of-the-box protocol-driven building can improve our rapid generation capabilities more through low-code building methods!

![](https://cdn.fliggy.com/upic/6j2zLj.jpg)

## Welcome to Fliggy

Advertising time is here. Actually, Fliggy frontend team is a relatively powerful frontend team in Alibaba. P9 Bachi leads the team. The overall members include mature high P and young fresh meat. Everyone's technical thinking is very Open. Usually birthday parties, team building, overseas outing, very happy.

![](https://cdn.fliggy.com/upic/rfqA2r.jpg)

Technically, currently we have team planning and development in novel technology, middle platform technology, and basic technology. If you are interested, you can chat directly. At the same time, if you have the ability to come and lead a direction, it is also very welcome. Finally, also very welcome to follow Fliggy frontend public account, there are many systematic construction articles and dry goods inside, worth reading!

![](https://cdn.fliggy.com/upic/YHInnY.jpg)
