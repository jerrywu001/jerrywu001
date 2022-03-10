import type { IncomingMessage, ServerResponse } from 'http';
import { ICategory, IElement, IMeta, ITableOfContent } from '~~/types';
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
  let meta = {} as IMeta;
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
    meta = res.meta;
    children = res.content;
    tocs = toc ? toc.children : [];
  } catch (error) {
    console.error(error);
  }

  return {
    code,
    meta,
    categories: [
      // TODO:
      {
        label: 'Code styles',
        children: [
          {
            label: 'less',
            url: '/posts/code-styles/less-code-style',
          },
          {
            label: 'css',
            url: '/posts/code-styles/css-style-guide',
          },
          {
            label: 'html',
            url: '/posts/code-styles/html-style-guide',
          },
          {
            label: 'airbnb javascript',
            url: '/posts/code-styles/airbnb-javascript-style-guide',
          },
          {
            label: 'esnext',
            url: '/posts/code-styles/es-next-style-guide',
          },
        ],
      },
      {
        label: 'React',
        children: [
          {
            label: '关于React的6点建议',
            url: '/posts/react/about-react',
          },
          {
            label: 'React源码调试环境搭建',
            url: '/posts/react/react-resource-debug',
          },
        ],
      },
      {
        label: 'Vue',
        children: [
          {
            label: 'full usage',
            url: '/posts/vue/full',
          },
          {
            label: 'vue test',
            url: '/posts/vue/test',
          },
        ],
      },
    ] as ICategory[],
    tocs: getTocMap(
      tocs.filter(
        (v) => v.type !== 'text' && v.children && v.children.length > 0
      )
    ),
    children: children.filter((v) => !isToc(v)),
  };
};
