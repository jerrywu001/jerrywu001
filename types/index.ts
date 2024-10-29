export interface ITableOfContent {
  archor: string;
  label: string;
  children: ITableOfContent[];
  class: string;
  depth?: number;
}

export interface IElementProps extends Record<string, any> {
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

export interface SiteUser {
  role?: Role;
  userId: string;
  email: string;
  nickname: string | null;
  avatar: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface IBlog {
  postId: string;
  title: string;
  keywords?: string;
  description?: string;
  source: string;
  content: IElement[];
  tags: Tag[];
  tocs: ITableOfContent[];
  cover?: string;
  likes?: BlogLike[];
  comments?: BlogComment[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  author?: SiteUser;
}

export interface BlogLike {
  likeId: string;
  count: number;
  createdAt: Date;
  updatedAt: Date;
  blogId: string;
  blog: IBlog;
  uid: string;
  user?: SiteUser;
}

export interface BlogComment {
  commentId: string;
  parentCommentId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  blogId: string;
  blog: IBlog;
  uid: string;
  user?: SiteUser;
}

export interface Tag {
  id?: string;
  name: string;
  _count?: {blogs: number};
}

export interface ISavePost {
  postId: string;
  title: string;
  source: string;
  content: any[];
  tags: Tag[];
  prevTags?: Tag[];
  tocs: any[];
  cover?: string;
  description?: string;
  keywords?: string;
}

export interface IQueyPosts {
  keyword?: string;
  authorId?: string;
  tags?: Tag[];
  content?: string;
}
