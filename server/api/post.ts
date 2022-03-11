import type { IncomingMessage, ServerResponse } from 'http';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { ICategory, IElement, IMeta, ITableOfContent } from '~~/types';
import { getResolvedMarkdown } from '~~/utils/getResolvedMarkdown';

const articlesCache = {};
const categories: ICategory[] = [];
const docsDir = path.join(process.cwd(), 'docs');

function setDirs(base = '', dirs = [] as ICategory[]) {
  const files = fs.readdirSync(base);
  files.forEach((item) => {
    const fPath = path.join(base, item);
    const stat = fs.statSync(fPath);
    const parent = {
      label: '',
      children: [],
    };
    if (stat.isDirectory()) {
      parent.label = fPath
        .replace(/\\\\/g, '/')
        .replace(/\\/g, '/')
        .split('docs/')[1]
        .replace(/-/g, ' ');
      setDirs(fPath, parent.children);
    }
    if (stat.isFile()) {
      let title = '';
      const str = fs.readFileSync(fPath, { encoding: 'utf-8' });
      const { content, data } = matter(String(str));
      const match = /# [\w\W]*/.exec(content);
      const hasH1 = /\n# [\w\W]*/.test('\n' + content);
      let folderName = fPath
        .replace(/\\\\/g, '/')
        .replace(/\\/g, '/')
        .split('docs/')[1]
        .replace('.md', '')
        .replace(/-/g, ' ');
      folderName = folderName.substring(folderName.lastIndexOf('/') + 1);
      title = data.title || '';
      // # XXX 的优先级要高于meta.title
      if (!title && match && hasH1) {
        const temp = match[0].split('\n')[0] || '';
        title = temp.split('{#')[0];
      }
      dirs.push({
        label: (title || folderName).replace(/#\s*/g, ''),
        url:
          '/posts' +
          fPath
            .replace(/\\\\/g, '/')
            .replace(/\\/g, '/')
            .replace('.md', '')
            .split('docs')[1],
      });
    }
    if (parent.label) {
      dirs.push(parent);
    }
  });
}

function isToc(v = {} as IElement) {
  return (
    v.tag === 'ol' &&
    v.props &&
    v.props.className &&
    v.props.className.includes('table-of-contents')
  );
}

function getTocMap(tocs: IElement[] = []) {
  const result: ITableOfContent[] = [];
  for (const p of tocs) {
    const item = {} as ITableOfContent;
    const children = p.children || [];
    for (const c of children) {
      if (c.tag === 'a') {
        item.class = (c.props.className || []).join(' ');
        item.label = c.children[0].value;
        item.archor = c.props.href;
      } else if (['ol', 'ul'].includes(c.tag) && c.children.length > 1) {
        item.children = getTocMap(c.children);
      }
    }
    if ('archor' in item) {
      result.push(item);
    }
  }
  return result;
}

export default async (req: IncomingMessage, res: ServerResponse) => {
  let meta = {} as IMeta;
  let children: IElement[] = [];
  let code = 0;
  let tocs = [];
  const query = new URLSearchParams(req.url);
  const category = query.get('category');
  const postname = query.get('postname');
  const key = category + postname;

  if (articlesCache[key]) {
    console.log('query article from cache:', key);
    return { ...articlesCache[key] };
  }

  try {
    const res = await getResolvedMarkdown(category, postname);
    const toc = res.content.find((v) => isToc(v));
    if (!categories.length) {
      console.log('haha===');
      setDirs(docsDir, categories);
    }
    code = res.code || 0;
    meta = res.meta;
    children = res.content;
    tocs = toc ? toc.children : [];
  } catch (error) {
    console.error(error);
  }

  articlesCache[key] = {
    code,
    meta,
    categories,
    tocs: getTocMap(
      tocs.filter(
        (v) => v.type !== 'text' && v.children && v.children.length > 0
      )
    ),
    children: children.filter((v) => !isToc(v)),
  };

  return { ...articlesCache[key] };
};
