import type { IncomingMessage, ServerResponse } from 'http';
import fetch from 'node-fetch';

export default async (req: IncomingMessage, res: ServerResponse) => {
  const rawHeaders = req.rawHeaders || [];
  const query = new URLSearchParams(req.url);
  const category = query.get('category');
  const postname = query.get('postname');

  const fullPath = rawHeaders.find(
    (v) => v && v.startsWith('http') && v.includes('/posts')
  );
  const path = fullPath ? fullPath.split('/posts')[0] : 'http://localhost:3000';

  const catlogs = await fetch(`${path}/content/categories.json`);
  const response = await fetch(`${path}/content/${category}-${postname}.json`);
  const body: any = await response.json();
  const categories = await catlogs.json();
  if (body && categories) {
    body.categories = categories;
  }
  return body;
};
