---
title: Prisma操作mysql
description: Prisma: 下一代 Node.js 和 TypeScript ORM，凭借其直观的数据模型、自动迁移、类型安全和自动完成功能，Prisma 在使用数据库时将开发人员体验提升到了新的水平。
cover: https://www.js-bridge.com/articles/prisma.jpg
---

[Prisma](https://www.prisma.io/) 是一个开源的下一代 ORM。它由以下部分组成：

- **Prisma Client**：用于 Node.js 和 TypeScript 的自动生成和类型安全的查询构建器
- **Prisma Migrate**：迁移系统
- **Prisma Studio** : 用于查看和编辑数据库中数据的 GUI

可以打开官网了解一下，话不多说，直接上实战教程（省略mysql的安装）：

---

## 初始化项目

### 必要操作

```sh
npm i -y

mkdir src prisma

touch tsconfig.json prisma/schema.prisma
```

### 安装依赖

```sh
npm i prisma @prisma/client typescript @types/node -D
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "sourceMap": true,
    "outDir": "dist",
    "target": "ES2018",
    "module": "commonjs",
    "strict": true,
    "lib": ["esnext"],
    "esModuleInterop": true
  },
  "exclude": ["dist"],
  "include": ["src"]
}
```

### schema.prisma

> 用于链接数据库 & 定义表结构

```yaml
datasource db {
  provider = "mysql"
  url      = "mysql://root:123456@localhost:3306/prisma"
}

generator client {
  provider        = "prisma-client-js"
}

model User {
  id      Int      @id @default(autoincrement())
  email   String   @unique
  name    String?
}
```

### Prisma Client

> 后续操作都基于它

```sh
npx prisma generate

# 生成的路径： node_modules\.prisma\client
```

### Prisma migrate

> 基于prisma/schema.prisma，初始化数据库和数据库对应的表
> [prisma-migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate)

```sh
npx prisma migrate dev --name init
```

> 划重点：**如果修改了prisma/schema.prisma，需要重新执行命令**:

```sh
npx prisma generate
npx prisma migrate dev --name init
```

- 此时prisma文件夹下会多出一些文件，并自动根据schem文件自动创建对应的sql文件

![prisma](https://pic3.zhimg.com/80/v2-cd352acad93a610c50144a2607a13fee.jpg)

![会自动根据schem文件自动创建对应的sql文件](https://pic4.zhimg.com/80/v2-411d02d029dd546b0986b0704acade27.jpg)

- 查看mysql数据库

> 自动生成了prisma数据库

![自动生成了prisma数据库](https://pic3.zhimg.com/80/v2-bdf94b669f1a4b60c7cad3100f038cb2.jpg)

- 查看prisma下的表

> 自动创建了user表

![自动创建了user表](https://pic1.zhimg.com/80/v2-f8cea74cebf98095749098c339bf1c4c.jpg)

## 增删改查操作

[prisma-client-reference](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)

### insert

> 向user表中添加记录

```sh
touch insert-user.ts
```

```[insert-user.ts]
// insert-user.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({});

async function main() {
  // const result = await prisma.user.create({
  //   data: {
  //     email: 'tom@test.io',
  //     name: 'tom',
  //   },
  // });  // 插入重复数据时，会报错

  // or
  const result = await prisma.user.createMany({
    data: [
      {
        email: 'tom@test.io',
        name: 'tom',
      },
    ],
    skipDuplicates: true, // 插入重复数据时，不会报错
  });
  console.log(result);
}

main()
  .catch((e) => {
    console.log(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

```sh
# 运行
npx ts-node src/insert-user.ts
```

此时插入了两条数据

![此时插入了两条数据](https://pic4.zhimg.com/80/v2-2e0d15edf38a086daf01eea51df15993.jpg)

### update

> 更新id为1的user name

```sh
touch update-user.ts
```

```[update-user.ts]
// update-user.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.update({
    where: {
      id: 1,
    },
    data: {
      name: 'Peters',
    },
  });
  console.log(user);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

```sh
# 运行
npx ts-node src/update-user.ts
```

**<small>更新成功</small>**

![更新成功](https://pic2.zhimg.com/80/v2-028955b068163e27b885ac369fd5e431.jpg)


### find

> 查找id为1的user

```sh
touch find-user.ts
```

```[find-user.ts]
// find-user.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // await prisma.user.findMany(); // 查询全部记录
  const returnUser = await prisma.user.findUnique({
    where: {
      id: 1,
    },
  });

  console.dir(returnUser, { depth: Infinity });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

```sh
# 运行
npx ts-node src/find-user.ts
```

**<small>查询结果</small>**

![查询结果](https://pic3.zhimg.com/80/v2-fec14a6256f203bf55493cb0e5c125ae.png)

### delete

> 删除id为2的user

```sh
touch find-user.ts
```

```[delete-user.ts]
// delete-user.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // await prisma.user.deleteMany(); // 删除全部记录
  const user = await prisma.user.delete({
    where: {
      id: 2,
    },
  });
  console.log(user);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

```sh
# 运行
npx ts-node src/delete-user.ts
```

**<small>删除成功</small>**

![删除成功](https://pic2.zhimg.com/80/v2-429740ed1c2fe15556432ce5f802db5d.jpg)

## 可视化数据操作

```sh
npx prisma studio
```

![prisma studio](https://pic4.zhimg.com/80/v2-0ce0c928464d0bd14e788f4d4c6e64eb.jpg)

![](https://pic1.zhimg.com/80/v2-adcc297f9792d333bf4879c9714c16f4.jpg)

- 点击add record 添加数据，然后点击save 1 change即可

![](https://pic3.zhimg.com/80/v2-92bf710d672562043af290c421e0a7f6.jpg)

![](https://pic4.zhimg.com/80/v2-bfbcec88d99e1bfd7a33deb8fd1ff3df.jpg)
