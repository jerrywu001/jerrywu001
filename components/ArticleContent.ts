import { find, html } from 'property-information';
import { h } from 'vue';
import Alert from './Alert.vue';
import ButtonLink from './ButtonLink.vue';
import CodeGroup from './CodeGroup.vue';
import List from './List.vue';
import youtube from './youtube.vue';
import embed from './embed.vue';
import panel from './panel.vue';
import { IElement, IMeta } from '~~/types';

export default {
  props: {
    children: {
      type: Array,
      default() {
        return [];
      },
    },
    meta: {
      type: Object,
      default() {
        return {} as IMeta;
      },
    },
  },
  setup(props) {
    return () => {
      const meta = props.meta as IMeta;
      const hasTitle = meta.hasTitle;
      const children = props.children as IElement[];
      const hasH1 = children.findIndex((v) => v.tag === 'h1') > -1;
      const hasCover =
        children.findIndex((v) => v.tag === 'img' && v.props.id === 'cover') >
        -1;

      if (!hasTitle && !hasH1) {
        children.unshift({
          type: 'element',
          tag: 'h1',
          props: {},
          children: [
            {
              type: 'text',
              value: meta.title,
            } as IElement,
          ],
        });
      }

      if (meta.cover && !hasCover) {
        children.unshift({
          type: 'element',
          tag: 'img',
          props: {
            id: 'cover',
            // @ts-ignore
            src: meta.cover,
            style: {
              marginTop: '0 !important',
            },
            className: ['article-cover w-full rounded-md'],
          },
          children: [],
        });
      }

      const childList = children.map((node) => processNode(node));

      return h(
        'div',
        {
          class: 'article-scroll-box px-4 sm:px-6 mt-2 xl:mt-0',
        },
        childList
      );
    };
  },
};

const rootKeys = ['class-name', 'class', 'className', 'style'];

const rxOn = /^@|^v-on:/;
const rxBind = /^:|^v-bind:/;
const rxModel = /^v-model/;
const nativeInputs = ['select', 'textarea', 'input'];

function evalInContext(code, context) {
  // eslint-disable-next-line no-new-func
  return new Function('with(this) { return (' + code + ') }').call(context);
}

function propsToData(node: IElement, doc = {} as any) {
  const { tag, props } = node;
  return Object.keys(props).reduce(
    function (data: any, key) {
      const k = key.replace(/.*:/, '');
      let obj = rootKeys.includes(k) ? data : data.attrs;
      const value = props[key];
      const { attribute } = find(html, key);
      const native = nativeInputs.includes(tag);

      if (rxModel.test(key) && value in doc && !native) {
        const mods: any = key
          .replace(rxModel, '')
          .split('.')
          .filter((d) => d)
          // eslint-disable-next-line no-sequences
          .reduce((d, k) => ((d[k] = true), d), {});

        // As of yet we don't resolve custom v-model field/event names from components
        const field = 'value';
        const event = mods.lazy ? 'change' : 'input';
        const processor = mods.number
          ? (d) => +d
          : mods.trim
          ? (d) => d.trim()
          : (d) => d;

        obj[field] = evalInContext(value, doc);
        data.on = data.on || {};
        data.on[event] = (e) => (doc[value] = processor(e));
      } else if (key === 'v-bind') {
        const val = value in doc ? doc[value] : evalInContext(value, doc);
        obj = Object.assign(obj, val);
      } else if (rxOn.test(key)) {
        key = key.replace(rxOn, '');
        data.on = data.on || {};
        data.on[key] = evalInContext(value, doc);
      } else if (rxBind.test(key)) {
        key = key.replace(rxBind, '');
        obj[key] = value in doc ? doc[value] : evalInContext(value, doc);
      } else if (Array.isArray(value)) {
        obj[attribute] = value.join(' ');
      } else {
        obj[attribute] = value;
      }
      return data;
    },
    { attrs: {} }
  );
}

function slotsToData(node: IElement) {
  const data = {};
  const children = node.children || [];

  children.forEach((child) => {
    if (!isTemplate(child) || isDefaultTemplate(child)) {
      return;
    }

    const template = child;
    const name = getSlotName(template);
    const vDomTree = template.content.map((tmplNode) => processNode(tmplNode));
    data[name] = function () {
      return vDomTree;
    };
  });

  return data;
}

function processNode(node = {} as any) {
  if (node.type === 'text') {
    return node.value;
  }

  resolveTag(node);

  const slots = slotsToData(node);
  const propData = propsToData(node);
  const data = Object.assign({}, propData);
  const hasSlots = Object.keys(slots).length > 0;

  const children = [];
  for (const child of node.children) {
    // Template nodes pointing to non-default slots are processed inside `slotsToData`.
    if (isTemplate(child) && !isDefaultTemplate(child)) {
      continue;
    }

    const processQueue = isDefaultTemplate(child) ? child.content : [child];
    children.push(...processQueue.map((node) => processNode(node)));
  }

  const attrs = { ...data.attrs };
  delete data.attrs;

  const props = { ...data, ...attrs };
  const childList = hasSlots
    ? { ...slots }
    : children.length > 0
    ? children
    : null;

  return h(node.tag, props, childList);
}

const DEFAULT_SLOT = 'default';

function isDefaultTemplate(node) {
  return isTemplate(node) && getSlotName(node) === DEFAULT_SLOT;
}

function isTemplate(node) {
  return node.tag === 'template';
}

function getSlotName(node) {
  let name = '';
  for (const propName of Object.keys(node.props)) {
    if (!propName.startsWith('#') && !propName.startsWith('v-slot:')) {
      continue;
    }
    name = propName.split(/[:#]/, 2)[1];
    break;
  }
  return name || DEFAULT_SLOT;
}

function resolveTag(node) {
  if (typeof node.tag === 'string') {
    const tag = node.tag.replace(/-/g, '').toLowerCase();
    switch (tag) {
      case 'panel':
        node.tag = markRaw(panel);
        break;
      case 'alert':
        node.tag = markRaw(Alert);
        break;
      case 'list':
        node.tag = markRaw(List);
        break;
      case 'youtube':
        node.tag = markRaw(youtube);
        break;
      case 'embed':
        node.tag = markRaw(embed);
        break;
      case 'buttonlink':
        node.tag = markRaw(ButtonLink);
        break;
      case 'codegroup':
        node.tag = markRaw(CodeGroup);
        break;
      default:
        break;
    }
  }
}
