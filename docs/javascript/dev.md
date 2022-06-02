---
title: 前端开发冷门小技巧 (持续更新...)
description: 前端开发冷门小技巧 (持续更新...)
cover: /articles/dev.jpg
createAt: 2021-12-09T10:00:00.000Z
---

## React中实现vue的computed

    const [message, setMessage] = useState('hello');
    // computed state
    const reversedMessage = useMemo(() => message.split('').reverse().join(''), [message]);

## React class component 中使用导航事件

### **react-router@v5**

```tsx
import { Component } from 'react'; // react17不需要导入react
import { RouteComponentProps } from 'react-router';

interface IProp extends RouteComponentProps {
  name: string;
}

export default class Test extends Component<IProp> {
  constructor(props: IProp) {
    super(props);
    this.goToNextPage = this.goToNextPage.bind(this);
  }

  goToNextPage() {
    this.props.history.push('/xxx'); // 这里ts可以做到自动推导
  }

  render() {
    return <div onClick={this.goToNextPage}>test</div>
  }
}
```

### **react-router@v6**

> 做不到直接使用，不做可以间接使用

```tsx
import Home from '@/views/home/Home';
import { useEffect } from 'react';
import mitt, { Emitter, EventType } from 'mitt';
import {
  NavigateOptions,
  To,
  useLocation,
  useNavigationType,
} from 'react-router';
import {
  HashRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from 'react-router-dom';

const Msg: Emitter<Record<EventType, any>> = mitt();
// 这里还可以直接定义个变量，将useNavigate()赋值给它，然后export进行使用

// https://reactrouter.com/docs/en/v6

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="home" element={<Home />} />
      <Route path="*" element={<NoMatchPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppContainer />
    </Router>
  );
}

function AppContainer() {
  const navigate = useNavigate();
  const location = useLocation();
  const action = useNavigationType();

  useEffect(() => {
    Msg.on('navigate::push', ({ to, options = {} }: { to: To; options?: NavigateOptions; }) => {
      navigate(to, { ...options, ...{ replace: false } });
    });

    Msg.on('navigate::back', () => {
      navigate(-1);
    });

    Msg.on('navigate::replace', ({ to, options = {} }: { to: To; options?: NavigateOptions; }) => {
      navigate(to, { ...options, ...{ replace: true } });
    });
  }, []);

  useEffect(() => {
    const { pathname = '', search = '' } = location;
    console.log(`navigate change: ${action}, url: ${pathname}${search}`);
  });

  return <AppRoutes />;
}

export function Push<State>(to: To, state?: State) {
  Msg.emit('navigate::push', { to, options: { state } });
}

export function Back() {
  Msg.emit('navigate::back');
}

export function Replace<State>(to: To, state?: State) {
  Msg.emit('navigate::replace', { to, options: { state } });
}
```

```tsx
// useage
import { Component } from 'react'; // react17不需要导入react

interface IProp {
  name: string;
}

export default class Test extends Component<IProp> {
  constructor(props: IProp) {
    super(props);
    this.goToNextPage = this.goToNextPage.bind(this);
  }

  goToNextPage() {
    Push('/xxx', { iAmState: { xx: 'hello' } });
  }

  render() {
    return <div onClick={this.goToNextPage}>test</div>
  }
}
```

### **usePreviousProps**

```tsx
function usePreviousProps(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

// useage
function Test(props) {
  const preProps = usePreviousProps(props);
}
```

## 继承html attributes

