import type { IncomingMessage, ServerResponse } from 'http';
import fs from 'fs';
import path from 'path';

async function main(req: IncomingMessage, res: ServerResponse) {
  const query = new URLSearchParams(req.url);
  let url = query.get('url');
  url = url || './docs/vue/test.md';
  const filePath0 = await path.resolve(url);

  return {
    filePath0,
    stat: {
      f0: fs.existsSync(filePath0),
    },
  };
}

export default main;
