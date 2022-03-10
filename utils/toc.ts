export function useArticleScroll() {
  function getTopIcon() {
    return document.querySelector('#back-2-top') as HTMLDivElement;
  }

  function doScroll() {
    const container = getScrollContainer();
    const topIcon = getTopIcon();
    const scrollTop = container.scrollTop;

    if (scrollTop > 200) {
      topIcon.style.display = 'flex';
    } else {
      topIcon.style.display = 'none';
    }

    autoHighlightArchor();
  }

  function onClick() {
    const container = getScrollContainer();
    container.scrollTo({ top: 0, behavior: 'smooth' });
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

  tryOnMounted(() => {
    const container = getScrollContainer();
    const topIcon = getTopIcon();
    topIcon.addEventListener('click', onClick, false);
    container.addEventListener('scroll', doScroll, false);
    document.body.addEventListener('click', hideTocs, false);
  });

  tryOnBeforeUnmount(() => {
    const container = getScrollContainer();
    const topIcon = getTopIcon();
    topIcon.removeEventListener('click', onClick, false);
    container.removeEventListener('scroll', doScroll, false);
    document.body.removeEventListener('click', hideTocs, false);
  });

  return {};
}

export function toggleTocs() {
  const container = document.querySelector('.tocs');
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

export const headHeight = 56;

export function getHeadings() {
  return [
    ...document.querySelectorAll('.article h2'),
    ...document.querySelectorAll('.article h3'),
    ...document.querySelectorAll('.article h4'),
  ];
}

export function getScrollContainer() {
  return document.querySelector('.layout-container') as HTMLDivElement;
}

export function getVisibleTocContainer() {
  let toc: HTMLDivElement = null;
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
  const tocs = !isPc ? toc : toc.querySelector('.tocs-btn');
  const container = getScrollContainer();
  const escapedId = id.replace(/\./g, '\\.').replace('#', '');
  const archor = document.getElementById(decodeURIComponent(escapedId));
  const offsetTop =
    archor.offsetTop - tocs.clientHeight - headHeight - (isPc ? 20 : 50);
  container.scrollTo({ top: offsetTop, behavior: 'smooth' });
  autoHighlightArchor();

  if (autoClose && !isPc) {
    tocs.classList.remove('h-auto');
    tocs.classList.add('h-10');
  }
}

export function autoHighlightArchor() {
  const container = getScrollContainer();
  const targets = document.querySelectorAll('h2, h3, h4');
  const tocLinks = document.querySelectorAll('.toc-link');
  const tocBtn = document.querySelector('.tocs-btn');
  const headBoxHeight = tocBtn.clientHeight + headHeight;

  for (const entry of targets) {
    const target = entry as HTMLDivElement;
    target.classList.remove('active');

    if (
      target.offsetTop < container.scrollTop + headBoxHeight + 90 &&
      target.offsetTop > container.scrollTop + headBoxHeight
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
    updateArchorOffsetTop();
  } else {
    container.scrollTo({ top: 0 });
  }
}

export function doHeadScroll(e) {
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
