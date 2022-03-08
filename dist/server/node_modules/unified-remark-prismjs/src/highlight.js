const { readFileSync } = require('fs');
const { createContext, runInContext } = require('vm');
const path = require('path');
const { JSDOM } = require('jsdom');
const escapeHtml = require('escape-html');
const components = require('prismjs/components.json');
const getLoader = require('prismjs/dependencies.js');
const { html2hast, modulesDir, PLUGINS } = require('./core.js');

const domHighlight = (value, attrs = {}, range = []) => {
  const highlightBg =
    'background: rgba(0, 0, 0, .08); background: linear-gradient(to right, rgba(0, 0, 0, .08), rgba(0, 0, 0, 0));';
  const MULTILINE_TOKEN_SPAN =
    /<span class="token ([^"]+)">[^<]*\n[^<]*<\/span>/g;

  // eslint-disable-next-line no-undef
  const pre = window.document.createElement('pre');
  // eslint-disable-next-line no-undef
  const code = window.document.createElement('code');

  for (const [key, value] of Object.entries(attrs)) {
    pre.setAttribute(key, value);
    code.setAttribute(key, value);
  }

  code.textContent = value;
  pre.appendChild(code);

  // eslint-disable-next-line no-undef
  window.Prism.highlightElement(code);

  return code.innerHTML
    .replace(MULTILINE_TOKEN_SPAN, (match, token) => {
      return match.replace(/\n/g, `</span>\n<span class="token ${token}">`);
    })
    .split(/\n/)
    .reduce((memo, line, idx) => {
      const matched = range.includes(idx + 1);
      return memo.concat(
        matched
          ? `<span class="remark-highlight-code-line" style="display: block; ${highlightBg}">${line}\n</span>`
          : `${line}\n`
      );
    }, '');
};

const loadLanguages = (parsingContext) => {
  const loadedLanguages = new Set();

  const languages = Object.keys(components.languages).filter(
    (l) => l !== 'meta'
  );

  const loaded = [
    ...loadedLanguages,
    ...Object.keys(parsingContext.Prism.languages),
  ];

  getLoader(components, languages, loaded).load((lang) => {
    if (!(lang in components.languages)) {
      console.warn('Language does not exist: ' + lang);
      return;
    }

    const filename = path.join(
      modulesDir,
      `prismjs/components/prism-${lang}.js`
    );
    runInContext(RUN(readFileSync(filename, 'utf-8')), parsingContext, {
      filename,
    });

    loadedLanguages.add(lang);
  });

  return Object.entries(components.languages).reduce(
    (memo, [name, { alias }]) => {
      return memo.concat(name).concat(alias).filter(Boolean);
    },
    []
  );
};

const RUN = (src) => {
  return `
    window.Prism = Prism;
    try {
      const self = window;
      ${src};
    } catch(err) {
      console.error(err);
    };
  `;
};

module.exports = function ({ plugins = [] }) {
  const { window } = new JSDOM('');
  const parsingContext = createContext(window);

  const prismjs = path.join(modulesDir, 'prismjs/prism.js');
  runInContext(RUN(readFileSync(prismjs, 'utf-8')), parsingContext, {
    filename: prismjs,
  });

  // load languages into the Prism object
  const languages = loadLanguages(parsingContext);
  const highlightElement = runInContext(
    domHighlight.toString(),
    parsingContext
  );

  // load plugins into the Prism object
  plugins.forEach((pl) => {
    const plugin = PLUGINS.includes(pl)
      ? `prismjs/plugins/${pl}/prism-${pl}`
      : pl;

    const filename = path.join(modulesDir, `${plugin}.js`);
    return runInContext(RUN(readFileSync(filename, 'utf-8')), parsingContext, {
      filename,
    });
  });

  return ({ lang, value, attrs, range }) => {
    const fallback = () => {
      return [
        {
          type: 'text',
          value: escapeHtml(value),
        },
      ];
    };

    if (!lang) {
      fallback();
    }

    const isAvailableLang = languages.includes(lang.replace(/^diff-/, ''));
    const { className = [] } = attrs;

    if (!isAvailableLang && lang !== 'treeview') {
      return fallback();
    }

    attrs.class = className.join(' ');
    delete attrs.className;

    return html2hast(highlightElement(value, attrs, range));
  };
}
