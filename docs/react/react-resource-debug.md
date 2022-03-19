---
title: React源码调试环境搭建
cover: /articles/react/react-resource-debug.jpeg
---

## 创建react项目 {#create}

:::alert{icon=🧙🏽‍♂️}

版本：[create-react-app@5.0.0](https://create-react-app.dev/docs/getting-started/)

:::

:::code-group

```bash[filename="use npm"]
npm i create-react-app -g
```

```bash[filename="use create-react-app"]
create-react-app react-debug
```

:::

## 弹出webpack配置 {#eject-webpack}

```bash
cd react-test
npm eject
```

## react源码下载 {#with-build-tools}

### 进入react-debug/src目录 {#cd-src}

```bash
cd src
git clone https://github.com/facebook/react.git -b 17.0.2
```

### 解决 Building fresh packages问题（可跳过此步骤） {#building-fresh-packages}

> 进入react-debug/src/react目录，并创建.yarnrc文件

添加以下内容

```yaml
registry "https://registry.npm.taobao.org"

sass_binary_site "https://npm.taobao.org/mirrors/node-sass/"
phantomjs_cdnurl "http://cnpmjs.org/downloads"
electron_mirror "https://npm.taobao.org/mirrors/electron/"
sqlite3_binary_host_mirror "https://foxgis.oss-cn-shanghai.aliyuncs.com/"
profiler_binary_host_mirror "https://npm.taobao.org/mirrors/node-inspector/"
chromedriver_cdnurl "https://cdn.npm.taobao.org/dist/chromedriver
```

### install packages（可跳过此步骤） {#install-pkg}

```bash
npm i
```

## webpack配置修改 {#webpack-config}

### config/webpack.config.js

- alias中添加以下配置

```diff [class="language-diff-javascript diff-highlight"]
{
  alias: {
  ...(modules.webpackAliases || {}),
+ 'react': path.resolve(__dirname, '../src/react/packages/react'),
+ 'react-dom': path.resolve(__dirname, '../src/react/packages/react-dom'),
+ 'shared': path.resolve(__dirname, '../src/react/packages/shared'),
+ 'react-reconciler': path.resolve(__dirname, '../src/react/packages/react-reconciler'),
+ scheduler: path.resolve(__dirname, '../src/react/packages/scheduler'),
  },
}
```

- 关闭eslint, tslint

```diff [class="language-diff-javascript diff-highlight"]
- const disableESLintPlugin = process.env.DISABLE_ESLINT_PLUGIN === 'true';
+ const disableESLintPlugin = true;

- useTypeScript &&
+ false &&
  new ForkTsCheckerWebpackPlugin({
   // ...
  });
```

- config/env.js

```diff [class="language-diff-javascript diff-highlight"]
const stringified = {
  'process.env': Object.keys(raw).reduce((env, key) => {
    env[key] = JSON.stringify(raw[key]);
    return env;
  }, {}),
+ __DEV__: true,
+ __PROFILE__: true,
+ __UMD__: true,
+ __EXPERIMENTAL__: true,
+ __VARIANT__: false
};
```

- .eslintrc.json

```js
{
  "extends": "react-app",
  "globals": {
    "__DEV__": true,
    "__PROFILE__": true,
    "__UMD__": true,
    "__EXPERIMENTAL__": true
  }
}
```

## React源码修改 {#react-resource-edit}

- src/react/packages/scheduler/index.js

```diff [class="language-diff-javascript diff-highlight"]
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

export * from './src/Scheduler';

+ export * from './src/SchedulerHostConfig.js';
```

- src/react/packages/scheduler/src/SchedulerHostConfig.js


```diff [class="language-diff-javascript diff-highlight"]
- throw new Error('This module must be shimmed by a specific build.');
+ export {
+    unstable_flushAllWithoutAsserting,
+    unstable_flushNumberOfYields,
+    unstable_flushExpired,
+    unstable_clearYields,
+    unstable_flushUntilNextPaint,
+    unstable_flushAll,
+    unstable_yieldValue,
+    unstable_advanceTime
+ } from './forks/SchedulerHostConfig.mock.js';

+ export {
+    requestHostCallback,
+    requestHostTimeout,
+    cancelHostTimeout,
+    shouldYieldToHost,
+    getCurrentTime,
+    forceFrameRate,
+    requestPaint
+ } from './forks/SchedulerHostConfig.default.js';
```

- src/react/packages/react-reconciler/src/ReactFiberHostConfig.js

```diff [class="language-diff-javascript diff-highlight"]
- import invariant from 'shared/invariant';

- invariant(false, 'This module must be shimmed by a specific renderer.');

+ export * from './forks/ReactFiberHostConfig.dom';
```

- src/react/packages/shared/ReactSharedInternals.js

```diff [class="language-diff-javascript diff-highlight"]
- import * as React from 'react';

- const ReactSharedInternals =
-   React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;

+ import ReactSharedInternals from '../react/src/ReactSharedInternals';

export default ReactSharedInternals;
```

- src/react/packages/shared/invariant.js

```diff [class="language-diff-javascript diff-highlight"]
export default function invariant(condition, format, a, b, c, d, e, f) {
+ if (condition) return;
  throw new Error(
    'Internal React error: invariant() is meant to be replaced at compile ' +
      'time. There is no runtime version.',
  );
}
```

## react, react-dom引用方式调整 {#react-dom}

> src/index.tsx

```diff [class="language-diff-javascript diff-highlight"]
- import React from 'react';
- import ReactDOM from 'react-dom';
+ import * as React from 'react';
+ import * as ReactDOM from 'react-dom';
```

## typescript报错解决 {#ts-fix}

> 如果创建的是ts模版的react项目，修改以下文件

- src/react/packages/react/src/__tests__/testDefinitions/React.d.ts

```diff [class="language-diff-javascript diff-highlight"]
// 注释掉以下代码
- declare module 'react' {
-   export class Component {
-     props: any;
-     state: any;
-     context: any;
-     static name: string;
-     constructor(props?, context?);
-     setState(partial : any, callback ?: any) : void;
-     forceUpdate(callback ?: any) : void;
-   }
-   export let PropTypes : any;
-   export function createElement(tag : any, props ?: any, ...children : any[]) : any
- }
```

最后启动npm start即可进行调试了

![run](https://pic4.zhimg.com/80/v2-83df4a2c8b8f9f0c1da6dc3da2d481eb.jpg)

## 附：在线调试 {#online-demo}

(不一定能打开哦～ ‍♂️)：[React App](https://l0159.sse.codesandbox.io/)

github仓库地址：[GitHub - jerrywu001/react17-debug: react17源码调试环境](https://github.com/jerrywu001/react17-debug)
