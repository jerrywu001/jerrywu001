---
title: sandbox demos
cover: /articles/sandpack.png
createAt: 2022-06-20T19:00:00.000Z
---

**此文章中 \\\`\\\`\\\` 表示的是 ```**

## templates

> 'angular' | 'react' | 'react-ts' | 'vanilla' | 'vanilla-ts' | 'vue' | 'vue3' | 'svelte' | 'solid';

## entry file path

> - vanilla:        'src/index.js'
> - vanilla-ts:     'src/index.ts'
> - angular:        'src/app/app.component.ts'
> - react:          'App.js'
> - react-ts:       'App.tsx'
> - vue:            'src/App.vue'
> - vue3:           'src/App.vue'
> - svelte:         'index.js'
> - solid:          'App.tsx'

## Normal

```md
:::sand-box{template=react-ts}
\`\`\`js App.tsx
export default function App() {
  return (
    <div>Hello world</div>
  );
}
\`\`\`
:::
```

:::sand-box{template=react-ts}
```js App.tsx
export default function App() {
  return (
    <div>Hello world</div>
  );
}
```
:::

## Global ReadOnly

```md
:::sand-box{template=react-ts read-only show-read-only}
\`\`\`js App.tsx
export default function App() {
  return (
    <div>Hello world</div>
  );
}
\`\`\`
:::
```

:::sand-box{template=react-ts read-only show-read-only}
```js App.tsx
export default function App() {
  return (
    <div>Hello world</div>
  );
}
```
:::


## Custom files

```md
:::sand-box{template=react}
\`\`\`js App.js [active]
import Item from './Item.js';

export default function App() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item
          isPacked={true}
          name="Space suit"
        />
        <Item
          isPacked={true}
          name="Helmet with a golden leaf"
        />
        <Item
          isPacked={false}
          name="Photo of Tam"
        />
      </ul>
    </section>
  );
}
\`\`\`

\`\`\`js Item.js
export default function Item({ name, isPacked }) {
  return <li className="item">{name}</li>;
}
\`\`\`
:::
```

:::sand-box{template=react}
```js App.js [active]
import Item from './Item.js';

export default function App() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item
          isPacked={true}
          name="Space suit"
        />
        <Item
          isPacked={true}
          name="Helmet with a golden leaf"
        />
        <Item
          isPacked={false}
          name="Photo of Tam"
        />
      </ul>
    </section>
  );
}
```

```js Item.js
export default function Item({ name, isPacked }) {
  return <li className="item">{name}</li>;
}
```
:::


## Custom with readonly

```md
:::sand-box{template=react}
\`\`\`js App.js
import Gallery from './Gallery.js';

export default function App() {
  return (
    <Gallery />
  );
}
\`\`\`

\`\`\`js Gallery.js [active] [readonly]
// this file is readOnly

function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
\`\`\`
:::
```

:::sand-box{template=react}
```js App.js
import Gallery from './Gallery.js';

export default function App() {
  return (
    <Gallery />
  );
}
```

```js Gallery.js [active] [readonly]
// this file is readOnly

function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```
:::


## custom with hidden

```md
:::sand-box{template=react}
\`\`\`js Clock.js [active]
export default function Clock({ color, time }) {
  return (
    <h1 style={{ color: color }}>
      {time}
    </h1>
  );
}
\`\`\`

\`\`\`js App.js [hidden]
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  const [color, setColor] = useState('lightcoral');
  return (
    <div>
      <p>
        Pick a color:{' '}
        <select value={color} onChange={e => setColor(e.target.value)}>
          <option value="lightcoral">lightcoral</option>
          <option value="midnightblue">midnightblue</option>
          <option value="rebeccapurple">rebeccapurple</option>
        </select>
      </p>
      <Clock color={color} time={time.toLocaleTimeString()} />
    </div>
  );
}
\`\`\`
:::
```

:::sand-box{template=react}
```js Clock.js [active]
export default function Clock({ color, time }) {
  return (
    <h1 style={{ color: color }}>
      {time}
    </h1>
  );
}
```

```js App.js [hidden]
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  const [color, setColor] = useState('lightcoral');
  return (
    <div>
      <p>
        Pick a color:{' '}
        <select value={color} onChange={e => setColor(e.target.value)}>
          <option value="lightcoral">lightcoral</option>
          <option value="midnightblue">midnightblue</option>
          <option value="rebeccapurple">rebeccapurple</option>
        </select>
      </p>
      <Clock color={color} time={time.toLocaleTimeString()} />
    </div>
  );
}
```
:::

## closableTabs

```md
:::sand-box{template=react closable-tabs}
\`\`\`js App.js
export default function App() {
  return (
    <h1>Hello World!</h1>
  );
}
\`\`\`

\`\`\`js file1.js
// file1
\`\`\`

\`\`\`js file2.js
// file2
\`\`\`
:::
```

:::sand-box{template=react closable-tabs}
```js App.js
export default function App() {
  return (
    <h1>Hello World!</h1>
  );
}
```

```js file1.js
// file1
```

```js file2.js
// file2
```
:::


## This sandbox doesn’t work because the root component is not exported

```md
:::sand-box{template=react}
\`\`\`js
function App() {
  return null;
}
\`\`\`
:::
```

:::sand-box{template=react}
```js
function App() {
  return null;
}
```
:::

---

:button-link[Edit this page]{href="https://github.com/jerrywu001/jerrywu001/blob/master/docs/other/sandpack-demos.md"}
