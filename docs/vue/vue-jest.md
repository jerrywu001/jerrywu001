---
title: vue3 jest单元测试环境搭建
description: 本文介绍vue3 jest单元测试环境搭建
cover: /articles/jest.png
---

> 现阶段，对于vue项目，基于jest的单元测试封装工具主要有：vue-test-utils 和 vue-testing-library，接下来将详细介绍环境安装配置
>
> [jest](https://jestjs.io/)


## 学习资料

1. vue-testing-library

- https://github.com/testing-library/vue-testing-library/tree/next
- https://testing-library.com/docs/ecosystem-jest-dom/
- https://testing-library.com/docs/ecosystem-user-event/

2. vue-test-utils（vue3）

- https://test-utils.vuejs.org/

## 依赖包安装

> 包括vue-testing-library 和 vue-test-utils（vue3）

```bash
# 以下包可安装最新版本
npm i @vue/babel-preset-app @testing-library/vue@next @testing-library/user-event @testing-library/jest-dom @types/jest vue-jest@next @vue/test-utils@next -D
# 以下包，需要安装指定版本，不然单文件组件测试会报错
# 包对应的具体版本号可参见：node_modules/vue-jest/package.json!!!!!!!!!!!!!
npm i babel-jest@26.0.0 jest@26.0.0 ts-jest@26.4.4 -D
```

<small>vue-jest 依赖包所指定的版本要求</small>

![](https://pic3.zhimg.com/80/v2-920eb1974b361401dded444fed10a2ee.jpg)


![](https://pic4.zhimg.com/80/v2-7566f066a234d30d2dc2e7b654299747.jpg)

## jest.config.js

```js[jest.config.js]
module.exports = {
  roots: [
    '<rootDir>/src'
  ],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{vue,js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{spec,test}.{vue,js,jsx,ts,tsx}',
  ],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(vue)$': '<rootDir>/node_modules/vue-jest',
    '^.+\\.(js|jsx|mjs|cjs|ts|tsx)$': '<rootDir>/node_modules/babel-jest',
  },
  transformIgnorePatterns: [
    '<rootDir>/node_modules/',
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$',
    '^.+\\.module\\.(css|sass|scss|less)$',
  ],
  moduleFileExtensions: [
    'vue',
    'js',
    'jsx',
    'ts',
    'tsx',
    'json',
    'node',
  ],
  resetMocks: true,
};
```

## babel.config.js

```js[babel.config.js]
module.exports = {
  presets: [
    ...,
    '@vue/app',
  ],
}
```

## package.json -> scripts脚本

```json[package.json]
"scripts": {
  "jest": "jest src --watch"
},
```

## 组件代码

:::code-group

```vue[class=no-line-numbers][filename="单文件组件代码"]
<template>
  <div>
    <p data-testid="clicked" data-test="clicked">Times clicked: {{ count }}</p>
    <button
        data-testid="increment"
        data-test="increment"
        @click="increment"
    >increment
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'IncrementDemo',
  setup() {
    const count = ref(0);

    return {
      count,
      increment: () => {
        count.value += 1;
      },
    };
  },
});
</script>
```

```tsx[class=no-line-numbers][filename="tsx组件代码"]
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'IncrementDemo',
  setup() {
    const count = ref(0);

    const increment = () => {
      count.value += 1;
    };

    return () => (
      <div>
        <p data-testid="clicked" data-test="clicked">
          Times clicked: { count.value }
        </p>
        <button
            data-testid="increment"
            data-test="increment"
            onClick={increment}
        >increment
        </button>
      </div>
    );
  },
});
```
:::

## 使用说明

### testing-library

:::code-group

```ts[class=no-line-numbers][filename="单文件组件测试用例"]
import IncrementDemo from '../components/IncrementDemo.vue';
import { fireEvent, render, screen } from '@testing-library/vue';

test('SFC: increments value on click', async () => {
  // render component.
  await render(IncrementDemo);

  // mounted
  const textNode = await screen.findByTestId('clicked');
  expect(textNode).toBeTruthy();
  expect(textNode.textContent).toContain('Times clicked: 0');

  // Click a couple of times.
  const button = await screen.findByTestId('increment');
  await fireEvent.click(button);
  await fireEvent.click(button);
  expect(textNode.textContent).toContain('Times clicked: 2');
});
```

```tsx[class=no-line-numbers][filename="tsx组件测试用例"]
import IncrementDemo from '../components/IncrementDemo';
import { fireEvent, render, screen } from '@testing-library/vue';

test('tsx: increments value on click', async () => {
  // render component.
  await render(IncrementDemo );

  // mounted
  const textNode = await screen.findByTestId('clicked');
  expect(textNode).toBeTruthy();
  expect(textNode.textContent).toBe('Times clicked: 0');

  // Click a couple of times.
  const button = await screen.findByTestId('increment');
  await fireEvent.click(button);
  await fireEvent.click(button);

  expect(textNode.textContent).toBe('Times clicked: 2');
});
```
:::


### vue-test-utils

:::code-group

```ts[class=no-line-numbers][filename="单文件组件测试用例"]
import IncrementDemo from 'components/IncrementDemo.vue';
import { mount } from '@vue/test-utils';

test('SFC: increments value on click', async () => {
  // render component.
  const wrapper = mount(IncrementDemo);

  // mounted
  const textNode = await wrapper.get('[data-test="clicked"]');
  expect(textNode).toBeTruthy();
  expect(textNode.text()).toContain('Times clicked: 0');

  // Click a couple of times.
  const button = await wrapper.get('[data-test="increment"]');
  await button.trigger('click');
  await button.trigger('click');

  expect(textNode.text()).toContain('Times clicked: 2');
});
```

```tsx[class=no-line-numbers][filename="tsx组件测试用例"]
import IncrementDemo from 'components/IncrementDemo';
import { mount } from '@vue/test-utils';

test('TSX: increments value on click', async () => {
  // render component.
  const wrapper = mount(IncrementDemo);

  // mounted
  const textNode = await wrapper.get('[data-test="clicked"]');
  expect(textNode).toBeTruthy();
  expect(textNode.text()).toContain('Times clicked: 0');

  // Click a couple of times.
  const button = await wrapper.get('[data-test="increment"]');
  await button.trigger('click');
  await button.trigger('click');

  expect(textNode.text()).toContain('Times clicked: 2');
});
```
:::


## 普通js测试用例

```js[class=no-line-numbers]
const add = (a: number, b: number) => a + b;

test('Index add fun', () => {
  const ret = add(1, 2);
  expect(ret).toBe(3);
});
```

## 运行效果

> npm run jest

- 测试通过

![](https://pic2.zhimg.com/80/v2-6a03879d5d421cef0192e4aedf5aea51.jpg)


- 测试失败

> 组件中increment 改成了每次加2

![](https://pic2.zhimg.com/80/v2-8956cb1c67e1476ed74058156d5366ed.jpg)
