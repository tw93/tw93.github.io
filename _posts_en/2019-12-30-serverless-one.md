---
layout: post
title: Fliggy Serverless System Construction S1
date: 2020-03-15 16:00:00
summary: It has been almost 1 year since the Fliggy Serverless technology system construction project was initiated last April. During this period, experienced group infrastructure research and multi-BU communication, formulated solution goals around the pain points of Fliggy front and back end cooperative development, to the construction of Sky Island R&D platform and gateway, the launch of pilot business, and then to the merger of Sky Island, Lander, and DEF to build a unified FaaS R&D platform, as well as construction around various development experiences and stability, and now to the Serverless transformation of 14 business scenarios, completing a preliminary stage.
categories: Share
---

> This article has been desensitized and approved for publication on the Fliggy Front-end Team Official Account.

It has been almost 1 year since the Fliggy Serverless technology system construction project was initiated last April. During this period, experienced group infrastructure research and multi-BU communication, formulated solution goals around the pain points of Fliggy front and back end cooperative development, to the construction of Sky Island R&D platform and gateway, the launch of pilot business, and then to the merger of Sky Island, Lander, and DEF to build a unified FaaS R&D platform, as well as construction around various development experiences and stability, and now to the Serverless transformation of 14 business scenarios, completing a preliminary stage.

**Fortunately, I experienced the hustle and bustle of Serverless before and the steady progress now. With the participation of multiple departments in Alibaba, Alibaba Serverless is slowly running in one direction, dedicated to the new upgrade of front-end R&D mode. I would like to introduce the current construction situation of Fliggy through this article, hoping to provide some reference suggestions for students who are waiting and seeing or currently planning to carry out Serverless business.** If there are deviations in understanding or unclear explanations, welcome everyone to point out.

## History Development

In 12~13 years, Fliggy's core business was mainly based on PC platform. The core pain point of front and back end R&D collaboration lay in the writing of dynamic templates. Different teams' front and back ends often caused conflicts around the ownership of "template applying" work.

By 14 and 15 years, in the process of All in Wireless, in order to solve the rapid conversion from complex industry data in PC era to wireless gateway Mtop, Fliggy established a wireless server team to complete the glue layer work from data to end side, which could solve a series of problems well, but continuous repetitive wrapper interfaces also made wireless server face growth and precipitation problems, which was not very sustainable.

