import type { IncomingMessage, ServerResponse } from 'http';
import { IElement, ITableOfContent } from '~~/types';
import { getResolvedMarkdown } from '~~/utils/getResolvedMarkdown';

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
  let meta = {};
  let children: IElement[] = [];
  let code = 0;
  let tocs = [];
  const query = new URLSearchParams(req.url);
  const category = query.get('category');
  const postname = query.get('postname');

  try {
    const res = await getResolvedMarkdown(category, postname);
    const toc = res.content.find((v) => isToc(v));
    code = res.code || 0;
    meta = res.data;
    children = res.content;
    tocs = toc ? toc.children : [];
  } catch (error) {
    console.error(error);
  }

  return {
    code,
    meta,
    tocs: getTocMap(
      tocs.filter(
        (v) => v.type !== 'text' && v.children && v.children.length > 0
      )
    ),
    children: children.filter((v) => !isToc(v)),
  };
};
