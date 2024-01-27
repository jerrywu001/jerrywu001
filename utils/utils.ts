import type { VNode } from 'vue';
import type { User } from '@supabase/supabase-js';
import type { MarkdownNode, SiteUser } from '~~/types';
import mermaid from 'mermaid';

export function isCDNAvatar(avatar: string | null) {
  return (avatar || '').includes('ik.imagekit.io');
}

export function formatSiteUser(u: User): SiteUser {
  const meta = u?.user_metadata;

  return {
    userId: u?.id,
    email: u?.email as string,
    nickname: meta?.user_name || meta?.name || (u.email as string),
    avatar: meta?.avatar_url || meta?.avatar,
  };
}

/**
 * List of text nodes
 */
export const TEXT_TAGS = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li'];

/**
 * Check virtual node's tag
 * @param vnode Virtuel node from Vue virtual DOM
 * @param tag tag name
 * @returns `true` it the virtual node match the tag
 */
export function isTag(
  vnode: VNode | MarkdownNode,
  tag: string | symbol,
): boolean {
  // Vue 3 uses `type` instead of `tag`
  if (vnode.type === tag) {
    return true;
  }
  // Vue 3 VNode `type` can be an object (tag is provided by MarkdownRenderer)
  if (typeof vnode.type === 'object' && (vnode.type as any).tag === tag) {
    return true;
  }
  // Markdown node
  if ((vnode as MarkdownNode).tag === tag) {
    return true;
  }
  return false;
}

/**
 * Check if virtual node is text node
 */
export function isText(vnode: VNode | MarkdownNode): boolean {
  return isTag(vnode, 'text') || typeof vnode.children === 'string';
}

/**
 * Find children of a virtual node
 * @param vnode Virtuel node from Vue virtual DOM
 * @returns Children of given node
 */
export function nodeChildren(node: VNode | MarkdownNode) {
  if (Array.isArray(node.children) || typeof node.children === 'string') {
    return node.children;
  }
  // Vue3 VNode children
  if (typeof node.children?.default === 'function') {
    return node.children.default();
  }
  return [];
}

/**
 * Calculate text content of a virtual node
 * @param vnode Virtuel node from Vue virtual DOM
 * @returns text content of given node
 */
export function nodeTextContent(node: VNode | MarkdownNode): string {
  // Return empty string is vnode is falsy
  if (!node) {
    return '';
  }

  if (Array.isArray(node)) {
    return node.map(nodeTextContent).join('');
  }

  if (node && isText(node)) {
    // @ts-ignore
    return (node.children as string) || (node as MarkdownNode).value;
  }

  // Walk through node children
  const children = nodeChildren(node);
  if (Array.isArray(children)) {
    return children.map(nodeTextContent).join('');
  }

  // Return empty string for non-text nodes without any children
  return '';
}

/**
 * Unwrap tags within a virtual node
 * @param vnode Virtuel node from Vue virtual DOM
 * @param tags list of tags to unwrap
 * @returns
 */
export function unwrap(vnode: VNode, tags = ['p']): VNode | VNode[] {
  if (Array.isArray(vnode)) {
    return vnode.flatMap((node) => unwrap(node, tags));
  }

  let result: VNode | VNode[] = vnode;

  // unwrap children
  if (tags.some((tag) => tag === '*' || isTag(vnode, tag))) {
    result = nodeChildren(vnode) || vnode;
    if (!Array.isArray(result) && TEXT_TAGS.some((tag) => isTag(vnode, tag))) {
      result = [result];
    }
  }

  return result;
}

export function flatUnwrap(vnodes: VNode | VNode[], tags = ['p']): VNode[] {
  vnodes = Array.isArray(vnodes) ? vnodes : [vnodes];

  if (!tags.length) {
    return vnodes;
  }

  return vnodes
    .flatMap((vnode) => flatUnwrap(unwrap(vnode, [tags[0]]), tags.slice(1)))
    .filter(
      (vnode) => !(isText(vnode) && nodeTextContent(vnode).trim() === ''),
    );
}

export const useUnwrap = () => ({
  unwrap,
  flatUnwrap,
});

export function validEmail(email = '') {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}

export function getDateTimeStr(date: Date) {
  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  const hour = dateObj.getHours();
  const minute = dateObj.getMinutes();
  const second = dateObj.getSeconds();

  const addZero = (num: number) => {
    return num < 10 ? `0${num}` : num;
  };

  return `${year}-${addZero(month)}-${addZero(day)} ${addZero(hour)}:${addZero(minute)}:${addZero(second)}`;
}

