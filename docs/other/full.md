## 基础语法

**此文章中 \\\`\\\`\\\` 表示的是 ```**

暂不支持流程图、序列图、甘特图

> https://www.markdownguide.org/basic-syntax
>
> https://markdown.com.cn/

## 其他基础语法

### gfm

see: [gfm](https://www.npmjs.com/package/remark-gfm)

### emoji

see: [emoji](https://www.npmjs.com/package/remark-gemoji)

```md
点个赞 :+1:，踩一下 :-1:，笑脸: :smile:，家庭 :family_man_man_boy_boy:，猫 :cat:，狗 :dog:，汽车 :car:
```

点个赞 :+1:，踩一下 :-1:，笑脸: :smile:，家庭 :family_man_man_boy_boy:，猫 :cat:，狗 :dog:，汽车 :car:

## code

> 1. **如果想全局禁用行号**
>
> 可以注释modules\content\markdown\remark.ts中"line-numbers"所在行查看效果
>
> 2. **如果想全局禁用bash commond-line**
>
> 可以注释modules\content\markdown\remark.ts中"command-line"所在行查看效果

### 内联code

```md
`const a = 1`
```

`const a = 1`

### code 默认有行号

```md
\`\`\`js
const a = 1;
console.log(a);
\`\`\`
```

```js
const a = 1;
console.log(a);
```

### code 无行号

> class="no-line-numbers"

```md
\`\`\`js[class=no-line-numbers]
const a = 1;
console.log(a);
\`\`\`
```

```js[class=no-line-numbers]
const a = 1;
console.log(a);
```

### bash

> 如果bash前面有用户信息，则自动隐藏行号

#### 有用户信息，自动隐藏行号

- windows

```md
\`\`\`bash[data-prompt="Cmder C:\Users\haha>" data-output="2-11"]
dir

Directory: C:\Users\Chris

Mode                LastWriteTime     Length Name
----                -------------     ------ ----
d-r--        10/14/2015   5:06 PM            Contacts
\`\`\`
```

```bash[data-prompt="Cmder C:\Users\haha>" data-output="2-11"]
dir

Directory: C:\Users\Chris

Mode                LastWriteTime     Length Name
----                -------------     ------ ----
d-r--        10/14/2015   5:06 PM            Contacts
```

- linux

```md
\`\`\`bash[data-user=haha][data-host=admin][data-output="2,4-8"]
pwd
/usr/home/chris/bin
ls -la
total 2
drwxr-xr-x   2 chris  chris     11 Jan 10 16:48 .
drwxr--r-x  45 chris  chris     92 Feb 14 11:10 ..
\`\`\`
```

```bash[data-user=haha][data-host=admin][data-output="2,4-8"]
pwd
/usr/home/chris/bin
ls -la
total 2
drwxr-xr-x   2 chris  chris     11 Jan 10 16:48 .
drwxr--r-x  45 chris  chris     92 Feb 14 11:10 ..
```

#### 隐藏用户信息 & 手动隐藏行号

> class="no-command-line no-line-numbers"

```md
\`\`\`bash[class="no-command-line no-line-numbers"]
pwd
/usr/home/chris/bin
ls -la
\`\`\`
```


```bash[class="no-command-line no-line-numbers"]
pwd
/usr/home/chris/bin
ls -la
```

## 文件树

```md

\`\`\`treeview
root_folder
├── a first folder
|   ├── holidays.mov
|   ├── javascript-file.js
|   └── some_picture.jpg
├── documents
|   ├── spreadsheet.xls
|   ├── manual.pdf
|   ├── document.docx
|   └── presentation.ppt
└── etc.
\`\`\`
```

```treeview
root_folder
├── a first folder
|   ├── holidays.mov
|   ├── javascript-file.js
|   └── some_picture.jpg
├── documents
|   ├── spreadsheet.xls
|   ├── manual.pdf
|   ├── document.docx
|   └── presentation.ppt
└── etc.
```

## 指定行高亮 & 显示文件名

```md
\`\`\`json{2,6,8-10}[我是文件名称.json]
{
  "scripts": {
    "dev": "nuxt",
    "dev": "nuxi dev",
    "build": "nuxt build",
    "build": "nuxi build",
    "start": "nuxt start",
    "start": "nuxi preview"
  }
}
\`\`\`
```

```json{2,6,8-10}[我是文件名称.json]
{
  "scripts": {
    "dev": "nuxt",
    "dev": "nuxi dev",
    "build": "nuxt build",
    "build": "nuxi build",
    "start": "nuxt start",
    "start": "nuxi preview"
  }
}
```

## 代码diff

```md
\`\`\`diff [class="language-diff-javascript diff-highlight"]
-    let foo = bar.baz([1, 2, 3]);
-    foo = foo + 1;
+    const foo = bar.baz([1, 2, 3]) + 1;
+    console.log(`foo: ${foo}`);
\`\`\`
```



```diff [class="language-diff-javascript diff-highlight"]
-    let foo = bar.baz([1, 2, 3]);
-    foo = foo + 1;
+    const foo = bar.baz([1, 2, 3]) + 1;
+    console.log(`foo: ${foo}`);
```

## autolinker

> 请打开modules\content\markdown\remark.ts中"autolinker"所在行的注释查看效果

```css
@font-face {
	src: url(http://lea.verou.me/logo.otf);
	font-family: 'LeaVerou';
}
```

## data-uri-highlight

```css
div {
    border: 40px solid transparent;
    border-image: 33.334% url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30"> \
                          <circle cx="5" cy="5" r="5" fill="%23ab4"/><circle cx="15" cy="5" r="5" fill="%23655"/> \
                          <circle cx="25" cy="5" r="5" fill="%23e07"/><circle cx="5" cy="15" r="5" fill="%23655"/> \
                          <circle cx="15" cy="15" r="5" fill="hsl(15, 25%, 75%)"/> \
                          <circle cx="25" cy="15" r="5" fill="%23655"/><circle cx="5" cy="25" r="5" fill="%23fb3"/> \
                          <circle cx="15" cy="25" r="5" fill="%23655"/><circle cx="25" cy="25" r="5" fill="%2358a"/></svg>');
    padding: 1em;
    max-width: 20em;
    font: 130%/1.6 Baskerville, Palatino, serif;
}
```

## css inline-color

```css
span.foo {
	background-color: navy;
	color: #BFD;
}

span.bar {
	background: rgba(105, 0, 12, .38);
	color: hsl(30, 100%, 50%);
	border-color: transparent;
}
```

## 组件使用说明

### code-group

```md
:::code-group

\`\`\`bash[class=no-command-line][filename="use npm"]
npm i create-react-app -g
\`\`\`

\`\`\`bash[class=no-command-line][filename="use create-react-app"]
create-react-app react-debug
\`\`\`

:::
```

:::code-group

```bash[class=no-command-line][filename="use npm"]
npm i create-react-app -g
```

```[class=no-command-line][filename="use create-react-app"]
create-react-app react-debug
```

:::

### Custom Containers

> 注意`:::`后面有个空格
>
> 语法和vitepress的一样： https://vitepress.dev/guide/markdown#custom-containers

- **默认（info）**

::: info
This is an info box.
:::

::: tip I am a title
This is a tip box.
:::

::: success
This is a success box.
:::

::: danger
This is a danger box.
:::

::: warning
🎤 This is a warning box. Sing a song.
:::

::: details Click me to view the code
This is a details block.
:::

### button link

- 外链

```md
:button-link[Open Bing]{href="https://cn.bing.com"}
```

:button-link[Open Bing]{href="https://cn.bing.com"}

- 站内跳转

```md
:button-link[站内跳转]{href="/"}
```

:button-link[站内跳转]{href="/"}


### list

- 默认 (type=primary)

```md
:::list

- one
- two
- three

:::
```

:::list

- one
- two
- three

:::


-  type=info

```md
:::list{type=info}

- one
- two
- three

:::
```

:::list{type=info}

- one
- two
- three

:::


-  type=success

```md
:::list{type=success}

- one
- two
- three

:::
```

:::list{type=success}

- one
- two
- three

:::


-  type=danger

```md
:::list{type=danger}

- one
- two
- three

:::
```

:::list{type=danger}

- one
- two
- three

:::

-  type=warning

```md
:::list{type=warning}

- one
- two
- three

:::
```

:::list{type=warning}

- one
- two
- three

:::

-  自定义icon

```md
:::list{icon=🧙🏽‍♂️}

- one
- two
- three

:::
```

:::list{icon=🧙🏽‍♂️}

- one
- two
- three

:::

### 普通折叠

```md
:::panel{title="我是个折叠按钮，点击我打开内容:"}

- one
- two
- three

:::
```

:::panel{title="我是个折叠面板，点击我打开内容:"}

- one
- two
- three

:::

---

### panel嵌套组件

<img src="https://ik.imagekit.io/jerrywu001/supabases-blogs/f243372d-29a3-4185-bb54-595eb26f4084/panel.png?updatedAt=1693471912976" style="max-width: 500px" />


:::panel{title="点击查看被嵌套的组件:"}
::: danger
This is an info box. `react` info

[bing](https://cn.bing.com)

```js
const a = 1;
```

| col | col | col |
| - | - | - |
| content | content | content |
:::

## iframe

```md
::embed[]{href=https://tailwindcss.com/}
```

::embed[]{href=https://tailwindcss.com/}

## sandpack demo

```md
:::sand-box{template=react-ts}
\`\`\`js App.tsx
export default function App() {
  return (
    <div>Hello world</div>
  );
}
\`\`\`
:::
```

:::sand-box{template=react-ts}
```js App.tsx
export default function App() {
  return (
    <div>Hello world</div>
  );
}
```
:::

:button-link[more demos]{href="/post/04f3f73c-df14-4a1a-93ef-502efb606f2a"}

## youtube

> UmkEDc1G_7A 是youtube embed id
>
> 需要翻墙

```md
::youtube[Video of a cat in a box]{#UmkEDc1G_7A}
```

::youtube[Video of a cat in a box]{#UmkEDc1G_7A}
