---
title: stylelint最佳实践
description: stylelint最佳实践，包含stylelint、prettier、vscode、webstorm配置。
cover: /articles/code-styles/stylelint.png
---

> 说实话，我一直觉得stylelint没什么必要，只要不报错就行！但最近应公司要求，还是搭建了一下，本文内容包含：
> - stylelint配置
> - prettier配置
> - vscode配置
> - webstorm配置
> - 如何保存时修复

## 一些基础配置

- .editorconfig

```yaml [class="no-line-numbers"][.editorconfig]
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
trim_trailing_whitespace = true
insert_final_newline = true
```

这里需要特别注意```end_of_line```配置：

建议设置LF (linux风格)，此时需要将.prettierrc中的```useTabs```为```false```；

**如果你设置为CRLF，请将.prettierrc中的```useTabs```设置为```true```**

---

## 安装

### 依赖包安装

> 若项目中存在scss文件，需安装postcss-scss
>
> 若项目中存在less文件，需安装postcss-less


```shell [class="no-command-lines no-line-numbers"]
npm i stylelint stylelint-config-standard -D

# 以下视情况进行安装
npm i postcss-scss postcss-less -D

# 如果是vue项目，需要安装
npm i stylelint-config-recommended-vue -D
```

### .stylelintrc.js

> 执行 npx stylelint **/*.{css,less,scss,vue} 进行检测

```js [class="no-line-numbers"][.stylelintrc.js]
// https://stylelint.io/user-guide/get-started

module.exports = {
  extends: [
    'stylelint-config-standard',
    // 如果是vue项目，需要添加
    'stylelint-config-recommended-vue',
  ],
  // rule覆盖（根据自己喜好来配置）
  rules: {
    'string-quotes': 'single',
    'property-no-vendor-prefix': null,
    'declaration-colon-newline-after': null,
    'value-list-comma-newline-after': null,
    'custom-property-pattern': null,
    'color-hex-length': 'short',
    'color-function-notation': null,
    'alpha-value-notation': null,
    'value-no-vendor-prefix': null,
    'selector-class-pattern': null,
    'function-url-quotes': null,
    'no-missing-end-of-source-newline': true,
    'no-descending-specificity': null,
    'font-family-no-missing-generic-family-keyword': null,
  },
  overrides: [
    // 若项目中存在scss文件，添加以下配置
    {
      files: '**/*.scss',
      customSyntax: 'postcss-scss',
    },
    // 若项目中存在less文件，添加以下配置
    {
      files: '**/*.less',
      customSyntax: 'postcss-less',
    },
  ]
};
```

---

## lint-staged配置

<small>当执行git commit -m "xxx"时，进行自动stylelint修复</small>

### install husky & lint-staged

> 请先全局安装yarn

```sh [class="no-command-lines no-line-numbers"]
npm set-script prepare "husky install"

# 如果配置了commit-lint，可以去掉yarn关键字
npx husky add .husky/pre-commit "yarn lint-staged --allow-empty"

npm i husky lint-staged -D
```

### package.json修改

> 增加部分

```json [package.json][class="no-line-numbers"]
{
  "scripts": {
    "stylelint": "stylelint **/*.{css,less,scss,vue}"
  },
  "devDependencies": {
    "husky": "^7.0.4",
    "lint-staged": "^12.3.7"
  },
  "lint-staged": {
    "**/*.{css,less,scss,vue}": [
      "stylelint --fix"
    ]
  }
}
```

### commitlint配置 (个人觉得不重要)

> 如果想对commit文案进行规范，需要安装commitlint

- 依赖

```sh [class="no-command-lines no-line-numbers"]
npm i @commitlint/cli @commitlint/config-conventional cz-customizable -D
```

- package.json新增部分

```json [package.json][class="no-line-numbers"]
{
  "scripts": {
    "commit": "node ./node_modules/cz-customizable/standalone.js"
  }
}
```

- .husky/commit-msg

```yaml [filename=commit-msg][class="no-line-numbers"]
#!/bin/sh

# shellcheck source=./_/husky.sh
. "$(dirname "$0")/_/husky.sh"

