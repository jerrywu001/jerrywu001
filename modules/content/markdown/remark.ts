import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeFormat from 'rehype-format';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import rehypeToc from 'rehype-toc';
import remarkDirective from 'remark-directive';
import remarkDirectiveRehype from 'remark-directive-rehype';
import remarkGfm from 'remark-gfm';
import remarkHeadingId from 'remark-heading-id';
import remarkParse from 'remark-parse';
import remarkGemoji from 'remark-gemoji';
import remarkPrism from 'unified-remark-prismjs';
import remarkRehype from 'remark-rehype';
import remarkSlug from 'remark-slug';
import remarkSqueezeParagraphs from 'remark-squeeze-paragraphs';
import { html2hast } from 'unified-remark-prismjs/src/core.js';
import { reporter } from 'vfile-reporter';
import { unified } from 'unified';
import parse2json from './parse2json';
import { IElement, IHast, IMeta } from '~~/types';

export function getArticleName(fPath = '') {
  return fPath
    .replace(/\\\\/g, '/')
    .replace(/\\/g, '/')
    .split('docs/')[1]
    .replace('.md', '');
}

// https://github.com/remarkjs/remark/blob/HEAD/doc/plugins.md#list-of-plugins

export const getResolvedMarkdown = async (
  content = '',
  data = {} as any,
  fPath: string
) => {
  const fileName = getArticleName(fPath);
  const category = fileName.split('/')[0];
  const meta = (data || {}) as IMeta;
  const file = await unified()
    .use(remarkParse)
    .use(remarkGemoji)
    .use(remarkGfm)
    .use(remarkSqueezeParagraphs)
    .use(remarkHeadingId)
    .use(remarkSlug)
    .use(remarkDirective)
    .use(remarkDirectiveRehype)
    .use(remarkPrism, {
      // showLanguage: true,
      enableCopy: true,
      plugins: [
        // 'autolinker',
        'data-uri-highlight',
        'inline-color',
        'line-numbers',
        'diff-highlight',
        'treeview',
        'command-line',
      ],
    })
    // @ts-ignore
    .use(remarkRehype, { allowDangerousHtml: true })
    // https://www.npmjs.com/package/rehype-toc
    .use(rehypeToc, {
      headings: ['h2', 'h3', 'h4'],
      nav: false,
      cssClasses: {
        toc: 'table-of-contents',
      },
    })
    .use(rehypeAutolinkHeadings, {
      behavior: 'wrap',
      test: ['h2', 'h3', 'h4'],
    })
    .use(rehypeRaw)
    .use(rehypeFormat)
    .use(rehypeStringify)
    .process(content);
  const hast = html2hast(String(file)) as IHast[];
  const res = parse2json({ type: 'root', children: hast } as any);

  if (reporter(file) && !String(reporter(file)).includes('no issues found')) {
    console.error(reporter(file));
  }

  // # XXX 的优先级要低于meta.title
  const h1 = hast.find((v) => v.tagName === 'h1');
  if (h1) {
    meta.hasTitle = true;
    if (!meta.title) {
      // @ts-ignore
      meta.title = h1.children[0]?.value;
    }
  }

  meta.description = meta.description || meta.title || '';
  meta.category = meta.category || category || '';
  return { meta, content: (res.children || []) as IElement[] };
};
