---
title: windows通过ubuntu子系统安装bun
description: bun：开发、测试、运行和捆绑 JavaScript 和 TypeScript 项目——全部使用 Bun。Bun 是一款专为提高速度而设计的一体化 JavaScript 运行时和工具包，配有捆绑器、测试运行器和与 Node.js 兼容的包管理器。
cover: https://picx.zhimg.com/70/v2-056e498af3c80f96973f4daf08895a27_1440w.avis?source=172ae18b&biz_tag=Post
---

> bun：开发、测试、运行和捆绑 JavaScript 和 TypeScript 项目——全部使用 Bun。Bun 是一款专为提高速度而设计的一体化 JavaScript 运行时和工具包，配有捆绑器、[测试运行器](https://bun.sh/docs/cli/test)和与 Node.js 兼容的[包管理器](https://bun.sh/package-manager)。

很遗憾，它目前无法在windows上直接安装使用，必须通过linux子系统安装，下面是详细安装步骤

## ubuntu子系统安装

### 通过store商店安装 （不推荐）

打开windows 商店，搜索ubuntu 点击安装即可

![image.png](https://pic3.zhimg.com/80/v2-29dfb9f3eb8efa75400bb2fdca2b581e.webp)

### 使用命令并安装到D盘（强烈推荐）

> 如果已经安装过，这里是卸载方法： https://blog.csdn.net/jarvan5/article/details/118144722

- **以管理员身份打开powershell**

![image.png](https://pic3.zhimg.com/80/v2-cdc381634ca9147349715db887cd68be.webp)

- **powserSheell 依次执行下面4个命令**

```bash
wsl --install

dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart

dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

wsl --set-default-version 2
```

- **下载 Linux 内核更新包**

[内核更新包](https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi)

下载完成，双击运行

- **下载Ubuntu_2004.2020.424.0_x64.appx**

下载链接：https://wsldownload.azureedge.net/Ubuntu_2004.2020.424.0_x64.appx

我是通过迅雷下载，快很多，比如下载到D盘

- 下载完成后，**powserSheell** 依次执行

```bash
Expand-Archive .\Ubuntu.zip -Verbose

cd .\Ubuntu\

.\ubuntu2004.exe
```

接着初始化用户名和密码即可

![image.png](https://pic1.zhimg.com/80/v2-c608c3fa5fb8d179b1fb3a19cc6a3adc.webp)

打开新的powsershell，验证状态，看到state是running

```bash
wsl -l -v
```

![image.png](https://pic3.zhimg.com/80/v2-c59436b47abc852c1dc6e7831cbac876.webp)

同时，你可以**双击exe**，然后**锁定到任务栏**，方便后续查找

![image.png](https://pic4.zhimg.com/80/v2-88f8c0b57fce899ca5b3beed19eccaaf.webp)

**切记，不要换源，否则sudo apt update可能会报错**

## 安装bun

打开子系统，开始安装

### 通过proto安装

> https://moonrepo.dev/docs/proto/install

![image.png](https://pic4.zhimg.com/80/v2-4c16096358209153bd1106a656e7b567.webp)

```bash
sudo apt update

curl -fsSL https://moonrepo.dev/install/proto.sh | bash

proto install bun 1.0
```

### 首选方案（推荐）

> https://bun.sh/docs/installation

```bash
sudo apt update

sudo apt install unzip

curl -fsSL https://bun.sh/install | bash
```

![image.png](https://pic2.zhimg.com/80/v2-099f9bba71e31540ba7e1c97af66760d.webp)

最后一个指令，需要等待一点时间（如果卡住， 那就`ctrl + c`，然后重新执行）

下载后，是这样

![image.png](https://pic3.zhimg.com/80/v2-50e54c083a87395e1ee80517003ecb76.webp)

按照提示，执行`source`命令即可结束bun的安装

---> 验证bun

![image.png](https://pic3.zhimg.com/80/v2-74516b038aa086e8afcef0c52141648e.webp)

## 子系统访问本机文件夹

```bash
cd /mnt

ls

cd d # 比如进入D盘

ls -al
```

![image.png](https://pic2.zhimg.com/80/v2-bb56a07d0e70aa84c1042c3b246ea325.webp)

![image.png](https://pic4.zhimg.com/80/v2-aab3ebf35ee4769891562fce36066d3b.webp)

## 安装node/pnpm

```bash
proto install node 18
proto install pnpm
```

等待一段时间

![image.png](https://pic1.zhimg.com/80/v2-bd23e152018e1b235c15a97613aa4b50.webp)

## 通过vscode链接子系统

上述成功后，子系统中随便创建个文件夹，然后`code .`即可打开vscode，会自动安装`wsl`插件链接子系统


![image.png](https://pic2.zhimg.com/80/v2-0fb5d7cb9fc7a9e8c02dd599690c6955.webp)

![image.png](https://pic1.zhimg.com/80/v2-16f0c3eee9d595a2c3aebdbdf2ebf2e8.webp)

![image.png](https://pic4.zhimg.com/80/v2-f67bb6c223e5ab27b6440d7516c6c1a7.webp)

## 正题，bun的简单示例

> https://bun.sh/docs/quickstart

### 创建项目文件夹

```bash
mkdir quickstart
cd quickstart
```

### 初始化示例项目

```bash
bun init
```

![image.png](https://pic1.zhimg.com/80/v2-4f520e57504679f36754031971547f50.webp)

按提示执行即可

![image.png](https://pic3.zhimg.com/80/v2-a1208a193e412f00dcb48c46e5458e0a.webp)

### server 示例

修改index.ts

```ts
const server = Bun.serve({
  port: 3000,
  fetch(req) {
    return new Response("Bun!");
  },
});

console.log(`Listening on http://localhost:${server.port} ...`);
```

![image.png](https://pic2.zhimg.com/80/v2-fa9262793174b5ee8faf14194afc6181.webp)

点击预览即可

![image.png](https://pic1.zhimg.com/80/v2-603f1bca415523aa5d0730443906a314.webp)

### 体验`bun install`

也许受限于虚拟机的性能，没感觉到有多快，足足跑了**210s**😂。

![image.png](https://pic2.zhimg.com/80/v2-716373817448c660e234cdae82ea7fa5.webp)

于是我用一个基础项目(240+ pkgs)在`vercel`云服务器上测试了下

- `npm install`是   `16s`
- `bun install`是   `4s`

- 项目访问测试也是可以的（*第一次访问地址有点慢*）

![image.png](https://pic3.zhimg.com/80/v2-8652a01ea898678cd706def3f309e9da.webp)

确实快

![image.png](https://pic1.zhimg.com/80/v2-8f45f69dac6ee55cc85bf1e10da91b28.webp)

### 端口被占用解决

```bash
lsof -i :3000

kill -9 xxxx
```

![image.png](https://pic4.zhimg.com/80/v2-ec5d26ecbbac41e21db114f0f9de3b6f.webp)

也可以点击此处进行端口管理（最好关闭之前ctrl+c终止进程）

![image.png](https://pic1.zhimg.com/80/v2-b3b84785c36189ffd1c7204a52806964.webp)
