import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeFormat from 'rehype-format';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import rehypeToc from 'rehype-toc';
import rehypeKatex from 'rehype-katex';
import remarkDirective from 'remark-directive';
import remarkDirectiveRehype from 'remark-directive-rehype';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
// @ts-ignore
import remarkHeadingId from 'remark-heading-id';
import remarkParse from 'remark-parse';
import remarkGemoji from 'remark-gemoji';
// @ts-ignore
import remarkPrism from 'unified-remark-prismjs';
import remarkRehype from 'remark-rehype';
import remarkSlug from 'remark-slug';
import remarkSqueezeParagraphs from 'remark-squeeze-paragraphs';
// @ts-ignore
import { html2hast } from 'unified-remark-prismjs/src/core.js';
import { reporter } from 'vfile-reporter';
import { unified } from 'unified';
import parse2json from './parse2json';
import type { IElement, IHast } from '~~/types';

function resolveContainerSyntax(str: string) {
  const regex = /::: ([a-z]+)(.*?)\n(.*?)\n:::/gs;
  const replacement = ':::vitepress-container{type=$1 title="$2"}\n$3\n:::';
  // const regex2 = /:::\s*(\w+)\s*(.*?)\s*:::/g;
  // const replacement2 = ':::vitepress-container{type=$1 title="$2"}';

  const newString = str.replace(regex, replacement);
  return newString;
}

// https://github.com/remarkjs/remark/blob/HEAD/doc/plugins.md#list-of-plugins

export const getResolvedMarkdown = async (content = '') => {
  // const str = content;
  const str = resolveContainerSyntax(content);
  // @ts-ignore
  const file = await unified()
    // @ts-ignore
    .use(remarkParse)
    .use(remarkMath)
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
    .use(rehypeKatex)
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
    .process(str);

  const hast = html2hast(String(file)) as IHast[];
  const res = parse2json({ type: 'root', children: hast } as any);

  if (reporter(file as any)
    && !String(reporter(file as any)).includes('no issues found')) {
    console.error(reporter(file as any));
  }

  return (res.children || []) as IElement[];
};
