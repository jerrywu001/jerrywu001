import PhotoSwipeLightbox from 'photoswipe/dist/photoswipe-lightbox.esm.js';
import PhotoSwipe from 'photoswipe';
import 'photoswipe/dist/photoswipe.css';
import { Ref } from '@vue/runtime-dom';

export default function useImgSwipe(loading: Ref<boolean>) {
  const imgs = ref([]);
  const lightbox = ref(null);

  async function initImageSwipe() {
    await uninstallImageSwipe();
    if (process.client) {
      nextTick(() => {
        setTimeout(() => {
          getAllImgsLoaded(() => {
            const box = document.querySelector('.article-scroll-box');
            if (box) {
              console.log('start inint images swiper');
              const items = box.querySelectorAll('img');
              const imgList = [];
              items.forEach((img, index) => {
                if (img.id !== 'cover') {
                  imgList.push({
                    largeURL: img.src,
                    width: img.width * 2.5,
                    height: img.height * 2.5,
                  });
                  img.onclick = () => {
                    const p = document.getElementById('photo-swipe');
                    const ls = p.querySelectorAll('a');
                    ls[index - 1].click();
                  };
                }
              });
              imgs.value = imgList;
              if (!lightbox.value) {
                lightbox.value = new PhotoSwipeLightbox({
                  gallery: '#photo-swipe',
                  children: 'a',
                  pswpModule: PhotoSwipe,
                  imageClickAction: 'close',
                  tapAction: 'close',
                });
                lightbox.value.init();
              }
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

  return { imgs, lightbox, initImageSwipe };
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
