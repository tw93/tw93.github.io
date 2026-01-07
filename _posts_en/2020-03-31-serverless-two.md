---
layout: post
title: Fliggy Serverless System Construction S2
date: 2020-03-30 16:00:00
summary: In the first half of the year, a series of infrastructure construction was completed. Experienced group infrastructure research and multi-BU communication, formulated solution goals around Fliggy front and back end cooperative development and business pain points, to the construction of Sky Island R&D platform and gateway, and deep co-construction of unified FaaS R&D platform with the group, as well as construction around various development experiences and stability, making the overall Serverless reach a usable state. Let's look at what was done in the second half of the year?
categories: Share
---

> This article has been desensitized and approved for publication on the Fliggy Front-end Team Official Account.

## History Development

In 12~13 years, Fliggy's core business was mainly based on PC platform. The core pain point of front and back end R&D collaboration lay in the writing of dynamic templates. Different teams' front and back ends often caused conflicts around the ownership of "template applying" work.

By 14 and 15 years, in the process of All in Wireless, in order to solve the rapid conversion from complex industry data in PC era to wireless gateway, Fliggy established a wireless server team to complete the glue layer work from data to end side, which could solve a series of problems well, but continuous repetitive wrapper interfaces also made wireless server face growth and precipitation problems, which was not very sustainable.

<img data-src="https://gw.alipayobjects.com/zos/k/3c/sTXzCN.jpg" src="{{site.defaultImage}}" class="lazyload img-zoom"/>

After wireless server technology construction stabilized in 16 and 17 years, also due to the above problems, interface encapsulation work was gradually delegated to industry backend students. With H5/Weex/iOS/Android multi-end development, respective demands for interfaces were difficult to be consistent, appearing to use Node BFF layer to undertake glue problems. But frontend operation and maintenance capability was not strong, long-tail machine waste led to difficulty in full BFFization.

By 18 years, Fliggy platform transformation was completed. Business changed from vertical industry to horizontal platform undertaking. Landing of requirements needed multi-party collaboration and scheduling. Fragmentation of the middle layer became more serious, bringing greater challenges to front and back end collaboration costs. At the same time, it could not solve other business layer problems through single domain problem solutions (such as order page solutions). **Urgently needed a lightweight general solution to solve increasingly serious glue layer collaboration**.

## Construction Goal

Based on the above background and problem analysis, Fliggy launched "Castle in the Sky" - Serverless technology system construction special project in May last year. Project overall goal:

> Build Fliggy Serverless R&D infrastructure, empower upper layer products/platforms, promote R&D collaboration among frontend/backend, business/platform, domains to evolve towards more efficient and function-focused mode, shorten innovative business R&D landing cycle, improve R&D resource input-output ratio.

- Short and medium term: Clear functional boundaries (frontend/backend, business/platform), innovative business incubation (misc services, platform capability filling)
- Medium and long term: Reduce cost (R&D, machine), maintenance-free (reduce operation and maintenance input such as big promotion scenario pressure test), inventory long-tail migration (build CaaS capability)

## Last Half Year

In the first half of the year, a series of infrastructure construction was completed. Experienced group infrastructure research and multi-BU communication, formulated solution goals around Fliggy front and back end cooperative development and business pain points, to the construction of Sky Island R&D platform and gateway, and deep co-construction of unified FaaS R&D platform with the group, as well as construction around various development experiences and stability, making the overall Serverless reach **usable** state.

But at that time, the overall Fliggy Serverless system **infrastructure perfection and ease of use** still had a distance, facing 4 urgent problems to be solved: stability needs strong guarantee, BaaS capability is incomplete, engineering link is not convenient, business pilot rhythm is poor.

Under this circumstance, we **[launched Fliggy Serverless System Phase II]** in the second half of the year. While consolidating Serverless technology system construction, found breakthrough points for frontend R&D system upgrade and Serverless combination, **carried out around advancing Serverless infrastructure upgrade, monitoring stability enhancement, R&D experience and engineering upgrade, front and back end integrated business best practices 4 aspects**.

<img data-src="https://gw.alipayobjects.com/zos/k/iu/O5JLxV.jpg" src="{{site.defaultImage}}" class="lazyload img-zoom"/>


**At this stage, completed multi-business scenario pilot exploration, meanwhile Serverless technology construction satisfies business use, completing trial period -> usable period stage. The next main goal is business scenario scope spreading, used to produce greater value.**

Want to take this opportunity to summarize and synchronize some of our technical construction achievements in the last half year to everyone. Maybe there are some capabilities you need that solve your urgent needs. Very welcome to discuss together. If there are deviations in understanding or unclear descriptions, welcome everyone to point out directly or make suggestions.

## First Talk about Landing

Talking about technology system, first need to consider its value reflection to business, including how to measure the differentiated value it brings.

