import { HTMLAttributes } from 'nuxt3/dist/app/compat/capi';

export interface ITableOfContent {
  archor: string;
  label: string;
  children: ITableOfContent[];
  class: string;
}

export interface IElementProps extends HTMLAttributes {
  id?: string;
  className?: string[];
  href?: string;
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
  children?: ICategory[];
}

export interface IArticleData {
  meta: IMeta;
  tocs: ITableOfContent[];
  children: IElement[];
  categories: ICategory[];
  code: number;
}
