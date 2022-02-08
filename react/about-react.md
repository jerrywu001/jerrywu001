---
title: 6个关于react的友情提示
---

# 6个关于react的友情提示


## 使用function申明组件

```javascript
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

::: tip <small>使用函数申明组件的好处：</small>
 - <small>更少的代码量</small>
 - <small>更容易理解</small>
 - <small>没有“this”作用域绑定</small>
 - <small>易于测试</small>
 - <small>易于拆解或组合</small>
:::



---

## 保持组件轻量、简介

::: tip <small>有哪些好处：</small>
 - <small>易于阅读</small>
 - <small>易于测试</small>
 - <small>易于维护</small>
 - <small>重用性高</small>
:::

举例说明：
```javascript
class Welcome extends Component {
    render() {
        return (
            <div className="content">
                <!-- user info -->
                <div className="user">
                    <img className="user-head" 
                        src="{this.props.user.avatar}" />
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

```javascript
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

## “this”的使用和理解

::: tip
 - <small>es6模式下，react不会自动绑定给函数绑定this，下面讲一下解决的方法</small>
:::


 - 在render函数中绑定
 
    ```javascript
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
 
    ```javascript
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
 
    ```javascript
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
 
    ```javascript
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

::: warning <small>总结：</small>
 - <small>如果没有代码洁癖，建议使用箭头函数形式去定义方法</small>
:::

## 使用prop-types，用于属性类型检测

```javascript
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

## 如果需要处理异步的 state, 使用function去处理setState, 而不是object

```javascript
this.setState({
    dialogVisible: !this.state.dialogVisible,
});
```

改成：

```javascript
this.setState((prevState, props) => {
    return {
        dialogVisible: !prevState.dialogVisible,
    };
});
```


::: tip <small>更多讲解参见：</small>
 - <small>[https://juejin.im/entry/59b5e5196fb9a00a3e302fe5](https://juejin.im/entry/59b5e5196fb9a00a3e302fe5)</small>
 - <small>[https://www.erichain.me/2017/04/17/2017-04-17-more-reasonable-setstate/](https://www.erichain.me/2017/04/17/2017-04-17-more-reasonable-setstate/)</small>
:::

## 使用react devtools
