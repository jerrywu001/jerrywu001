import PhotoSwipeLightbox from 'photoswipe/dist/photoswipe-lightbox.esm.js';
import PhotoSwipe from 'photoswipe';
import 'photoswipe/dist/photoswipe.css';
import { Ref } from '@vue/runtime-dom';

export default function useImgSwipe(loading: Ref<boolean>) {
  const lightbox = ref(null);

  async function initImageSwipe() {
    await uninstallImageSwipe();
    if (process.client) {
      nextTick(() => {
        setTimeout(() => {
          getAllImgsLoaded(() => {
            const box = document.querySelector('.article-scroll-box');
            if (box) {
              console.log('start init images swiper');
              const items = box.querySelectorAll('img');
              items.forEach((img) => {
                if (img.id !== 'cover') {
                  const a = document.createElement('a');
                  a.className = 'swiper-link';
                  a.href = img.src;
                  a.rel = 'noreferrer';
                  a.target = '_blank';
                  a.setAttribute('data-pswp-width', String(img.width * 2.5));
                  a.setAttribute('data-pswp-height', String(img.height * 2.5));
                  a.appendChild(img.cloneNode(true));
                  img.replaceWith(a);
                }
              });
              if (!lightbox.value) {
                lightbox.value = new PhotoSwipeLightbox({
                  gallery: '.article-scroll-box',
                  children: '.swiper-link',
                  pswpModule: PhotoSwipe,
                  imageClickAction: 'close',
                  tapAction: 'close',
                });
                lightbox.value.init();
              }

              const pres = document.querySelectorAll('pre');
              pres.forEach((pre) => {
                pre.classList.add('d-scrollbar');
              });
            }
          });
        }, 0);
      });
    }
  }

  function uninstallImageSwipe() {
    if (lightbox.value) {
      lightbox.value.destroy();
      lightbox.value = null;
    }
  }

  tryOnBeforeUnmount(() => {
    uninstallImageSwipe();
  });

  watch(
    loading,
    () => {
      if (!loading.value) {
        initImageSwipe();
      }
    },
    { immediate: true }
  );

  return { lightbox, initImageSwipe };
}

function getAllImgsLoaded(callback) {
  const box = document.querySelector('.article-scroll-box');
  const images = box.querySelectorAll('img');

  const promises = Array.prototype.slice.call(images).map((node) => {
    return new Promise((resolve) => {
      const loadImg = new Image();
      loadImg.src = node.src;
      loadImg.onload = () => {
        resolve(node);
      };
      loadImg.onerror = () => {
        resolve(node);
      };
    });
  });

  Promise.all(promises)
    .then(() => {
      callback && callback();
    })
    .catch((e) => {
      console.error(e);
    });
}
