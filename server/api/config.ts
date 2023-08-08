export default defineEventHandler((event) => {
  const { public: runtimeConfig } = useRuntimeConfig();

  return runtimeConfig;
});
