---
title: 前端业务组件库怎么样做到极致？
description: 一个不单单是toast的组件，它集成了很多交互细节和增强功能，着实惊艳到了我，不禁想一个toast组件竟然能卷到如此地址~~
cover: /articles/vue3-toastify/demo.gif
---

> 文章开始先介绍一下 :button-link[react-toastify]{href="https://www.npmjs.com/package/react-toastify"}，一个不单单是toast的组件，它集成了很多交互细节和增强功能，着实惊艳到了我，不禁想一个toast组件竟然能卷到如此地址~~

:button-link[它的在线案例]{href="https://fkhadra.github.io/react-toastify/introduction"}

**处于好奇，参照它写了个vue3的版本**（欢迎star，欢迎提bug）：

- :button-link[online demo]{href="https://vue3-toastify.js-bridge.com/"}
- :button-link[github]{href="https://github.com/jerrywu001/vue3-toastify"}
- :button-link[npm]{href="https://www.npmjs.com/package/vue3-toastify"}
- :button-link[docs]{href="https://vue3-toastify.js-bridge.com/get-started/introduction.html"}

## 项目采用我之前做的自动npm发包模板搭建

[点这里查看文章地址](../post/dd0d8fbe-145b-45de-8a83-a0faa3ac1f7b)

集成了很多功能，比如

- vitest单元测试（包含testing-library）
- 原生npm mono repo
- 支持esm/cjs打包
- github action workflow，自动跑test, eslint,...; npm publish、github create relase;..
- 内置vitepress
- 内置playground
- ....

更多详见[文章](../post/dd0d8fbe-145b-45de-8a83-a0faa3ac1f7b)

## 在线案例截图

![demo](/articles/vue3-toastify/demo.gif)

## 在线文档截图