First synchronize Serverless landing effect in Fliggy business scenarios to everyone. **Currently one year Fliggy Serverless accumulated 25 scenarios using probing including High Speed Rail Tour, Traffic Search, Fliggy Release Commenter, Resource Position Management Platform, Visa, WIFI, Surrounding Tour, Travel Any Door, Travel Purchase, Super New Discovery, Ticket, POI, Discovery Video, Newcomer Zone, Find Similar, Titan, Mini Program URL Management, Collection/Itinerary, Boat Ticket, DB, PC Content Detail Full Cut FaaS SSR, Live Broadcast, Unified Destination, Delivery Platform Coupon Issuing/Crowding/Publishing Activity etc.** Among them S2 launched 10 function groups, mainly gathering on landing work of new business new type scenarios. Including various frontend teams on Fliggy side are also using, and there are also **many "special representative" scenario businesses**:

<img data-src="https://gw.alipayobjects.com/zos/k/zy/6j9UtM.jpg" src="{{site.defaultImage}}" class="lazyload img-zoom"/>

- **Rax Integrated Scenario**: We completed Outbound Purchase Rax + FaaS integrated project landing, pulling group students together to support improvement in many places in the middle, also the group's first Weex integrated business launch;

- **General Search Capability Architecture**: Ticket group students used Serverless to make **Traffic Line Search Architecture** capability, designed corresponding search general capability, empowering subsequent use of Boat Ticket, DB search;

- **Mid-backend Integrated Scenario**: Utilizing Ant Design Pro + Serverless integrated capability and database connection to quickly launch Fliggy parameter passthrough control platform, saving application, domain application complex processes, lighter use

- **Fliggy SEO SSR Capability Landing**: Fliggy side SEO platform brought great value to Fliggy user acquisition and search ranking last year, but to quickly land an SSR page, actually still needed a lot of server-side capabilities. Currently ran through Fliggy Strategy Page SSR process, can develop our SSR like developing functions, very simple to use, expecting greater value later.

## Capability Consolidation

Can pass the following picture of some of our construction items in nearly half a year. Through integrated development mode, let frontend students gradually possess productized development thinking. BaaS capability expansion will do things down one layer deeper. Monitoring integration construction let serverless full link get visual guarantee. Bringing business demands to participate in group Serverless co-construction to better promote overall development.

<img data-src="https://gw.alipayobjects.com/zos/k/2i/l0uZj5.jpg" src="{{site.defaultImage}}" class="lazyload img-zoom"/>


### Integrated R&D Mode Upgrade

