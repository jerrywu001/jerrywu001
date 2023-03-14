import { loadScript, loadStyle } from './utils';

const gitalkContainerId = 'gitalk-container';

export function useGitTalk() {
  const route = useRoute();

  tryOnMounted(() => {
    if (process.client) {
      nextTick(() => {
        setTimeout(async () => {
          const owner = 'jerrywu001';
          const container = document.querySelector('.article-info');
          if (container) {
            const gittalkDom = document.createElement('div');
            gittalkDom.id = gitalkContainerId;
            gittalkDom.classList.add('px-4');
            gittalkDom.classList.add('xl:mr-$tocs-width');
            container.appendChild(gittalkDom);

            await loadScript('/gitalk.min.js', 'gittalk-script');
            await loadStyle('/gitalk.css', 'gittalk');

            // @ts-ignore
            const gitalk = new Gitalk({
              clientID: !process.dev
                ? 'e4505f12aeb214a7d37b'
                : '07e254c2c829e74832a7',
              clientSecret: !process.dev
                ? '2eacdd20118ad2c02ffcb93232998f4e65d08099'
                : 'fec2210915e59194f214b51edcf7c78bb48f4436',
              repo: owner,
              owner,
              admin: [owner],
              id: route.path,
              distractionFreeMode: false,
            });
            gitalk.render(gittalkDom.id);
          }
        }, 300);
      });
    }
  });

  return {};
}

