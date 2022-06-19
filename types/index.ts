import { HTMLAttributes } from 'nuxt/dist/app/compat/capi';

export interface ITableOfContent {
  archor: string;
  label: string;
  children: ITableOfContent[];
  class: string;
  depth?: number;
}

export interface IElementProps extends HTMLAttributes {
  id?: string;
  className?: string[];
  href?: string;
  __ignoreMap?: any;
}

export interface IElement {
  type: string;
  tag: string;
  value?: string;
  props: IElementProps;
  children: IElement[];
  content?: IElement[];
}

export interface IHast {
  type: string;
  tagName: string;
  properties: IElementProps;
  value?: any;
  children?: IHast[];
}

export interface IMeta {
  title: string;
  description: string;
  category: string;
  createAt: string;
  hasTitle: boolean;
  cover?: string;
  [key: string]: any;
}

export interface ICategory {
  label?: string;
  url?: string;
  depth?: number;
  children?: ICategory[];
}

export interface IArticleData {
  meta: IMeta;
  tocs: ITableOfContent[];
  children: IElement[];
  categories: ICategory[];
  code: number;
}

export interface ParsedContentMeta {
  /**
   * Content id
   */
  _id: string;
  /**
   * Content source
   */
  _source?: string;
  /**
   * Content path, this path is source agnostic and it the content my live in any source
   */
  _path?: string;
  /**
   * Content title
   */
  title?: string;
  /**
   * Content draft status
   */
  _draft?: boolean;
  /**
   * Content partial status
   */
  _partial?: boolean;
  /**
   * Content locale
   */
  _locale?: boolean;
  /**
   * File type of the content, i.e `markdown`
   */
  _type?: string;
  /**
   * Path to the file relative to the content directory
   */
  _file?: string;
  /**
   * Extension of the file
   */
  _extension?: string;

  [key: string]: any;
}

//
export interface MarkdownNode {
  type: string;
  tag?: string;
  value?: string;
  props?: Record<string, any>;
  content?: any;
  children?: MarkdownNode[];

  attributes?: Record<string, any>;
  fmAttributes?: Record<string, any>;
}
