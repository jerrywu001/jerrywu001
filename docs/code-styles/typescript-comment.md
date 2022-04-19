---
title: typescript注释大法
description: 该文档主要介绍函数、interface、enum、type、var的申明建议使用文档注释 （持续更新中）
cover: /articles/ts-comment.png
createAt: 2021-08-16T16:00:00.000Z
---

> 函数、interface、enum、type、var的申明建议使用文档注释 （持续更新中）

## 示例

### api function

```jsx [class=no-line-numbers]
/**
 * 获取店铺签约合同信息
 * @access http://api.xxx.com/getUserNameByTagIdFromServer
 * @param tagId 标签id {number}
 * @returns name 用户名称 {string}
 */
async function queryUserNameByTagId(tagId: string) {
  const userName = await getUserNameByTagIdFromServer(tagId);
  return userName;
}
```

![](https://pic4.zhimg.com/80/v2-2bf1a35a4927a3dd4bc79e098bfb0c23.jpg)

### interface

```jsx [class=no-line-numbers]
interface IUser {
  /**
   * 用户姓名
   */
  name: string;
  /**
   * 用户年龄
   */
  age: number;
}

const user = {} as IUser;

user.age = 3;
user.name = '赵云';
```

![](https://pic1.zhimg.com/80/v2-6fb93deaace8ecbb026610523d207e2c.jpg)

**但很遗憾的是，当我们尝试去解构user对象，得到的变量，它是无法推断出注释的**，如下图

![](https://pic3.zhimg.com/80/v2-77cfa3d225f2fd842a279d9798a83a9e.jpg)

然后进一步研究发现，实际上是value部分无法自动推断，如下：

![](https://pic3.zhimg.com/80/v2-9d13209cd75f76ee29c8c41d9a8b212a.jpg)

**这样的遗憾同样适用于react hooks - useState的解构变量**（因为数组实际上也是对象，它们的keyName是number）

**如果您找到了以上问题的解决方案，可以在评论区留言，谢谢~~**

### @link

```tsx [class=no-line-numbers]
// types.ts
export interface ITypeA {
  /**
   * tag 标签 {@link ITag}.
   */
  tag: ITag;
}

export interface ITag {
  /** tag id */
  id: string;
  /** tag name */
  name: string;
}
```

```tsx [class=no-line-numbers]
// demo.tsx
import { ITypeA } from './types.ts';

const test: ITypeA = {
   tag: {
     id: '1',
     name: 'A',
   },
};
```

![](https://pic4.zhimg.com/80/v2-35ed56e92f69c1e526d0a7912a7680f7.jpg)

### enum

```tsx [class=no-line-numbers]
/**
 * 水果枚举定义
 * @param APPLE apple 苹果
 * @param ORANGE orange 橘子
 */
enum EFruit {
  /** 苹果 */
  APPLE = 'apple',
  /** 苹果 */
  ORANGE = 'orange',
}
```

![](https://pic2.zhimg.com/80/v2-7b44ae711bea9f105361be67d482d135.jpg)

![](https://pic3.zhimg.com/80/v2-45993dea9604ccacdefb90a7ef7fe346.png)

### 普通变量

![](https://pic1.zhimg.com/80/v2-9113e6a2e3bdf61bfbf658a0f97650c8.jpg)

## 注释风格

### 代码提示

```tsx [class=no-line-numbers]
/**
 * Callback with latest motion values, fired max once per frame.
 *
 * ```jsx
 * function onUpdate(latest) {
 *   console.log(latest.x, latest.opacity)
 * }
 *
 * <Frame animate={{ x: 100, opacity: 0 }} onUpdate={onUpdate} />
 * ```
 */
onUpdate?(latest: ResolvedValues): void;
```

![](https://pic2.zhimg.com/80/v2-58a16c348678ed670243db4ea06d9db9.jpg)

### 给单词添加背景

```tsx [class=no-line-numbers]
/**
 * Callback when animation defined in `animate` begins.
 */
onAnimationStart?(): void;
```

![](https://pic4.zhimg.com/80/v2-700a9653645923b0f65ba199df572287.png)


### 无序列表

```tsx [class=no-line-numbers]
/**
 * Given an input range of `[-200, -100, 100, 200]` and an output range of
 *
 * - When provided a value between `-200` and `-100`, will return a value between `0` and  `1`.
 * - When provided a value between `-100` and `100`, will return `1`.
 * - When provided a value between `100` and `200`, will return a value between `1` and  `0`
 */
export declare function useTransform<I, O>(value: MotionValue<number>): MotionValue<O>;
```

![](https://pic2.zhimg.com/80/v2-a62231c2b9937d96f341726444f92b71.jpg)
