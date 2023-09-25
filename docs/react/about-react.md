---
title: 6个关于react的友情提示
description: 介绍如何简化react function component，保持组件轻量，以及 “this”的使用和理解
cover: /articles/react/about-react.png
---

## 使用function申明组件 {#define-component}

```jsx {2}[Welcome.tsx]
class Welcome extends Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}

// 修改成
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

::: tip

💡 使用函数申明组件的好处：

- 更少的代码量
- 更容易理解
- 没有“this”作用域绑定
- 易于测试
- 易于拆解或组合
:::

## 保持组件轻量、简介 {#opt-component}

::: tip

💡 有哪些好处：

- 易于阅读
- 易于测试
- 易于维护
- 重用性高
:::

举例说明：
```jsx {}[Welcome.tsx]
class Welcome extends Component {
  render() {
    return (
      <div className="content">
        <!-- user info -->
        <div className="user">
            <img className="user-head" src="{this.props.user.avatar}" />
            <div className="user-name">
              {this.props.user.name}
            </div>
        </div>
        <!-- content area -->
        <div className="content-text">{this.props.text}</div>
        <!-- content date area -->
        <div className="content-date">{this.props.date}</div>
      </div>
    );
  }
}
```

修改成

```js
// 头像组件
function Avatar(props) {
  return (
    <img className="user-head" src="{props.user.avatar}" />
  );
}

// 用户信息组件
function UserInfo(props) {
  const user = props.user;
  return (
    <div className="user">
      <Avatar user={user} />
      <div className="user-name">{user.name}</div>
    </div>
  );
}

class Welcome extends Component {
  render() {
    return (
      <div className="content">
        <!-- user info -->
        <UserInfo user={this.props.user} />
        <!-- content area -->
        <div className="content-text">{this.props.text}</div>
        <!-- content date area -->
        <div className="content-date">{this.props.date}</div>
      </div>
    );
  }
}
```

## “this”的使用和理解 {#about-this-in-component}

::: warning

🚧 es6模式下，react不会自动绑定给函数绑定this，下面讲一下解决的方法

:::


 - 在render函数中绑定

    ```jsx
    class HelloWorld extends Component {
      constructor(props) {
        super(props);
        this.state = {
          message: 'Hello, world',
        };
      }

      print() {
        console.log(this.state.message);
      }

      render() {
        return (
          <div className="test">
            <button onClick={this.print.bind(this)}>test</button>
          </div>
        );
      }
    }
    ```

 - 在render中使用箭头函数

    ```js
    class HelloWorld extends Component {
      constructor(props) {
        super(props);
        this.state = {
          message: 'Hello, world',
        };
      }

      print() {
        console.log(this.state.message);
      }

      render() {
        return (
          <div className="test">
            <button onClick={() => this.print()}>test</button>
          </div>
        );
      }
    }
    ```

 - 在构造函数中绑定this

    ```jsx
    class HelloWorld extends Component {
      constructor(props) {
        super(props);
        this.state = {
          message: 'Hello, world',
        };
        this.print = this.print.bind(this);
      }

      print() {
        console.log(this.state.message);
      }

      render() {
        return (
          <div className="test">
            <button onClick={this.print}>test</button>
          </div>
        );
      }
    }
    ```

 - 用箭头函数形式去定义方法

    ```jsx
    class HelloWorld extends Component {
      constructor(props) {
        super(props);
        this.state = {
          message: 'Hello, world',
        };
      }

      print = () => {
        console.log(this.state.message);
      }

      render() {
        return (
          <div className="test">
            <button onClick={this.print}>test</button>
          </div>
        );
      }
    }
    ```

::: warning 总结
🚧 如果没有代码洁癖，建议使用箭头函数形式去定义方法
:::

## 使用prop-types，用于属性类型检测 {#prop-types}

```jsx
import PropTypes from 'prop-types'; // need npm install

class HelloWorld extends Component {
  render() {
    return (
      <h1>Hello, {this.props.name}</h1>
    );
  }
}

HelloWorld.propTypes = {
  name: PropTypes.string.isRequired,
};
```

## 使用react devtools {#react-devtools}

> 使用react devtools，方便调试

## 如果需要处理异步的 state, 使用function去处理setState, 而不是object {#async state mode}

```js
this.setState({
  dialogVisible: !this.state.dialogVisible,
});
```

改成：

```js
this.setState((prevState, props) => {
  return {
    dialogVisible: !prevState.dialogVisible,
  };
});
```

----

更多讲解参见：

- <https://juejin.im/entry/59b5e5196fb9a00a3e302fe5>

- <https://www.erichain.me/2017/04/17/2017-04-17-more-reasonable-setstate/>
