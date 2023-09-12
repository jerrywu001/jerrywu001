---
title: 一文彻底搞懂package.json中的exports, main, module, type
description: 详细介绍package.json中的exports, main, module, type，以及它们的使用场景和细节
cover: https://picx.zhimg.com/v2-5cea55d64465d57fc2e3537d7968f9a7_1440w.jpg?source=172ae18b
---

> package.json每天都会用到，但是你真的对里面的某些字段很了解吗，本文将带你了解其中经常使用的一些字段

## repository/homepage

项目的仓库地址, 会显示在npm [package](https://www.npmjs.com/package/sandpack-vue3)右侧

```json
{
  "repository": {
    "type": "git",
    "url": "git+https://github.com/jerrywu001/sandpack-vue3.git"
  },
  "homepage": "https://sandpack-vue3.netlify.app",
}
```

## main/module/types

```json
{
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
}
```

- **main**

对应commonjs引入方式的程序入口文件

```js
const { Sandpack } = require('sandpack-vue3);
```

- **module**

对应esmodule引入方式的程序入口文件

```js
import { Sandpack } from 'sandpack-vue3';
```

- **types**

描述了程序中所有组件以及变量的类型定义

## exports

### 介绍

exports定义了自定义导出规则，***可以理解为路径映射***

```json
{
   "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    },
    "./unstyled": {
      "types": "./dist/unstyled.d.ts",
      "import": "./dist/unstyled.mjs",
      "require": "./dist/unstyled.js"
    }
  },
}
```

### 实战案例

> 测试了`vite`| `@vue/cli` | `nuxt3` | `vitepress`，保证了解决方案的有效性。

```js
import { Sandpack } from 'sandpack-vue3';
import { Sandpack as UnstyledPack } from 'sandpack-vue3/unstyled';
import 'sandpack-vue3/dist/styles.css';
```

以上的案例代码存在一些问题

- **build过程，无法识别'sandpack-vue3/dist/styles.css'路径**

    ![image.png](https://pic1.zhimg.com/80/v2-054780349e09895148bde82d9a535c18.webp)

    - 解决方案：

    ```diff
    {
       "exports": {
        ".": {
          "types": "./dist/index.d.ts",
          "import": "./dist/index.mjs",
          "require": "./dist/index.js"
        },
        "./unstyled": {
          "types": "./dist/unstyled.d.ts",
          "import": "./dist/unstyled.mjs",
          "require": "./dist/unstyled.js"
        },
    +   "./*": [
    +      "./*",
    +      "./*.d.ts"
    +    ]
      },
    }
    ```

- **ts无法识别'sandpack-vue3/unstyled'路径**


    ![image.png](https://pic1.zhimg.com/80/v2-f0e9649f7918f1c831e71940970e9334.webp)

    - 解决方案 (*增加的两段内容，缺一不可！*)：

    > 特别需要注意的是：**dist目录下需要保证unstyled.d.ts存在**，并且需要和exports中子路径名称一致，否则依然无法找到路径

    ```diff
    {
       "exports": {
        ".": {
          "types": "./dist/index.d.ts",
          "import": "./dist/index.mjs",
          "require": "./dist/index.js"
        },
        "./unstyled": { // <-需和dist下unstyled.d.ts文件名称一致
          "types": "./dist/unstyled.d.ts", // 可以省略，但不建议
          "import": "./dist/unstyled.mjs",
          "require": "./dist/unstyled.js"
        },
    +   "./*": [
    +      "./*",
    +      "./*.d.ts"
    +    ]
      },
    +  "typesVersions": {
    +    "*": {
    +      "*": [
    +        "./dist/*",
    +        "./*"
    +      ]
    +    }
      },
    }
    ```

## type和exports/main/module的关系

首先我们需要理解type字段的含义：

> - 当设置为“module”时，所在项目中（不包含node_modules）所有.js文件将被视为EsModule类型文件。
>
> - 如果省略“type”字段或设置为“commonjs”，则项目中（不包含node_modules）所有.js文件都被视为CommonJS类型文件。

### type: "module"

此时.js文件将被视为esmodule，并且我们需要将commonjs文件显示声明为.cjs

改造配置如下：

```json
{
  ...,
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },
    "./unstyled": {
      "types": "./dist/unstyled.d.ts", // 可以省略，但不建议
      "import": "./dist/unstyled.js",
      "require": "./dist/unstyled.cjs"
    },
    "./*": "./*"
  },
  ...
}
```

### type: "commonjs" 或不设置

此时.js将被视为commonjs，并且我们需要将esmodule文件显示声明为.mjs/.esm.js(*实际上你声明成.xxx.js也可以，甚至.xxx也行，但不建议*)

改造配置如下：

```json
{
  ...,
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    },
    "./unstyled": {
      "types": "./dist/unstyled.d.ts", // 可以省略，但不建议
      "import": "./dist/unstyled.mjs",
      "require": "./dist/unstyled.js"
    },
    "./*": "./*"
  },
  ...
}
```

## main/module 和 exports的关系

### exports省略场景

如果**没有子路径**，比如m没有`my-package/xxx`，只是简单的`my-package`, 那配置可以简化为：

```json
{
  ...,
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  ...
}
```

### exports不可省略场景

存在子路径，此时需要添加exports进行路径映射，并且export中的"."配置会具有较高优先级，所以"."对应的路径必须是真实存在的（*这么一说，即使你在main/module中的路径写错了，也没关系，感兴趣的可以自行尝试一下*）。

### 子路径不想放根目录下？？

有时候我们有想把子路径文件放单独文件夹的想法，可行吗？答案是，可以的，但是我们必须保证dist根目录下`xxx.d.ts`真实存在，除它之外的其他文件可以单独文件夹，举个🌰：


![image.png](https://pic2.zhimg.com/80/v2-cec8e73fb5f665adfe0a5ffc65d38a39.webp)


好了，文章到此结束，如对您有帮助，还请帮忙点个小🌟🌟，不甚感激~
