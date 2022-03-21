---
title: 这么好的前端mock工具，还不用起来？
description: 本文要介绍的mock工具msw，它通过service worker来做请求拦截
cover: /articles/mocker.jpeg
createAt: 2022-01-04T10:00:00.000Z
---

> 一个好的前端mock工具，可以有效的提高前端开发效率
>
> 常用的mock方案这里不做过多介绍，可以自行搜索

本文要介绍的mock工具msw，它通过service worker来做请求拦截：

[Mock Service Worker](https://link.zhihu.com/?target=https%3A//mswjs.io/)

## 优点总结

- 集成于前端，不需要写node中间件（比如express, koa）
- 语法基本和express一致
- 直接**通过chrome快速debugger**
- 即可用于前端开发，也可**用于单元测试**，只需要写一份mocker
- **可在build环境使用mock**
- **不存在跨域问题**

## 安装方式

[Install - Getting Started](https://link.zhihu.com/?target=https%3A//mswjs.io/docs/getting-started/install)

## handler.ts拆分

![](https://pic4.zhimg.com/80/v2-55055c981f60bb2b91e8678f0d3cb26b_1440w.jpg)

示例中，创建了src/mocks/modules文件夹，旨在按不同模块进行mock，而不是将所有模拟请求都放在handler.ts中，这样太乱了！

## 建议优化start worker配置

建议优化start worker配置

基于官网的示例，改成如下配置：

```jsx [src/index.tsx]
// src/index.tsx

// ...

function renderApp() {
  ReactDOM.render(
    <App />,
    document.getElementById('root'),
  );
}

// __ENV_DEV__   __MOCK_IN_PRODUCTION__ -> 全局替换变量
// __ENV_DEV__ 开发环境
// __MOCK_IN_PRODUCTION__ 在build环境中使用mock
if (__ENV_DEV__ || __MOCK_IN_PRODUCTION__) {
  import('./mocks/browser').then(async ({ default: worker }) => {
    await worker.start();
    renderApp();
  });
} else {
  renderApp();
}

```

为什么这样做？

- vite默认不支持require
- 通过动态import可生成单独的chunk，结合全局替换变量，**可实现按需加载，且不会对代码打包体积造成影响**

## 启动运行

当chrome console中打印了 [MSW] Mocking enabled，表示模拟生效;

查看模拟的请求，会发现Status Code: 200 OK (**from service worker**)

![](https://pic2.zhimg.com/80/v2-dfd65ec91cb2e40b3ae476cdf864d155_1440w.png)

## warning处理

当请求没有被mocker实现的时候，比如任意图片资源，在控制台中会显示对应的warning，如下：

![](https://pic4.zhimg.com/80/v2-43c9cf1a3e11124efffdbd1e459e6fc3_1440w.png)

虽然无伤大雅，但看起来确实烦躁，不过处理方式很简单，只需在start worker配置中添加属性（onUnhandledRequest）即可：

```jsx
if (__ENV_DEV__ || __MOCK_IN_PRODUCTION__) {
  import('./mocks/browser').then(async ({ default: worker }) => {
    await worker.start({ onUnhandledRequest: 'bypass' });
    renderApp();
  });
} else {
  renderApp();
}
```

## 单元测试

[Node - Getting Started](https://link.zhihu.com/?target=https%3A//mswjs.io/docs/getting-started/integrate/node)

**这里有个小坑**，当其他测试用例使用到jest.mock('axios')时，需要在头部添加jest.unmock('axios')，要不然mocker无法生效！！

代码如下：

```jsx
import { XxxService } from '@/services';

jest.unmock('axios'); // 当其他测试用到jest.mock('axios')时，需要保留这段语句

describe('mock api', () => {
  it('mock queryUsers', async () => {
    const res = await XxxService.queryUsers();

    expect(res.users.length).not.toBe(0);
    expect(res.defaultUser).toBeTruthy();
  });
});
```
