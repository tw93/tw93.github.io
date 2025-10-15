---
layout: post
title: 改良了下传说中最快的终端
date: 2023-02-06 21:00:00
feature: https://static.tw93.fun/img/0AscUe.png
summary: Alacritty 是一个基于 Rust 使用 GPU 加速的跨平台终端仿真器，只有 5M 左右，传说中最快的终端。用了两年多，体验非常好，这篇文章记录了我的配置和使用心得（2025 年更新版）。
categories: Creation
---

## 长话短说

好久没有折腾电脑的命令行终端工具了，之前用了好多年的 iTerm2，也尝试过 Hyper、Warp、Wez's、Kitty 等，要么冷启动慢，要么不太顺手。

两年多前发现了 Alacritty，一个基于 Rust 使用 GPU 加速的跨平台终端仿真器，只有 5M 左右，传说中是最快的终端。关于性能，官网文档有 [详细说明](https://github.com/alacritty/alacritty#faq)，实测确实非常快。默认界面比较简陋，但高度可定制。用了两年多下来，体验非常好，这里分享一下我的配置和使用心得。

**更新说明**：本文最初写于 2023 年 2 月，现已更新至 2025 年最新配置（v0.15.1 版本），配置格式也从 YAML 改为了 TOML，Shell 从 Fish 改回了 Oh My Zsh + Starship。

### 一、下载安装

可以去 [Alacritty](https://github.com/alacritty/alacritty) Github 下载最新版本，Mac 用户推荐直接下载 [最新的 DMG 包](https://github.com/alacritty/alacritty/releases/latest)（当前最新版为 v0.15.1）。也可以通过 Homebrew 安装：

```bash
brew install --cask alacritty
```

下载好后，你会看到下图左侧的默认效果，我们将改造成右侧的优化效果。

![对比](https://cdn.fliggy.com/upic/OKZX5C.png)

### 二、替换默认的应用图标

应用图标实在太丑了，首先我们可以下载我这边的一个 [logo.icns](https://gw.alipayobjects.com/os/k/41/logo.icns)，在应用文件夹中找到 `Alacritty.app` 选中后快捷键 `command + i` 打开显示简介，然后将下载的 icns 文件拖动到左上角图标上，即可完成替换，最后重新下图标就自动更新了。

### 三、让展示变得漂亮些

个人比较习惯沉浸式透明窗口，字体使用 [JetBrains Mono](https://www.jetbrains.com/lp/mono/)，本地没有的话可以直接下载安装。颜色方案选择了偏紫色的配色，光标使用闪烁的竖线样式，整体更加现代。

**重要更新**：从 v0.13.0 开始，Alacritty 的配置格式从 YAML 改为了 TOML，配置文件路径仍然是 `~/.config/alacritty/alacritty.toml`。

我的配置文件可以直接下载使用：

```bash
# 下载配置文件到本地
curl -fLo ~/.config/alacritty/alacritty.toml --create-dirs \
     https://tw93.fun/files/alacritty/alacritty.toml
```

执行完重新打开，效果差不多会变成上面图片中的右图效果。配置中包含了样式设置和常用快捷键（对，快捷键都需要自己配置），主要包括：

```shell
command + r：清屏，清理历史命令行显示
command + k：清屏（另一种方式）
command + w：隐藏窗口（默认是直接 quit）
command + n：新开实例
command + t：新开窗口
command + shift + w：关闭当前窗口
command + delete：删除一行
command + f：搜索关键字
command + ←：跳到行首
command + →：跳到行尾
option + ←：向左跳一个单词
option + →：向右跳一个单词
option + delete：删除前一个单词
```

配置完成后，UI 颜色和字体展示大概是这样，基本上比较舒服的高亮。
<img src="https://gw.alipayobjects.com/zos/k/k1/Lb8iKn.png" width=800 />

### 四、配置 Oh My Zsh + Starship

Shell 方面，我用过一段时间 Fish，虽然开箱即用，但兼容性不太好（不是 POSIX 兼容），很多脚本需要改写。最后还是回到了 Zsh + Oh My Zsh 的组合，搭配 Starship 作为 prompt，既有好的性能，又有足够的兼容性。

#### 安装 Oh My Zsh

如果还没安装，可以执行：

```bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

#### 安装推荐插件

我只用了几个必要的插件，保持加载速度：

```bash
# zsh-autosuggestions：根据历史命令自动补全
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions

# zsh-syntax-highlighting：语法高亮
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
```

在 `~/.zshrc` 中启用插件：

```bash
plugins=(git z zsh-autosuggestions zsh-syntax-highlighting)
```

#### 安装 Starship Prompt

[Starship](https://starship.rs/) 是一个快速、可定制的 prompt，用 Rust 写的，性能很好：

```bash
# 安装 starship
brew install starship

# 在 ~/.zshrc 最后添加
eval "$(starship init zsh)"
```

#### 我的完整配置

我的 zshrc 配置可以直接下载：

```bash
curl -fLo ~/.zshrc \
     https://tw93.fun/files/alacritty/zshrc
```

配置中包含了性能优化、常用别名、实用函数等，可以根据自己需要调整。重点优化了加载速度，启动基本秒开。

<img src="https://gw.alipayobjects.com/zos/k/7i/ala.gif" width=800 />

### 五、常见问题

1. **如何设置全局快捷键打开？** 推荐使用 [Thor](https://github.com/gbammc/Thor) 或 [Raycast](https://www.raycast.com/)，设置快捷键为 `option+空格` 或你喜欢的组合，这样即使未打开也可以快速唤起。

2. **如何设置 VS Code 默认终端？** 打开设置，搜索 `terminal.integrated.defaultProfile.osx`，选择 zsh 即可。

3. **配置文件格式变化？** v0.13.0 之后从 YAML 改为 TOML，老配置需要手动迁移。可以参考 [官方迁移指南](https://github.com/alacritty/alacritty/blob/master/CHANGELOG.md)。

4. **需要多 Tab 功能怎么办？** 有几个方案：
   - 使用 `Command + N` 开多个实例（我目前的方案，简单直接）
   - 使用 [Zellij](https://github.com/zellij-org/zellij) 或 [Tmux](https://github.com/tmux/tmux)（可选，配置较复杂）
   - macOS 自带的窗口管理也很好用

### 六、关于多 Tab（可选）

Alacritty 本身不支持 Tab，但可以通过 Tmux 实现。我之前折腾过，但后来发现直接用 `Command + N` 开多个实例更简单，配合 macOS 的窗口管理就够用了。

如果你确实需要 Tab 功能，可以安装 Tmux：

```bash
# 安装 tmux
brew install tmux

# 基础使用（不需要复杂配置）
tmux  # 启动
# Ctrl+B 然后按 c：新建窗口
# Ctrl+B 然后按 数字：切换窗口
# Ctrl+B 然后按 d：detach（后台运行）
```

对于大多数日常使用，我不太推荐过度配置 Tmux。简单场景直接多开几个 Alacritty 窗口就好，复杂场景再用 Tmux 的默认配置也够用。

### 七、总结

用了两年多 Alacritty，总体非常满意：

**优点**：

- 启动速度极快，几乎秒开
- GPU 加速，渲染流畅
- 内存占用低，只有 5M 左右
- 配置简单清晰（TOML 格式）
- 跨平台，Windows/Linux/macOS 体验一致

**不足**：

- 默认界面简陋，需要自己配置
- 不支持原生 Tab（但可以用其他方案）
- 快捷键需要全部自己配置

对于追求性能和简洁的开发者来说，Alacritty 是很好的选择。配合 Oh My Zsh + Starship，基本上可以满足日常所有需求。

---

*最后更新：2025-10-15*
*配置文件：[alacritty.toml](https://tw93.fun/files/alacritty/alacritty.toml) · [zshrc](https://tw93.fun/files/alacritty/zshrc)*
