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
