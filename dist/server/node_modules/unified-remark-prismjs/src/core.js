const path = require('path');
const parse5 = require('parse5');
const htmlparser2Adapter = require('parse5-htmlparser2-tree-adapter');

function getNormalizedMeta(meta) {
  meta = meta || '';
  // for example
  // { 5, 2,3, 6 - 9, 8-12} [ layouts / default.js class = " abc, fgh,  ji" class = " sss" hidden ='  true' ]
  // ---> {5,2,3,6-9,8-12}[layouts/default.js class="abc,fgh,ji" class="sss" hidden='true']
  return (
    meta
      // .replace(/\s+/g, ' ')
      .replace(/\s*-\s*/g, '-')
      .replace(/\s*,\s*/g, ',')
      .replace(/\s*=\s*/g, '=')
      .replace(/\s*{\s*/g, '{')
      .replace(/\s*}\s*/g, '}')
      .replace(/\s*\[\s*/g, '[')
      .replace(/\s*\]\s*/g, ']')
      .replace(/\s*\/\s*/g, '/')
      .replace(/="\s*/g, '="')
      .replace(/='\s*/g, "='")
      .replace(/\s*"/g, '"')
  );
}

function getAllGroups(meta) {
  meta = meta || '';
  const splitChar = '@#@#@';
  meta = getNormalizedMeta(meta);
  return meta
    .replace(/(\w+)=([\w-]+\b)/g, '$1="$2"')
    .replace(/\]\[/g, splitChar)
    .replace(/\]/g, splitChar)
    .replace(/\[/g, splitChar)
    .replace(/'\s/g, `'${splitChar}`)
    .replace(/"\s/g, `"${splitChar}`)
    .replace(/\sclass=/g, `${splitChar}class=`)
    .split(splitChar)
    .filter(Boolean);
}

/**
 * @param {string} lang node.lang
 * @param {string} meta node.meta
 * @returns
 * ```js
 * // example
 * {
 *   lang: 'js',
 *   data-line: '2,3,5,6-9',
 *   filename: 'xxx.js',
 *   className: ['xxx', 'xxxx'],
 *   restProps1: 'value',
 *   restProps2: 'value',
 *   // ...
 * }
 * ```
 */
function getCodeAttributes({ lang, meta }) {
  meta = meta || '';
  lang = lang || '';
  const result = { lang };
  let classNames = [];
  const attrs = getAllGroups(meta);
  for (let attr of attrs) {
    if (attr.startsWith('{')) {
      const lines = attr.substring(1, attr.length - 1);
      if (lines) {
        result['data-line'] = lines;
      }
    } else if (attr.startsWith('class=')) {
      // class
      attr = attr
        .replace(/"/g, '')
        .replace(/'/g, '')
        .replace(/,/g, ' ')
        .replace(/class=/g, '');
      const classList = attr.split(' ');
      classNames = classNames.concat(classList);
    } else if (attr.includes('=')) {
      // other
      const [key, value] = attr.split('=');
      result[key] = value.replace(/"/g, '').replace(/'/g, '');
    } else if (attr.includes('.')) {
      // filename, like 'xxx/xxx.spec.ts' 'xxx/xxx.js'  'xxx.js'
      result.filename = attr;
    } else {
      // single attribute, like disabled
      const allSingles = attr.split(' ');
      for (const single of allSingles) {
        result[single] = single;
      }
    }
  }
  result.className = Array.from(new Set(classNames));
  return result;
}

function html2hast(html) {
  const document = parse5.parse(html, {
    treeAdapter: htmlparser2Adapter,
  });

  const toHast = ({ type, name, attribs = {}, data: value, children = [] }) => {
    const { class: className = '', ...attrs } = attribs;

    const _children = children.map(toHast);
    const properties = {
      ...attrs,
      className: className.split(/\s/).filter(Boolean),
    };

    return {
      type: type === 'tag' ? 'element' : 'text',
      value,
      tagName: name,
      data: {
        hName: name,
        hProperties: properties,
        hChildren: _children,
      },
      properties,
      children: _children,
    };
  };

  return document.children
    .pop()
    .children.find(({ name }) => name === 'body')
    .children.map(toHast);
}

function h(type, properties = {}, children = []) {
  return {
    type: 'element',
    tagName: type,
    data: {
      hName: type,
      hProperties: properties,
      hChildren: children,
    },
    properties,
    children,
  };
}

const PLUGINS = [
  'autolinker',
  'show-invisibles',
  'data-uri-highlight',
  'diff-highlight',
  'inline-color',
  'line-numbers',
  'command-line',
  'treeview',
];

const modulesDir = path.join(process.cwd(), 'node_modules');

function normalizeCodeNode(node) {
  let { lang = '', meta } = node;
  meta = meta || '';
  const firstChar = lang.charAt(0);
  const existBracket = lang.includes('{') || lang.includes('[');
  if (existBracket && !['{', '['].includes(firstChar)) {
    let index = 0;
    lang = meta ? `${lang} ${meta}` : lang;
    const objectBracketIdx = lang.indexOf('{');
    const arrBracketIdx = lang.indexOf('[');
    const onlyObjectBracket = arrBracketIdx === -1;
    const onlyArrBracket = objectBracketIdx === -1;
    const hasBoth = !onlyObjectBracket && !onlyArrBracket;
    if (hasBoth) {
      index =
        objectBracketIdx < arrBracketIdx ? objectBracketIdx : arrBracketIdx;
    } else {
      index = onlyObjectBracket ? objectBracketIdx : 0;
      index = onlyArrBracket ? arrBracketIdx : index;
    }
    node.lang = lang.substring(0, index);
    node.meta = lang.substring(index, lang.length);
    convertSomeLang(node);
  } else {
    convertSomeLang(node);
  }
}

function convertSomeLang(node) {
  if (node.lang === 'vue') {
    node.lang = 'html';
  }
  if (node.lang === 'sh' || node.lang === 'shell') {
    node.lang = 'bash';
  }
}

module.exports.getCodeAttributes = getCodeAttributes;
module.exports.h = h;
module.exports.PLUGINS = PLUGINS;
module.exports.html2hast = html2hast;
module.exports.modulesDir = modulesDir;
module.exports.normalizeCodeNode = normalizeCodeNode;
