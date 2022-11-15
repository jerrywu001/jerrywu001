---
title: Eslint是如何工作的（深度源码解析）
description: Eslint是如何工作的（深度源码解析）！（建议入收藏夹～～）
cover: https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0244e52239454de8baa4c0260f6a92d5~tplv-k3u1fbpfcp-zoom-crop-mark:3024:3024:3024:1702.awebp?
createAt: 2022-11-14T19:00:00.000Z
---


> 对于前端工程化，[Eslint](https://eslint.org/docs/latest/user-guide/getting-started)是一个非常重要的环节，它可以方便的检查出代码中不符合规范的地方，并给予错误提示，对前端规范来说非常重要!

# 阅读本文，您将收获

- 如何调试eslint node_modules源码
- 文件遍历以及文件配置生成过程
- 如何将代码转换成ast
- 如何利用ast和rules生成错误信息
- 如何利用ast和rules进行代码修复

> 首先，我们需要了解几个重要的点：

- **ESLint/FlatESLint**

    入口对应的类, 下图是它的调用方式

    路径：

    - node_modules\eslint\lib\eslint\eslint.js
    - node_modules\eslint\lib\eslint\flat-eslint.js

    ![Eslint class.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0513fda628c74f7c8626ae1cc4bdc98c~tplv-k3u1fbpfcp-watermark.image?)

- **CLIEngine 该类是 Eslint 的大脑，控制 Eslint 的执行流程，调用 api 时一般只需要操作 CLIEngine 即可**

    路径: node_modules\eslint\lib\cli-engine\cli-engine.js

- **`FileEnumerator`遍历每个文件，并为文件绑定config**

    路径: node_modules\eslint\lib\cli-engine\file-enumerator.js

- **Linter 该类是 Eslint 的执行总裁，配置文件加载、校验、修复都是该类来控制完成的**

    路径: node_modules\eslint\lib\linter\linter.js

- **[espree](https://www.npmjs.com/package/espree)**

    > espree是基于[Acorn](https://www.npmjs.com/package/acorn)实现的
    >
    > 源码位置：node_modules\espree\dist\espree.cjs -> `class Espree extends Parser`

    `Eslint`使用它将代码转成`ast`，核心方法`espree.parse`，路径：node_modules\espree\dist\espree.cjs

    在`Linter`类的初始化过程中会将`espree`缓存到`internalSlotsMap`全局对象中，后续`verify`环节会使用

    ![espree cache.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aafce83c58fe4bb4af2c84ebebead539~tplv-k3u1fbpfcp-watermark.image?)

---

## 如何调试？

- 创建最小化`eslint demo`（字符串这里选择单引号规则）

    ```bash
    mkdir eslint-demo & cd eslint-demo

    npm init @eslint/config
    # 选择js特性即可，字符串请选择单引号规则

    mkdir src & echo > src/index.js  'const a = "hello";'
    ```

 - 配置`package.json`，修改`script`

     ```json
     {
      "name": "eslint-demo",
      "version": "1.0.0",
      "main": "index.js",
      "scripts": {
        "test": "npx eslint index.js"
      },
      "devDependencies": {
        "@typescript-eslint/eslint-plugin": "^5.42.1",
        "@typescript-eslint/parser": "^5.42.1",
        "eslint": "^8.27.0"
      }
     }
     ```
- 配置launch.json (后续打断点，按F5即可调试)

    ```
    mkdir .vscode & touch launch.json
    ```

    **launch.json**

    ```json
    {
      "version": "0.2.0",
      "configurations": [
        {
          "name": "Launch via NPM",
          "request": "launch",
          "runtimeArgs": [
            "run-script",
            "test"
          ],
          "runtimeExecutable": "npm",
          "skipFiles": [
            "<node_internals>/**"
          ],
          "type": "node"
        }
      ]
    }
    ```

## 文件遍历以及文件配置生成过程

   从入口`CLIEngine.executeOnFiles`调用`fileEnumerator.iterateFiles`实现文件的遍历和配置生成，其中`patterns`为命令行传入的文件范围，它可以传一个固定的路径或者模式匹配，具体过程见下图：

![save-file-config.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b4fc56edbd15452b937d8ad0bce79b54~tplv-k3u1fbpfcp-watermark.image?)

![save-config-array.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/69d63488cb044d97a6ca1a6bd5b32bda~tplv-k3u1fbpfcp-watermark.image?)

## 如何将代码转换成tokens & ast

   主要是调用spree.parse完成转换过程，具体过程见下图：

![ast-image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/db81c51ab56f44e0a4fd264da342feb5~tplv-k3u1fbpfcp-watermark.image?)

## 如何利用ast和rules生成错误信息

   通过调用`runRules`函数，并执行`Traverser.travers`e遍历`ast tree`, 并调用相应的`检测函数`进行校验，输出问题信息

   **值得注意的是，problems信息中包含fix数据，为后续fix代码做铺垫**
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f0c0df4db4d849c381c63ff00354ff91~tplv-k3u1fbpfcp-watermark.image?)

![problems-image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3d71d7ed727f469ca03030080e9d881b~tplv-k3u1fbpfcp-watermark.image?)

## 如何利用ast和rules进行代码修复

在上一步拿到`problems`信息的基础上，进一步分析，发现调用了`applyFixes`函数，即修复过程，具体过程见下图：

![fix-image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/84b0c994a0594461a65c2b105ac09e47~tplv-k3u1fbpfcp-watermark.image?)

好了，到此文章结束，感谢您的阅读，如果觉得对您有帮助，帮点个小红心，万分感谢~~