- **Rax + FaaS Integrated Capability**: S2 we promoted co-construction group together to upgrade to frontend-dominated [src/apis] directory structure based on original old [client/cloud], local development debugging SDK and gateway request frontend SDK upgrade compatibility completed and pass through fcMtopInnerParams parameter simulation. On business side we completed [Outbound Purchase](https://market.m.taobao.com/app/trip/rx-faas-fliggyshop/pages/home.html?wh_weex=true&titleBarHidden=1&wx_navbar_hidden=true&spm=181.7474825.subentry.d4&scm=&ttid=12mtb0000155&utparam-url=%7B%22ranger_buckets_native%22%3A%22tsp2584_22605%22%7D&_projVer=2.0.1) business landing launch

- **Ant Design Pro + FaaS Integrated Mid-backend Development**: Since currently many Fliggy Xiaoer platforms complete Node application deployment by applying for 1+3 machines in Aone, there are problems of troublesome application, machine waste, complex launch. Based on this we **ran through FaaS integrated local debugging, compilation, deployment launch full process under Ant Design Pro system, currently precipitated to scaffold and R&D platform**. We can launch mid-backend applications like developing a normal frontend page, without applying for machines and domains. Currently Fliggy Channel Management Platform ran through database usage process launch

  <img data-src="https://gw.alipayobjects.com/zos/k/p1/2W1NjX.jpg" src="{{site.defaultImage}}" class="lazyload img-zoom"/>

- **FaaS Rax SSR Integration Run Through**: Previously when developing SSR, needed to make a frontend become a full stack, meanwhile needed to consider Node selection, application, construction, deployment, guarantee these processes. This also led to it being difficult to use widely internally. Water Lan side SSR co-construction group students produced general capabilities. Subsequently based on nginx+lua+cache dynamic proxy strategy, completed Fliggy side full link launch run through. Currently can also be put into production use, can be used well for subsequent Fliggy SEO and page performance improvement scenarios, see [Travel Strategy>>](https://fl-content-d.fl.fliggy.com/detail?id=221333293146)

**This type of integrated development mode is currently in representative scenario business run through launch process in Fliggy. Subsequently mass production we need to cheer up to do it, so as to realize greater value of this technology**.

### Development Experience Improvement

Speaking of frontend development experience, Fliggy frontend students will inevitably think of "CLAM Engineering System" (a feeling of clam coding by the sea). **A set of simple commands complete project initialization (clam init), create iteration and branch (clam newbranch), local development debugging (clam dev), prepub (clam prepub), launch (clam publish) full process engineering, seamlessly connected with underlying platform capabilities**.

Based on this, we completed the connection of Clam and FaaS development system. Now Fliggy developers do not need to apply for corresponding applications on R&D platform, click iteration step by step. **Directly create pure faas project through `clam init faas`, create RAX+FaaS integrated project through `clam init rax --faas`, subsequent process can keep consistent with previous page development experience**, reducing usage cost for everyone.

<img data-src="https://gw.alipayobjects.com/zos/k/65/YWmBaO.jpg" src="{{site.defaultImage}}" class="lazyload img-zoom"/>

At the same time, in order to reduce starting cost for students initially using FaaS, completed Fliggy side Serverless usage document organization and induction, including **novice tutorial, framework introduction, common service calling, BaaS capability, integrated development, operation and maintenance troubleshooting development full process usage document>>>**

<img data-src="https://gw.alipayobjects.com/zos/k/y9/RRFRRn.jpg" src="{{site.defaultImage}}" class="lazyload img-zoom"/>

### BaaS Capability Construction

Vaguely remember that in the first half of the year, due to many BaaS capabilities not being well supported, especially database usage, led to some scenarios only being able to flinch. This part is also a part we promote group co-construction students to strongly support. In the second half of the year, we tossed out following solutions together to meet existing business demands:

**Proxy way to connect database** (Transition solution, existing scenarios use): We ran through proxying to database addition, deletion, modification and query operations by using baas-sdk connecting center application at the beginning. Used as a transitional way when database could not be used at that time, but due to centralized proxy dare not strongly guarantee C-end application stability, more recommended for internal application use.

**FaaS Direct Connect Database** (Recommended solution, safer): Plus C-end business side has strong appeal, needing to use database capability, we and midway runtime students **ran through directly connecting to database when FaaS function LifeCycle starts, allowing each function to read Configuration, and also precipitated a set of what we think is the best way to use FaaS database addition, deletion, modification, query and table creation, filling the blank of using database in FaaS in the group**. Currently this type of use has been run through in Fliggy C-end city destination unification and internal mid-backend channel management.

<img data-src="https://gw.alipayobjects.com/zos/k/6z/uqIghi.jpg" src="{{site.defaultImage}}" class="lazyload img-zoom"/>

**Internal Network Login Capability Call**: Our mid-backend system's first middleware capability, usage method is very like original midway way, can use this plugin to quickly realize internal network login capability access, allowing us to get started quickly.

### Stability and O&M Capability

Stability has always been the part that needs most attention in Serverless system. Since it belongs to new things, need to guarantee stability as much as possible, letting new students feel this system is reliable, their business can come to production use, thus can promote its better integration and development.

**Serverless Monitoring Integration Platform**: To better discover and troubleshoot problems, we pulled original Node monitoring students together to make a Serverless monitoring integration platform. Currently version 1.0 has been released. **Plus function monitoring information, introduced health score concept, also added important function full link monitoring, can see problem location at a glance through flowchart, added quick stop bleeding entrance**, meanwhile **overall capability has been accessed to unified FaaS R&D platform**. Currently we are working on function monitoring focus part, meanwhile starting to work on custom log statistics capability, expecting to bring greater value in monitoring side later.

Besides monitoring part, how to make functions under low O&M cost is also a place needing key consideration. Based on this Serverless co-construction group promoted Serverless machine students together to launch **function dynamic scaling** capability, and also established **function tenant control platform**, facilitating subsequent function capacity, tenant, launch and other control work.

In addition, there is an important Fliggy serverless supporting multi-unitization matter also being promoted, so as to achieve **unit escape** when emergency problems occur.

### Gateway Side Enhancement

In the first half of the year, our gateway side capability could meet existing C-end business side use. In S2 we did some enhancement work, such as gateway frontend SDK supporting H5 and Rax1.0 gateway information passthrough, meanwhile implemented standardized connection of Fliggy side gateway buried point data and full link monitoring, meeting use of serverless full link monitoring.

### Group Co-construction

Most of the above capabilities are implemented together with group Serverless co-construction side capabilities. Especially thank brother teams for cooperation and support, such as FaaS R&D platform, integration solution, monitoring integration, BaaS capabilities. These constructions are strongly dependent on everyone cooperating together to land and use.

## Outlook

In the next year we will focus more on spreading use on business side, meanwhile need to **verify Serverless true differentiated value to business, proof of machine saving**; also very welcome more students to refer in, push Ali Serverless system value one step further!

Technical side in the next year will focus more on stability, and underlying BaaS capabilities, peripheral monitoring system construction. Business side will more likely spread with multi-scenario business, deeper exploring business value Serverless can bring!
