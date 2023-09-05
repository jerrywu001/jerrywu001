import 'photoswipe/dist/photoswipe.css';
// @ts-ignore
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import { Ref } from 'vue';

export default function useImgSwipe(loaded: Ref<boolean>) {
  const lightbox = ref(null);

  async function initImageSwipe() {
    await uninstallImageSwipe();
    if (process.client) {
      nextTick(() => {
        setTimeout(() => {
          getAllImgsLoaded(() => {
            const box = document.querySelector('article');
            if (box) {
              const items = (box.querySelectorAll('img') || []);
              items.forEach((img) => {
                if (img.id !== 'cover' && !img.classList.contains('w-10')) {
                  (function (prevImg: HTMLImageElement) {
                    const a = document.createElement('a');
                    let newImg = document.createElement(
                      'img',
                    ) as HTMLImageElement;

                    a.className = 'swiper-link';
                    a.href = prevImg.src;
                    a.rel = 'noreferrer';
                    a.appendChild(prevImg.cloneNode(true));
                    prevImg?.parentNode?.insertBefore(a, prevImg);
                    prevImg.remove();

                    newImg.src = prevImg.src;
                    newImg.onload = () => {
                      a.setAttribute('data-pswp-width', String(newImg.width));
                      a.setAttribute('data-pswp-height', String(newImg.height));
                      // @ts-ignore
                      newImg = null;
                    };

                    newImg.onerror = () => {
                      a.setAttribute('data-pswp-width', '100');
                      a.setAttribute('data-pswp-height', '100');
                      // @ts-ignore
                      newImg = null;
                    };
                  }(img));
                }
              });
              if (!lightbox.value) {
                // @ts-ignore
                lightbox.value = new PhotoSwipeLightbox({
                  gallery: 'article',
                  children: '.swiper-link',
                  pswpModule: () => import('photoswipe'),
                  imageClickAction: 'close',
                  tapAction: 'close',
                  errorMsg: '图片加载失败',
                });
                setTimeout(() => {
                  // @ts-ignore
                  lightbox.value?.init();
                });
              }
            }
          });
        }, 1200);
      });
    }
  }

  function uninstallImageSwipe() {
    if (lightbox.value) {
      // @ts-ignore
      lightbox.value.destroy();
      lightbox.value = null;
    }
  }

  tryOnBeforeUnmount(() => {
    uninstallImageSwipe();
  });

  watch(
    loaded,
    () => {
      if (loaded.value) {
        nextTick(() => {
          initImageSwipe();
        });
      }
    },
  );

  return { lightbox, initImageSwipe };
}

function getAllImgsLoaded(callback: () => void) {
  const box = document.querySelector('article') as HTMLDivElement;
  const images = box?.querySelectorAll('img');

  const promises = Array.prototype.slice.call(images || []).map((node) => new Promise((resolve) => {
    const loadImg = new Image();
    loadImg.src = node.src;
    loadImg.onload = () => {
      resolve(node);
    };
    loadImg.onerror = () => {
      resolve(node);
    };
  }));

  Promise.all(promises)
    .then(() => {
      if (callback) callback();
    })
    .catch((e) => {
      console.error(e);
    });
}
