import type { Slot } from 'vue';
import {
  defineComponent,
  getCurrentInstance,
  useSlots,
  computed,
  h,
} from '#imports';
import { useUnwrap } from '~~/utils/utils';

/**
 * Markdown component
 */
export default defineComponent({
  name: 'Markdown',
  functional: true,
  props: {
    /**
     * A slot name or function
     */
    use: {
      type: [String, Function],
      default: 'default',
    },
    /**
     * Tags to unwrap separated by spaces
     * Example: 'ul li'
     */
    unwrap: {
      type: [Boolean, String],
      default: false,
    },
  },
  setup(props) {
    const { parent } = getCurrentInstance() as any;
    const { between } = useSlots();

    const tags = computed(() => {
      if (typeof props.unwrap === 'string') {
        return props.unwrap.split(' ');
      }
      return ['*'];
    });

    return {
      tags,
      between,
      parent,
    };
  },
  // @ts-ignore
  render({ use, unwrap, between, tags, parent }) {
    try {
      const slot: Slot =
        typeof use === 'string'
          ? parent?.slots[use] || parent?.parent?.slots[use]
          : use;

      if (!slot) {
        return h('div');
      }

      if (!unwrap) {
        return [slot()];
      }

      const { flatUnwrap } = useUnwrap();

      const unwrapped = flatUnwrap(slot(), tags);

      if (between) {
        return unwrapped.flatMap((vnode, index) => index === 0 ? [vnode] : [between(), vnode]);
      }

      return unwrapped.reduce((acc: any[], item: any) => {
        if (typeof item.children === 'string') {
          if (typeof acc[acc.length - 1] === 'string') {
            acc[acc.length - 1] += item.children;
          } else {
            acc.push(item.children);
          }
        } else {
          acc.push(item);
        }
        return acc;
      }, []);
    } catch (e) {
      // Catching errors to allow content reactivity
      return h('div');
    }
  },
});
