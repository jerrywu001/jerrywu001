---
title: 记录改造一个2018年的react老项目到vite4.3全过程
cover: https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5ceff112af604f619e57432c13b7d32f~tplv-k3u1fbpfcp-zoom-crop-mark:1512:1512:1512:851.awebp?
createAt: 2023-04-20T19:00:00.000Z
---

> 前言：
>
> 每个项目的改造成本是不一样的，您遇到的问题，可能恰巧我没有遇到，so，不喜勿喷～
>
> 本文忽略：
> 1. `eslint`, `prettier`, 因为影响不大，改造成本相对较小。
> 2. `test & mock`环节, 自己配很简单 (推荐使用[vitest](https://vitest.dev/), [msw](https://juejin.cn/post/7130551899584987143))

# 老项目核心配置

- react@16.8.x
- antd@3.26.x
- webpack@4.28.x
- typescript@3.9.x

# 改造过程

> vite有个好处：
> 1. 基本上`xxx-loader`都`不需要自己install`，比如`less-loader`, `ts-loader`, `sass-loader`, 只需要装`less`, `typescript`, `sass`即可
> 2. postcss/postcss-loader也不需要安装

## 用vite初始化一个空react-ts项目

此时配置很简洁，就一个react插件的配置

```
npm create vite@latest proj-to-vite -- --template react-ts

cd proj-to-vite
```

## index.html改造

将老项目的index.html和vite的index.html进行合并, 并保留以下脚本

```html
<!-- react是index.tsx -->
<script type="module" src="/src/index.tsx"></script>
```

同时后期运行项目，我遇到了：`global not defined`的问题

**解决办法**：在index.html中添加

```diff
+ <script>window.global = window;</script>
<script type="module" src="/src/index.tsx"></script>
```

## postcss配置

主要作用是css前缀添加/flexbox bugs修复等([online demo](https://stackblitz.com/edit/vitejs-vite-7gfghf?file=src%2FApp.tsx))...

```bash
npm i postcss-flexbugs-fixes postcss-preset-env -D
```

举例：比如我们想要给filter, animation属性添加-webkit前缀 (***此时设定范围需要包含chrome52***)

`.browserslistrc`

```
>0.2%
Chrome >= 52
```

修改`postcss.config.js`（或者直接在vite.config.ts中配置）

```js
module.exports = {
  plugins: [
    // https://github.com/luisrudge/postcss-flexbugs-fixes#readme
    require('postcss-flexbugs-fixes'),
    require('postcss-preset-env')({
      // postcss-preset-env依赖了autoprefixer, 所以不需要单独安装
      autoprefixer: {
        // 或者在这里覆盖.browserslistrc
        // overrideBrowserslist: ['Chrome >= 52'],
        grid: true,
      },
    }),
  ],
};
```

## 路由异步加载

*为了提升开发和用户体验，请异步加载路由，我使用的是:*

**[@loadable/component](https://github.com/gregberge/loadable-components#readme)**

## vite 配置修改

请仔细阅读以下每一步修改：

### base路径修改

有些项目并不是部署在服务器的根目录下, 有可能在二级目录下，base修改为 `./`

```ts
/// <reference types="vite/client" />

import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ command, mode }) => {
  return {
    base: './',
    plugins: [react()],
  };
});
```
### 变量替换

请**慎用**`__DEV__`这个名称, 因为有些第三方包源码中存在`__DEV__`判断，vite默认会匹配并执行所有替换，项目跑起来报错，如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/84f7915667844c3db8875df08b72e835~tplv-k3u1fbpfcp-watermark.image?)

换成不一样的名称即可，比如`__ENV_DEV__`

```ts
/// <reference types="vite/client" />

import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ command, mode }) => {
  const isBuild = command !== 'serve';
  // load .env vars
  const env = loadEnv(mode, process.cwd(), '');

  return {
    ...,
    define: {
      __ENV_DEV__: !isBuild,
      // __DEV__: !isBuild, // 慎用

      // === other vars ===

      // MOCK_DEV定义在.env文件中
      __MOCK_IN_PRODUCTION__: env.MOCK_DEV === '1',
    },
  };
});
```
### alias路径映射

路径简写，和webpack中的alias一样

```ts
/// <reference types="vite/client" />

import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ command, mode }) => {
  ...

  return {
    ...,
    resolve: {
      alias: [
        ...(
          Object.entries({
            '@': path.resolve('src'),
            '@config': path.resolve('src/config'),
            '@assets': path.resolve('src/assets'),
            '@components': path.resolve('src/components'),
          }).map(([key, val]) => ({ find: key, replacement: val }))
        ),
      ],
    },
  };
});
```

### classnames/lodash改造

vite通过预处理，将多个模块进行合并，以减少开发环境模块请求数量， 从而提升开发体验

```bash
npm i classnames-es-ts lodash-es -S

# 代码还是正常 import { xx } from 'lodash';
```

```ts
/// <reference types="vite/client" />

import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ command, mode }) => {
  ...

  return {
    ...,
    resolve: {
      alias: [
        ...(
          Object.entries({
            ...,
            'classnames': 'classnames-es-ts',
            'lodash': 'lodash-es',
          }).map(([key, val]) => ({ find: key, replacement: val }))
        ),
      ],
    },
  };
});
```
### build配置修改

```ts
/// <reference types="vite/client" />

import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ command, mode }) => {
  ...

  return {
    ...,
    build: {
      outDir: 'build', // 我们的项目输出文件夹要求是build
      assetsInlineLimit: 4096 * 2, // 转换base64的临界点(kb)
      chunkSizeWarningLimit: 3000, // 对于PC，500kb上限有点小
      sourcemap: !isBuild ? true : env.SOURCE_MAP === '1', // SOURCE_MAP定义在.env文件中
      manifest: true, // for PWA
    },
  };
});
```

### react插件配置/html-plugin

项目使用了`decorators`, `class-properties`, `reflect-metadata`

切记：***src/index.tsx入口处需要`import 'reflect-metadata'`***

同时

```bash
# 因为使用了`decorators`, `class-properties`, `reflect-metadata`
# 请记得install：
# @babel/plugin-proposal-decorators
# @babel/plugin-proposal-class-properties
# babel-plugin-transform-typescript-metadata

npm i babel-plugin-transform-typescript-metadata @babel/plugin-proposal-decorators @babel/plugin-proposal-class-properties -D
```

```ts
/// <reference types="vite/client" />

import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';

export default defineConfig(({ command, mode }) => {
  ...

  return {
    ...,
    plugins: [
      createHtmlPlugin(),
      // 我测试了很多遍，babel无法读取.babelrc，需要写在插件里面
      // TIPS: 这里不在需要presets配置，否则你会很难受！
      react({
        babel: {
          plugins: [
            'babel-plugin-transform-typescript-metadata',
            ['@babel/plugin-proposal-decorators', { legacy: true }],
            ['@babel/plugin-proposal-class-properties', { loose: true }],
          ],
        },
      }),
    ]
  };
});
```

### antd按需加载

```ts
/// <reference types="vite/client" />

import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ command, mode }) => {
  ...

  return {
    ...,
    css: {
      preprocessorOptions: { // antd 的基本配置
        less: {
          javascriptEnabled: true,
          modifyVars: {
            '@primary-color': 'blue',
            // ...
          },
        },
        scss: {
          // 解决postcss插件产生的warning
          charset: false,
        },
      },
    },
    plugins: [
      ...,
      createStyleImportPlugin({
        resolves: [
          AntdResolve(),
        ],
        libs: [
          {
            libraryName: 'antd' ,
            resolveStyle: (name) => {
              return `antd/es/${name}/style`;
            },
          },
        ],
      }),
    ]
  };
});
```

### 让vite读取.browserslistrc配置

> 当然你可以直接使用`vite-plugin-legacy`，but, 它的打包速度非常的慢, 我们的项目加上它，打包时间从2分钟直接变成了6分钟，坑爹啊，果断放弃, 转到[browserslist-to-esbuild](https://github.com/marcofugaro/browserslist-to-esbuild#readme)
>
> TIPS: vite默认只处理语法转换，比如async await/??/?./??=，函数(例如padStart)需要自行添加polyfill方案

以下设定可以转换 “async await/??/?./??=”语法, [online demo](https://stackblitz.com/edit/vitejs-vite-7gfghf?file=src%2FApp.tsx)

```
> 0.2%
Chrome >= 52
```

```ts
...
import browserslistToEsbuild from 'browserslist-to-esbuild'

export default defineConfig(({ command, mode }) => {
  ...

  return {
    ...,
    build: {
      ...
      // 可读取.browserslistrc文件
      target: browserslistToEsbuild(),
    },
  };
});
```

目前测试`.browserslistrc配置`可以影响css的输出 (**js方面，默认只会处理语法转换，比如async await/??/?./??=，函数(例如padStart)需要自行添加polyfill方案**)：

css方面，我的配置是`chrome >= 52`，因为我的浏览器范围设定很大，包含低版本，所以如下样式会被转换：

```css
background-color: #0006;

/** to **/

background-color: rgba(0, 0, 0, 0.4);
```

**注意：若css需要添加前缀 / flexbugs修复，请配置`postcss.config.js`**

*详细请转到：本文“postcss配置”部分*

### 第三方包 require not defined 问题

添加transformMixedEsModules配置即可

```ts
...
import browserslistToEsbuild from 'browserslist-to-esbuild'

export default defineConfig(({ command, mode }) => {
  ...

  return {
    ...,
    build: {
      ...
      commonjsOptions: {
        transformMixedEsModules: true
      },
    },
  };
});
```

### typescript静态类型实时检测

建议先不开启它，等改造成功后再开启（因为会产生一些ts相关的类型error, 但不影响程序运行，需要我们`手动fix`）

```ts
...
import TsChecker from 'vite-plugin-checker';

export default defineConfig(({ command, mode }) => {
  ...

  return {
    ...,
    plugins: [
      ...,
      // 里面也有eslint的配置
      TsChecker({ typescript: true }),
    ]
  };
});
```

### 本地开发环境启用https

[安装步骤请戳👇](https://juejin.cn/post/7129795273546530824)

```ts
...
import viteCopyPlugin from '@col0ring/vite-plugin-copy';

export default defineConfig(({ command, mode }) => {
  ...

  return {
    ...,
    server: {
      // VITE_HTTPS定义在.env文件中
      https: env.VITE_HTTPS === 'true' ? {
        key: fs.readFileSync('keys/cert.key'),
        cert: fs.readFileSync('keys/cert.crt')
      } : false,
    },
  };
});
```

### 拷贝文件功能

这里我们在构建成功后，将public下的文件拷贝到build文件夹下。

```ts
...
import viteCopyPlugin from '@col0ring/vite-plugin-copy';

export default defineConfig(({ command, mode }) => {
  ...

  return {
    ...,
    plugins: [
      ...,
      viteCopyPlugin([
        {
          src: './public/*',
          target: './build',
        },
      ]),
    ]
  };
});
```

### 开启webpack的魔法注释

[magic-comments vite](https://github.com/JiangWeixian/vite-plugin-magic-comments#readme)

```js
// 使用方式和webpack魔法注释一样
() => import(/* webpackPrefetch: true */'./xxx/xx/xxx')
```

```ts
...
import { magicComments } from 'vite-plugin-magic-comments';

export default defineConfig(({ command, mode }) => {
  ...

  return {
    ...,
    plugins: [
      ...,
      !isBuild ? magicComments() : null,
    ]
  };
});
```

不过目前最新版本`0.1.1`版本还有bug，我们可以使用`patch-package`打补丁

改动如下 (*你也可以向作者提个`merge request`*)：

`patches/vite-plugin-magic-comments+0.1.1.patch`

```diff
diff --git a/node_modules/vite-plugin-magic-comments/dist/index.mjs b/node_modules/vite-plugin-magic-comments/dist/index.mjs
index 79dfdfc..d795ca4 100644
--- a/node_modules/vite-plugin-magic-comments/dist/index.mjs
+++ b/node_modules/vite-plugin-magic-comments/dist/index.mjs
@@ -677,9 +677,9 @@ const magicComments = () => {
         htmlTags.push({
           tag: "link",
           attrs: {
+            rel: meta.preload ? "preload" : meta.prefetch ? "prefetch" : "",
+            as: "script",
             href: withLeadingSlash(fileName),
-            preload: meta.preload ? JSON.stringify(meta.preload) : void 0,
-            prefetch: meta.prefetch ? JSON.stringify(meta.prefetch) : void 0
           }
         });
       }
```

## package.json修改

### dependencies merge

将老项目的dependencies合并过来，并做适当升级, react升级`17.0.2`测试了下，很稳

### devDependencies 改造

- 移除所有webpack相关依赖包
- 移除`xxx-loader`

### scripts改造

*使用vite提供的运行脚本*

## 其他改造

- 删除src目录
- 将原来项目的src目录粘贴过来

- postcss配置

    *本文`postcss配置`中有说明*

- 将`antd/lib/xx`路径全局替换为`antd/es/xx`

- *关于antd datepicker 国际化修改*

    ```ts
    // index.tsx

    // import 'moment/locale/zh-cn'; // 需要改成以下方式，否则不生效
    import 'moment/dist/locale/zh-cn';

    moment.locale('zh-cn');
    ```

- 项目使用了 `reflect-metadata`

    *so，在src/index.tsx入口处需要`import 'reflect-metadata'`*

- 可能会出现`interface xxx not defined`, 解决办法很简单：

    ```ts
    import { type xxx } from 'xxx/xx/...';
    ```

- class方式写的组件不支持`hot reload`，你需要在所在文件末尾添加 (*但是效果还是不理想，因为页面还是会刷新*)

    ```ts
    if (import.meta.hot) {
      import.meta.hot.accept()
    }
    ```

- 项目本身的一些require语法改造，这个比较简单，改成import即可

    *关于第三方包的修复，在本文`vite配置 -> require not defined`中有说明*

- src/vite-env.d.ts添加

    主要加一些全局的类型定义，比如.jpg,.png,....，还有vite配置中的环境变量声明

    ```ts
    /// <reference types="react" />
    /// <reference types="react-dom" />

    /**
    * process.env是否是development
      */
    declare const __ENV_DEV__: boolean

    // ...

    // CSS modules
    type CSSModuleClasses = { readonly [key: string]: string }

    declare module '*.module.css' {
      const classes: CSSModuleClasses
      export default classes
    }

    // ...
    ```
---

改造完成，项目也正常跑起来了，打包运行也没问题

***好了，如果您有任何问题，欢迎讨论（如果文章对您有帮助，还望点个小红心支持一下，谢谢）～***









