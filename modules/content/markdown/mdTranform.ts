import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import chalk from 'chalk';
import { getArticleName, getResolvedMarkdown } from './remark';
import { ICategory, IElement, IMeta, ITableOfContent } from '~~/types';

export interface MdOption {
  rootDir: string;
  docsDir: string;
}

export default class MdTransform {
  rootDir = '';
  docsDir = '';
  outputDir = '';
  catlogs = [] as ICategory[];

  constructor(options: MdOption) {
    this.rootDir = options.rootDir;
    this.docsDir = options.docsDir;
    this.outputDir = path.join(this.rootDir, 'public/content');
  }

  async init() {
    const catlogs = await this.walk();

    await fs.writeFileSync(
      path.join(this.outputDir, 'categories.json'),
      JSON.stringify(catlogs)
    );
  }

  async walk(base = this.docsDir, dirs = this.catlogs as ICategory[]) {
    const files = await fs.readdirSync(base);

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
        this.walk(fPath, parent.children);
      }
      if (stat.isFile()) {
        let title = '';
        const str = fs.readFileSync(fPath, { encoding: 'utf-8' });
        const { content, data } = matter(String(str));
        const match = /# [\w\W]*/.exec(content);
        const hasH1 = /\n# [\w\W]*/.test('\n' + content);
        let articleName = getArticleName(fPath).replace(/-/g, ' ');
        articleName = articleName.substring(articleName.lastIndexOf('/') + 1);
        title = data.title || '';
        // # XXX 的优先级要低于meta.title
        if (!title && match && hasH1) {
          const temp = match[0].split('\n')[0] || '';
          title = temp.split('{#')[0];
        }
        dirs.push({
          label: (title || articleName).replace(/#\s*/g, ''),
          url:
            '/posts' +
            fPath
              .replace(/\\\\/g, '/')
              .replace(/\\/g, '/')
              .replace('.md', '')
              .split('docs')[1],
        });
        // get article hast
        this.saveArticle(content, data, fPath);
      }
      if (parent.label) {
        dirs.push(parent);
      }
    });
    return this.catlogs;
  }

  async saveArticle(content = '', data = {} as {}, fPath: string) {
    let meta = {} as IMeta;
    let children: IElement[] = [];
    let tocs = [];
    const startTime = process.hrtime();
    const fileName = getArticleName(fPath).replace(/\//g, '-');

    try {
      const res = await getResolvedMarkdown(content, data, fPath);
      const toc = res.content.find((v) => isToc(v));
      meta = res.meta;
      children = res.content;
      tocs = toc ? toc.children : [];
    } catch (error) {
      if (error) {
        console.error(chalk.red(error));
      }
    }

    const result = {
      meta,
      tocs: getTocMap(
        tocs.filter(
          (v) => v.type !== 'text' && v.children && v.children.length > 0
        )
      ),
      children: children.filter((v) => !isToc(v)),
    };

    fs.writeFileSync(
      path.join(this.outputDir, `${fileName}.json`),
      JSON.stringify(result)
    );

    const [s, ns] = process.hrtime(startTime);
    console.info(
      chalk.blue(
        `Parsed ${fPath.split('docs')[1]} files in ${chalk.green(
          `${s}.${Math.round(ns / 1e8)} seconds`
        )}`
      )
    );
  }
}

/**
 * =============================
 * some tools
 * =============================
 */

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
