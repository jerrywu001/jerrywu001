/* eslint-disable prettier/prettier */
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
  const category = query.get('category');
  const postname = query.get('postname');

  console.info(protocol, host, port);
  const thePort = String(port) === '80' ? '' : `:${String(port)}`;
  const path = `${protocol}//${host}${thePort}`;

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
