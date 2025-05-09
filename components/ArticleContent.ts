import { h, resolveComponent, Text, defineComponent } from 'vue';
import { destr } from 'destr';
import { pascalCase } from 'scule';
import { find, html } from 'property-information';
import htmlTags from 'html-tags';
import type { VNode, ConcreteComponent, PropType } from 'vue';
import type {
  IElement as MarkdownNode,
  ParsedContentMeta,
} from '~~/types';

type ContentVNode = VNode | string;

/**
 *  Default slot name
 */
const DEFAULT_SLOT = 'default';

const rxOn = /^@|^v-on:/;
const rxBind = /^:|^v-bind:/;
const rxModel = /^v-model/;
const nativeInputs = ['select', 'textarea', 'input'];

interface IProp {
  tag?: string;
  children: MarkdownNode[];
}

export default defineComponent({
  name: 'ContentRendererMarkdown',
  props: {
    /**
     * Root tag to use for rendering
     */
    tag: {
      type: String,
      default: 'div',
    },
    /**
     * Content to render
     */
    children: {
      type: Array as PropType<MarkdownNode[]>,
      default() {
        return [];
      },
    },
  },
  render(props: IProp) {
    const { tag, children, ...restProps } = props;

    if (!children || !children.length) {
      return null;
    }

    // Get body from value
    let component: string | ConcreteComponent = tag as string;

    // Resolve component if it's a Vue component
    component = resolveVueComponent(component as string);

    const childList = children.map((child) => renderNode(child, {} as ParsedContentMeta));

    // Return Vue component
    return h(
      component as any,
      {
        ...restProps,
        ...this.$attrs,
      },
      { default: createSlotFunction(childList) },
    );
  },
});

/**
 * Render a markdown node
 */
function renderNode(
  node: MarkdownNode,
  documentMeta: ParsedContentMeta,
): ContentVNode {
  const originalTag = node.tag;
  // `_ignoreMap` is an special prop to disables tag-mapper
  const renderTag: string =
    typeof node.props?.__ignoreMap === 'undefined' &&
    documentMeta.tags &&
    documentMeta.tags[node.tag] ||
    node.tag;

  /**
   * Render Text node
   */
  if (node.type === 'text') {
    return h(Text, node.value);
  }

  const component = resolveVueComponent(renderTag);

  if (typeof component === 'object') {
    component.tag = originalTag;
  }

  return h(
    component as any,
    propsToData(node, documentMeta),
    renderSlots(node, documentMeta),
  );
}

/**
 * Create slots from `node` template children.
 */
function renderSlots(
  node: MarkdownNode,
  documentMeta: ParsedContentMeta,
) {
  const children: MarkdownNode[] = node.children || [];

  const slots: Record<string, Array<VNode | string>> = children.reduce(
    (data, mnode) => {
      if (!isTemplate(mnode)) {
        // @ts-ignore
        data[DEFAULT_SLOT].push(renderNode(mnode, documentMeta));
        return data;
      }

      if (isDefaultTemplate(mnode)) {
        data[DEFAULT_SLOT].push(
          // @ts-ignore
          ...mnode.children.map((child) => renderNode(child, documentMeta)),
        );
        return data;
      }

      const slotName = getSlotName(mnode);

      // @ts-ignore
      data[slotName] = mnode.children.map((child) => renderNode(child, documentMeta));

      return data;
    },
    { [DEFAULT_SLOT]: [] },
  );

  return Object.fromEntries(
    Object.entries(slots).map(([name, vDom]) => [
      name,
      createSlotFunction(vDom),
    ]),
  );
}

/**
 * Create component data from node props.
 */
