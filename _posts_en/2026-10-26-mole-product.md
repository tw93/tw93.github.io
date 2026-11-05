---
layout: post
title: "How I Made Mole a Slow Product in the Fast AI Era"
poem: 欲速則不達
date: 2026-10-26 20:00:00
feature: https://cdn.tw93.fun/blog/pic/mole-product-cover-honest-en.png
summary: "It has been a little over two months since I wrote the previous post, “From Mole CLI to Mole for Mac: What I Learned”. In that time Mole went from 1.13 all the way to 1.19, added AI tool cleanup and System Data cleanup, the Windows version shipped on the evening of October 14, and the GitHub repository quietly passed 73.9K stars."
categories: Thought
---

![How I Made Mole a Slow Product in the Fast AI Era article cover](https://cdn.tw93.fun/blog/pic/mole-product-cover-honest-en.png)

It has been a little over two months since I wrote the previous post, [From Mole CLI to Mole for Mac: What I Learned](https://tw93.fun/en/2026-08-16/mole-mac.html). In that time Mole went from 1.13 all the way to 1.19, added AI tool cleanup and System Data cleanup, the Windows version shipped on the evening of October 14, and the GitHub repository quietly passed 73.9K stars.

Looking back, most of my time did not go into new features. It went into testing apps, resending emails, and reworking icons and copy, things that look like a poor trade to an engineer.

Programmers naturally like work that scales. Whatever the task, we look for a way to turn it into a tool, a script or an AI call so we can be lazy. These two months left me feeling a bit differently. Code keeps getting cheaper and anyone can quickly build something that runs, so what sets products apart is more and more the details you only learn by doing the work yourself. The good news is that with AI, these chores that used to take a lot of people can now be finished by one.

## Installing 853 Mac apps to test uninstall

I am a bit obsessive and keep my own Mac at around 30 apps. To make Mole's uninstall more thorough and its leftover cleanup stronger, the first round collected more than 300 Mac apps from China and abroad, about 100 GB of downloads, split into 30 groups of 10. An agent used computer use to download each from its official site, install it on my Mac, check its folders, update bundles and login items, uninstall it, look for what was left behind, and add the missing rules to Mole.

At first I thought 100 mainstream apps would be plenty. When those were done I thought, why not another 100, and at 200 I thought the same again. Later I added App Store versions and extensions, and the count went to 549, 709, 824, and now 853. My Mac suddenly turned into the very messy desktop below. Have a look.

![The real desktop during testing, with open apps, permission prompts and work windows piled on top of each other](https://cdn.tw93.fun/blog/pic/mole-product-testing-mac-apps-desktop.webp)

The process looks extremely boring. Many apps start popping up permission requests the moment they are installed, nudge you to buy a membership, and some insist on an administrator password. The agent handled most of it on its own and I stepped in for the rest. What surprised me most was that the AI wrote its own scripts to automate installing, uninstalling and checking leftovers, to make its job easier. Quite clever. I was mostly its assistant.

<video width="800px" controls preload="none" muted playsinline poster="https://cdn.tw93.fun/blog/pic/mole-product-testing-mac-apps-poster.webp">
  <source src="https://cdn.tw93.fun/blog/pic/mole-product-testing-mac-apps.mp4" type="video/mp4">
</video>

I thought software engineering was orderly and followed conventions, and that after 100 apps there would be few rules left to add, since the conventions of mainstream apps should be enumerable. The further I went, the clearer it became that this was wrong. Many leftovers cannot be found by any general rule, and some bundle IDs are not even reverse domain names. A convention that looks tidy may just be what some programmer typed years ago, with no theory behind it, so the only way is to install one and check one.

That first round of more than 300 apps gave Mole 13 kinds of reusable general rules and more than 90 precise cleanup paths. Along the way it also fixed more than 30 places I had thought should be cleaned but should actually be left alone, and added more than 100 unit tests. Those places to leave alone were as valuable to me as the new leftovers: a cache can be rebuilt, the user's own files cannot, and data several apps share should never go just because one of them was uninstalled.

I also wrote up the leftover paths and uninstall steps for every app as guides in Chinese and English on the site. All 853 are free to read, so even without any tools you can follow them by hand. See whether the apps on your Mac are in [this list](https://mole.fit/tested-apps).

![The AI tools part of the tested app list](https://cdn.tw93.fun/blog/pic/mole-product-testing-mac-apps-800.webp)

## Actually using 30-plus AI tools

Before Mole had AI cleanup, many people had asked to clean up the data AI tools leave behind. I used to see AI coding session history as a valuable asset, so Mole only cleaned real caches and old versions there.

But using AI every day, I had piled up plenty of old artifacts, old sessions and worktrees I no longer needed, and one user's single `opencode.db` had grown to 62 GB and they urgently asked how to clean it. So I tested more than 30 AI tools one by one: 13 desktop apps, 13 command line tools, plus the folders OpenClaw, Hermes and Pi leave behind after uninstall.

Unlike the earlier install-and-uninstall rounds, this time I signed in to every tool I could and used it once in a real project: asking questions, running agents, building code indexes, setting scheduled tasks. A lot of the data only appears after real use.

For each tool, the AI compared against the state before install, measured what it wrote into the home folder, `~/Library`, `/usr/local/bin` and the shell configuration, and recorded it in a ledger. Then it checked how many processes and how much memory the tool used, uninstalled it with Mole, and scanned the whole home folder by name for anything unlisted. Whatever was missing went into the code that night and was tested again.

In this round, the most visible part was memory: the 13 desktop apps open together took about 23 GB, and one tool from a big Chinese company started 41 processes and 4.49 GB of memory on launch. Most of these tools are built on VS Code or Electron, so each window brings a string of helpers. That is why, when I built status monitoring, I gave each app one row and added up all of its child processes; in Activity Monitor alone it is hard to see who is actually eating the memory.

Then there were the small changes they made to the system. Some tools, on first launch, put a root-owned command link in `/usr/local/bin`, which becomes a dead link once the app is deleted. One put a `python3.12` into `~/.local/bin`, so typing `python3.12` in the terminal afterwards ran its bundled copy. The worst was a Chinese command line tool: I ran it once, it told me it was no longer maintained, and then, without asking, downloaded and installed its new version, edited `.zshrc`, and renamed the old command to legacy.

The sizes were wild too. One desktop app downloaded a roughly 1 GB toolkit the first time I used its Work mode, 3.1 GB unpacked, carrying its own LibreOffice, FFmpeg and OpenJDK. My own `~/.codex`, which I use every day, was already 24 GB, 17 GB of it sessions, and 12 GB of the Claude desktop app's 14 GB was the Cowork virtual machine. Many skill installers also write a `skills/` folder into every agent's directory whether or not you have that agent, so I had config folders for Qwen Code, iFlow and Droid without ever using them. Mole's first version even treated them as 2.4 MB of tool leftovers and nearly cleaned out my installed skills as junk.

Something else I did not expect was processes. The morning after an uninstall, two command line tools had their folders deleted and grown back. The terminal sessions from the night before were still alive: the program files were already in the Trash, but the background processes kept writing logs into the folders. A command line tool has no window, and closing the terminal tab does not necessarily end it.

Some apps also misbehaved. Some installers quietly write something to your clipboard while downloading, to track the install channel. Some pop up endless prompts to join campaigns and claim tokens, the kind of tool you hold your nose to use. By comparison, Claude, Codex and Cursor stayed fairly restrained, and in China the one that pleasantly surprised me was Qoder: a clean interface, good taste, nothing pushy.

All this changed one of my earlier judgments. Sessions really are valuable, but old sessions and worktrees you are done with really do take space. Today's AI cleanup lists sessions by the retention period you choose, 15, 30, 90 or 120 days, each with its title and time, and keeps a recovery copy before deleting. A worktree only shows up when git can prove it has no uncommitted changes. `opencode.db` gets database compaction, which only returns the freed pages to the disk and never deletes the user's conversations.

![Mole's AI Cleanup & Care page, listed in three sections: caches and old versions, sessions and workspaces, idle tools](https://cdn.tw93.fun/blog/pic/mole-product-en-ai.webp)

## Mac System Data can now be seen and cleaned

A while ago I was browsing Reddit and saw many people complaining that System Data in macOS settings often reaches one or two hundred GB, asking what it is and whether it can be deleted. That number is only the result of a classification. [Apple's own explanation](https://support.apple.com/102624) also counts every file the other categories did not take, so it is not a list you can delete from. Mole's System Data group therefore only states how much it measured and can handle, and does not try to match the total in System Settings.

The hard part is that you cannot install one thing and check one thing on your own machine here. Every Mac's System Data is different, and many cases can only wait for a user report and then be traced layer by layer.

Take purgeable space. The number the system reports mixes iCloud files that can be reclaimed with caches the system will release on its own. Even a Mac with no local snapshots shows around 142 GB. Early Mole used that number to estimate how much snapshots could free, estimated 50.7 GB, and after cleaning the free space only grew by a few GB. Now the snapshot row no longer shows an estimated size; after cleaning, Mole measures how much free space actually changed, and since APFS does not return space all at once after a delete, it waits until the number stops growing. Along the way I caught a bug: reading free space always returned a stale cached value, so cleaning always showed 0 freed.

Another user's System Data held 179.53 GB of wallpaper render cache, 6644 files in all, an uncompressed BMP for every wallpaper at every screen size, never deleted by the system. The first version could find it but could not delete a single byte, because the wallpaper process is always running in the background, and the command that checks whether a file is in use reported errors on single files, which were treated as uncertain. In the end it only lists the ones older than a week that are not currently on screen, for the user to confirm, and this shipped in 1.17.

As for things like the 119 GB iPhone backup and the 79.5 GB Parallels virtual machine on my own Mac, they are big but should never sit behind a select-all delete button. Mole only shows their size and where to manage them, they cannot be ticked, and they do not count toward the space that can be cleaned, so people go back to the right place and make sure before doing anything.

![Mole's Clean page during development, with System Data at the top and Other Storage read-only](https://cdn.tw93.fun/blog/pic/mole-product-mole-system-data-review.webp)

## Resending keys to 400 unactivated buyers

Over the National Day holiday I spent a day on something I had put off for a long time. I went through every Mole order from the May launch to the end of September that was bought but never activated, about 400, had AI write a simple local script to list the emails and keys, and resent them one by one, grouped by purchase month, country and language. It was more like sending a message to a friend: a reminder not to forget it, and no rush if they are not using it yet.

Interestingly, replies kept coming in from users in many countries, and they meant much more than I expected. Some said they bought it just to support the development and actually preferred the Terminal version, and some had forgotten about the GUI and had been using the CLI all along. One user had bought two, one for themselves and one for family as a Christmas present, so it was still unactivated, the key already saved in their password manager. It made the world feel like a lovely place.

One user could use it on a work computer at first, until the company banned software outside its approved list, and was waiting for a new Mac of their own to start using it. Another bought during a discount and still had no MacBook, planning to activate as soon as the new machine arrived. Someone replied with just "Prefect!", and someone else said during the holiday that it was time to slack off properly, a pun on mole that only works in Chinese. These replies were a joy to read.

Quite a few, though, had simply typed their email wrong, probably in a hurry, `gmai.com`, `gmail.con`, `cloud.com` and so on, and never came to me. Others never got the first email and bought again to start using it sooner.

So I filled in a piece of the post-purchase flow: after payment, the user is taken back to the site, which displays the Key right away, so even with a mistyped email or a blocked message they see it immediately. There is also a neat little detail: clicking activate on the web page invokes the installed client through a custom protocol and automatically fills in the Key, leaving the user to just press confirm without copying and pasting.

<video width="800px" controls preload="none" muted playsinline poster="https://cdn.tw93.fun/blog/pic/mole-product-mole-active-poster.webp">
  <source src="https://cdn.tw93.fun/blog/pic/mole-product-mole-active.mp4" type="video/mp4">
</video>

This small piece of magic is really just the web page handing the system a link Mole recognizes, the system handing it to the app, and the app only placing the key in the input field. It never confirms the activation for the user and still goes through the original license check. An engineer who has built clients or front ends may find this trivial, but to most users it feels like wow, how did it do that, this product did a little extra for me.

I wonder if you have noticed some of the small details in Mole. When you start Clean Screen, the whole screen goes black, the keyboard locks, and a random line of poetry appears. By the time you have read it and thought it over, about two minutes, the screen is clean.

Lately I have been doing something similar: writing to the early users who bought Mole right after its launch in May, with versions in Simplified Chinese, Traditional Chinese, English, Spanish and French. The letter mostly thanks them for supporting it so early, mentions that the Mac version has added System Data and AI cleanup these months and that checking for updates in Mole brings them in, and ends by asking them to reply directly with anything that feels off or any feature they want.

I wrote this letter myself by hand, the way I would talk to a friend.

Paul Graham wrote in [Do Things that Don't Scale](https://paulgraham.com/ds.html) that Wufoo sent handwritten thank-you notes to early users and that the Stripe founders would take a user's laptop and set them up on the spot.

## Redrawing icons and rewriting copy from feedback

The detail that took the most time these two months was replacing every icon in Mole. Before, I used system icons, which are fine for simple cases but lack a bit of soul up close. After looking around, Remix Icon, which I use a lot for the web, did not look right in an app. I settled on Phosphor: about 70% could be used directly, and the other 30% I drew as SVGs with Opus 5.5 so the line width and style would stay consistent.

![35 pairs of icons, each with the old system icon on the left and the new icon on the right](https://cdn.tw93.fun/blog/pic/mole-product-mole-icons-before-after.webp)

For Keep Screen On I used a cup of coffee, a nod to Caffeine, as if the computer drank coffee and could not sleep. About usually gets a circled i, but I thought it should say hello, so I used a waving hand. Diagnostics would normally get a troubleshooting mark; I used a stethoscope, more like giving the computer a checkup.

Then after release, some icons I liked turned out to be unclear to users. Check for Updates used a download icon, so people read it as download. The little square for the GPU did not read as a graphics card, the archive icon was confusing, and two stacked memory sticks did not look much like memory. Some said the sponge for Clean Screen and the waving hand for About made no sense.

So I reworked all of these as people suggested. Check for Updates became a clockwise arrow, the GPU became a dual-fan graphics card, the archive became a storage box, audio went from a music note to headphones, Clean Screen went back to its original brush, memory went back to a chip, and About ended up as the most orthodox ⓘ, just redrawn to the line width of its column. Quite a few were changed three times before they finally felt right.

![The same piece of interface side by side, each row from left to right: the system icon, the first version, and what it looks like now](https://cdn.tw93.fun/blog/pic/mole-product-mole-icons-iterations.webp)

The copy took the same kind of fiddling. I had used up most of my Claude and Codex quota writing code, so I dug out Gemini, which had been gathering dust for a while, switched to 3.8 Flash High and asked it to look at the copy. It pleasantly surprised me: it may not be the very best at code, but it writes plain language very well. I put almost all of Mole's settings, cleanup item descriptions and site content through it. The brief was simple: talk like a person, simple, clear, easy to grasp, so someone using it for the first time gets it instantly, nothing stilted and no AI tone.

I had it output before and after versions with the reason for each change, then went through them one by one. It really felt like having a very patient language teacher sitting beside me, turning a lot of programmer-pleasing phrasing into words normal people can follow. For example, the cache deletion item used to be easy to misread as the way the whole app gets deleted; now it says clearly that it only covers ordinary caches on the Clean page and does not affect uninstall.

## Accessibility made AI testing more precise

Testing hundreds of apps brought an unexpected bonus. In its first few versions Mole already supported blind and low-vision users with many accessibility attributes, and this time they helped a lot: with them, the AI could find every button and element very precisely, and testing went much more smoothly.

Accessibility attributes give more than a coordinate. They say what a control is called, what kind it is and what state it is in, so when the interface shifts a little, a script still finds the same button. Relying only on screenshots and coordinates, a changed dialog or a moved window easily makes the click miss. From the start Apple wanted everyone to be able to use a computer equally, so much of the system can be read by VoiceOver, and I love that.

## Testing the Windows version in a VM and on a ThinkPad

The Windows version was tested the same way, one app at a time. Windows was not starting from zero: Mole's Windows CLI has been maintained since early this year with contributions from the community, and the CLI is quite mature now. That groundwork is what made this desktop version possible. The desktop version uses native C# and WinUI 3 on Windows, and the Swift code of the Mac version is almost no use there. It took close to a month of back and forth, more than 90,000 lines of code and more than 5,500 test cases. The 482 Windows apps tested so far ran mostly in a Parallels virtual machine on the Mac. I also bought a ThinkPad X1 that stays on 24 hours a day, and the Mac connects to it through UU Remote and ssh, letting the AI operate this real computer directly for install, uninstall and cleanup acceptance.

Before the release, the Windows version had already gone through about 14 versions with a small group, then several days of testing by Mole's early supporters, who sent a lot of suggestions, until it was finally usable. Many thanks to everyone who helped!

![The Apps page of Mole for Windows, listing installed apps and their sizes](https://cdn.tw93.fun/blog/pic/mole-product-windows-uninstall.webp)

Now my Mac is the main machine for all of development. It runs the Parallels virtual machine, connects to the ThinkPad X1 beside it, and has a small Android tablet on a cable; with adb debugging on, the AI can operate some services that have no API, and there is also the iPhone simulator in Xcode. All the AI context lives on this one Mac. Usually 7 to 10 terminal tabs of agents are running tasks, suggestions and feedback collected on social platforms go into Notion, and the AI marks them done once handled.

![My workspace: the Mac in the middle, the ThinkPad X1 on the left, the Android tablet plugged in on the right, with Mole open on every screen](https://cdn.tw93.fun/blog/pic/mole-product-workspace.webp)

How exactly to build Windows software on a Mac, for example how to layer the code so the tests run on the Mac and how to drive the virtual machine with scripts, I wrote up separately in [this post](https://mole.fit/windows/blog/building-mole-for-windows-on-a-mac) on Mole's blog, and the trade-offs in choosing the stack are in [You Don't Know Client Development](https://tw93.fun/en/2026-10-22/desktop.html). Have a look if you are doing the same.

## In an era when code is no moat, do a few more things that don't scale

I actually think that now code has hardly any moat, we can do a few more things that don't scale. Only by going through it by hand yourself do you learn how to make the experience better; just thinking about it, you won't come up with it.

Installing and uninstalling 853 apps one by one, reading every reply, redrawing dozens of icons three times: AI will not decide to do these for you. But once they are done, if 1% of your users now and then get that instant understanding, that wow, that feeling of a magic trick while using your product, it is very much worth it. Maybe it is exactly these silly chores that can make Mole a better Mac cleanup and optimization tool.

Next on the Mac side I am looking forward to reaching 1,000 apps, which will feel great, and the Windows side will keep filling in too. If your computer has an app that is especially hard to uninstall or leaves deep leftovers, tell me in the [GitHub discussion](https://github.com/tw93/Mole/discussions/1604) and I will put it on the next round's list.

![Mole CLI on macOS, Windows and Linux side by side](https://cdn.tw93.fun/notes/3_2117879110873821184.jpg)

I have always seen the CLI and the GUI as two forms of the same product. The GUI can do many good things a CLI cannot, but the CLI wins on simplicity and works well for agents, so treating them equally is better, and I will keep polishing both.

The CLI has always been open source and free on [GitHub](https://github.com/tw93/Mole), and now there are Mac, Windows and Linux versions too. The desktop versions for Mac and Windows are at [mole.fit](https://mole.fit), and if you use it, suggestions are always welcome.
