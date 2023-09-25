---
title: 手把手讲解使用纯css实现item - background-hover随鼠标丝滑移动~
description:
cover: https://pic1.zhimg.com/v2-c2b2a9a9aab88b368fda3285ec303e7b_1440w.jpg?source=d16d100b
---

<img src="https://pic2.zhimg.com/v2-c57fd1916998f05b9606b5bcfc98dce5_b.jpg" style="max-width: 800px" />

<br />

# 线上效果预览

:button-link[animation demo]{href="/"}

## 前提

基于css方案，每个item的高度必须是固定的，这确实是一个局限的点，当然文章主要分享一下新的思路。

## 常规hover效果

```css
.item:hover {
  background-color: #eee;
}
```

可以想象一下，效果很生硬，你看到的区块是hover时突然出现，并不会有丝滑的移动效果。

## css实现步骤

### 创建html，创建items

<img src="https://pic3.zhimg.com/80/v2-cb9a02216599d290aa0f2f0f51d87456_720w.webp" style="max-width: 800px" />

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>hover</title>
  <style>
    body {
      margin: 0;
      padding: 0;
    }

    .container {
      overflow-x: hidden;
      overflow-y: auto;
      position: relative;
      height: 100vh;
    }

    .item {
      --y: 0;
      --height: 151px;
      --surface-2: #767676;
      --surface-0: #181818;

      cursor: pointer;
      padding: 30px 16px;
      border-bottom: 1px #ddd solid;
      box-sizing: border-box;
    }
  </style>
</head>
<body>
  <div class="container"></div>
</body>
<script>
  const itemCount = 15;

  for (var i = 0; i < itemCount; i++) {
    var item = document.createElement('div');
    item.className = 'item';
    item.innerHTML = '<p>testtesttesttesttest</p><p>testtesttesttesttesttest</p>';
    document.querySelector('.container').appendChild(item);
  }
</script>
</html>
```

### 在每一项hover时，通过伪类获取最后一个item

```css
.item:hover~.item:last-child {
  // do something
}
```

这是打开核心思路的钥匙。

介此，我们可以通过`.item:last-child::before`去创建一个等同大小`absolute定位`的浅灰色区块，在hover时候去移动它来达到我们想要的交互效果~

浅灰色区块默认`opacity: 0`，可以通过`top`来移动浅灰色区块。

```css
.item {
  --y: 0;
  --height: 151px;
  --surface-2: #767676;
  --surface-0: #181818;

  // ...
}

.item:last-child::before {
  content: '';
  display: block;
  position: absolute;
  background: var(--surface-2);
  opacity: 0;
  width: 100%;
  top: var(--y);
  left: 0;
  height: var(--height);
  border-radius: .4rem;
  pointer-events: none;
  transition: all .5s cubic-bezier(.2,1,.2,1);
}
```

接下来的关键就是如何在hover每一项时改变`y`变量的值，上面我们提到过“在每一项hover时，通过伪类获取最后一个item的before”，并将其透明度调高

- 透明度调高

```css
.item:hover~.item:last-child::before {
  opacity: .06;
}
```

此时预览，发现并没有任何效果，浅灰色区块始终在最上方，那是因为我们还没有初始化`y`的值。

初始化思路也是通过伪类实现即可，如下：

```css
.item:nth-child(1):hover~.item:last-child::before {
  --y: calc(var(--height) * 0);
}

.item:nth-child(2):hover~.item:last-child::before {
  --y: calc(var(--height) * 1);
}

.item:nth-child(3):hover~.item:last-child::before {
  --y: calc(var(--height) * 2);
}

// ...
// ...
```

但是，这样写死未免有些不方便，而且显得笨拙~

我们改造一下，通过js去生成样式，并在items dom生成后初始化插入head即可。

```js
const initHoverClasses = () => {
    let styleStr = '';

    for (let i = 0, len = itemCount; i < len - 1; i++) {
      styleStr += `
        .item:nth-child(${i + 1}):hover~.item:last-child::before {
          --y: calc(var(--height) * ${i});
        }
      `;
    }

    styleStr += `.item:nth-child(${itemCount}):hover::before {
      --y: calc(var(--height) * ${itemCount - 1});
      opacity: .06;
    }`;

    // create style tag, inject styleStr
    const styleTag = document.getElementById('hover-classes');
    if (styleTag) styleTag.remove();

    const style = document.createElement('style');
    style.id = 'hover-classes';
    style.innerHTML = styleStr;
    document.head.appendChild(style);
};
```

### 完整代码

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>hover</title>
  <style>
    body {
      margin: 0;
      padding: 0;
    }

    .container {
      overflow-x: hidden;
      overflow-y: auto;
      position: relative;
      height: 100vh;
    }

    .item {
      --y: 0;
      --height: 151px;
      --surface-2: #767676;
      --surface-0: #181818;

      cursor: pointer;
      padding: 30px 16px;
      border-bottom: 1px #ddd solid;
      box-sizing: border-box;
    }

    .item:last-child::before {
      content: "";
      display: block;
      position: absolute;
      background: var(--surface-2);
      opacity: 0;
      width: 100%;
      top: var(--y);
      left: 0;
      height: var(--height);
      border-radius: .4rem;
      pointer-events: none;
      transition: all .5s cubic-bezier(.2,1,.2,1);
    }

    .item:hover~.item:last-child:before {
      opacity: .06;
    }
  </style>
</head>
<body>
  <div class="container"></div>
</body>
<script>
  const itemCount = 15;

  const initHoverClasses = () => {
    let styleStr = '';

    for (let i = 0, len = itemCount; i < len - 1; i++) {
      styleStr += `
        .item:nth-child(${i + 1}):hover~.item:last-child::before {
          --y: calc(var(--height) * ${i});
        }
      `;
    }

    styleStr += `.item:nth-child(${itemCount}):hover::before {
      --y: calc(var(--height) * ${itemCount - 1});
      opacity: .06;
    }`;

    // create style tag, inject styleStr
    const styleTag = document.getElementById('hover-classes');
    if (styleTag) styleTag.remove();

    const style = document.createElement('style');
    style.id = 'hover-classes';
    style.innerHTML = styleStr;
    document.head.appendChild(style);
  };

  for (var i = 0; i < itemCount; i++) {
    var item = document.createElement('div');
    item.className = 'item';
    item.innerHTML = '<p>testtesttesttesttest</p><p>testtesttesttesttesttest</p>';
    document.querySelector('.container').appendChild(item);

    setTimeout(() => {
      initHoverClasses();
    });
  }
</script>
</html>
```

好了文章到此结束，如果对您有帮助，请点个小红心，谢谢~