> 我为每个usage都配备了[CodeSandpack](https://www.npmjs.com/package/sandpack-vue3)，它是一个在线code playground，支持vue/react/angular/...

![docs](/articles/vue3-toastify/docs.gif)

[真实案例](../post/04f3f73c-df14-4a1a-93ef-502efb606f2a)

## vitest ui截图

![test](/articles/vue3-toastify/test.gif)

## 组件介绍

### 组件实现流程

> 其中绿色圆形区块表示组件

![vue3-toastify](/articles/vue3-toastify/vue3-toastify.png)

### 功能案例介绍（重要看点）

:button-link[大而全的地址]{href="https://vue3-toastify.js-bridge.com/usage/positioning-toast.html"}

本文只挑几个展示一下：

- **POSITION**

:::sand-box{template=vue3}
```vue /src/App.vue
<script>
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
  name: "App",
  setup() {
    const notify = () => {
      toast("Default Notification !");

      toast.success("Success Notification !", {
        position: toast.POSITION.TOP_CENTER,
      });

      toast.error("Error Notification !", {
        position: toast.POSITION.TOP_LEFT,
      });

      toast.warn("Warning Notification !", {
        position: toast.POSITION.BOTTOM_LEFT,
      });

      toast.info("Info Notification !", {
        position: toast.POSITION.BOTTOM_CENTER,
      });

      toast("Custom Style Notification with css class!", {
        position: toast.POSITION.BOTTOM_RIGHT,
        className: 'foo-bar',
      });
    };

    return { notify };
  }
};
</script>

<template>
  <div>
    <button @click="notify">Notify !</button>
  </div>
</template>

<style>
.foo-bar { color: #f00; }
</style>
```
:::


- **theme & icon**

:::sand-box{template=vue3}
```vue /src/App.vue
<template>
  <button @click="notify">show toast</button>
</template>

<script>
import { defineComponent } from 'vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default defineComponent({
  setup() {
    const notify = () => {
      toast("Default Notification !");

      toast.success("AUTO， 跟随系统主题（light/dark）!", {
        theme: toast.THEME.AUTO,
      });

      toast.info("light!", {
        theme: toast.THEME.LIGHT,
        position: toast.POSITION.BOTTOM_RIGHT,
      });

      toast.warning("dark!", {
        theme: toast.THEME.DARK,
        position: toast.POSITION.TOP_LEFT,
      });

      toast.error("Colored!", {
        theme: toast.THEME.COLORED,
        position: toast.POSITION.TOP_LEFT,
      });
    };
    return {
      notify,
    };
  },
});
</script>

<style>
  .count {
    color: red;
  }
</style>
```
:::

- **toast.promise**

:::sand-box{template=vue3}
```vue /src/App.vue
<script>
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
  name: "App",
  setup() {
    const displayPromise = () => {
      const resolveWithSomeData = new Promise((resolve, reject) => setTimeout(() => resolve({ message: 'world' }), 3000));
      toast.promise(
        resolveWithSomeData,
        {
          pending: {
            render() {
              return "I'm loading";
            },
            // other options
            icon: false,
          },
          success: {
            render(res) {
              return 'resolve with data: ' + res.data.message;
            },
            // other options
            icon: '🟢',
          },
          error: {
            render(err) {
              // When the promise reject, data will contains the error
              return h('div', 'Err: ' + err.data.message);
              // return 'Err: ' + err.data.message;
            },
            // render: 'just text',
            // render: h('div', 'error'),
          },
        },
        {
          position: toast.POSITION.BOTTOM_RIGHT,
        }
      );
    };
    return { displayPromise };
  }
};
</script>

<template>
  <div>
    <button @click="displayPromise">display promise</button>
  </div>
</template>
```
:::

- **update toast**

:::sand-box{template=vue3}
```vue /src/App.vue
<template>
  <button @click="notify">show toast</button>
  <button @click="update">update icon</button>
  <button @click="updateContent">update content</button>

  <p>更多查看：https://vue3-toastify.js-bridge.com/usage/update-toast.html</p>
</template>

<script>
import { defineComponent, ref, h } from 'vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default defineComponent({
  setup() {
    const toastId = ref('');
    const notify = () => toastId.value = toast('Hello', {
      autoClose: false,
      position: toast.POSITION.BOTTOM_RIGHT,
    });
    const update = () => toast.update(toastId.value, {
      type: toast.TYPE.INFO,
      autoClose: 5000,
    });
    const updateContent = () => toast.update(
      toastId.value,
      {
        // render: 'New content',
        // render: SomeVNode, // ToastContent<T>
        render: (props) => {
          return h('div', 'new content');
        }, // ToastContentProps<T>
        type: toast.TYPE.INFO,
        autoClose: 5000,
      }, // ToastOptions
    );

    return {
      notify,
      update,
      updateContent,
    };
  },
});
</script>

<style>
  .count {
    color: red;
  }
</style>
```
:::

- **Define a custom enter and exit animation**

:::sand-box{template=vue3}
```vue /src/App.vue
<template>
  <button @click="notify">show toast</button>
</template>

<script>
import { defineComponent } from 'vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import 'animate.css';

export default defineComponent({
  setup() {
    const customAnimation = {
      enter: "animate__animated animate__lightSpeedInRight",
      exit: "animate__animated animate__lightSpeedOutRight",
      // appendPosition: true,
    }; // as CSSTransitionProps

    // TIPS !!!!!!!!!!!!!!!!
    // if add prop --> appendPosition: true
    // - className to be: "animate__animated animate__lightSpeedInRight--top-right"
    // - enter or exit animation will not trigger,
    // - because there has no className "animate__lightSpeedInRight--top-right"

    const notify = () => {
      toast('Wow so easy !', {
        transition: customAnimation,
      });
    };

    return {
      notify,
    };
  },
});
</script>
```
:::


- **Pause toast timer when the window loses focus**

:::sand-box{template=vue3}
```vue /src/App.vue
<template>
  <button @click="notify">show toast</button>
  <p>打开toast后，点击非“iframe”区域</p>
</template>

<script>
import { defineComponent } from 'vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default defineComponent({
  setup() {
    const notify = () => {
      toast('default enable');

      toast('disable pauseOnFocusLoss', {
        pauseOnFocusLoss: false,
      });
    };

    return {
      notify,
    };
  },
});
</script>

<style>
  .count {
    color: red;
  }
</style>
```
:::
