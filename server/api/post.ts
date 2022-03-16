import type { IncomingMessage, ServerResponse } from 'http';
import fetch from 'node-fetch';
import chalk from 'chalk';

// const protocol = 'http:';
// const host = 'localhost';
// const port = 3000;

const protocol = 'https:';
const host = 'jerrywu001-jerrywu001.vercel.app';
const port = 80;

export default async (req: IncomingMessage, res: ServerResponse) => {
  let body = {} as any;

  const query = new URLSearchParams(req.url);
  const category = query.get('category');
  const postname = query.get('postname');

  const path = `${protocol}//${host}${
    String(port) === '80' ? '' : `:${String(port)}`
  }`;

  console.info(chalk.blue(`fullPath: ${path}`));

  console.info(chalk.blue(`host: ${process.env.HOST}`));

  try {
    const queryUrl = `${path}/content/${category}-${postname}.json`;
    const catlogs = await fetch(`${path}/content/categories.json`);
    const categories = await catlogs.json();
    const response = await fetch(queryUrl);

    console.info(chalk.green(`path invoked: ${queryUrl}`));

    body = await response.json();
    if (body && categories) {
      body.categories = categories;
    }
  } catch (error) {
    console.error(error);
  }
  return body;
};