![](https://gw.alipayobjects.com/zos/k/q9/LohYRl.jpg)

After wireless server technology construction stabilized in 16 and 17 years, also due to the above problems, Mtop interface encapsulation work was gradually delegated to industry backend students. With H5/Weex/iOS/Android multi-end development, respective demands for interfaces were difficult to be consistent, appearing to use Node BFF layer to undertake glue problems. But frontend operation and maintenance capability was not strong, long-tail machine waste led to difficulty in full BFFization.

By 18 years, Fliggy platform transformation was completed. Business changed from vertical industry to horizontal platform undertaking. Landing of requirements needed multi-party collaboration and scheduling. Fragmentation of the middle layer became more serious, bringing greater challenges to front and back end collaboration costs. At the same time, it could not solve other business layer problems through single domain problem solutions (such as order page solutions). **Urgently needed a lightweight general solution to solve increasingly serious glue layer collaboration**.

## The Emergence of Opportunity

With the landing of Serverless on various cloud platforms in the industry, this "fragmented" function solution via FaaS can well solve the above fragmentation problems of front and back end assistance; at the beginning of the fiscal year, the Serverless container infrastructure built by the middleware team plus the support of the R&D department FaaS platform side and Midway Runtime made Serverless landing in the group possible.

Under this opportunity, we launched the "Castle in the Sky - Serverless Technology System Construction Special Project". By building the upper-level Serverless technology system on the group's underlying infrastructure, we solved a series of problems encountered in Fliggy's shopping guide, interactive, and mid-backend fields, and used this to push the existing front and back end collaboration model one step forward to the next stage.

## Castle in the Sky Construction

### Solution Diagram

Through exchanges and consultations with infrastructure teams of all parties in the group, we formed the following Serverless construction diagram around Fliggy's current pain points.

<img data-src="https://img.alicdn.com/tfs/TB1tEksjUD1gK0jSZFGXXbd3FXa-1920-1080.png" src="{{site.defaultImage}}" class="lazyload img-zoom"/>

Among them, blue is the key construction part, green is the dependence on the group side, co-construction and promoting development, and red part is the existing capability of industry/platform; in the half-year construction process, with the development promotion of group Serverless co-construction, and the gradual clarity of demands in the business pilot process, technical direction mainly focused on the following 4 points:

### FaaS R&D Platform Construction

Within half a year, FaaS R&D platform construction went through 4 phases cumulatively. From the initial phase 1 self-built Sky Island to the later 3 phases co-building a unified R&D platform with multi-BU students to meet migration use. The purpose has always been <Leverage group underlying capabilities, build upper-level Serverless upper-level unified platform, meet the use of business scenarios Serverless transformation>

**Phase 1 Self-built Sky Island to meet Fliggy pilot use**: In June last year, we completed the construction of Fliggy FaaS unified management platform Sky Island. The bottom layer highly encapsulated Aone basic API, opening up function development, service calling, deployment, runtime full process. From tenant management, business scenarios to function group management, connecting WebIDE, more in line with the usage habits of Fliggy upper-level business development students; based on this, we completed 3 business scenario pilot uses, forming partial quantitative and qualitative conclusions on R&D resource input, runtime performance, stability and other indicators.

At the same time, Lancer platform also began to empower Taobao shopping guide business use. Artificial intelligence YaaS platform satisfies mid-backend scenario use, but lacks a unified Alibaba front-end Serverless R&D platform. After many discussions and alignment with many Alibaba teams, the planning landing of the co-construction R&D platform came.

<a href="https://cdn.fliggy.com/upic/0kvqxm.mp4" target="_blank"><img src="https://cdn.fliggy.com/upic/KkSMk4.gif" width="960"/></a>

**Phase 2 Participate in group co-construction to complete multi-party merger, supporting Fliggy and Mobile Taobao run through**: Mainly early merger and product solution sorting, formulating solutions together, completing the three-party integration of Fliggy Sky Island, Mobile Taobao Lancer, and Def. At the same time, unified connection on underlying database structure and Api. Functionally supports non-overlay release and grayscale flow cutting solutions. This stage basically completed FaaS function run through, but usability still needs improvement;

**Phase 3 Unified platform features enriched, supporting Fliggy side easy to use and migrate**: Work in this phase covers existing Sky Island capabilities, that is DEF 2.0 seen in the above figure now. On the previous basis, supports aggregation capabilities of BU and product scenarios, R&D closed-loop testing monitoring experience, Http universal gateway supporting mid-backend scenarios; completed unified external Open-Api sorting specification formulation work, providing lightweight Pipeline release process for service orchestration system use; letting Sandbox and service market support Fliggy side well, co-construction produced Rax + FaaS integrated solution, meeting use on unified R&D platform on Fliggy side.

<img data-src="https://gw.alipayobjects.com/zos/k/pc/J9WUGP.jpg" src="{{site.defaultImage}}" class="lazyload img-zoom"/>

**Phase 4 Usage pain point optimization, meeting cut flow work before 930**: After functions in the previous phase met use, construction focus in this stage solved pain points in user usage process on Mobile Taobao and Fliggy side, supplemented operation manuals, enhanced pipeline release control process; at the same time supported use of mid-backend FaaS integrated scenarios, and **added function testing, quick calling, Debug 3-in-1 function on function detail page for everyone's convenient use**;
<img src="https://cdn.fliggy.com/upic/EK10Uu.gif" width="720"/>

### Sky Island Gateway Construction

Before FaaS functions are used by the end side, gateway is also needed to convert lower layer HSF service access to universal Mtop/HTTP accessible, and provide authentication, current limiting, disaster recovery, logging, monitoring functions for all FaaS functions on Fliggy side through unified gateway entrance. Currently construction has reached the third phase, subsequent focus mainly on capability enhancement.

<img data-src="https://gw.alipayobjects.com/zos/k/sg/Q6wnhO.jpg" src="{{site.defaultImage}}" class="lazyload img-zoom"/>

**Phase 1**: Mainly used for docking with Sky Island platform. Through standard agreement, **provide basic capabilities to meet business side pilot use**. At that time, connection was made by accessing Sky Island database to obtain corresponding FaaS trigger information of the function.

**Phase 2**: Coincided with R&D platform co-construction with the group. To dock with new platform use, we configured gateway layer standards with business platforms and Taobao students based on the original basis, **can meet use of non-overlay release and grayscale flow cutting**. When function is released, push information to corresponding remote group, gateway side monitoring, solving platform data coupling problem based on meeting standards.

**Phase 3**: More focused on **adaptable parameter specification, stability, capability expansion** 3 aspects. Currently specifications and stability are all completed. Full link log, gateway monitoring alarm, anti-crawling, DingTalk custom alarm access. Subsequent focus on capability expansion, solving some problems due to insufficient underlying BaaS capabilities.

<img data-src="https://gw.alipayobjects.com/zos/k/uo/mqjiBj.jpg" src="{{site.defaultImage}}" class="lazyload img-zoom"/>

### Basic Support

Besides satisfying R&D platform and gateway side can be used by business development through normal stable support business, externally need to work with the group to handle some upstream and downstream infrastructure support well. Fliggy side acts like a "business party" role helping write part of the code and raise requirements; internally do corresponding stability guarantee and some optimizations to let business development students develop more comfortably; for BUs newly starting, may also need to spend time on midway-faas runtime, Ginkgo machine, stability, integration to support preventing omissions;

- **FaaS Runtime**: This part is a very critical part of function runtime, provided by group Node team partners. Current version can meet business use well; during the period mainly helped provide middleware calling case demo, improve tool link experience, and document supplementation work; including some Bug troubleshooting notification communication work in runtime, making the bottom layer reliable preventing impact on business.

- **Stability Matters**: Currently the most important part for Serverless system is stability guarantee. Not producing online problems is also the bottom line of construction (preventing online problems -> Serverless is unstable now -> important business not using chain reaction); including pressure test work before launching big business (surprised that a single Pod can withstand 300qps access!), pre-partner preparation work (expansion, evaluation), code self-disaster recovery check, gateway level disaster recovery configuration, monitoring access etc.; since currently Fliggy side is only deployed in Zhangbei, subsequently need to promote cloud business must be deployed in multiple units to improve stability;

- **Function Migration to Cloud**: Related to function running container is our middleware team. Currently cloud cluster is usable, gradually offline original old computer room. During the period completed Fliggy side function migration matters, including whitelist function sorting, migration, check, correction, verification, full migration. Interestingly, through this promoted group monitoring to complete monitoring and Debug capability intercommunication;

- **Rax + FaaS Integrated R&D**: Belongs to a relatively important link in future cloud-end integration. Currently multi-party formulated directory structure of client, cloud, completed Fliggy gateway simulation SDK, frontend request SDK connecting gateway development and merging to trunk. Added support for Fliggy Rax+Faas integrated creation in scaffold, meeting full process run through local debugging calling and unified R&D platform release work; currently connecting corresponding process with Fliggy side engineering system Clam, expecting to let business side truly friendly launch integrated projects.

  <img data-src="https://gw.alipayobjects.com/zos/k/fs/GAXnwT.jpg" src="{{site.defaultImage}}" class="lazyload img-zoom"/>

## Business Scenario Serverless Transformation Support

Speaking of Serverless technology construction, a large part is that technology can meet business demands, allowing it to explore a new R&D method in the process of business scenario landing;

Currently cumulatively completed High Speed Rail Tour, Publisher, Visa wifi, Ticket, Any Door, Surrounding Tour, Collection, poi, Discovery, Find Similar, Titan Super Tube, Resource Position Management (Mid-backend Integration), Traffic Side Search (Development completed pending launch) etc. nearly 22 functions FaaS transformation support for businesses, 14 business pilot scenarios, meanwhile generating 1000W+ function calls every day in shopping guide domain**;

Through Serverless, frontend students possess service development capabilities, can solve boundary problems in interface development and division of labor relatively well, meanwhile can release certain java and manpower resources, saving machine O&M manpower.

From pilot effect, currently judge Serverless system is suitable for business scenarios of data source merging, data protocol conversion, middle layer and data passthrough. Can undertake glue layer logic in a more elegant way to smooth the gap between cloud and end. But at the same time currently in development experience, stability aspects still need to strengthen cooperation with collaborators, jointly promoting infrastructure to move forward.

## Subsequent Planning

<img data-src="https://gw.alipayobjects.com/zos/k/v6/r8RIhT.jpg" src="{{site.defaultImage}}" class="lazyload img-zoom"/>

## Outlook

Very fortunate that currently Serverless construction follows Alibaba co-construction development and business pilot promotion, gradually changing from the noise at that time to steady progress now. At the same time, there are still many things to do. Welcome to enter the world of Serverless, and better promote her development!
