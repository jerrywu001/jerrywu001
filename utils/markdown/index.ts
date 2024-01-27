import chalk from 'chalk';
import matter from 'gray-matter';
import { getResolvedMarkdown } from './remark';
import type { IElement, ITableOfContent } from '~~/types';

export async function getTransformedVNode(fileStr: string) {
  const { content } = matter(fileStr);
  let children: IElement[] = [];
  let tocElements: IElement[] = [];

  try {
    const res = await getResolvedMarkdown(content);
    const toc = res.find((v) => isToc(v));
    children = res;
    tocElements = toc ? toc.children : [];
  } catch (error) {
    if (error) {
      console.error(chalk.red(error));
    }
  }

  const result = {
    tocs: getTableOfContents(
      tocElements.filter(
        (v) => v.type !== 'text' && v.children && v.children.length > 0,
      ),
      1,
    ),
    content: children.filter((v) => !isToc(v)),
  };

  return result;
}

function isToc(v = {} as IElement) {
  return (
    v.tag === 'ol' &&
    v.props &&
    v.props.className &&
    v.props.className.includes('table-of-contents')
  );
}

function getTableOfContents(
  tocs: IElement[] = [],
  depth: number,
) {
  const tocDepth = 3;
  const result: ITableOfContent[] = [];

  for (let i = 0, len = tocs.length; i < len; i++) {
    const p = tocs[i];
    const item = {} as ITableOfContent;
    const children = p.children || [];
    item.depth = depth;

    for (const c of children) {
      if (c.tag === 'a' && depth <= tocDepth) {
        item.class = (c.props.className || []).join(' ');
        item.label = c.children[0].value as string;
        item.archor = c.props.href as string;
      }
      if (
        ['ol', 'ul'].includes(c.tag) &&
        c.children.length > 1 &&
        depth <= tocDepth
      ) {
        item.children = getTableOfContents(c.children, depth + 1);
      }
    }

    if ('archor' in item) {
      result.push(item);
    }
  }

  return result;
}
