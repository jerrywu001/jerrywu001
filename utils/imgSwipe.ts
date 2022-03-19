import PhotoSwipeLightbox from 'photoswipe/dist/photoswipe-lightbox.esm.js';
import PhotoSwipe from 'photoswipe';
import 'photoswipe/dist/photoswipe.css';

export default function useImgSwipe() {
  const imgs = ref([]);
  const lightbox = ref(null);

  tryOnBeforeUnmount(() => {
    if (lightbox.value) {
      lightbox.value.destroy();
      lightbox.value = null;
    }
  });

  tryOnMounted(() => {
    if (process.client) {
      nextTick(() => {
        setTimeout(() => {
          const box = document.querySelector('.article-scroll-box');
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
        }, 1200);
      });
    }
  });

  return { imgs, lightbox };
}
