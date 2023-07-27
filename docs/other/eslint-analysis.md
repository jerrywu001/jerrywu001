---
title: Eslint是如何工作的（深度源码解析）
description: Eslint是如何工作的（深度源码解析）！（建议入收藏夹～～）
cover: https://picx.zhimg.com/v2-f5cb0d834f416c183a4ad62a71970ee6.jpg?source=172ae18b
createAt: 2022-11-14T19:00:00.000Z
---

> 对于前端工程化，[Eslint](https://eslint.org/docs/latest/user-guide/getting-started)是一个非常重要的环节，它可以方便的检查出代码中不符合规范的地方，并给予错误提示，对前端规范来说非常重要!

# 阅读本文，您将收获

- 如何直接调试eslint node_modules源码
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

    ![Eslint class.png](https://pic1.zhimg.com/80/v2-cc63a29a50c027e90374ee9c0467c4c0.webp)

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

    ![espree cache.png](https://pic4.zhimg.com/80/v2-30d55aef5be61efa1f8ba4775e5e2377.webp)

---

## 如何调试？

- 创建最小化`eslint demo`（字符串这里选择单引号规则）

    ```bash
    mkdir eslint-demo & cd eslint-demo

    npm init -y

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

 - 进入node_modules/eslint/bin/eslint.js

    找到以下代码所在行，打个断点，按F5即可开启调试

    ```js
    require("../lib/cli").execute
    ```

## 文件遍历以及文件配置生成过程

   从入口`CLIEngine.executeOnFiles`调用`fileEnumerator.iterateFiles`实现文件的遍历和配置生成，其中`patterns`为命令行传入的文件范围，它可以传一个固定的路径或者模式匹配，具体过程见下图：

![02.file-config.png](https://pic3.zhimg.com/80/v2-1b8cef501ce28508b5af5435a14fbc9a.webp)

![save-config-array.png](https://pic3.zhimg.com/80/v2-28178817f182c97012188beb7bc6d2ee.webp)

## 如何将代码转换成tokens & ast

   主要是调用spree.parse完成转换过程，具体过程见下图：

![03.ast.png](https://pic2.zhimg.com/80/v2-25117d10d8ec2c5e3d0b4f169ae930dd.webp)

## 如何利用ast和rules生成错误信息

   通过调用`runRules`函数，并执行`Traverser.travers`e遍历`ast tree`, 并调用相应的`检测函数`进行校验，输出问题信息

   **值得注意的是，problems信息中包含fix数据，为后续fix代码做铺垫**
![image.png](https://pic2.zhimg.com/80/v2-d83b28be18fb0309c1097a68b4b234e9.webp)

![04. problems.png](https://pic1.zhimg.com/80/v2-4492ead135ef7ed1d279b813f012df90.webp)

## 如何利用ast和rules进行代码修复

在上一步拿到`problems`信息的基础上，进一步分析，发现调用了`applyFixes`函数，即修复过程，具体过程见下图：

![05.fix-image.png](https://pic3.zhimg.com/80/v2-02822ac491a9792805c0435948ab0b32.webp)

好了，到此文章结束，感谢您的阅读，如果觉得对您有帮助，帮点个小红心，万分感谢~~
