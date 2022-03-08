import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeFormat from 'rehype-format';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import rehypeToc from 'rehype-toc';
import remarkDirective from 'remark-directive';
import remarkDirectiveRehype from 'remark-directive-rehype';
import remarkGfm from 'remark-gfm';
import remarkHeadingId from 'remark-heading-id';
import remarkParse from 'remark-parse';
import remarkPrism from 'unified-remark-prismjs';
import remarkRehype from 'remark-rehype';
import remarkSlug from 'remark-slug';
import remarkSqueezeParagraphs from 'remark-squeeze-paragraphs';
import { html2hast } from 'unified-remark-prismjs/src/core.js';
import { read } from 'to-vfile';
import { reporter } from 'vfile-reporter';
import { unified } from 'unified';

function parse2json(node, parent) {
  if (node.type === "element") {
    const childs = [];
    if (node.tagName === "a" && (node.properties.href || "").startsWith("/")) {
      node.tagName = "nuxt-link";
      node.properties.to = node.properties.href;
      delete node.properties.href;
    }
    const filtered = {
      type: "element",
      tag: node.tagName,
      props: node.properties,
      children: childs,
      content: []
    };
    if (node.tagName === "template") {
      const templateContent = [];
      const childList = node.children || [];
      const contentNode = childList[0] ? childList[0] : {};
      (contentNode.children || []).forEach((templateNode) => parse2json(templateNode, templateContent));
      filtered.content = templateContent;
    }
    parent.push(filtered);
    if (node.children) {
      node.children.forEach((child) => parse2json(child, childs));
    }
    return;
  }
  if (node.type === "text") {
    parent.push({
      type: "text",
      value: node.value
    });
    return;
  }
  if (node.type === "root") {
    node.children.forEach((child) => parse2json(child, parent));
  }
}
function parse2json$1(root = []) {
  const result = [];
  parse2json(root, result);
  return {
    type: "root",
    children: result
  };
}

const docsDir = path.join(process.cwd(), "docs");
const getResolvedMarkdown = async (category = "", name = "") => {
  const filePath = path.join(docsDir, `./${category}/${name}.md`);
  if (!fs.existsSync(filePath)) {
    return { code: 404 };
  }
  const str = await read(filePath, { encoding: "utf-8" });
  const { content, data } = matter(String(str));
  const file = await unified().use(remarkParse).use(remarkGfm).use(remarkSqueezeParagraphs).use(remarkHeadingId).use(remarkSlug).use(remarkDirective).use(remarkDirectiveRehype).use(remarkPrism, {
    enableCopy: true,
    plugins: [
      "data-uri-highlight",
      "inline-color",
      "diff-highlight",
      "treeview"
    ]
  }).use(remarkRehype, { allowDangerousHtml: true }).use(rehypeToc, {
    headings: ["h2", "h3", "h4"],
    nav: false,
    cssClasses: {
      toc: "table-of-contents"
    }
  }).use(rehypeAutolinkHeadings, {
    behavior: "wrap",
    test: ["h2", "h3", "h4"]
  }).use(rehypeRaw).use(rehypeFormat).use(rehypeStringify).process(content);
  const hast = html2hast(String(file));
  const res = parse2json$1({ type: "root", children: hast });
  console.error(reporter(file));
  return { data, content: res.children || [] };
};

function isToc(v = {}) {
  return v.tag === "ol" && v.props && v.props.className && v.props.className.includes("table-of-contents");
}
function getTocMap(tocs = []) {
  const result = [];
  for (const p of tocs) {
    const item = {};
    const children = p.children || [];
    for (const c of children) {
      if (c.tag === "a") {
        item.class = (c.props.className || []).join(" ");
        item.label = c.children[0].value;
        item.archor = c.props.href;
      } else if (["ol", "ul"].includes(c.tag) && c.children.length > 1) {
        item.children = getTocMap(c.children);
      }
    }
    if ("archor" in item) {
      result.push(item);
    }
  }
  return result;
}
const post = async (req, res) => {
  let meta = {};
  let children = [];
  let code = 0;
  let tocs = [];
  const query = new URLSearchParams(req.url);
  const category = query.get("category");
  const postname = query.get("postname");
  try {
    const res2 = await getResolvedMarkdown(category, postname);
    const toc = res2.content.find((v) => isToc(v));
    code = res2.code || 0;
    meta = res2.data;
    children = res2.content;
    tocs = toc ? toc.children : [];
  } catch (error) {
    console.error(error);
  }
  return {
    code,
    meta,
    tocs: getTocMap(tocs.filter((v) => v.type !== "text" && v.children && v.children.length > 0)),
    children: children.filter((v) => !isToc(v))
  };
};

export { post as default };
