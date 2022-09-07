---
title: 使用vite、tsup、github actions打造丝滑的npm package开发模版
description: 使用vite、tsup、github actions打造丝滑的npm package开发模版（针对vue3和react）
cover: /articles/vue/R-C.png
createAt: 2022-07-25T19:00:00.000Z
---

很多时候我们有开发npm pacckge的想法，但自己搭建开发模版会觉得很麻烦！所以，我有了搭建零配置npm package开发模版的想法，真的是零配置哦🫠，你要做的只是：

1. Fork [my project]
2. 初始化GitHub action必须的[token](https://github.com/codes-templates/npm-react#how-to-add-npm_token)
3. 在src文件夹中编写您的逻辑
4. Push or PR，Github action会自动发包，并部署storybook文档

项目地址：

:button-link[For React]{href="https://github.com/codes-templates/npm-react"}

:button-link[For Vue3]{href="https://github.com/codes-templates/npm-vue3"}

## 大致介绍

> npm package开发模版所包含的技术点：

- 🛹 项目使用[vite3.0](https://vitejs.dev/)搭建, 支持[typescript](https://www.typescriptlang.org/)
- 🧩 发布的npm package支持cjs/esm
- 🎯 使用[github actions](https://docs.github.com/cn/actions)实现自动化 ci、deploy to [netlify](https://www.netlify.com/)、npm publish、create-release
- 🛫 使用[tsup](https://tsup.egoist.sh/)(npm run build)去构建npm package

  > 同时也集成了vite构建方案 --> ```npm run build:vite```
  >
  > 输出路径: dist/index.js & dist/esm/index.js & dist/index.d.ts

- 🏗 内置了开发调试环境(可直接引用src中的代码，方便调试)

  > 对应文件夹为playground ---> ```npm run dev```

- 💡 支持browserslistrc配置
- 🔌 使用[postcss](https://github.com/codes-templates/npm-react/blob/main/postcss.config.js) ([postcss-nested](https://www.npmjs.com/package/postcss-nested)/ [autoprefixer](https://www.npmjs.com/package/autoprefixer) / [cssnano](https://cssnano.co/docs/getting-started/))构建样式

  > 对应文件夹为playground ---> ```npm run build:css```
  >
  > 入口文件位置： src/styles/index.css
  >
  > 输出路径: dist/index.css

- 🖼 集成[stylelint](https://stylelint.io/)
- 💊 集成[eslint](https://eslint.org/)
- 🎉 集成单元测试（[vitest](https://vitest.dev/)）
- 🛎 [使用原生npm实现mono repo](https://dev.to/ynwd/how-to-create-react-monorepo-with-npm-workspace-webpack-and-create-react-app-2dhn)
- 🧌 集成[storybook](https://storybook.js.org/)
- 🐳 集成[Husky](https://typicode.github.io/husky) & [lint-staged](https://github.com/okonet/lint-staged#readme)
- 🍥 集成[commitlint](https://commitlint.js.org), 规范提交信息
- ⛷ [vue](https://vuejs.org/)>=3.2.0，[react](https://reactjs.org/)>=16.8.0
- 🪜 vue版本默认集成了[vitepress](https://vitepress.vuejs.org/)
  > docs文件夹

## 项目结构

```js
Project
├── __tests__           # 单元测试脚本
├── babel.config.js     # babel config
├── package.json
├── playground          # dev environment folder (通过包名可以直接引用src中的源码，方便开发调试)
│   ├── index.html
│   ├── package.json
│   ├── public
│   ├── src
│   ├── tsconfig.json
│   ├── vite-env.d.ts
│   └── vite.config.ts
├── postcss.config.js  # 使用postcss构建css
├── src                # npm包源码位置
│   ├── index.ts       # npm包源码入口文件
│   ├── stories        # storybook for building UI components and pages
│   ├── styles         # npm包对应的样式源文件（可选）
│   └── types.ts       # ts类型申明
├── tsconfig.json      # ts config
└── tsup.config.ts     # 默认使用tsup构建package（也可选择npm run build:vite）
```

## 如何使用

### 替换包名称

全局搜索项目，将'custom-package-name'替换为你的npm package名称

### 初始化github action需要的token

具体步骤，请参照：
:button-link[create token]{href="https://github.com/codes-templates/npm-react#how-to-add-npm_token"}

### 关于github actions

> 正常push或pr即可触发action

- [ci](https://github.com/codes-templates/npm-react/blob/main/.github/workflows/ci.yaml)

当有PR被创建、修改、reopen、commit时，会触发ci work，用于执行eslint、stylelint、typecheck、unit test

效果如下图：

![](/articles/vue/release-start.png)

- [deploy](https://github.com/codes-templates/npm-react/blob/main/.github/workflows/deploy.yaml)

当有代码被push 或 PR被创建、修改、reopen、commit时，会触发deploy work，用于执行上一步ci，并在ci成功时自动deploy storybook到netlify、vercel上

效果如下图：

![](/articles/vue/deploying.png)

- [release](https://github.com/codes-templates/npm-react/blob/main/.github/workflows/release.yaml)

当tag被添加（npm run release），会触发release work，用于执行上一步ci，并在ci成功时自动发布npm package、create release

效果如下图：

![](/articles/vue/release-03.png)
![](/articles/vue/release-04.png)
![](/articles/vue/release-010.png)
![](/articles/vue/release-05.png)

## 关于模版细节，后续将出文章详细一一介绍
