import Vue3Toastify, { ToastOptions, toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Vue3Toastify, {
    clearOnUrlChange: false,
    autoClose: 3000,
    position: toast.POSITION.TOP_CENTER,
    theme: 'auto',
  } as ToastOptions);

  return {
    provide: { toast },
  };
});
