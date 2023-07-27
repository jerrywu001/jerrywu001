---
title: 是时候和npm-check-updates江湖再见了~
description: 是时候和npm-check-updates江湖再见了~
createAt: 2023-07-03T10:00:00.000Z
---

相比大家都用过[npm-check-updates](https://www.npmjs.com/package/npm-check-updates), 一个可以检查项目package版本是否有更新的工具，截图如下：

![image.png](https://pic4.zhimg.com/80/v2-0fb5b4e04251d4261f0dcfd508e029d7.webp)

非常nice, 但是由于历史原因，不支持`monorepo`，并且无法在`major/minor/patch`模式之间自由选择，不过最近[antfu](https://github.com/antfu)大佬借鉴它开发了[taze](https://github.com/antfu/taze)，一并解决了上述优化点，从而使用体验得到质的飞跃~

废话不多说，下面来简单介绍一下它的用法。

# taze安装

> 一个现代的 cli 工具，让您的部门保持新鲜感

```bash
npm i taze -g

# 或者使用npx taze执行检测
```

# 常用命令

## 普通模式

> 非monorepo

## taze

没有看到`major`信息，是因为`taze`默认只匹配 `minor/patch`

*打印信息非常详细，包含版本变化，最新发布日期*

![image.png](https://pic2.zhimg.com/80/v2-3dffe51a4c6adae10962069f5bf6d8d1.webp)

## taze major

可以看到`major`被匹配

![image.png](https://pic1.zhimg.com/80/v2-08e45a4fa9da911d5ac719caf6f99680.webp)

## taze minor

同`taze`

## taze patch

只会匹配`patch`

![image.png](https://pic3.zhimg.com/80/v2-fc26edf189b24e5abc1a1dbc03f86696.webp)

## 执行更新操作

以上命令只是查看，如果想要执行更新, 命令只要追加` -w`即可, 比如`taze major -w`

![image.png](https://pic2.zhimg.com/80/v2-c7b9a92ce96fac6c368dbdbd0ed37119.webp)

# taze monorepo

> 命令只要追加` -r`即可

## 检查更新

```bash
taze major -r
```

![image.png](https://pic2.zhimg.com/80/v2-7c8aea08305b5e12b393ee7bb70cf995.webp)

## 执行更新

也是追加` -w`

```bash
taze major -r -w
```

# 其他功能

当然除了上述常用指令外，还有一些其他指令：

- `taze -P`  -> 只匹配`dependencies`
- `taze -D`  -> 只匹配`devDependencies`
- `taze -n`  -> `include`功能

    ![image.png](https://pic3.zhimg.com/80/v2-aba571c7a20225e8a93de870aad8f796.webp)

- `taze -x`  -> exclude功能

    ![image.png](https://pic1.zhimg.com/80/v2-64299d16a705405478bf48af4d92161c.webp)

- `taze -w -i`  -> 执行更新后进行install，会提示你选择安装源
- `taze -h` 查看所有指令

    ![image.png](https://pic3.zhimg.com/80/v2-d7f6edf6221df55c08873adb72c50ffa.webp)

# 配置文件

配置文件支持绝对属于最大的亮点，直接看代码


```js
import { defineConfig } from 'taze'

export default defineConfig({
  // ignore packages from bumping
  exclude: [
    'webpack'
  ],
  // fetch latest package info from registry without cache
  force: true,
  // write to package.json
  write: true,
  // run `npm install` or `yarn install` right after bumping
  install: true,
  // override with different bumping mode for each package
  packageMode: {
    'typescript': 'major',
    'unocss': 'ignore',
    // regex starts and ends with '/'
    '/vue/': 'latest'
  }
});

```

最后感谢antfu大佬~🥳