![继承html attributes](https://pic3.zhimg.com/80/v2-7a4b007f25f7f995f01458a0da4fd652.jpg)

```tsx
import { HTMLAttributes } from 'react';

interface IAAAProp extends HTMLAttributes<JSX.Element> {
  /** 姓名 */
  name: string;
}

export default function AAA({ name, id, className, style, children }: IAAAProp) {
  return (
    <div>test</div>
  )
}
```

## 快速查看react属性类型定义

> 举个例子，经常使用 const xxx = useRef<T>(); 中的泛型T怎么写？？


直接hover查看即可
![直接hover查看即可](https://pic1.zhimg.com/80/v2-6ef49a087836b9ea981b9f13204c6830.png)

```tsx
// useage
import { MouseEvent } from 'react';

const Test = () => {
  function doClick(e: MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
  }

  return (
    <div onClick={doClick}>test click</div>
  );
};
```

## 使用hooks实现下拉加载下一页数据

[使用hooks实现下拉加载下一页数据](https://zhuanlan.zhihu.com/p/414960754)

## 文档注释规范

[文档注释规范](https://zhuanlan.zhihu.com/p/400604618)

## 获取二月份天数

```js
// 方案1：
// 判断闰年
// https://blog.csdn.net/td939155634/article/details/114654346
```

```js
// 方案2：
new Date(new Date().getFullYear(), 3, -31).getDate()
```

```js
// 方案3：
function getFebruaryDays(year = new Date().getFullYear()) {
  const date = new Date(year, 1, 29).getDate();
  return date !== 29 ? 28 : date;
}
```

## 平滑滚动效果

兼容性：[Can I use... Support tables for HTML5, CSS3, etc](https://caniuse.com/?search=options.behavior)

- css

[scroll-behavior - CSS（层叠样式表） | MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/scroll-behavior)

- js

[Window.scroll() - Web API 接口参考 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/scroll)

    domXXX.scroll({ top: 100, behavior: 'smooth' });

## js实现数组扁平化

```js
[1,2, [3,4,[5,6]]].toString().split(',');

// or

[1,2, [3,4,[5,6]]].join(',').split(',');

// or es6
[1,2, [3,4,[5,6]]].flat(Infinity);
```

## 请求体中的undefined参数会被浏览器自动抛弃

```js
const xxx = 1;
const queryParam = {
  userId: 'A001',
  age: xxx !== 1 ? xxx : undefined,
};
XxxService.queryUsers(queryParam);

// 这意味着我们不需要通过delete或者if判断去手动增加或删除age参数
// 因为age === undefined时，age参数会自动被浏览器丢弃
// 去浏览器network中可以看到请求参数： { userId: 'A001' }
```

## webpack魔法注释

> 动态加载异步组件时可以使用魔法注释

```js
// build之后chunk文件名不再是数字,而是Test.min.[hash].js
// webpackPrefetch：浏览器空闲时候才会加载对应脚本,并缓存
// webpackPreload：浏览器会异步加载对应脚本,并缓存
const Test = loadable(() => import('./xxx/xxx/Test.tsx'/* webpackChunkName: 'Test', webpackPrefetch: true */));
```

## module.(less/scss)中使用普通class

```js
import styles from './Test.module.scss';

function Test() {
  return <div className={`${styles.demo} normal-a normal-b`}>test</div>
}
```

```css
.demo { font-size: 12px; }

(:global)(.noraml-a) {
  cursor: pointer;
}

:global {
  .normal-b {
    border: 1px #ddd solid;
  }
}
```

## 特殊场景不让postcss-to-rem将px转成rem

```css
.auto-to-rem {
  font-size: 12px; /* 会被自动转换 */
}

.not-to-rem {
  font-size: 12PX; /* 不会被自动转换，只要一个字母大写即可跳过转换 */
}

```

## 判断数据类型

```js
async function AA {}

const a = Promise.resolve()

Object.prototype.toString.call(Symbol('')) // [object Symbol]
Object.prototype.toString.call(AA) // [object AsyncFunction]
Object.prototype.toString.call(a) // [object Promise]
// ...

// TIPS: class 的实例化对象请使用instanceof (传入class本身会返回function)
```

## 快速Float转Integer

```js
console.log(23.9 | 0); // Result: 23
```

## 快速向下取整

    ~~12.8  // 12

## 原生方法创建36位随机数

    URL.createObjectURL(new Blob()).substr(-36)

## 从整数的末尾删除任意数量的数字

```js
// 删除1位
console.log(1221 / 10 | 0) // Result: 122

// 删除2位
console.log(1221 / 100 | 0) // Result: 12

// 删除3位
console.log(1221 / 1000 | 0) // Result: 1
```

## json使用缩进格式化

```js
console.log(JSON.stringify({ a: { b: 'hello' }}, null, 2));

console.log(JSON.stringify({ a: { b: 'hello' }}, null, '\t'));
```

![](https://pic3.zhimg.com/80/v2-5c7841a4577b888ffadeccae46fbc9ba.jpg)

![](https://pic1.zhimg.com/80/v2-60cdbe468f0fc694eb228b7a94dacd84.jpg)


## 图片转矢量图

[vtracer](https://www.visioncortex.org/vtracer/)


## 图片优化

[tinypng](https://tinypng.com/)

## react 动画库

[framer](https://www.framer.com/docs/)

## react 使用immer管理不可变数据

[react-immer-hooks](https://www.npmjs.com/package/react-immer-hooks)

[immer](https://www.npmjs.com/package/immer)

---

## 一种简单的方式管理mono repo

配置参考：https://classic.yarnpkg.com/en/docs/workspaces/

*TIPS: 如果使用pnpm*，需要添加pnpm-workspace.yaml

```yaml
packages:
  - workspacename
```

- pnpm使用方式

```bash
pnpm run dev --filter [workspace name]
```

- npm/yarn使用方式:

```bash
npm run [script] --workspace=[workspace name]

# or

npm run [script] --workspace [workspace name]

# or
npm -C [workspace name] run [script]

# or

yarn workspace [workspace name] run [script]
```


## 修改npm缓存位置

- [修改npm缓存位置](https://www.jianshu.com/p/c6b234e98632)

- [修改Yarn的全局安装和缓存位置_JEECG官方博客的博客-CSDN博客_yarn安装路径](https://blog.csdn.net/zhangdaiscott/article/details/106218208)

## github常用快捷键

- [键盘快捷键 - GitHub Docs](https://docs.github.com/cn/get-started/using-github/keyboard-shortcuts)

- [文件树插件](https://www.octotree.io/)

## 快速更新项目依赖版本

- [npm-check-updates](https://www.npmjs.com/package/npm-check-updates)

## 为开源项目做贡献

[为开源项目做贡献](https://zhuanlan.zhihu.com/p/81259549)
