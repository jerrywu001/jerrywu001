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

export default defineEventHandler(async (event) => {
  let body = {} as any;
  const { postname = '' } = getQuery(event);

  const thePort = String(port) === '80' ? '' : `:${String(port)}`;
  const path = `${protocol}//${host}${thePort}`;

  try {
    const queryUrl = `${path}/content/${(postname as string).replace(
      /_/g,
      '-'
    )}.json`;
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
});
