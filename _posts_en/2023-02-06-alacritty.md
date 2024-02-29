---
layout: post
title: Improvements to the Legendary Fastest Terminal
date: 2023-02-06 21:00:00
feature: https://static.tw93.fun/img/0AscUe.png
summary: Recently, I discovered Alacritty, a cross-platform terminal emulator powered by Rust and accelerated with OpenGL, merely around 5MB in size, touted as the fastest terminal. However, it's truly unattractive. I contemplated whether to revamp it to possibly make it my default terminal. The final product turned out quite well.
categories: Creation
lang: en-US
---

## Long Story Short

It's been a while since I tinkered with command-line terminal tools on my computer. After using iTerm2 for many years, due to being part of the aesthetics crowd, I started using Hyper last year, paired with Oh My Zsh, and it's been pretty smooth, except for the somewhat slow cold start. I've also tried others like Warp, Wez's, Kitty, etc., but none felt quite right.

I recently stumbled upon Alacritty, a cross-platform terminal emulator powered by Rust and accelerated with OpenGL, merely around 5MB in size, reputed to be the fastest terminal. Regarding its claim to fame as the fastest, the official documentation [here](https://github.com/alacritty/alacritty#faq) explains it. After giving it a try, I found it indeed fast, but also incredibly unattractive. The default appearance was so bad it turned many people away. I thought about giving it a makeover, had some free time over the weekend, and ended up quite pleased with the result. So, I've documented the configuration steps for those interested in tinkering. It takes roughly 10 minutes to set up, **and additionally, on 20230211, by fiddling with Tmux, I enabled Alacritty to support multi-tab switching**, which is detailed at the end of the article.

### 1. Download Installation Package

Before starting, you can go to [Alacritty](https://github.com/alacritty/alacritty) on Github to download the corresponding package. For Mac users, the package is [Alacritty-v0.11.0.dmg](https://github.com/alacritty/alacritty/releases/download/v0.11.0/Alacritty-v0.11.0.dmg). After downloading, you will see the effect on the left side of the image below, and finally, we will change it to the optimized effect on the right side.

![Comparison](https://cdn.fliggy.com/upic/OKZX5C.png)

### 2. Replace the Default Application Icon

The application icon is really ugly, first, you can download my [logo.icns](https://gw.alipayobjects.com/os/k/41/logo.icns), find `Alacritty.app` in the application folder, select it and press `command + i` to open the Get Info window, then drag and drop the downloaded icns file onto the icon in the top left corner to complete the replacement. The icon will automatically update after reopening.

### 3. Make Its Display More Beautiful

I personally prefer software to use an immersive header, and I like to use the [JetBrains Mono](https://www.jetbrains.com/lp/mono/) font. If it's not installed locally, you can download and install it directly. Finally, configure the colors according to preference. Fortunately, all these settings can be put in `~/.config/alacritty/alacritty.yml`. Mine is [alacritty.yml](https://gw.alipayobjects.com/os/k/s0/alacritty.yml). Run the following command to directly download and place it in the corresponding location.

```bash
curl -fLo ~/.config/alacritty/alacritty.yml --create-dir \
     https://gw.alipayobjects.com/os/k/j2/alacritty.yml
```

After executing, reopen to try, and the effect will almost change to the right image effect above. In addition to the style configuration, some common shortcuts are also added (ah, even shortcuts have to be configured), including the following:

```shell
command + r: Clear the screen, clearing the display of historical command lines
command + w: Hide, the default is to quit directly, this is changed to hide
command + t: Open a new window, if you need a second terminal window
command + shift + w: Close the current window
command + delete: Delete a line
command + f: Search for keywords
command + ←: Jump to the beginning of the line
command + →: Jump to the end of the line
```

After configuration, the UI color and font display are roughly as follows, basically quite comfortable highlights.
<img src="https://gw.alipayobjects.com/zos/k/k1/Lb8iKn.png" width=800 />

### 4. Why Not Try Fish Shell

Many students probably use zsh; I did too. However, the overall loading and usage performance of zsh is not very fast, and it is not so convenient to configure. Here, I recommend trying [Fish](https://fishshell.com/), which is very out-of-the-box, and performs very well, with built-in auto-suggestions, syntax highlighting, tab auto-completion, visual Web configuration features. Additionally, the shell's prompt loads super fast, with almost no delay.

First, you can install the fish shell via brew. During the installation process, it should ask if you want to set it as the default. If after installation, the default is not fish, you can refer to this document [default-shell](https://fishshell.com/docs/current/index.html#default-shell) to set it as default.

```shell
brew install fish
```

After installing fish, it's basically good enough to use. You can also run `fish_config` to open the web visualization settings. Besides, I generally don't use too many plugins, but these two are essential to install. The steps can be seen in the installation commands below.

The first one is `z`, which helps you remember your previous history of opened directories, allowing you to open a corresponding address from any path with just one key. The installation address is at [jethrokuan/z](https://github.com/jethrokuan/z). Before using it, you need to install [fisher](https://github.com/jorgebucaran/fisher) to download plugins.

The second one is the [pure-fish/pure](https://github.com/pure-fish/pure) theme, which is quite minimalist and can also be downloaded through fisher.

```shell
# Install fisher
curl -sL https://raw.githubusercontent.com/jorgebucaran/fisher/HEAD/functions/fisher.fish | source && fisher install jorgebucaran/fisher
# Install z
fisher install jethrokuan/z
# Install pure theme
fisher install pure-fish/pure
```

The effect after the final installation is as follows:

<img src="https://gw.alipayobjects.com/zos/k/zp/12.gif" width=800 />

Regarding the pure theme, you can slightly configure it by entering the commands directly in the terminal, as shown below:

```bash
# You can change the original > to an emoji you like, for example, I set it to 🏂
set --universal  pure_symbol_prompt 🏂
# If you don't like the two-line mode, you can put the command line input and the current folder on one line
set --universal pure_enable_single_line_prompt true
```

After all configurations are complete, using a normal time-consistent screen recording without any acceleration, you can basically see it opens instantly.

<img src="https://gw.alipayobjects.com/zos/k/7i/ala.gif" width=800 />

### 5. Possible Issues

1. Commands installed globally with npm do not work? It's basically because the global install directory is not set in PATH, you can refer to [NPM global commands not working with fish](https://github.com/fish-shell/fish-shell/issues/3023#issuecomment-387944920).
2. How to set Alacritty to open with a global shortcut? Try [Thor](https://github.com/gbammc/Thor), set its shortcut to `option+space` or whatever you prefer, so you can quickly open it even when it's not already open.
3. How to set Fish as the default command line tool for VS Code? Open settings, search for `shellArgs.osx`, and change the option to fish.
4. Alacritty does not support multiple tabs. How can this be supported? There are two ways, the first is to use [zellij](https://github.com/zellij-org/zellij) or [Tmux](https://github.com/tmux/tmux) plugins, you can search for the corresponding documentation. Another way is to package it yourself, refer to this [issue](https://github.com/alacritty/alacritty/issues/1544), but if you're used to it, I think not using tabs is also fine.

### 6. Adding Multi-Tab Capability

Some users have feedback that Alacritty is not easy to use without the Tab function. Here, I played with [Tmux](https://github.com/tmux/tmux) to customize this capability. However, to be honest, this plugin's functionality is too complex and abundant. My ideal product should be a plug-and-play one with just one command to get everything done. I tried to package it towards a minimalist direction, making the user experience consistent with Chrome's shortcuts. The final effect can be seen below:

<img src="https://gw.alipayobjects.com/zos/k/a7/alacritty.gif" width=800 />

Here, I didn't use its split-screen functionality because I don't need it, only the Tab switching and current record retention features were used. Actually, if you're just using the command line simply, the non-Tab solution mentioned above is completely sufficient. However, if you have a strong need for multiple Tabs, then you can follow the steps below to play around:

```bash
# 1. First, install tmux
brew install tmux
# 2. Download tmux configuration file to local
curl -fLo ~/.tmux.conf \
    https://gw.alipayobjects.com/os/k/8b/.tmux.conf
# 3. Replace the alacritty configuration file
curl -fLo ~/.config/alacritty/alacritty.yml --create-dir \
     https://gw.alipayobjects.com/os/k/l9/alacritty.yml
```

After the installation is complete, you can restart Alacritty, and it should by default load tmux. The following shortcuts are added on top of the previous setup:

```shell
command + t: Open a new tab
command + w: Close the tab
command + number: Jump to the corresponding tab
command + shift + [: Switch to the previous tab
command + shift + ]: Switch to the next tab
```

I won't explain too much about what the corresponding configuration files do here, haha, actually, I tinkered for a long time because Tmux's configuration is really too complicated. Those interested in making secondary modifications can find the official documentation to tinker with. Have fun playing.