export function isUUID(str?: string) {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str || '');
}

/** a function to generate a uuid */
export function uuid() {
  let d = Date.now();
  if (
    typeof performance !== 'undefined' &&
    typeof performance.now === 'function'
  ) {
    d += performance.now();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = ((d + Math.random() * 16) % 16) | 0;
    d = Math.floor(d / 16);

    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export const toolbars = [
  'bold',
  'underline',
  'italic',
  '-',
  'title',
  'strikeThrough',
  'sub',
  'sup',
  'quote',
  'unorderedList',
  'orderedList',
  'task',
  '-',
  'codeRow',
  'code',
  'link',
  'image',
  'table',
  'katex',
  'mermaid',
  0,
  '-',
  'revoke',
  'next',
  '=',
  'pageFullscreen',
  'fullscreen',
  'catalog',
] as any[];

export function getDefaultMdVnodes() {
  return {
    title: '',
    source: '## hello',
    content: [
      {
        type: 'text',
        value: '\n',
      },
      {
        type: 'element',
        tag: 'h2',
        props: {
          id: 'hello',
          className: [],
        },
        children: [
          {
            type: 'element',
            tag: 'a',
            props: {
              href: '#hello',
              className: [],
            },
            children: [
              {
                type: 'text',
                value: 'hello',
              },
            ],
            content: [],
          },
        ],
        content: [],
      },
      {
        type: 'text',
        value: '\n',
      },
    ],
    tocs: [
      {
        depth: 1,
        class: 'toc-link toc-link-h2',
        label: 'hello>',
        archor: '#hello',
      },
    ],
  };
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = function (event: any) {
      const base64String = event.target.result.split(',')[1];
      resolve(base64String);
    };

    reader.onerror = function (event: any) {
      resolve('');
    };

    reader.readAsDataURL(file);
  });
}

export function parseDomFromString(htmlString = '') {
  if (!htmlString) return null;

  const parser = new DOMParser();
  const docFragment = parser.parseFromString(htmlString, 'text/html').body;

  return docFragment.firstElementChild as HTMLElement;
}

export function replaceMdSyntax(resolveMd = false) {
  if (resolveMd) {
    setTimeout(() => {
      const pres = document.querySelectorAll('pre.language-md');
      const items = [...(pres || [])];
      items.forEach((pre) => {
        const html = pre.innerHTML.replace(/\\`\\`\\`/g, '```');
        const newDom = parseDomFromString(html);
        pre.innerHTML = '';
        pre.appendChild(newDom as HTMLElement);
      });
    }, 500);
  }

  const mdScroller = document.querySelector('.cm-scroller');
  const viewScroller = document.getElementById('content');

  if (mdScroller && viewScroller) {
    mdScroller.addEventListener('scroll', () => {
      viewScroller.scrollTop = mdScroller.scrollTop;
    });
    viewScroller.addEventListener('scroll', () => {
      mdScroller.scrollTop = viewScroller.scrollTop;
    });
  }
}

export const toggleVisibleAnimation = (toVisible: boolean, container: HTMLElement | null) => {
  container?.classList?.[toVisible ? 'add' : 'remove']('!translate-y-[80px]');
  if (toVisible) {
    container?.classList?.remove('hidden');
    setTimeout(() => {
      container?.classList?.add('opacity-100');
      container?.classList?.remove('!translate-y-[80px]');
      container?.classList?.add('!translate-y-[105px]');
    });
  } else {
    container?.classList?.remove('opacity-100');
    container?.classList?.remove('!translate-y-[105px]');
    container?.classList?.add('!translate-y-[80px]');
    setTimeout(() => {
      container?.classList?.add('hidden');
    }, 200);
  }
};

export function initMermaid() {
  const pres = document.querySelectorAll('pre.language-mermaid');

  const renderMermaid = () => {
    mermaid.initialize({ startOnLoad: true });

    mermaid.run({ querySelector: 'pre.language-mermaid' });
  };

  if (pres?.length) {
    // @ts-ignore
    pres.forEach((pre: HTMLPreElement) => {
      const div = pre.parentElement as HTMLDivElement;
      const codeContent = div.getAttribute('code');
      pre.classList.add('mermaid');
      pre.classList.remove('line-numbers');
      pre.innerHTML = codeContent || '';
      delete pre.dataset.processed;
    });

    renderMermaid();
  }
}