function propsToData(node: MarkdownNode, documentMeta: ParsedContentMeta) {
  const { tag = '', props = {} } = node;

  return Object.keys(props).reduce((data, key) => {
    // Ignore internal `__ignoreMap` prop.
    if (key === '__ignoreMap') {
      return data;
    }

    // @ts-ignore
    const value = props[key];

    // `v-model="foo"`
    if (rxModel.test(key) && !nativeInputs.includes(tag)) {
      return propsToDataRxModel(key, value, data, documentMeta);
    }

    // `v-bind="{foo: 'bar'}"`
    if (key === 'v-bind') {
      return propsToDataVBind(key, value, data, documentMeta);
    }

    // `v-on="foo"`
    if (rxOn.test(key)) {
      return propsToDataRxOn(key, value, data, documentMeta);
    }

    // `:foo="bar"`, `v-bind:foo="bar"`
    if (rxBind.test(key)) {
      return propsToDataRxBind(key, value, data, documentMeta);
    }

    const { attribute } = find(html, key);

    // Join string arrays using space, see: https://github.com/nuxt/content/issues/247
    if (Array.isArray(value) && value.every((v) => typeof v === 'string')) {
      data[attribute] = value.join(' ');
      return data;
    }

    data[attribute] = value;

    return data;
  }, {} as any);
}

/**
 * Handle `v-model`
 */
function propsToDataRxModel(
  key: string,
  value: any,
  data: any,
  documentMeta: ParsedContentMeta,
) {
  // Model modifiers
  const number = (d: any) => +d;
  const trim = (d: any) => d.trim();
  const noop = (d: any) => d;

  const mods = key
    .replace(rxModel, '')
    .split('.')
    .filter((d) => d)
    .reduce((d, k) => {
      d[k] = true;
      return d;
    }, {} as any);

  // As of yet we don't resolve custom v-model field/event names from components
  const field = 'value';
  const event = mods.lazy ? 'change' : 'input';
  const processor = mods.number ? number : mods.trim ? trim : noop;

  data[field] = evalInContext(value, documentMeta);
  data.on = data.on || {};
  data.on[event] = (e: any) => (documentMeta as any)[value] = processor(e);

  return data;
}

/**
 * Handle object binding `v-bind`
 */
function propsToDataVBind(
  _key: string,
  value: any,
  data: any,
  documentMeta: ParsedContentMeta,
) {
  const val = evalInContext(value, documentMeta);

  data = Object.assign(data, val);
  return data;
}

/**
 * Handle `v-on` and `@`
 */
function propsToDataRxOn(
  key: string,
  value: any,
  data: any,
  documentMeta: ParsedContentMeta,
) {
  key = key.replace(rxOn, '');
  data.on = data.on || {};
  data.on[key] = () => evalInContext(value, documentMeta);
  return data;
}

/**
 * Handle single binding `v-bind:` and `:`
 */
function propsToDataRxBind(
  key: string,
  value: any,
  data: any,
  documentMeta: ParsedContentMeta,
) {
  key = key.replace(rxBind, '');
  data[key] = evalInContext(value, documentMeta);
  return data;
}

/**
 * Resolve component if it's a Vue component
 */
const resolveVueComponent = (component: string) => {
  // Check if node is not a native HTML tag
  if (
    typeof component === 'string' &&
    (!htmlTags.includes(component as any) || component === 'embed')
  ) {
    const componentFn = resolveComponent(pascalCase(component), false);

    // If component exists
    if (typeof componentFn === 'object') {
      return componentFn;
    }
  }
  return component;
};

/**
 * Evaluate value in specific context
 */
function evalInContext(code: string, context: any) {
  // Retrive value from context
  const result = code
    .split('.')
    .reduce((o: any, k) => typeof o === 'object' ? o[k] : undefined, context);

  return typeof result === 'undefined' ? destr(code) : result;
}

/**
 * Get slot name out of a node
 */
function getSlotName(node: MarkdownNode) {
  let name = '';

  for (const propName of Object.keys(node.props || {})) {
    // Check if prop name correspond to a slot
    if (!propName.startsWith('#') && !propName.startsWith('v-slot:')) {

      continue;
    }
    // Get slot name

    name = propName.split(/[:#]/, 2)[1];
    break;
  }
  return name || DEFAULT_SLOT;
}

/**
 * Create a factory function if there is a node in the list
 */
function createSlotFunction(nodes: Array<VNode | string>) {
  return nodes.length ? () => nodes : undefined;
}

/**
 * Check if node is root
 */
function isDefaultTemplate(node: MarkdownNode) {
  return isTemplate(node) && getSlotName(node) === DEFAULT_SLOT;
}

/**
 * Check if node is Vue template tag
 */
function isTemplate(node: MarkdownNode) {
  return node.tag === 'template';
}
