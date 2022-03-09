import type { IncomingMessage, ServerResponse } from 'http';
import fs from 'fs';
import path from 'path';

async function main(req: IncomingMessage, res: ServerResponse) {
  const filePath0 = await path.resolve('./docs/vue/test.md');
  const filePath1 = await path.resolve('docs/vue/test.md');
  const filePath2 = await path.resolve('../docs/vue/test.md');
  const filePath3 = await path.resolve('../../docs/vue/test.md');
  const filePath4 = await path.resolve('../../../docs/vue/test.md');

  return {
    filePath0,
    filePath1,
    filePath2,
    filePath3,
    filePath4,
    stat: {
      f0: fs.existsSync(filePath0),
      f1: fs.existsSync(filePath1),
      f2: fs.existsSync(filePath2),
      f3: fs.existsSync(filePath3),
      f4: fs.existsSync(filePath4),
    },
  };
}

export default main;