export function useArticleScroll() {
  function getTopIcon() {
    return document.querySelector('#back-2-top') as HTMLDivElement;
  }

  function getCommentIcon() {
    return document.querySelector('#comment') as HTMLDivElement;
  }

  function doScroll() {
    const container = getScrollContainer();
    const topIcon = getTopIcon();
    const scrollTop = container.scrollY;

    if (scrollTop > 200) {
      topIcon.style.display = 'flex';
    } else {
      topIcon.style.display = 'none';
    }

    autoHighlightArchor();
  }

  function onBack2TopClick() {
    const container = getScrollContainer();
    container.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function onCommentClick() {
    const gitalkDom = document.getElementById(gitalkContainerId);
    window.scrollTo({ top: gitalkDom?.offsetTop, behavior: 'smooth' });
  }

  function hideTocs(e: MouseEvent) {
    const tocs = document.querySelector('.tocs-sm');
    if (tocs) {
      const classList = tocs.classList;
      const isOpen = classList.contains('h-auto');
      if (isOpen && !tocs.contains(e.target as HTMLElement)) {
        tocs.classList.remove('h-auto');
        tocs.classList.add('h-10');
      }
    }
  }

  function onMove(e: any) {
    e.preventDefault();
    try {
      const target = e.currentTarget as HTMLDivElement;
      const x = e.clientX || e.touches[0]?.clientX;
      const y = e.clientY || e.touches[0]?.clientY;
      target.style.bottom = 'auto';
      target.style.right = 'auto';
      target.style.top = `${y - target.clientHeight / 2}px`;
      target.style.left = `${x - target.clientWidth / 2}px`;
    } catch (error) {
      // error
    }
  }

  tryOnMounted(() => {
    const container = getScrollContainer();
    const topIcon = getTopIcon();
    const commentIcon = getCommentIcon();
    topIcon.addEventListener('click', onBack2TopClick, false);
    commentIcon.addEventListener('click', onCommentClick, false);
    topIcon.addEventListener('touchmove', onMove, false);
    topIcon.addEventListener('drag', onMove, false);
    commentIcon.addEventListener('touchmove', onMove, false);
    commentIcon.addEventListener('drag', onMove, false);
    container.addEventListener('scroll', doScroll, false);
    document.body.addEventListener('click', hideTocs, false);
    document.documentElement.classList.remove('overflow-hidden');
    document.documentElement.classList.remove('h-full');
  });

  tryOnBeforeUnmount(() => {
    const container = getScrollContainer();
    const topIcon = getTopIcon();
    const commentIcon = getCommentIcon();
    topIcon.removeEventListener('click', onBack2TopClick, false);
    commentIcon.removeEventListener('click', onCommentClick, false);
    topIcon.removeEventListener('touchmove', onMove, false);
    topIcon.removeEventListener('drag', onMove, false);
    commentIcon.removeEventListener('touchmove', onMove, false);
    commentIcon.removeEventListener('drag', onMove, false);
    container.removeEventListener('scroll', doScroll, false);
    document.body.removeEventListener('click', hideTocs, false);
    removeArchorClickEvent();
  });

  return {};
}

export function toggleTocs() {
  const container = document.querySelector('.tocs');
  if (container) {
    const classList = container.classList;
    const isOpen = classList.contains('h-auto');
    if (isOpen) {
      container.classList.remove('h-auto');
      container.classList.add('h-10');
    } else {
      container.classList.add('h-auto');
      container.classList.remove('h-10');
    }
  }
}

export const headHeight = 56;

export function getHeadings() {
  return [
    ...document.querySelectorAll('.article h2'),
    ...document.querySelectorAll('.article h3'),
    ...document.querySelectorAll('.article h4'),
  ];
}

export function getScrollContainer() {
  // return document.querySelector('.layout-container') as HTMLDivElement;
  return window;
}

export function getVisibleTocContainer() {
  let toc: HTMLDivElement | null = null;
  const allTocs = document.querySelectorAll('.tocs');
  for (const v of allTocs) {
    if (v.classList.contains('<xl:hidden')) {
      toc = v as HTMLDivElement;
      break;
    }
  }
  return toc;
}

export function updateArchorOffsetTop(
  id = window.location.hash,
  autoClose = false
) {
  const isPc = window.innerWidth >= 1280;
  const toc = getVisibleTocContainer();
  const tocs = !isPc ? toc : toc?.querySelector('.tocs-btn');
  const container = getScrollContainer();
  const escapedId = id.replace(/\./g, '\\.').replace('#', '');
  const archor = document.getElementById(decodeURIComponent(escapedId));
  const offsetTop =
    (archor?.offsetTop as number) -
    (tocs?.clientHeight as number) -
    headHeight -
    (isPc ? 20 : 50);
  container.scrollTo({ top: offsetTop, behavior: 'smooth' });
  autoHighlightArchor();

  if (autoClose && !isPc) {
    tocs?.classList.remove('h-auto');
    tocs?.classList.add('h-10');
  }
}

export function autoHighlightArchor() {
  const container = getScrollContainer();
  const targets = document.querySelectorAll('h2, h3, h4');
  const tocLinks = document.querySelectorAll('.toc-link');
  const tocBtn = document.querySelector('.tocs-btn');
  const headBoxHeight = (tocBtn?.clientHeight as number) + headHeight;

  for (const entry of targets) {
    const target = entry as HTMLDivElement;
    target.classList.remove('active');

    if (
      target.offsetTop < container.scrollY + headBoxHeight + 90 &&
      target.offsetTop > container.scrollY + headBoxHeight
    ) {
      tocLinks.forEach((dom) => {
        dom.classList.remove('active');
      });
      const links = document.querySelectorAll(
        `.toc-link[href="#${target.id}"]`
      );
      for (const v of links) {
        v.classList.add('active');
      }
      break;
    }
  }
}

export function scrollToHeading(event: MouseEvent, id = '') {
  if (event) event.preventDefault();
  window.history.replaceState({}, '', id);
  setTimeout(() => {
    updateArchorOffsetTop(id, true);
    autoHighlightArchor();
  });
}

export function initScrollTopByHash() {
  const container = getScrollContainer();
  if (window.location.hash) {
    setTimeout(() => {
      updateArchorOffsetTop();
    }, 600);
  } else {
    container.scrollTo({ top: 0 });
  }
}

export function doHeadScroll(e: any) {
  e.preventDefault();
  if (e.target.href) {
    const archor = '#' + e.target.href.split('#').pop();
    scrollToHeading(e, archor);
  }
}

export function addArchorClickEvent() {
  const headings = getHeadings();
  initScrollTopByHash();

  headings.forEach((heading) => {
    heading.addEventListener('click', doHeadScroll, false);
  });
}

export function removeArchorClickEvent() {
  const headings = getHeadings();

  headings.forEach((heading) => {
    heading.removeEventListener('click', doHeadScroll, false);
  });
}
