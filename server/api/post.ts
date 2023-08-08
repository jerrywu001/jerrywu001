import fetch from 'node-fetch';
import chalk from 'chalk';

const { public: publicConfig } = useRuntimeConfig();
const { host, port, dev } = publicConfig;

const protocol =
  process.env.HTTPS === undefined
    ? 'http:'
    : process.env.HTTPS === 'false'
    ? 'http:'
    : 'https:';

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

    if (dev) {
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
