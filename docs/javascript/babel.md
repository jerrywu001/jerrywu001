---
title: babel 之 core-js preset-env plugin-transform-runtime 实操指南
description: babel 之 core-js preset-env plugin-transform-runtime 实操指南
cover: /articles/babel.jpg
createAt: 2022-08-26T10:00:00.000Z
---

> 由于 Babel 只进行语法转换（如箭头函数, let, const），你可以使用**垫片方案**来支持新的全局变量，如 Promise 或新的原生方法，如 String.padStart（left-pad）。

## 关于@babel/polyfill

- Babel < 7.4.0

```js [class=no-line-numbers]
import "@babel/polyfill";
```

- [Babel >= 7.4.0](https://babeljs.io/docs/en/babel-polyfill)

```js [class=no-line-numbers]
// 替换成以下形式即可
import "core-js/stable";
import "regenerator-runtime/runtime";
```

## 准备工作

- 创建文件夹，名称随意
- npm init，生产package.json
- 添加npm依赖

```bash [class="no-line-numbers no-command-line"]
npm i @babel/cli @babel/core @babel/plugin-transform-runtime @babel/preset-env -D

npm i core-js @babel/runtime -S
```

- 创建demo.js

```js [class=no-line-numbers]
const a = '1003';

a.padStart(10, '0');

const func = () => {};
```

- 修改package.json scripts部分

:::alert

npm run babel

如修改babel.config.js/.browserslistrc，需要重新跑这个命令

:::

```diff [class="diff-highlight"]
{
+  "scripts": {
+    "test": "echo \"Error: no test specified\" && exit 1",
+    "babel": "babel demo.js --watch --out-file output.js"
+  }
}
```

- 创建 .browserslistrc

:::alert{type=warning}
\>0.2%会polyfill不支持es6的浏览器，我验证了下这个粗略的临界点大概在0.764%，当小于这个值，比如<=0.763%的时候，效果和>0.2%一样
:::

```yaml [class=no-line-numbers]
>0.2%
```

- 创建babel.config.js

```js [class=no-line-numbers]
// useBuiltIns可选值有usage,entry,false
// - 默认为false，false不需要指定corejs版本
// - usage/entry，需要指定corejs版本

module.exports = {
  presets: [
    [
      '@babel/preset-env', // 会根据.browserslistrc中浏览器的设定，进行polyfill
      {
        useBuiltIns: 'entry',
        corejs: 3,
      },
    ],
  ],
};
```

## @babel/preset-env useBuiltIns 场景

- useBuiltIns: false

```js [class=no-line-numbers]
// 只进行语法转换（如箭头函数, let, const），输出：

"use strict";

var a = '1003';
a.padStart(10, '0');

var func = function func() {};
```

- useBuiltIns: 'entry'

```js [class=no-line-numbers]
// 修改demo.js
// 头部需要导入core-js/stable, regenerator-runtime，否则无法polyfill

import "core-js/stable";
import "regenerator-runtime/runtime";

const a = '1003';

a.padStart(10, '0');

const func = () => {};
```

:::alert
输出结果中会发现引入了很多不需要的特性，实际上只用到pad-start
:::

```js [class=no-line-numbers]
// 输出：

"use strict";
... // 省略其他require
require("core-js/modules/web.url.to-json.js");
require("core-js/modules/web.url-search-params.js");
require("regenerator-runtime/runtime");

var a = '1003';
a.padStart(10, '0');

var func = function func() {};
```

- useBuiltIns: 'usage'

```js [class=no-line-numbers]
// 修改demo.js
const a = '1003';

a.padStart(10, '0');

const func = () => {};
```

:::alert
usage 实现了按需引用
:::

```js [class=no-line-numbers]
"use strict";

require("core-js/modules/es.string.pad-start.js");

var a = '1003';
a.padStart(10, '0');

var func = function func() {};
```

## .browserslistrc简单使用

:::alert

[browserslist](https://github.com/browserslist/browserslist)

:::

- 兼容旧石器浏览器

> <= 0.763%

```js [class=no-line-numbers]
"use strict";

require("core-js/modules/es.string.pad-start.js");

var a = '1003';
a.padStart(10, '0');

var func = function func() {};
```

- 适配支持es6的浏览器

> \>0.764%

```js [class=no-line-numbers]
// 没有做任何转换，因为全球使用率>0.764%的浏览器都支持了es6中的padStart

"use strict";

const a = '1003';
a.padStart(10, '0');

const func = () => {};
```

- 配置可以叠加

我们打开：[Can I use](https://caniuse.com/?search=padStart)

![](https://pic1.zhimg.com/80/v2-5f3fec6b4740f2b0d5a07dd046212db8.jpg)

查询padStart的兼容信息，发现chrome从57开始支持了padStart，但是如果我们的项目需要兼容56版本，此时我们可以添加以下配置

```yaml [class=no-line-numbers]
>0.764%
chrome >= 56
```

```js [class=no-line-numbers]
// 输出：
"use strict";

require("core-js/modules/es.string.pad-start.js");

var a = '1003';
a.padStart(10, '0');

var func = function func() {};
```

## @babel/plugin-transform-runtime

:::alert
babel编译es6到es5的过程中，@babel/plugin-transform-runtime这个插件会自动polyfill es5不支持的特性，这些polyfill包就是在@babel/runtime这个包里（core-js 、regenerator等）
:::

- 场景问题

.browserslistrc

```js [class=no-line-numbers]
>0.2%
```

demo.js

```js [demo.js][class=no-line-numbers]
class A {}
```

输出

```js [class=no-line-numbers]
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var A = function A() {
  _classCallCheck(this, A);
};
```

此时会发现，就地定义了一个_classCallCheck，并没有从@babel/runtime/helpers中引用classCallCheck

但样这做存在一个问题。在我们正常的前端工程开发的时候，少则几十个js文件，多则上千个。如果每个文件里都使用了class类语法，那会导致每个转换后的文件上部都会注入这些相同的函数声明。这会导致我们用构建工具打包出来的包非常大。

**其实解决这个问题，很简单**，我们只有修改babel.config.js:

```js [class=no-line-numbers]
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: 3,
      },
    ],
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
  ],
};
```

然后重新npm run babel即可，此时输出：

```js [class=no-line-numbers]
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var A = function A() {
  (0, _classCallCheck2.default)(this, A);
};
```

问题解决~

```runtime```编译器插件做了以下几件事：

1. 当你使用 generators/async 函数时，自动引入 @babel/runtime/regenerator 。
2. 如有必要，可以使用 core-js 作为帮助函数，如果需要被polyfill
3. 移除内联的 Babel helper，并使用模块 @babel/runtime/helpers 代替。
4. 可以将 helper 和 polyfill 都改为从一个统一的地方引入，并且引入的对象和全局变量是完全隔离的
