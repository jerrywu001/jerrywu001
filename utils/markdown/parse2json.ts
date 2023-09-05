/**
 * Parses nodes for JSON structure. Attempts to drop
 * unwanted properties.
 */
function parse2json(node: any, parent: any) {
  /**
   * Element node creates an isolated children array to
   * allow nested elements
   */
  if (node.type === 'element') {
    const childs: any[] = [];

    /**
     * Replace a tag with nuxt-link if relative
     */
    if (node.tagName === 'a' && (node.properties.href || '').startsWith('/')) {
      node.tagName = 'nuxt-link';
      node.properties.to = node.properties.href;
      delete node.properties.href;
    }

    const filtered = {
      type: 'element',
      tag: node.tagName,
      props: node.properties,
      children: childs,
      content: [],
    };

    // Unwrap contents of the template, saving the root level inside content.
    if (node.tagName === 'template') {
      const templateContent: any[] = [];
      const childList = node.children || [];
      const contentNode = childList[0] ? childList[0] : {};
      (contentNode.children || []).forEach((templateNode: any) => parse2json(templateNode, templateContent));
      // @ts-ignore
      filtered.content = templateContent;
    }

    parent.push(filtered);

    if (node.children) {
      node.children.forEach((child: any) => parse2json(child, childs));
    }

    return;
  }

  /**
   * Text node pushes to the parent
   */
  if (node.type === 'text') {
    parent.push({
      type: 'text',
      value: node.value,
    });
    return;
  }

  /**
   * Root level nodes push to the original parent
   * children and don't create a new node
   */
  if (node.type === 'root') {
    node.children.forEach((child: any) => parse2json(child, parent));
  }
}

/**
 * JSON compiler
 */
export default function (root: any[] = []) {
  /**
   * We do not use `map` operation, since each node can be expanded to multiple top level
   * nodes. Instead, we need an array to fill in as many elements inside a single
   * iteration
   */
  const result: any[] = [];
  parse2json(root, result);

  return {
    type: 'root',
    children: result,
  };
}
