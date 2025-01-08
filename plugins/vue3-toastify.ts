import Vue3Toastify, { type ToastOptions, toast } from 'vue3-toastify';
import { type App } from 'vue';
import 'vue3-toastify/dist/index.css';

export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter();

  function resolveGLobalComponents(instance: App<Element>) {
    instance.use(router);
  }

  nuxtApp.vueApp.use(Vue3Toastify, {
    useHandler: resolveGLobalComponents,
    clearOnUrlChange: false,
    autoClose: 3000,
    position: toast.POSITION.TOP_CENTER,
    theme: 'auto',
  } as ToastOptions);

  return { provide: { toast } };
});
