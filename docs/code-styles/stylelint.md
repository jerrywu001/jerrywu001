---
title: stylelint最佳实践
description: stylelint最佳实践，包含stylelint、prettier、vscode、webstorm配置。
cover: /articles/code-styles/stylelint.png
createAt: 2022-04-06T16:00:00.000Z
---

> 说实话，我一直觉得stylelint没什么必要，只要不报错就行！但最近公司应需要，还是搭建了一下，本文内容包含：
> - stylelint配置
> - prettier配置
> - vscode配置
> - webstorm配置
> - 如何保存时修复

## 一些基础配置

- .editorconfig

```yaml
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
trim_trailing_whitespace = true
insert_final_newline = true

```

以上请注意```end_of_line```配置，建议设置lf (linux风格)，对应.prettierrc中的useTabs为false；

**如果你设置了crlf，请将.prettierrc中的```useTabs```设置为```true```**

---

## 安装

### 依赖包安装

> postcss-scss postcss-less 请根据使用情况进行选择安装


```sh
npm i stylelint stylelint-config-standard postcss-scss postcss-less -D
```

### .stylelintrc.js

> 执行 npx stylelint **/*.{css,less,scss} 进行检测

```js
// https://stylelint.io/user-guide/get-started

module.exports = {
  extends: [
    'stylelint-config-standard',
  ],
  // rule覆盖（根据自己喜好来配置）
  rules: {
    'string-quotes': 'single',
    'declaration-colon-newline-after': null,
    'value-list-comma-newline-after': null,
    'custom-property-pattern': null,
    'color-hex-length': 'short',
    'color-function-notation': null,
    'alpha-value-notation': null,
    'value-no-vendor-prefix': null,
    'selector-class-pattern': null,
    'function-url-quotes': 'never',
    'no-missing-end-of-source-newline': true,
    'no-descending-specificity': null,
    'font-family-no-missing-generic-family-keyword': null,
  },
  // scss 和 less，根据使用情况进行配置
  overrides: [
    {
      files: '**/*.scss',
      customSyntax: 'postcss-scss',
    },
    {
      files: '**/*.less',
      customSyntax: 'postcss-less',
    },
  ]
};
```

---

## lint-staged配置

<small>当执行git commit -m "xxx"时进行自动stylelint修复</small>

### install husky & lint-staged

```sh
npm i husky lint-staged -D
```

### 创建.husky/pre-commit

<small>**如果mac系统报"找不到pre-commit"，请将```pre-commit文件的行尾格式```从```CRLF```改成```LF```即可解决**</small>

```sh
mkdir .husky
touch pre-commit
```

```yaml[filename=pre-commit]
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

yarn lint-staged --allow-empty
```

### commitlint配置 (个人觉得不重要)

> 如果想对commit文案进行规范，需要安装commitlint

- 依赖

```sh
npm i @commitlint/cli @commitlint/config-conventional -D
```

- package.json新增部分

```json[package.json]
{
  "scripts": {
    "commit": "node ./node_modules/cz-customizable/standalone.js"
  }
}
```

- .husky/commit-msg

> 此时继续使用git commit -m "xxx"会报以下错误：
>
> ✖   subject may not be empty [subject-empty]

```yaml
#!/bin/sh

# shellcheck source=./_/husky.sh
. "$(dirname "$0")/_/husky.sh"

npx --no-install commitlint --edit "$1"
```

- commitlint.config.js

```js[commitlint.config.js]
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

```[.cz-config.js]
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

### package.json修改

> 增加部分

```json
{
  "scripts": {
    "prepare": "husky install",
    "stylelint": "stylelint **/*.{css,less,scss}"
  },
  "devDependencies": {
    "husky": "^7.0.4",
    "lint-staged": "^12.3.7"
  },
  "lint-staged": {
    "**/*.{css,less,scss}": [
      "stylelint --fix"
    ]
  }
}
```

### **如果当前已经```npm i```过，请执行：**

```sh
npm run prepare
```

---

## prettier配置

> 可选择性安装，个人觉得也不重要

- 依赖

```sh
npm i stylelint-prettier stylelint-config-prettier -D
```

- .prettierrc

<small>请注意```useTabs```配置，详细请参见```editorconfig```的说明</small>

```yaml
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

> stylelint-prettier/recommended需要放在数组最后

```js[.stylelintrc.js]
module.exports = {
  extends: [
    'stylelint-prettier/recommended',
  ],
};
```

---

## vscode配置

### 项目根目录创建.vscode文件夹

```sh
mkdir .vscode
```

### vscode安装stylelint插件

<small>**这样vscode可以读取stylelint配置，并对错误代码进行告警**</small>

### .vscode文件夹中创建extensions.json

<small>别人通过vscode打开你的项目，会自动提示是否安装stylelint插件，如果想安装，点击确定按钮就可~</small>

```json
{
  "recommendations": [
    "stylelint.vscode-stylelint"
  ]
}
```

### .vscode文件夹中创建settings.json

<small>配置保存时自动对代码进行stylelint修复~</small>

```json
{
  "editor.formatOnSave": false,
  "editor.formatOnPaste": false,
  "editor.codeActionsOnSave": {
    "source.fixAll.stylelint": true
  },
  "stylelint.validate": [
    "css",
    "less",
    "scss"
  ]
}
```

---

## webstorm配置

webstorm无法直接做到保存时自动stylelint，需要额外最一番操作，真心累啊！！！

### 启用stylelint

打开设置，严格按下图进行配置即可（搜索stylelint，其中软件包位置选择项目stylelint依赖包的位置即可）：


![启用stylelint](/public/articles/code-styles/stylelint-01.png)

### 为stylelint添加快捷键

注意：工具设置->程序，一定要填写:

```html
node_modules\stylelint\.bin\stylelint.cmd

非windows填写：

node_modules\stylelint\.bin\stylelint
```

![启用stylelint](/public/articles/code-styles/stylelint-02.png)

![启用stylelint](/public/articles/code-styles/stylelint-03.png)


### 为stylelint配置自动保存并修复

> 编写时候体验不佳，会发现代码保存过快，还会弹出框，很不友好，🤷‍♂️💀

添加file watchers

![启用stylelint](/public/articles/code-styles/stylelint-04.png)

![启用stylelint](/public/articles/code-styles/stylelint-05.png)

![启用stylelint](/public/articles/code-styles/stylelint-06.png)