npx --no-install commitlint --edit "$1"
```

<small><strong>此时继续使用git commit -m "xxx", 会报以下错误：</strong></small>

<small>*✖   subject may not be empty [subject-empty]*</small>

<small>*<strong>此时应该使用npm run commit</strong>*</small>

- commitlint.config.js

```js [commitlint.config.js][class="no-line-numbers"]
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['Feat', 'Fix', 'Doc', 'Style', 'Update', 'Chore', 'Refactor', 'Test', 'Framework', 'Revert'],
    ],
    'type-case': [0, 'always', 'start-case'],
    'type-empty': [0],
    'scope-empty': [0],
    'scope-case': [0],
    'subject-full-stop': [0, 'never'],
    'subject-case': [0, 'never'],
    'header-max-length': [0, 'always', 72],
  },
};
```

- .cz-config.js

```js [.cz-config.js][class="no-line-numbers"]
module.exports = {
  types: [
    { value: 'Feat', name: '特性:    一个新的特性' },
    { value: 'Update', name: '更新:   更新一个功能' },
    { value: 'Fix', name: '修复:    修复一个Bug' },
    { value: 'Style', name: '样式:    变更的只有样式' },
    { value: 'Doc', name: '文档:    变更的只有文档' },
    { value: 'Refactor', name: '重构:    代码重构，注意和特性、修复区分开' },
    { value: 'Test', name: '测试:    添加一个测试' },
    { value: 'Framework', name: '框架:    开发框架变动(构建、脚手架工具等)' },
    { value: 'Revert', name: '回滚:    代码回退' }
  ],
  scopes: [
    { name: '系统框架' },
    { name: '公共组件' },
  ],
  allowTicketNumber: false,
  isTicketNumberRequired: false,
  ticketNumberPrefix: 'TICKET-',
  ticketNumberRegExp: '\\d{1,5}',

  // override the messages, defaults are as follows
  messages: {
    type: '选择一种你的提交类型:',
    scope: '选择一个scope (可选):',
    // used if allowCustomScopes is true
    customScope: 'Denote the SCOPE of this change:',
    subject: '短说明:\n',
    body: '长说明，使用"|"换行(可选)：\n',
    breaking: '非兼容性说明 (可选):\n',
    footer: '关联关闭的issue，例如：#31, #34(可选):\n',
    confirmCommit: '确定提交说明?'
  },

  allowCustomScopes: true,
  // skip any questions you want
  skipQuestions: ['body'],

  // limit subject length
  subjectLimit: 72,
};
```

### **如果配置之前已经```npm i```过，请执行：**

```bash [class="no-command-lines no-line-numbers"]
npm run prepare
```

---

## prettier配置

> 可选择性安装，个人觉得也不重要

- 依赖

```sh [class="no-command-lines no-line-numbers"]
npm i stylelint-prettier stylelint-config-prettier -D
```

- .prettierrc

<small>请注意```useTabs```配置，详细请参见```editorconfig```的说明</small>

```yaml [class="no-line-numbers"][.prettierrc]
{
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "insertPragma": false
}
```

- .stylelintrc.js新增部分

> stylelint-prettier/recommended需要放在**数组最前面**

```js [.stylelintrc.js][class="no-line-numbers"]
module.exports = {
  extends: [
    'stylelint-prettier/recommended',
  ],
};
```

---

## vscode配置

### 项目根目录创建.vscode文件夹

```sh [class="no-command-lines no-line-numbers"]
mkdir .vscode
```

### vscode安装stylelint插件

<small>**目的是为了让vscode可以读取stylelint配置，并对错误代码进行告警**</small>

### .vscode文件夹中创建extensions.json

<small>别人通过vscode打开你的项目，会自动提示是否安装stylelint插件，如果想安装，点击确定按钮就可~</small>

```json [class="no-line-numbers"][extensions.json]
{
  "recommendations": [
    "stylelint.vscode-stylelint"
  ]
}
```

### .vscode文件夹中创建settings.json

<small>代码保存时，自动对代码进行stylelint修复~</small>

<small>如果需要校验vue，则需要在```stylelint.validate```数组中添加vue</small>

```json [class="no-line-numbers"][settings.json]
{
  "editor.formatOnSave": false,
  "editor.formatOnPaste": false,
  "editor.codeActionsOnSave": {
    "source.fixAll.stylelint": true
  },
  "stylelint.validate": [
    "css",
    "postcss",
    "less",
    "scss",
    "sass",
    "vue"
  ]
}
```

---

## webstorm配置

<small style="color: #f60"><strong>webstorm无法直接做到保存时自动stylelint，需要额外做一些操作，真心累啊！！！</strong></small>

### 启用stylelint

打开设置，参考下图进行配置即可（搜索stylelint，其中软件包位置选择项目stylelint依赖包的位置即可）：


![启用stylelint](/articles/code-styles/stylelint-01.png)

### 为stylelint添加快捷键

![启用stylelint](/articles/code-styles/stylelint-02.png)

**注意**：工具设置->程序，一定要填写:

:::code-group

```jsx [class=no-line-numbers][filename="windows"]
xxx\xxx\node_modules\stylelint\.bin\stylelint.cmd
```

```jsx [class=no-no-line-numbers][filename="mac | linux"]
xxx/xxx/node_modules/stylelint/.bin/stylelint
```

:::

![启用stylelint](/articles/code-styles/stylelint-03.png)


### 为stylelint配置自动保存并修复

添加file watchers（不推荐）


![启用stylelint](/articles/code-styles/stylelint-04.png)

**注意** 上图中：要在变更上运行的工具->程序(P)，一定要填写:

:::code-group

```jsx [class=no-line-numbers][filename="windows"]
xxx\xxx\node_modules\stylelint\.bin\stylelint.cmd
```

```jsx [class=no-line-numbers][filename="mac | linux"]
xxx/xxx/node_modules/stylelint/.bin/stylelint
```

:::

![启用stylelint](/articles/code-styles/stylelint-05.png)

![启用stylelint](/articles/code-styles/stylelint-06.png)

<small style="color: red">**TIPS: file watchers撸代码体验不佳，会发现代码保存过快，还会时不时弹出提示框，很不友好（反正我用的不是很爽，见下图）😰🤬:cry:**</small>

![启用stylelint](/articles/code-styles/stylelint-07.png)


## 附一些问题

*如果是.vue或者.html文件，用快捷键或者file watcher会报以下错误：*

```Error: Cannot resolve custom syntax module "postcss-html". Check that module "postcss-html" is available and spelled correctly.```

（暂时没找到解决办法，🤣🤷‍♂️，如果你有解决办法，欢迎留言）*

**建议使用： 鼠标右键->修复Stylelint问题，如下图：**

![启用stylelint](/articles/code-styles/stylelint-08.png)
