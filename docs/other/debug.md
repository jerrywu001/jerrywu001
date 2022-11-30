---
title: 如何优雅的调试node环境的npm package源码
description: 如何优雅的调试node环境的npm package源码
cover: https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/60200ca6e4f0473aa1c082173b45ea7d~tplv-k3u1fbpfcp-zoom-crop-mark:3024:3024:3024:1702.awebp?
createAt: 2022-11-30T10:00:00.000Z
---

> [光神](https://juejin.cn/user/2788017216685118)曾经说过“当你有了技术深度，很可能也同时有了技术广度”，这句话说出来是非常牛逼的，就比如说当你尝试去阅读源码时，你会学到很多你之前未曾听过的知识和技巧。

我今天想要记录的是***如何优雅的调试node环境的npm package源码***

一共有两种方式，让我们一一道来：

## 创建项目

```bash
mkdir node-test
cd node-test
npm init -y
npm i typescript wait-on -D

mkdir src
touch src/index.ts src/util.ts
```

### package.json

> 注：`build`script中`--sourcemap`尤其重要，**否则不能断点ts源码，只能调试bundle js代码**
>
> 开源`npm package`一般都会提供一个`dev`或者`playground`的script, 本文的`dev`script仅仅用于演示，并不是一定要这么写

```json
{
  "name": "node-test",
  "version": "1.0.0",
  "description": "",
  "main": "dist/index.js",
  "scripts": {
    "build": "rm -rf dist && tsc ./src/index.ts --sourcemap --outDir dist",
    "dev": "npm run build && wait-on dist/index.js && npm run chrome",
    "chrome": "node --inspect-brk dist/index.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "typescript": "^4.9.3",
    "wait-on": "^6.0.1"
  }
}
```

### src/index.ts
```ts
import displayName from "./util";

const message = displayName('google');
console.log(message);
```

### src/util.ts
```ts
export default function displayName(name: string) {
  return `My name is ${name}`;
}
```

## chrome inspect
:mp4{path=chrome-debug}

### 运行`npm run dev`

  ![step-1.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9ed3eedd8d0640bfb02505f4b3bbccc4~tplv-k3u1fbpfcp-watermark.image?)

### 打开chrome, 访问`chrome://inspect`

  ![step-2.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/11c06ed64cee4a368c5aa3faf539f70d~tplv-k3u1fbpfcp-watermark.image?)

  ![step-3.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cf60303e1b184bd1b23712bb43d6b376~tplv-k3u1fbpfcp-watermark.image?)

### 添加项目文件夹到`worksapce`

  ![step-4.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dd3d818d45034fa5bd2a58e69079a153~tplv-k3u1fbpfcp-watermark.image?)

### src源码打断点，即可调试

  ![step-5.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7b967e84cf4a49d195ad892f4c197b3c~tplv-k3u1fbpfcp-watermark.image?)

## vscode debug （推荐）

:mp4{path=vscode-debug}

### 通过sourcemap调试源码

- 修改package.json的script部分
```json
"scripts": {
    "build": "rm -rf dist && tsc ./src/index.ts --sourcemap --outDir dist",
    "dev": "npm run build && wait-on dist/index.js && npm run inspect",
    "inspect": "node dist/index.js"
 }
```

- 添加launch.json

  ![node-1.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5f7b201826854f5984913749b03cde89~tplv-k3u1fbpfcp-watermark.image?)

- 弹框选择nodejs

  ![node-2.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/69425865481c452e86572a3d77a65839~tplv-k3u1fbpfcp-watermark.image?)

- 点击添加配置按钮，并删除`configurations`，重新选择，如图：

  ![node-3.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c6d634195b274239930ca21f42a07b2a~tplv-k3u1fbpfcp-watermark.image?)

- 修改`runtimeArgs`，将`debug`改成`dev`

  ![node-4.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/759b6f6f379b428b89b442132ee79d31~tplv-k3u1fbpfcp-watermark.image?)

- 源码打几个断点

  ![node-5.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/501027a15ed64b9eb2ea1e448664fcb8~tplv-k3u1fbpfcp-watermark.image?)

- 键盘按下F5，即可调试

  ![node-6.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a922ab27c36c43eea7383b745fafeac6~tplv-k3u1fbpfcp-watermark.image?)

### 直接调试源码

- `rm -rf node_modules dist package-lock.json`，并修改package.json
```json
{
  "name": "node-test",
  "version": "1.0.0",
  "description": "",
  "scripts": {
    "dev": "esno src/index.ts"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

- `npm i esno -D`
    > 也可以用`ts-node`

- 源码打几个断点

- 按下F5即可调试

  ![node-7.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7eabcaafca7f4cb79cd30a69e8979f61~tplv-k3u1fbpfcp-watermark.image?)

**总结，最关键的是需要有sourcemap，否则只能调试打包后的js代码，如果某些npm包没有提供soucemap，需要想办法重新打包，并生成sourcemap**

***如果觉得文章对您有帮助，可以点个小红心，感谢~***
