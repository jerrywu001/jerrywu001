/* eslint-disable prettier/prettier */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import chalk from 'chalk';
import { Hookable } from 'hookable';
import { getArticleName, getResolvedMarkdown } from './remark';
import { ICategory, IElement, IMeta, ITableOfContent } from '~~/types';

type WatchEvent = 'add' | 'addDir' | 'change' | 'unlink' | 'unlinkDir';

export interface MdOption {
  /** 项目根目录 */
  rootDir: string;
  /** md文件位置 */
  docsPath: string;
  /** md编译结果位置 */
  outputDir?: string;
  /** Directory used for writing content. */
  docsDirName: string;
  /**
   * You can change maximum heading depth to include in the table of contents
   * @default 3
   */
  tocDepth?: number;
  /**
   * You can change maximum depth to include in the sidebar
   * @default 2
   */
  sidebarDepth?: number;
}

export default class MdTransform extends Hookable implements MdOption {
  rootDir = '';
  docsPath = '';
  outputDir = '';
  docsDirName = '';
  sidebarDepth = 2;
  tocDepth = 3;
  catlogs = [] as ICategory[];

  constructor(options: MdOption) {
    super();
    this.rootDir = options.rootDir;
    this.docsPath = options.docsPath;
    this.docsDirName = options.docsDirName;
    this.tocDepth = options.tocDepth;
    this.sidebarDepth = options.sidebarDepth;
    this.outputDir = path.join(this.rootDir, 'public/content');
  }

  init() {
    this.updateCategories();
  }

  /**
   * 更新sidebar分类
   * @param build {boolean} 是否重新编译md文件
   */
  updateCategories(build = true) {
    this.travelDirs(undefined, undefined, build);
    const catlogDir = path.join(this.outputDir, 'categories.json');

    fs.writeFileSync(catlogDir, JSON.stringify(this.catlogs));
  }

  /** 递归目录，并编译md文件 */
  travelDirs(base = this.docsPath, dirs = this.catlogs, build = true) {
    const files = fs.readdirSync(base);
    files.forEach((item) => {
      const fPath = path.join(base, item);
      const { folder, depth } = getStat(fPath, this.docsDirName);
      const stat = fs.statSync(fPath);

      if (stat.isDirectory()) {
        if (!isEmptyDir(fPath) && depth <= this.sidebarDepth) {
          const obj = {
            label: folder.replace(/-/g, ' '),
            children: [],
            depth,
          } as ICategory;
          dirs.unshift(obj);
          this.travelDirs(fPath, obj.children, build);
        }
      } else if (fPath.endsWith('.md') && depth <= this.sidebarDepth + 1) {
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

        const url = fPath
          .replace(/\\\\/g, '/')
          .replace(/\\/g, '/')
          .replace('.md', '')
          .split(`/${this.docsDirName}`)[1];
        dirs.push({
          depth,
          label: (title || articleName).replace(/#\s*/g, ''),
          url: `/posts/${url.substring(1).replace(/\//g, '_')}`,
          children: [],
        });

        // get article hast
        if (build) {
          this.saveArticle(content, data, fPath);
        }
      }
    });
  }

  async onFileChange(event: WatchEvent, url: string) {
    await this.transformFileOnChange(event, url);
    this.callHook('file:transformed', event, this.docsDirName + url);
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
        await this.updateTransform(url);

        this.catlogs = [];
        this.updateCategories(false);
        break;
      case 'unlink':
        if (url.endsWith('.md')) {
          const mdPath = path.join(this.docsPath, url);
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
    const mdPath = path.join(this.docsPath, url);
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
      tocs: getTableOfContents(
        tocs.filter(
          (v) => v.type !== 'text' && v.children && v.children.length > 0
        ),
        1,
        this.tocDepth
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
        `Parsed ${mdPath.split(this.docsDirName)[1]} files in ${chalk.green(
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

function isEmptyDir(path = '') {
  return fs.readdirSync(path).length === 0;
}

function getStat(fPath: string, docsDirName: string) {
  const relativePath = fPath
    .replace(/\\\\/g, '/')
    .replace(/\\/g, '/')
    .split(`${docsDirName}/`)[1];
  let relPath = relativePath;
  const isFile = relativePath.includes('.');
  if (isFile) {
    relPath = relPath.substring(0, relPath.lastIndexOf('/'));
  }
  const folder = relPath.substring(relPath.lastIndexOf('/') + 1);
  const temp = relPath.substring(0, relPath.lastIndexOf('/'));
  const parentFolder = temp.substring(temp.lastIndexOf('/') + 1);
  return { folder, parentFolder, depth: relativePath.split('/').length };
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
  tocDepth: number
) {
  const result: ITableOfContent[] = [];
  for (let i = 0, len = tocs.length; i < len; i++) {
    const p = tocs[i];
    const item = {} as ITableOfContent;
    const children = p.children || [];
    item.depth = depth;
    for (const c of children) {
      if (c.tag === 'a' && depth <= tocDepth) {
        item.class = (c.props.className || []).join(' ');
        item.label = c.children[0].value;
        item.archor = c.props.href;
      }
      if (
        ['ol', 'ul'].includes(c.tag) &&
        c.children.length > 1 &&
        depth <= tocDepth
      ) {
        item.children = getTableOfContents(c.children, depth + 1, tocDepth);
      }
    }
    if ('archor' in item) {
      result.push(item);
    }
  }
  return result;
}
