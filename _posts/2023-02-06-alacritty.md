---
layout: post
title: 改良了下传说中最快的终端
date: 2023-02-06 21:00:00
feature: https://static.tw93.fun/img/0AscUe.png
summary: 最近发现了 Alacritty，一个基于 Rust 使用 OpenGL 加速的跨平台终端仿真器，只有 5M 的样子，传说中最快的终端，不过是真的丑，想着要不要改造一下，看能否当做我的默认终端，最终成品还不错。
categories: Creation
---

## 长话短说

好久没有折腾电脑的命令行终端工具了，之前用了好多年的 iTerm2，由于颜值党的缘故去年开始使用 Hyper，搭配 Oh My Zsh 用得算顺手，唯一就是冷启动有些慢。后面也有试过 Warp、Wez's、Kitty 这一类，奈何还是不太顺手。

最近发现了 Alacritty，一个基于 Rust 使用 OpenGL 加速的跨平台终端仿真器，只有 5M 的样子，传说中是最快的终端，关于是不是最快的终端，在官网文档里面 [这段话](https://github.com/alacritty/alacritty#faq) 说明，试了试发现是真的快，不过也是真的丑，默认的效果丑出天际，直接就劝退一批人了。想着要不要改造改造，周末有空给折腾了下，最后成品还不错，于是将配置按照顺序写下来给到有兴趣折腾的同学玩玩，大概 10min 可搞定，**此外 20230211 通过折腾 Tmux 让 Alacritty 支持了多 Tab 切换的功能**，在文章最后补充。

### 一、下载安装包

开始之前，可以去 [Alacritty](https://github.com/alacritty/alacritty) Github 下载好对应的包，Mac 用户对应的包是这个 [Alacritty-v0.11.0.dmg](https://github.com/alacritty/alacritty/releases/download/v0.11.0/Alacritty-v0.11.0.dmg)，下载好后，你将看到下图左侧效果，最后我们将改成右侧优化效果。

![对比](https://cdn.fliggy.com/upic/OKZX5C.png)

### 二、替换默认的应用图标

应用图标实在太丑了，首先我们可以下载我这边的一个 [logo.icns](https://gw.alipayobjects.com/os/k/41/logo.icns)，在应用文件夹中找到 `Alacritty.app` 选中后快捷键 `command + i` 打开显示简介，然后将下载的 icns 文件拖动到左上角图标上，即可完成替换，最后重新下图标就自动更新了。

### 三、让他的展示变得漂亮些

个人比较习惯软件使用沉浸式头，同时字体喜欢用 [JetBrains Mono](https://www.jetbrains.com/lp/mono/)，本地没有可以直接下载安装，最后按照喜好配置颜色，好在这里设置全部可以放到 `~/.config/alacritty/alacritty.yml`，我的是 [alacritty.yml](https://gw.alipayobjects.com/os/k/s0/alacritty.yml)，运行如下命令，可以直接下载并放到对应的位置。

```bash
curl -fLo ~/.config/alacritty/alacritty.yml --create-dir \
     https://gw.alipayobjects.com/os/k/j2/alacritty.yml
```

执行完，重新打开下试试，效果差不多会变成上面图片中的右图效果了。此外除了样式的配置，还添加了一些常用的快捷键（哎，居然快捷键都要配置），包括如下：

```shell
command + r：清屏，清理掉历史命令行的显示
command + w: 隐藏，默认是直接quit了，这里改成隐藏
command + t:  新开窗口，假如需要第二个终端窗口
command + shift+w：关闭当前窗口
command + delete：删除一行
command + f：搜索关键字
command + ←：跳到行首
command + →：跳到行尾
```

配置完成后，UI 颜色和字体展示大概是这样，基本上比较舒服的高亮。
<img src="https://gw.alipayobjects.com/zos/k/k1/Lb8iKn.png" width=800 />

### 四、要不要试试 fish shell

不少同学应该是使用的 zsh，我之前也是，不过 zsh 整体加载使用性能其实不是很快，同时配置起来也不是那么方便，这里推荐可以试试 [Fish](https://fishshell.com/)，很开箱即用，同时性能很不错，内置了自动提示、语法高亮、tab 自动完成、可视 Web 配置功能，此外 shell 的 prompt 加载超级快，几乎没有延迟。

首先可执行 brew 安装 fish shell，执行过程中应该会问你要不要设置成默认，假如安装完成后，重新打开默认不是 fish，可参考此文档 [default-shell](https://fishshell.com/docs/current/index.html#default-shell) 设置成默认。

```shell
brew install fish
```

安装完成 fish 以后，其实基本上够用了，也可以执行 `fish_config` 打开 web 可视化设置，此外我一般不会使用太多插件，但是这两个很有必要一装，步骤可见下面安装命令。

第一个是`z`，他的作用是帮你记住你之前的历史打开，可以在任何路径，一键打开对应的地址，安装地址在[jethrokuan/z](https://github.com/jethrokuan/z)，使用前需要先安装 [fisher](https://github.com/jorgebucaran/fisher)用于下载插件。

第二个是 [pure-fish/pure](https://github.com/pure-fish/pure) 主题，比较极简，同样也是可以通过 fisher 下载。

```shell
# 安装 fisher
curl -sL https://raw.githubusercontent.com/jorgebucaran/fisher/HEAD/functions/fisher.fish | source && fisher install jorgebucaran/fisher
# 安装 z
fisher install jethrokuan/z
# 安装 pure 主题
fisher install pure-fish/pure
```

最后安装好以后的效果如下：

<img src="https://gw.alipayobjects.com/zos/k/zp/12.gif" width=800 />

对于 pure 主题而言，可以稍微配置下，直接命令行输入即可，如下所示

```bash
# 可以将原来的>修改成你喜欢的表情图案，比如我设置的是🏂
set --universal  pure_symbol_prompt 🏂
# 假如不喜欢上下行的方式，可以将命令行输入和当前文件夹放一行
set --universal pure_enable_single_line_prompt true
```

全部配置完成后，使用正常时间一致的录屏，没有任何加速的情况下，基本上可以看到秒开。

<img src="https://gw.alipayobjects.com/zos/k/7i/ala.gif" width=800 />

### 五、可能的问题

1. npm 全局安装的命令行执行无效？基本是没有将全局安装目录设置成 PATH,可以参考 [NPM global commands not working with fish](https://github.com/fish-shell/fish-shell/issues/3023#issuecomment-387944920)。
2. 如何设置 Alacritty 可以全局快捷键打开？推荐试试 [Thor](https://github.com/gbammc/Thor)，设置他的快捷键为`option+空格`或者你喜欢的，这样及时在没有打开的情况下也可以快速打开。
3. 如何设置 VS Code 默认的命令行工具为 Fish？ 打开设置，搜索 `shellArgs.osx`，修改选项为 fish 即可。
4. Alacritty 不支持多 Tab 的模式，如何支持？有两个办法，第一个是使用 [zellij](https://github.com/zellij-org/zellij) 或者 [Tmux](https://github.com/tmux/tmux) 插件，可以去搜索对应文档。另外一个可以自己打包，参考这个 [issue](https://github.com/alacritty/alacritty/issues/1544)，不过假如你习惯了，其实不用 tab 我觉得也还行。

### 六、增加多 Tab 的能力

有网友反馈 Alacritty 没有 Tab 功能不好用，我这里使用 [Tmux](https://github.com/tmux/tmux) 玩了玩，来定制了下这个能力，不过说实话这个插件的功能实在太多太杂了，我理想的产品应该是开箱即用的一条命令就搞定的，尝试着朝着极简的方向封装了下，使用体验和 Chrome 快捷键一致，最后效果可见如下：

<img src="https://gw.alipayobjects.com/zos/k/a7/alacritty.gif" width=800 />

这里没有使用他的分屏功能，因为我用不上，只使用的 Tab 切换以及当前记录保留功能，其实假如你就是简单实用命令行，其实上面非 Tab 的方案完全够用，如果强烈有多 Tab 需求，那可以按照如下步骤来玩一玩：

```bash
# 1. 首先安装 tmux
brew install tmux
# 2. 下载tmux配置问题到本地位置
curl -fLo ~/.tmux.conf \
    https://gw.alipayobjects.com/os/k/8b/.tmux.conf
# 3. 重新替换一下 alacrittye 配置文件
curl -fLo ~/.config/alacritty/alacritty.yml --create-dir \
     https://gw.alipayobjects.com/os/k/l9/alacritty.yml
```

安装完成以后，可以重启一下 Alacritty，应该就默认加载了 tmux 的运行，在之前基础上补充如下快捷键：

```shell
command + t：新开标签页
command + w: 关闭标签页
command + 数字：跳转对应标签页
command + shift + [ ：切换到上一个标签页
command + shift + ] ：切换到下一个标签页
```

这里不过多解释对应配置文件做的事情，哈哈，其实折腾了很久，因为 Tmux 配置实在太复杂了，有兴趣二次改动的可以找到官方文档进行折腾，祝你玩的开心。
