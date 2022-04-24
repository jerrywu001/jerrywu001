import type { IncomingMessage, ServerResponse } from 'http';
import fetch from 'node-fetch';
import chalk from 'chalk';

const protocol =
  process.env.HTTPS === undefined
    ? 'http:'
    : process.env.HTTPS === 'false'
    ? 'http:'
    : 'https:';
const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;

export default async (req: IncomingMessage, res: ServerResponse) => {
  let body = {} as any;

  const query = new URLSearchParams(req.url);
  const postname = query.get('postname');

  const thePort = String(port) === '80' ? '' : `:${String(port)}`;
  const path = `${protocol}//${host}${thePort}`;

  try {
    const queryUrl = `${path}/content/${postname.replace(/_/g, '-')}.json`;
    const catlogs = await fetch(`${path}/content/categories.json`);
    const categories = await catlogs.json();
    const response = await fetch(queryUrl);

    if (process.env.NODE_ENV !== 'development') {
      console.info(chalk.green(`path invoked: ${queryUrl}`));
    }
    if (response.status === 200 && body && categories) {
      body = await response.json();
      body.categories = categories;
    }
    body.code = response.status;
  } catch (error) {
    console.error(error);
  }

  return body;
};
