---
title: vite集成https，并安装本地自签名证书
description: vite集成https，并安装本地自签名证书（同时可解决msw的fallback mode问题）
cover: /articles/https.png
createAt: 2022-08-08T10:00:00.000Z
---

## 问题描述
1. vite默认使用http，模块很多时，访问速度上似乎不太理想
2. [msw](https://mswjs.io/)在http模式下，会存在[fallback mode](./server_mocker#关于fallback-mode)的问题

🎯 本文的愿景是解决上面的问题，正好发现https+证书可以完美解决

## 启用https

- package.json

```diff
"scripts": {
-  "dev": "vite"
+  "dev": "vite --host"
}
```

- vite.config.ts

```diff
+ server: {
+  https: true,
+ }
```

## 配置证书

> [mkcert](https://www.npmjs.com/package/mkcert)

### install mkcert

```bash
npm i mkcert -g
```

### 生成ca证书

```bash
cd [project folder]

mkdir keys

cd keys
```

```bash
mkcert create-ca [options] # options 参见npm文档
```

### 再根据ca证书生成cert证书

```bash
# mkcert create-cert [options] # options 参见npm文档

# 如下，设置domains
mkcert create-cert --domains 127.0.0.1,localhost,custom1.domain.xxx,custom2.domain.xxx
```

## 安装正式

### mac

- 打开keys文件夹，并双击ca.crt，会弹出密钥串访问对话框

![](/articles/ca-1.png)


- 双击对话框中的Test CA： 点开“信任” -> 使用此证书时 -> 始终信任 -> 输入密码即可

![](/articles/ca-2.png)

- 成功

![](/articles/ca-3.png)

### windows

- 双击ca.crt，在弹出对话框中点击“安装证书”

![](/articles/ca-w-1.png)

- 弹出框中，选择本地计算机，点击下一步

![](/articles/ca-w-2.png)

- 弹出框中，按截图提示操作

![](/articles/ca-w-3.png)

- 弹出框中，点击确定即可

![](/articles/ca-w-4.png)

## 验证证书是否生效

### 修改vite.config.ts

```diff
server: {
-  https: true,
+  https: {
+    cert: fs.readFileSync(path.join(__dirname, 'keys/cert.crt')),
+    key: fs.readFileSync(path.join(__dirname, 'keys/cert.key')),
+  },
},
```

### 启动本地服务

```bash
npm run dev
```

同时也解决了msw [fallback mode](./server_mocker#关于fallback-mode)的问题, 效果：

![](/articles/ca-over.png)



