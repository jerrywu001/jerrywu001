> [光神](https://juejin.cn/user/2788017216685118)曾经说过“当你有了技术深度，很可能也同时有了技术广度”，这句话说出来是非常牛逼的，就比如说当你尝试去阅读源码时，你会学到很多你之前未曾听过的知识和技巧。

我今天想要记录的是***如何优雅的调试node环境的npm package源码***

一共有两种方式，让我们一一道来：

## 创建项目

```bash
mkdir node-test
cd node-test
npm init -y
npm i typescript wait-on -D

mkdir src
touch src/index.ts src/util.ts
```

### package.json

> 注：`build`script中`--sourcemap`尤其重要，**否则不能断点ts源码，只能调试bundle js代码**
>
> 开源`npm package`一般都会提供一个`dev`或者`playground`的script, 本文的`dev`script仅仅用于演示，并不是一定要这么写

```json
{
  "name": "node-test",
  "version": "1.0.0",
  "description": "",
  "main": "dist/index.js",
  "scripts": {
    "build": "rm -rf dist && tsc ./src/index.ts --sourcemap --outDir dist",
    "dev": "npm run build && wait-on dist/index.js && npm run chrome",
    "chrome": "node --inspect-brk dist/index.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "typescript": "^4.9.3",
    "wait-on": "^6.0.1"
  }
}
```

### src/index.ts
```ts
import displayName from "./util";

const message = displayName('google');
console.log(message);
```

### src/util.ts
```ts
export default function displayName(name: string) {
  return `My name is ${name}`;
}
```

## chrome inspect
:mp4{path=chrome-debug}

### 运行`npm run dev`

  ![step-1.png](https://pic2.zhimg.com/80/v2-8cd2848c001c906ea16053d5ff0a76fd.webp)

### 打开chrome, 访问`chrome://inspect`

  ![step-2.png](https://pic3.zhimg.com/80/v2-35c72b3a8f26699f7ca8590e869ce2b2.webp)

  ![step-3.png](https://pic2.zhimg.com/80/v2-280a35a592304a2201ca1bfaeb647e85.webp)

### 添加项目文件夹到`worksapce`

  ![step-4.png](https://pic1.zhimg.com/80/v2-38f41f985ec0b78b7199bc11a4ea0b30.webp)

### src源码打断点，即可调试

  ![step-5.png](https://pic1.zhimg.com/80/v2-fb95f7f91dace7f35c47822a774b489c.webp)

## vscode debug （推荐）

:mp4{path=vscode-debug}

### 通过sourcemap调试源码

- 修改package.json的script部分
```json
"scripts": {
    "build": "rm -rf dist && tsc ./src/index.ts --sourcemap --outDir dist",
    "dev": "npm run build && wait-on dist/index.js && npm run inspect",
    "inspect": "node dist/index.js"
 }
```

- 添加launch.json

  ![node-1.png](https://pic3.zhimg.com/80/v2-8f12a93ecc5afdcf91100fc5c46c1496.webp)

- 弹框选择nodejs

  ![node-2.png](https://pic4.zhimg.com/80/v2-c3a1b987eb6ccd3e848f334db0a0909b.webp)

- 点击添加配置按钮，并删除`configurations`，重新选择，如图：

  ![node-3.png](https://pic2.zhimg.com/80/v2-e05e4d0bab96326e0dcbdbe8d15803b1.webp)

- 修改`runtimeArgs`，将`debug`改成`dev`

  ![node-4.png](https://pic4.zhimg.com/80/v2-4f350878171782ef40ab724272bc0ca7.webp)

- 源码打几个断点

  ![node-5.png](https://pic4.zhimg.com/80/v2-0eca859bad8687e7462c6eb10553241f.webp)

- 键盘按下F5，即可调试

  ![node-6.png](https://pic2.zhimg.com/80/v2-e187adf9c8a5916fdb1a00bcaf6a5f61.webp)

### 直接调试源码

- `rm -rf node_modules dist package-lock.json`，并修改package.json
```json
{
  "name": "node-test",
  "version": "1.0.0",
  "description": "",
  "scripts": {
    "dev": "esno src/index.ts"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

- `npm i esno -D`
    > 也可以用`ts-node`

- 源码打几个断点

- 按下F5即可调试

  ![node-7.png](https://pic3.zhimg.com/80/v2-842bcf92f98b41626bb6bb72278673de.webp)

**总结，最关键的是需要有sourcemap，否则只能调试打包后的js代码，如果某些npm包没有提供soucemap，需要想办法重新打包，并生成sourcemap**

***如果觉得文章对您有帮助，可以点个小红心，感谢~***
