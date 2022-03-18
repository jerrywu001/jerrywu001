import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import chalk from 'chalk';
import { Hookable } from 'hookable';
import { getArticleName, getResolvedMarkdown } from './remark';
import { ICategory, IElement, IMeta, ITableOfContent } from '~~/types';

type WatchEvent = 'add' | 'addDir' | 'change' | 'unlink' | 'unlinkDir';

export interface MdOption {
  rootDir: string;
  docsDir: string;
}

export default class MdTransform extends Hookable {
  rootDir = '';
  docsDir = '';
  outputDir = '';
  catlogs = [] as ICategory[];

  constructor(options: MdOption) {
    super();
    this.rootDir = options.rootDir;
    this.docsDir = options.docsDir;
    this.outputDir = path.join(this.rootDir, 'public/content');
  }

  init() {
    this.updateCategories();
  }

  async updateCategories(build = true) {
    const catlogs = await this.getCatlogs(undefined, undefined, build);
    const catlogDir = path.join(this.outputDir, 'categories.json');

    fs.writeFileSync(catlogDir, JSON.stringify(catlogs));
  }

  async getCatlogs(
    base = this.docsDir,
    dirs = this.catlogs as ICategory[],
    build = true
  ) {
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
        this.getCatlogs(fPath, parent.children, build);
      }
      if (stat.isFile() && fPath.endsWith('.md')) {
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
        if (build) {
          this.saveArticle(content, data, fPath);
        }
      }
      if (parent.label) {
        dirs.push(parent);
      }
    });
    return this.catlogs;
  }

  async onFileChange(event: WatchEvent, url: string) {
    await this.transformFileOnChange(event, url);
    this.callHook('file:transformed', event, `docs${url}`);
  }

  async transformFileOnChange(event: WatchEvent, url: string) {
    switch (event) {
      case 'add':
        if (url.endsWith('.md')) {
          this.catlogs = [];
          await this.updateTransform(url);
          this.updateCategories(false);
        } else {
          console.warn('只支持新增md格式文件');
        }
        break;
      case 'change':
        this.updateTransform(url);
        break;
      case 'unlink':
        if (url.endsWith('.md')) {
          const mdPath = path.join(this.docsDir, url);
          const fileName = getArticleName(mdPath).replace(/\//g, '-');

          await fs.unlinkSync(path.join(this.outputDir, `${fileName}.json`));

          this.catlogs = [];
          this.updateCategories(false);
        }
        break;
      default:
        break;
    }
  }

  async updateTransform(url = '') {
    const mdPath = path.join(this.docsDir, url);
    const str = fs.readFileSync(mdPath, { encoding: 'utf-8' });
    const { content, data } = matter(String(str));
    await this.saveArticle(content, data, mdPath);
  }

  async saveArticle(content: string, data, mdPath = '') {
    let meta = {} as IMeta;
    let children: IElement[] = [];
    let tocs = [];
    const startTime = process.hrtime();
    const fileName = getArticleName(mdPath).replace(/\//g, '-');

    try {
      const res = await getResolvedMarkdown(content, data, mdPath);
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
        `Parsed ${mdPath.split('docs')[1]} files in ${chalk.green(
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
