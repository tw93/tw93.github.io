---
layout: post
title: Comparison of Vue, Angular, Avalon Frameworks
date: 2015-02-04 10:21:29
summary: Front-end development is no longer the front-end development of a few years ago. It has entered the industrial era from the agricultural era. In recent years, many excellent MVVM frameworks in JavaScript have appeared. Today I compare the advantages and disadvantages of frameworks like Vue, Angular, Avalon ...
categories: Study
---

Front-end development is no longer the front-end development of a few years ago. It has entered the industrial era from the agricultural era. In recent years, many excellent MVVM frameworks in JavaScript have appeared. Today we compare the advantages and disadvantages of Vue, Angular, Avalon frameworks.

### Vue

Vue is a library for creating web interactive interfaces written by Mr. You Yuxi. It is a streamlined MVVM. From a technical point of view, [Vue](http://vuejs.org/){:target="_blank"} focuses on the ViewModel layer of the MVVM model. It connects the View layer and the Model layer through two-way data binding. Actual DOM encapsulation and output format are abstracted as Directives and Filters. Vue is a small and beautiful library compared to other libraries. The author's main purpose is to produce reflective data bindings and composable view components through an API as simple as possible. I feel the author's thinking is very clear.

#### Advantages

1. Simple: Official documentation is very clear, easier to learn than Angular.
2. Fast: Update DOM in asynchronous batch processing way.
3. Composable: Compose your application with decoupled, reusable components.
4. Compact: ~18kb min+gzip, and no dependencies.
5. Powerful: Expressions & derivable properties without declaring dependencies (computed properties).
6. Module-friendly: Can be installed via NPM, Bower or Duo. It doesn't force all your code to follow various regulations of Angular. Usage scenarios are more flexible.

#### Disadvantages

1. Newborn: Vue is a new project. 0.10.0 ReleaseCandidate version released on March 20, 2014. Currently the latest on github is version 0.11.4. Not as mature as angular.
2. Impact is not very large: Googled it, diversity or richness about Vue is less than some famous libraries.
3. Does not support IE8: Haha, but Angular 1.3 also abandoned support for IE8. But Mr. @Situ Zhengmei's avalon supports IE6+. Should have put in a lot of effort to optimize. This point is not good for those projects that need to support IE8, but this is also a trend of web front-end development. Like low versions of IE, they should withdraw from the stage of history by changing our front-end thinking, instead of catering to those who use old versions and do not upgrade. Mr. Yu Bo once said a sentence that I think is very good: "In this day and age, supporting IE6 and 7 is no longer a feature, but a shame. Strive to push Alipay to completely not support IE6 and 7, look forward to more brothers joining".

### Angular

Angular is very hot recently, and there are many followers, [Superheroic JavaScript MVW Framework](https://Angular.org/){:target="_blank"}. The official says very simply: "Client-side technology written completely in JavaScript. Used in coordination with other long-standing Web technologies (HTML, CSS and JavaScript) to make Web application development easier and faster than ever before". When you learn it, I believe you will be attracted by many of its new features.

#### Advantages

1. Dynamic view: Never thought js could extend HTML attributes like this before, but Angular did it. It added many extensibility functions for our static HTML, giving a feeling of making HTML come alive from death.
2. Complete: It is a relatively complete front-end MVW framework, including templates, two-way data binding, routing, modularity, services, dependency injection and all other functions. Template function is powerful and rich, and is declarative, coming with rich Angular directives.
3. Google maintenance: Angular is maintained by Google, undoubtedly having a powerful background. For promotion and maintenance, it obviously has advantages over Vue and avalon. The community is also very active, which can well promote its development.
4. Angular & Ionic: [Ionic](http://ionicframework.com/){:target="_blank"}, these two are best friends. Ionic uses Angular to create a framework most suitable for developing rich and powerful applications. Last time I answered on Zhihu [link](http://www.zhihu.com/question/27210335/answer/35713635){:target="_blank"}.

#### Disadvantages

1. Large and comprehensive: Difficult to learn. For me, the learning curve is very convoluted and relatively difficult to understand.
2. Overthrow and rewrite: Browsing the community a while ago, found Angular2 will overthrow and rewrite the previous one. The changes of the two frameworks are very large, basically two frameworks. It means that after 2.0 comes out, you need to start from scratch again. As Xu Fei said, the popularity of 2.0 will take at least 3 years. Without jumping the gun, there will be a stable version after 1 year. This stable version should not support many browsers. There will be no peripherals for the stable version for a period of time. So, current learning of 1.3 cannot be considered invalid investment.
3. Does not support below IE8. Seems 2.0 becomes only supporting mobile end. Wait until it comes out and see.

### AAvalon

[AAvalon](https://github.com/RubyLouvre/avalon){:target="_blank"} is a simple and easy-to-use mini MVVM framework written by Mr. Situ Zhengmei. It was first released on 2012.09.15, developed to solve the existence of various view presentations for the same business logic. Can often see the teacher promoting his AAvalon, issued many tutorials, undoubtedly providing great convenience for people learning AAvalon in China.

#### Advantages

1. Simple to use. Add binding in HTML, define ViewModel with avalon.define in JS, then call avalon.scan method, it can move!
2. Compatible to IE6 (other MVVM frameworks, KnockoutJS(IE6), Angular(IE9), EmberJS(IE8), WinJS(IE9)), and avalon.mobile, which can run more efficiently in new version browsers such as IE10.
3. No dependencies, less than 5000 lines, less than 50KiB after compression.
4. Support pipeline style filtering functions, convenient for formatted output.
5. Granularity of local refresh has been refined to a text node, characteristic node.
6. The node to be operated is bound with the view refresh function in the first scan and cached, so there is no room for selectors to appear.
7. Let DOM operation code almost extinct.
8. Use an overlapping coverage mechanism similar to CSS, letting each ViewModel partition render the page alternately.
9. When node is removed, intelligently uninstall the corresponding view refresh function, saving memory.
10. Operating data is operating DOM. Operations on ViewModel will be synchronized to View and Model.
11. Comes with AMD module loader, saving integration with other loaders.

#### Disadvantages

1. Cannot listen to attribute changes of array elements. In ng we can achieve this function through $watch an expression (this is one of the culprits causing ng performance bottleneck), but avalon's $watch can only listen to attribute changes of current layer of current VM.
2. No publicly available front-end integration solution (responsible for generating the current project's scaffold, online code detection, JS, CSS merging, image merging, compression, uploading to target server...).
3. OniUI's skin is not good-looking enough. Many people say to cooperate with bootstrap, but no one in the community has taken the initiative to stand out and do this.

### Remarks

This is actually a summary of a question I answered on Zhihu. I wrote it for one night, so I collected it.
