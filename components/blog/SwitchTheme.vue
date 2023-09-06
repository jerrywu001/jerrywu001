<template>
  <button
    id="theme-toggle"
    class="theme-toggle !w-[22px] !h-[22px]"
    title="Toggles light &amp; dark"
    aria-live="polite"
    @click="switchTheme"
  >
    <svg
      class="sun-and-moon"
      aria-hidden="true"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <mask id="moon-mask" class="moon">
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="white"
        ></rect>
        <circle
          cx="24"
          cy="10"
          r="6"
          fill="black"
        ></circle>
      </mask>
      <circle
        class="sun"
        cx="12"
        cy="12"
        r="6"
        mask="url(#moon-mask)"
        fill="currentColor"
      ></circle>
      <g class="sun-beams" stroke="currentColor">
        <line
          x1="12"
          y1="1"
          x2="12"
          y2="3"
        ></line>
        <line
          x1="12"
          y1="21"
          x2="12"
          y2="23"
        ></line>
        <line
          x1="4.22"
          y1="4.22"
          x2="5.64"
          y2="5.64"
        ></line>
        <line
          x1="18.36"
          y1="18.36"
          x2="19.78"
          y2="19.78"
        ></line>
        <line
          x1="1"
          y1="12"
          x2="3"
          y2="12"
        ></line>
        <line
          x1="21"
          y1="12"
          x2="23"
          y2="12"
        ></line>
        <line
          x1="4.22"
          y1="19.78"
          x2="5.64"
          y2="18.36"
        ></line>
        <line
          x1="18.36"
          y1="5.64"
          x2="19.78"
          y2="4.22"
        ></line>
      </g>
    </svg>
  </button>
</template>

<script setup lang="ts">
const storageKey = 'nuxt-color-mode';
const colorMode = useColorMode();

const syncDatasetTheme = () => {
  nextTick(() => {
    setTimeout(() => {
      document.documentElement.dataset.theme = colorMode.preference;
    }, 590);
  });
};

function switchTheme() {
  colorMode.preference = colorMode.preference === 'dark' ? 'light' : 'dark';
  syncDatasetTheme();
}

function getLastThemePreference() {
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const systemPreference = isDark ? 'dark' : 'light';
  if (localStorage.getItem(storageKey) === 'system') {
    localStorage.setItem(storageKey, systemPreference);
  }
  return localStorage.getItem(storageKey) || systemPreference;
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    const preference = getLastThemePreference();
    colorMode.preference = preference;
    localStorage.setItem(storageKey, preference);
    syncDatasetTheme();

    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', ({ matches: inDark }) => {
        const preferenceColor = inDark ? 'dark' : 'light';
        colorMode.preference = preferenceColor;
        localStorage.setItem(storageKey, preferenceColor);
        syncDatasetTheme();
      });
  }
});
</script>

<style lang="postcss">
@import"https://unpkg.com/open-props/easings.min.css";

.sun-and-moon>:is(.moon,.sun,.sun-beams) {
  transform-origin: center center
}

.sun-and-moon>:is(.moon,.sun) {
  fill: var(--icon-fill)
}

.theme-toggle:is(:hover,:focus-visible)>.sun-and-moon>:is(.moon,.sun) {
  fill: var(--icon-fill-hover)
}

.sun-and-moon>.sun-beams {
  stroke: var(--icon-fill);
  stroke-width: 2px
}

.theme-toggle:is(:hover,:focus-visible) .sun-and-moon>.sun-beams {
  stroke: var(--icon-fill-hover)
}

[data-theme=dark] .sun-and-moon>.sun {
  transform: scale(1.75)
}

[data-theme=dark] .sun-and-moon>.sun-beams {
  opacity: 0
}

[data-theme=dark] .sun-and-moon>.moon>circle {
  transform: translate(-7px)
}

@supports (cx: 1) {
  [data-theme=dark] .sun-and-moon>.moon>circle {
    transform: translate(0);
    cx: 17;
  }
}

@media (prefers-reduced-motion: no-preference) {
  .sun-and-moon>.sun {
    transition: transform .5s var(--ease-elastic-3)
  }

  .sun-and-moon>.sun-beams {
    transition: transform .5s var(--ease-elastic-4),opacity .5s var(--ease-3)
  }

  .sun-and-moon .moon>circle {
    transition: transform .25s var(--ease-out-5)
  }

  @supports (cx: 1) {
    .sun-and-moon .moon>circle {
      transition: cx .25s var(--ease-out-5)
    }
  }

  [data-theme=dark] .sun-and-moon>.sun {
    transform: scale(1.75);
    transition-timing-function: var(--ease-3);
    transition-duration: .25s
  }

  [data-theme=dark] .sun-and-moon>.sun-beams {
    transform: rotate(-25deg);
    transition-duration: .15s
  }

  [data-theme=dark] .sun-and-moon>.moon>circle {
    transition-delay: .25s;
    transition-duration: .5s
  }
}

.theme-toggle {
  --size: 2rem;
  --icon-fill: hsl(210 10% 30%);
  --icon-fill-hover: hsl(210 10% 15%);
  background: none;
  border: none;
  padding: 0;
  inline-size: var(--size);
  block-size: var(--size);
  aspect-ratio: 1;
  border-radius: 50%;
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  outline-offset: 5px
}

.theme-toggle>svg {
  inline-size: 100%;
  block-size: 100%;
  stroke-linecap: round
}

[data-theme=dark] .theme-toggle {
  --icon-fill: hsl(210 10% 70%);
  --icon-fill-hover: hsl(210 15% 90%)
}

@media (hover: none) {
  .theme-toggle {
    --size: 32px
  }
}

</style>
