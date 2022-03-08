import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
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
import remarkPrism from 'unified-remark-prismjs';
import remarkRehype from 'remark-rehype';
import remarkSlug from 'remark-slug';
import remarkSqueezeParagraphs from 'remark-squeeze-paragraphs';
import { html2hast } from 'unified-remark-prismjs/src/core.js';
import { read } from 'to-vfile';
import { reporter } from 'vfile-reporter';
import { unified } from 'unified';
import parse2json from './parse2json';
import { IElement } from '~~/types';

// https://github.com/remarkjs/remark/blob/HEAD/doc/plugins.md#list-of-plugins
const docsDir = path.join(process.cwd(), 'docs');

export const getResolvedMarkdown = async (category = '', name = '') => {
  const filePath = path.join(docsDir, `./${category}/${name}.md`);
  console.log(docsDir);
  console.log(filePath);
  if (!fs.existsSync(filePath)) {
    return { code: 404 };
  }

  const str = await read(filePath, { encoding: 'utf-8' });
  const { content, data } = matter(String(str));
  const file = await unified()
    .use(remarkParse)
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
        // 'line-numbers',
        'diff-highlight',
        'treeview',
        // 'command-line',
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
  const hast = html2hast(String(file));
  const res = parse2json({ type: 'root', children: hast } as any);
  console.log('has hasts', res.children.length);

  console.error(reporter(file));
  return { data, content: (res.children || []) as IElement[] };
};
