export const TAGS_MAP = {
  h1: ['h1', 'prose-h1'],
  h2: ['h2', 'prose-h2'],
  h3: ['h3', 'prose-h3'],
  h4: ['h4', 'prose-h4'],
  h5: ['h5', 'prose-h5'],
  h6: ['h6', 'prose-h6'],
  hr: ['hr', 'prose-hr'],
  p: ['p', 'prose-paragraph'],
  ul: ['ul', 'prose-ul'],
  ol: ['ol', 'prose-ol'],
  blockquote: ['blockquote', 'prose-blockquote'],
  img: ['img', 'prose-img'],
  a: ['a', 'prose-a'],
  code: ['code', 'prose-code-inline'],
};
export const expandTags = (_tags) => _tags.flatMap((t) => TAGS_MAP[t]);
export const TEXT_TAGS = expandTags([
  'p',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'li',
]);
export function isTag(vnode, tag) {
  return (
    vnode?.tag === tag ||
    vnode?.componentOptions?.tag === tag ||
    vnode?.asyncMeta?.tag === tag
  );
}
export function nodeChildren(node) {
  return (
    node.children ||
    node?.componentOptions?.children ||
    node?.asyncMeta?.children
  );
}
export function nodeTextContent(node) {
  if (!node) return '';
  if (Array.isArray(node)) {
    return node.map(nodeTextContent).join('');
  }
  if (node.type === 'text') {
    return node.value;
  }
  if (node.text) {
    return node.text;
  }
  const children = nodeChildren(node);
  if (Array.isArray(children)) {
    return children.map(nodeTextContent).join('');
  }
  return '';
}
export function unwrap(vnode, tags = ['p']) {
  if (Array.isArray(vnode)) {
    return vnode.flatMap((node) => unwrap(node, tags));
  }
  tags = expandTags(tags);
  let result = vnode;
  if (tags.some((tag) => isTag(vnode, tag))) {
    result = nodeChildren(vnode) || vnode;
    if (TEXT_TAGS.some((tag) => isTag(vnode, tag))) {
      result = [result];
    }
  }
  return result;
}
export function flatUnwrap(vnodes, tags = ['p']) {
  const result = [];
  const list = (Array.isArray(vnodes) ? vnodes : [vnodes])
    .flatMap((vnode) => unwrap(vnode, tags))
    .flatMap((vnode) => unwrap(vnode, tags))
    .filter((vnode) => !vnode.text || !!vnode.text.trim());
  list.forEach((v) => {
    if (typeof v !== 'string' || (typeof v === 'string' && !!v.trim())) {
      result.push(v);
    }
  });
  return result.filter(Boolean);
}

/**
 * 异步加载 JS
 * @param scriptUrl
 * resolve(true) 加载成功
 * reject(error) 加载失败(error 需要用try/catch去捕获)
 */
export function loadScript(scriptUrl: string, id: string) {
  return new Promise<boolean>((resolve, reject) => {
    console.log(`[system] loadScript: 准备加载 "${scriptUrl}"`);
    if (document.getElementById(id)) {
      resolve(true);
    } else {
      const scriptElement = document.createElement('script');
      scriptElement.id = id;
      scriptElement.src = scriptUrl;
      scriptElement.async = true;
      scriptElement.onload = () => {
        console.log(`[system] loadScript: "${scriptUrl}" 加载成功`);
        resolve(true);
      };
      scriptElement.onerror = (error) => {
        console.error(`[system] loadScript: "${scriptUrl}" 加载失败`);
        reject(error);
      };
      document.head.appendChild(scriptElement);
    }
  });
}

/**
 * 异步加载 Css
 * @param styleUrl
 * resolve(true) 加载成功
 * reject(error) 加载失败(error 需要用try/catch去捕获)
 */
export function loadStyle(styleUrl: string, id: string) {
  return new Promise<boolean>((resolve, reject) => {
    console.log(`[system] loadStyle: 准备加载 "${styleUrl}"`);
    if (document.getElementById(id)) {
      document.getElementById(id).remove();
    }
    const styleElement = document.createElement('link');
    styleElement.id = id;
    styleElement.rel = 'stylesheet';
    styleElement.href = styleUrl;
    styleElement.onload = () => {
      console.log(`[system] loadStyle: "${styleUrl}" 加载成功`);
      resolve(true);
    };
    styleElement.onerror = (error) => {
      console.error(`[system] loadStyle: "${styleUrl}" 加载失败`);
      reject(error);
    };
    document.head.appendChild(styleElement);
  });
}
