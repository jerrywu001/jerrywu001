<script lang="ts">
export default {
  name: 'Markdown',
  functional: true,
  props: {
    use: {
      type: [String, Object, Function, Array],
      default: 'default',
    },
  },
  render: (ctx) => {
    const slot = ctx.use || 'default';
    let node = null;
    if (Array.isArray(slot)) {
      node = slot;
    }
    if (typeof slot === 'function') {
      node = slot();
    }
    if (typeof slot === 'string') {
      return [slot];
    }
    return node;
  },
};
</script>
