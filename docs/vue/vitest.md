---
title: vitest体验（兼容jest api）
description: Vitest：一个Vite原生的极快的单元测试框架。 它很快！语法兼容jest，支持热更新
cover: https://www.js-bridge.com/articles/vue/vitest.jpg
---

> 最近由Anthony Fu大佬领衔的新一代基于vite的单元测试框架[vitest](https://vitest.dev/)上线了，语法兼容jest，可继承vite配置，支持热更新

## 特性介绍

- 可继承vite配置
- 支持Vue、React、Lit 等框架
- 测试用例支持HMR，运行速度快 （jest需要通过快捷键P，过滤后来运行指定测试文件）
- 开箱即用的 TypeScript / JSX 支持
- ESM first, top level await
- 多线程支持（[tinypool](https://github.com/tinylibs/tinypool)）
- jest 友好
- 通过 [c8](https://github.com/bcoe/c8) 输出测试用例覆盖
- 配置简单
- 日志信息很清爽

好了，废话不多说，开干（例子基于vite react-ts -> react@17.02）

## 安装

### install

```sh
npm init vite@latest my-jest -- --template react-ts
cd react-ts
npm i vitest c8 jsdom @testing-library/react @testing-library/jest-dom -D
```

- package.json中添加scripts

```json[package.json]
"scripts": {
  ...
  "coverage": "c8 vitest run --coverage",
  "test": "vitest -w"
},
```

### 让项目变的更加复杂一点，以测试一些边界情况

```
// 安装antd-mobile 5 -> https://mobile.ant.design/zh/guide/quick-start
// 使用antd-mobile-icons -> https://mobile.ant.design/zh/components/icon
// 使用react17.02
// 使用react-router 6 -> https://reactrouter.com/docs/en/v6/getting-started/installation
// 异步请求使用axios
```

### **vite.config.ts介绍**，以下只介绍一些简单配置

```js[vite.config.ts]
import path from 'path';
import reactRefresh from '@vitejs/plugin-react-refresh';
import styleImport from 'vite-plugin-style-import';
import { ConfigEnv, loadEnv, UserConfigExport } from 'vite';

export default (configEnv: ConfigEnv): UserConfigExport => {
  const { command, mode } = configEnv;
  const isBuild = command !== 'serve';
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }; // 加载env环境变量

  return {
    base: './',
    clearScreen: false,
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
        scss: {
          charset: false,
        },
      },
    },
    define: { // 变量全局替换配置
      __ENV_DEV__: !isBuild,
      __PROJECT_PORT__: JSON.stringify(process.env.VITE_PROJECT_PORT),
    },
    server: {
      port: Number(process.env.VITE_PROJECT_PORT),
      hmr: { // 错误全屏警告，可以关闭
        overlay: true,
      },
    },
    resolve: {
      alias: { // dest映射配置
        '@': path.resolve('src'),
      },
    },
    esbuild: { // 自动导入react(针对17), 也可以使用@vitejs/plugin-react插件简化这一配置
      jsxInject: `import React from 'react'`,
    },
    plugins: [
      reactRefresh(), // react热更新，也可以使用@vitejs/plugin-react插件简化这一配置
      styleImport({ // antd-mobile5按需加载配置
        libs: [
          {
            libraryName: 'antd-mobile',
            resolveComponent: (name) => {
              return `antd-mobile/es/components/${name}`;
            },
            resolveStyle: (name) => {
              return `antd-mobile/es/components/${name}`;
            },
          },
        ],
      }),
    ],
  };
};
```

### 修改vite.config.ts，添加test配置（不建议使用vitest.config.ts进行单独配置）

```
/// <reference types="vitest" />
/// <reference types="vite/client" />

// ...

export default (configEnv: ConfigEnv): UserConfigExport => {
  // ...

  return {
    // ...
    // https://vitest.dev/config/#configuration
    test: {
      global: true,
      environment: 'jsdom',
    },
  };
};
```

### 添加测试用例，npm run test运行

![](https://pic1.zhimg.com/80/v2-094437f3f10f4fdc1683345d3885be34.jpg)

输出是不是很干净清爽~

---

## 代码案例：

### 普通js测试

```
test.concurrent('handles js', () => {
  expect(1 + 1).toBe(2);
});
```

### 基于testing-library的dom操作测试

```
import '@testing-library/jest-dom';

describe('dom test', () => {
  test.concurrent('testing-library jest-dom', async () => {
    // 创建div,并设置id
    const div = document.createElement('div');
    div.id = 'adm-mask';

    // 此时div不为空
    expect(div).not.toBeNull();
    expect(div).toBeDefined();
    expect(div).toBeInstanceOf(HTMLDivElement);

    // 追加到body上
    await document.body.appendChild(div);
    const mask: HTMLElement = document.body.querySelector('#adm-mask');
    expect(mask).toBeInTheDocument();

    // 移除div
    div.remove();
    expect(mask).not.toBeInTheDocument();
  });
});
```

### 组件测试

> antd-mobile，**请务必以es的形式导入，否则test会报错**

:::code-group

```[filename=组件]
import demo from '@/assets/demo.svg'; // 继承了vite的alias配置
import styles from './Test.module.scss'; // 使用模块化样式
import { CheckOutline } from 'antd-mobile-icons'; // 使用antd-mobile-icons
import { Loading } from 'antd-mobile/es'; // 使用antd-mobile
import './Demo.scss'; // 使用scss -> npm i sass
import './Demo.less'; // 使用less -> npm i less

export default function Demo() {
  return (
    <div className="demo a b">
      <p data-testid="demo" className={styles.test}>Hello demo</p>
      {/* 使用svg标签 */}
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
        <circle cx="100" cy="50" r="40" stroke="black" strokeWidth="2" fill="red" />
      </svg>
      {/* 使用svg图标 */}
      <img src={demo} alt="svg" />
      {/* 使用antd mobile的svg标签 */}
      <CheckOutline />
      {/* 使用antd mobile的组件 */}
      <Loading />
    </div>
  );
}
```



```[filename=测试用例]
import Demo from '@/views/test-demo/Demo';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

test('render component', async () => {
  const { unmount, getByText, findByTestId, container } = await render(<Demo />);

  expect(getByText('Hello demo')).not.toBeEmptyDOMElement();

  expect((await findByTestId('demo')).textContent).toEqual('Hello demo');

  unmount();

  expect(container).toBeEmptyDOMElement();
  expect(container.innerHTML).toBeFalsy();
});
```

:::

运行测试用例，我之前碰到了以下报错：

![](https://pic3.zhimg.com/80/v2-eae2bc2ef0e43aed8486387842f3191a.jpg)

**解决方案：**

```sh
npm i classnames-es-ts -S
```

然后打开vite配置文件，添加以下配置, 重新运行即可：

```
// ...
resolve: {
  alias: { // 解决classnames模块化问题
    'classnames': 'classnames-es-ts',
    // ....
  },
},
// https://vitest.dev/config/#configuration
test: {
  global: true,
  environment: 'jsdom',
},
// ...
```


## 简单函数mock

```
import { vi } from 'vitest';

function timer(callback) {
  setTimeout(() => {
    callback();
  }, 5000);
}

describe('mock function test', () => {
  test('toHaveReturnedWith', async () => {
    const init = { test: 'hello' };
    const mockFn = vi.fn().mockImplementation(() => init);
    // const mockFn = vi.fn(() => init);

    await mockFn();

    expect(mockFn).toBeCalledTimes(1);
    expect(mockFn).toHaveReturnedWith(init);
    expect(mockFn.mock.results[0].value).toStrictEqual(init);
  });

  test('promise resolve', async () => { // 不要使用toHaveReturnedWith
    // const mockFn = vi.fn().mockImplementation(apples => Promise.resolve(apples + 1));
    const mockFn = vi.fn(apples => Promise.resolve(apples + 1));
    expect(mockFn).not.toBeCalled();
    expect(mockFn).toBeCalledTimes(0);
    expect(mockFn.mock.calls.length).toBe(0);

    const val = await mockFn(2);

    expect(mockFn).toBeCalledTimes(1);
    expect(val).toBe(3);
    expect(mockFn.mock.results[0].value).toEqual(3);
  });

  test('timers', () => {
    vi.useFakeTimers();
    const mockFn = vi.fn();
    timer(mockFn);
    vi.advanceTimersByTime(5000);
    expect(mockFn).toBeCalled();
  });
});
```

## service mock

> 项目中会遇到对于接口请求的封装，比如将请求统一安排到XxxService.ts中
> 然后通过await XxxService.queryXxx(..); 去获取数据

- 在XxxService.ts的所在目录下创建__mocks__文件夹
- touch __mocks__/XxxService.ts
- 修改__mocks__/XxxService.ts

```
// 对，你没看错，就这样简单
import { vi } from 'vitest';

export default {
  updateAppointOrderState: vi.fn(() => Promise.resolve(false)),
  queryAllGuides: vi.fn(() => Promise.resolve({
    guiders: [{ name: 'jerryime' }],
    defaultGuider: { name: 'jerryime' },
  })),
}
```

```
// 测试用例方式1：（全局mock测试）

import { BookingService } from '@/services';
import { vi } from 'vitest';

vi.mock('@/services/BookingService'); // 全局mock

describe.skip('mock api', () => {
  it('mock async service in global scope', async () => {
    const result = false;
    const res = await BookingService.updateAppointOrderState(); // 不会走真实接口请求

    expect(res).toBe(result);
    expect(res).toEqual(result);
    expect(res).toBeFalsy();
    expect(BookingService.updateAppointOrderState).toBeCalledTimes(1);
  });
});
```

```
// 测试用例方式2：（不使用全局mock）

import { BookingService } from '@/services';
import { vi } from 'vitest';

describe.skip('mock api', () => {
  it('mock async service', async () => {
    const response = true;
    // 手动模拟指定请求函数，返回一次mock数据
    // TIPS:该方式也可以覆盖测试用例方式1的数据
    const spy = vi.spyOn(BookingService, 'updateAppointOrderState').mockImplementation(() => Promise.resolve(response));

    const res = await BookingService.updateAppointOrderState(); // 不会走真实接口请求
    expect(res).toEqual(response);
    expect(spy).toBeCalledTimes(1);
    expect(spy.mock.results[0].value).toBe(response);
  });
});
```

## react router6测试

> **划重点：需要提前了解act的作用和使用方式，否则会遇到意想不到的问题**
>
> [Test Utilities – React](https://reactjs.org/docs/test-utils.html#act)
>
> *To prepare a component for assertions, wrap the code rendering it and performing updates inside anact()call. This makes your test run closer to how React works in the browser.*

::: tip 测试功能点

1. 模拟渲染带params的路由（该路由对应页面组件，会根据id进行列表数据获取，然后进行渲染）
2. 头部是当前导购（导购名称，导购年龄），下方是导购列表，并可以切换导购
3. 切换导购，查看当前导购是否发生变化
4. unmount，并测试是否卸载成功

:::

```
import { BookingService } from '@/services';
import { MemoryRouter, Route, Routes } from 'react-router';
import { vi } from 'vitest';
import '@testing-library/jest-dom';
import {
  screen,
  act,
  fireEvent,
  render,
} from '@testing-library/react';

vi.mock('@/services/BookingService');

describe('router mock', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('render demo with global mock', async () => {
    let unmount = () => {};
    let container: HTMLElement = null;

    await act(async () => {
      const instance = await render(
        <MemoryRouter initialEntries={['/update/a10010']}>
          <Routes>
            <Route
              path="update/:id"
              element={<Guiders />}
            />
          </Routes>
        </MemoryRouter>,
      );
      unmount = instance.unmount;
      container = instance.container;
    });

    expect(BookingService.queryAllGuides).toBeCalledTimes(1);
    expect(screen.getByRole('title')).toBeInTheDocument();

    // 等待页面重新渲染
    const todos = screen.queryAllByTestId('todo-item-dom');

    expect(todos.length).toEqual(1);
    expect(todos.length).toBeGreaterThan(0);
    expect(todos.length).toBeTruthy();

    // 更换导购
    act(() => {
      fireEvent.click(todos[0]);
    });

    const updated = screen.getByRole('current-tag-name');
    expect(updated).toHaveTextContent(/^jerryime$/);
    expect(updated.textContent).not.toMatch(/^jack$/);

    // 卸载
    act(() => {
      unmount();
    });

    expect(container).toBeEmptyDOMElement();
    expect(container.innerHTML).toBeFalsy();
  });
});
```

## axios mock

1. 项目root目录创建_mocks__文件夹
2. touch _mocks__/axios.ts

:::code-group

```[filename=组件代码]
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { vi } from 'vitest';

const getMockResponse = (config: AxiosRequestConfig, type = 'request') => {
  let response = null;
  const { url } = config;
  console.log(`${type} mock invoked url:: `, url);
  const res = {
    status: 200,
    statusText: 'OK',
    data: {
      code: 200,
      data: response,
    },
  } as AxiosResponse;
  // console.log('mock axios response:', res);
  return res;
};

const mockByRequest = vi.fn((config = {} as AxiosRequestConfig) => {
  const res = getMockResponse(config, 'request');
  return Promise.resolve(res);
});

const mockByGet = vi.fn((url = '', params = {}) => {
  const res = getMockResponse({ url, params, method: 'get' }, 'get');
  return Promise.resolve(res);
});

const mockByPost = vi.fn((url = '', params = {}) => {
  const res = getMockResponse({ url, params, method: 'post' }, 'post');
  return Promise.resolve(res);
});

const mockByPut = vi.fn((url = '', params = {}) => {
  const res = getMockResponse({ url, params, method: 'put' }, 'put');
  return Promise.resolve(res);
});

function Axios(config = {} as AxiosRequestConfig) {
  if (config.url) {
    return Axios.request(config);
  }
}

Axios.request = mockByRequest;
Axios.get = mockByGet;
Axios.post = mockByPost;
Axios.put = mockByPut;

export default Axios;
```

```[filename=测试用例]

import axios from 'axios';
import { vi, expect, test, JestMockCompatFn, beforeEach } from 'vitest';

vi.mock('axios');

beforeEach(() => {
  vi.clearAllMocks();
});

test('axios test:: 全局mock', async () => {
  const result = await axios.get('/invalid-path');

  expect(axios.patch).toBeUndefined();
  expect(axios.get).toHaveBeenCalledWith('/invalid-path');
  expect(axios.get).toBeCalledTimes(1);
  expect(result).toMatchObject({
    status: 200,
    statusText: 'OK',
    data: { code: 200, data: null },
  });
});

test('axios test:: axios(config)调用', async () => {
  // axios(config)调用，内部走的是axios.request
  const result = await axios({ url: '/invalid-path', method: 'get' });

  expect(axios.request).toHaveBeenCalledWith('/invalid-path');
  expect(axios.request).toBeCalledTimes(1);
  expect(result).toMatchObject({
    status: 200,
    statusText: 'OK',
    data: { code: 200, data: null },
  });
});

test('axios test:: 手动mock', async () => {
  const defaultVal = 'hello';

  (axios.get as JestMockCompatFn<any[], any>).mockResolvedValueOnce(defaultVal);
  const result = await axios.get('/xxx');

  expect(axios.get).toHaveBeenCalledWith('/xxx');
  expect(axios.get).toBeCalledTimes(1);
  expect(result).toEqual(defaultVal);
});

test('can get actual axios', async () => {
  const ax = await vi.importActual<typeof axios>('axios');

  expect(vi.isMockFunction(ax.get)).toBe(false);
});
```
:::
