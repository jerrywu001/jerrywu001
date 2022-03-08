const map = require('unist-util-map');
const rangeParse = require('parse-numeric-range');
const createHighlighter = require('./highlight.js');
const { normalizeCodeNode, h, getCodeAttributes } = require('./core.js');

const remarkPrism =
  (options = {}) =>
  (tree) => {
    const highlight = createHighlighter(options);
    const { plugins = [], showLanguage = false, enableCopy = false } = options;
    const enableLineNumbers =
      plugins.findIndex((v) => v.includes('line-numbers')) > -1;
    const enableCommandLine =
      plugins.findIndex((v) => v.includes('command-line')) > -1;

    return map(tree, (node) => {
      const { type } = node;

      if (!['code'].includes(type)) {
        return node;
      }
      normalizeCodeNode(node);

      if (node.meta === null) {
        node.meta = '[]';
      }

      if (
        enableCommandLine &&
        ['shell-session', 'shellsession', 'sh-session', 'bash'].includes(
          node.lang
        ) &&
        node.meta &&
        !node.meta.includes('command-line') &&
        !node.meta.includes('no-command-line')
      ) {
        node.meta = `[class=command-line]${node.meta}`;
      }

      if (
        enableLineNumbers &&
        node.meta &&
        !node.meta.includes('line-numbers') &&
        !node.meta.includes('no-line-numbers')
      ) {
        node.meta = `[class=line-numbers]${node.meta}`;
      }

      if (
        node.meta.includes('=command-line') &&
        node.meta.includes('=line-numbers')
      ) {
        node.meta = node.meta.replace(/=line-numbers/, '=no-line-numbers');
      }

      const { value, children = [] } = node;
      const attrs = getCodeAttributes(node);
      const { lang = 'unknown', filename = '', className = [] } = attrs;
      const range = rangeParse(attrs['data-line'] || '');
      const langClassName = `language-${lang}`;
      className.push(langClassName);

      delete attrs.filename;
      delete attrs.lang;

      const code = h(
        'code',
        { className: langClassName },
        highlight({
          lang,
          value:
            value ||
            children
              .filter(({ type }) => type === 'text')
              .map(({ value }) => value)
              .pop(),
          attrs,
          range,
        })
      );

      const pre = h(
        'div',
        { className: 'remark-highlight', style: 'position: relative' },
        [
          h(
            'pre',
            {
              ...attrs,
              className,
            },
            [code]
          ),
          filename
            ? h(
                'span',
                {
                  className: 'filename',
                  style: 'position: absolute;',
                },
                [{ type: 'text', value: filename }]
              )
            : null,
          showLanguage
            ? h(
                'span',
                {
                  className: 'code-lang-tag',
                  style: 'position: absolute;',
                },
                [{ type: 'text', value: lang }]
              )
            : null,
          enableCopy
            ? h(
                'span',
                {
                  className: 'code-copy-block',
                  style: 'position: absolute;',
                  title: 'copy',
                  onclick: `
                    const btnDom = this;
                    const parent = btnDom.parentElement;
                    const preDom = parent.querySelector('pre');
                    const codeDom = preDom.firstElementChild;
                    const content = codeDom.innerText;

                    var copyarea = document.createElement('textarea');
                    copyarea.setAttribute('readonly', 'readonly');
                    copyarea.value = content;
                    document.body.appendChild(copyarea);
                    copyarea.select();
                    var res = document.execCommand('copy');
                    document.body.removeChild(copyarea);
                    btnDom.classList.add('code-copied');
                    setTimeout(() => {
                      btnDom.classList.remove('code-copied');
                    }, 1600);
                  `
                },
                [{ type: 'text', value: '' }]
              )
            : null,
        ].filter(Boolean)
      );

      return /^inline/.test(type) ? code : pre;
    });
  };

module.exports = remarkPrism;
