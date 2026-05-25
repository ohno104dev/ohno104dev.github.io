<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import "./content/about-me.css";
import "./content/web3.css";
import bgDesktop from "./assets/bg-desktop.png";
import bgMobile from "./assets/bg-mobile.png";
import bgTablet from "./assets/bg-tablet.png";
import bgTabletLandscape from "./assets/bg-tablet-landscape.png";
import aboutMeContent from "./content/about-me.html?raw";
import underConstructionContent from "./content/under-construction.html?raw";
import web3Content from "./content/web3.html?raw";
import profileAvatar from "./assets/profile-avatar.webp";

const profileItem = {
  name: "Felix Huang",
  badge: "F",
  color: "linear-gradient(135deg, #111827, #475569)",
  detailTitle: "About Me",
  contentHtml: aboutMeContent,
  iconImage: profileAvatar,
};

function createGradientFromName(name) {
  const hue = [...name].reduce(
    (hash, character) => hash + character.charCodeAt(0),
    0,
  ) % 360;
  const secondaryHue = (hue + 42) % 360;

  return `linear-gradient(135deg, hsl(${hue} 82% 62%), hsl(${secondaryHue} 78% 43%))`;
}

function withGeneratedColor(item) {
  return {
    ...item,
    color: createGradientFromName(item.name),
  };
}

const pinnedProject = [
  {
    name: "Edge",
    badge: "E",
    detailTitle: "Browser Workspace",
    contentHtml: underConstructionContent,
  },
  {
    name: "Word",
    badge: "W",
    detailTitle: "Document Workspace",
    contentHtml: underConstructionContent,
  },
  {
    name: "Excel",
    badge: "X",
    detailTitle: "Spreadsheet Workspace",
    contentHtml: underConstructionContent,
  },
  {
    name: "PowerPoint",
    badge: "P",
    detailTitle: "Presentation Workspace",
    contentHtml: underConstructionContent,
  },
  {
    name: "Outlook",
    badge: "O",
    detailTitle: "Communication Workspace",
    contentHtml: underConstructionContent,
  },
  {
    name: "Store",
    badge: "S",
    detailTitle: "Store Workspace",
    contentHtml: underConstructionContent,
  },
  {
    name: "Settings",
    badge: "G",
    detailTitle: "Settings Workspace",
    contentHtml: underConstructionContent,
  },
  {
    name: "Photos",
    badge: "P",
    detailTitle: "Media Workspace",
    contentHtml: underConstructionContent,
  },
  {
    name: "Xbox",
    badge: "X",
    detailTitle: "Gaming Workspace",
    contentHtml: underConstructionContent,
  },
].slice(0, 6).map(withGeneratedColor);

const pinnedGame = [
  {
    name: "Grammarly",
    badge: "G",
    detailTitle: "Writing Workspace",
    contentHtml: underConstructionContent,
  },
  {
    name: "Book Report",
    badge: "W",
    detailTitle: "Reading Notes",
    contentHtml: underConstructionContent,
  },
  {
    name: "Budget Estimate",
    badge: "X",
    detailTitle: "Budget Workspace",
    contentHtml: underConstructionContent,
  },
  {
    name: "MRP Impact",
    badge: "X",
    detailTitle: "Planning Workspace",
    contentHtml: underConstructionContent,
  },
  {
    name: "Figma",
    badge: "F",
    detailTitle: "Design Workspace",
    contentHtml: underConstructionContent,
  },
  {
    name: "Design Concepts",
    badge: "P",
    detailTitle: "Concept Workspace",
    contentHtml: underConstructionContent,
  },
].slice(0, 3).map(withGeneratedColor);

const pinnedBlockchain = [
  {
    name: "Web3",
    badge: "W",
    detailTitle: "Web3 pages",
    contentHtml: web3Content,
  },
  {
    name: "Ethereum",
    badge: "E",
    detailTitle: "Smart Contract Workspace",
    contentHtml: underConstructionContent,
  },
  {
    name: "Solana",
    badge: "S",
    detailTitle: "Web3 Workspace",
    contentHtml: underConstructionContent,
  },
].map(withGeneratedColor);

const userActions = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/hello-felixhuang",
    iconSrc: "/icon/linkedin.svg",
    target: "_blank",
  },
  {
    label: "GitHub",
    href: "https://github.com/ohno104dev",
    iconSrc: "/icon/github.svg",
    target: "_blank",
  },
  {
    label: "Email",
    href: "mailto:hi@ohno104.dev",
    iconSrc: "/icon/email.svg",
  },
];

const selectedApp = ref(null);
const isWindowOpen = ref(false);
const isWindowClosing = ref(false);
const isLauncherExpanded = ref(true);
const taipeiNow = ref(new Date());
const cursorX = ref(0);
const cursorY = ref(0);
const isCursorVisible = ref(false);
const isCursorPressed = ref(false);
const isCursorOnLightSurface = ref(false);

let timerId;
let canUseTouchCursor = false;
let compactViewportQuery;

function syncLauncherWithViewport(event) {
  if (event.matches) {
    isLauncherExpanded.value = false;
  }
}

function parseColorChannels(color) {
  const matched = color.match(/[\d.]+/g);

  if (!matched || matched.length < 3) {
    return null;
  }

  return {
    r: Number(matched[0]),
    g: Number(matched[1]),
    b: Number(matched[2]),
    a: matched[3] === undefined ? 1 : Number(matched[3]),
  };
}

function getRelativeLuminance({ r, g, b }) {
  const channels = [r, g, b].map((value) => {
    const normalized = value / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function detectLightSurfaceAtPoint(x, y) {
  let element = document.elementFromPoint(x, y);

  while (element) {
    const { backgroundColor } = window.getComputedStyle(element);
    const channels = parseColorChannels(backgroundColor);

    if (channels && channels.a > 0.15) {
      return getRelativeLuminance(channels) > 0.55;
    }

    element = element.parentElement;
  }

  return false;
}

function handlePointerMove(event) {
  cursorX.value = event.clientX;
  cursorY.value = event.clientY;
  isCursorVisible.value = true;
  isCursorOnLightSurface.value = detectLightSurfaceAtPoint(
    event.clientX,
    event.clientY,
  );
}

function handlePointerDown() {
  isCursorPressed.value = true;
}

function handlePointerUp() {
  isCursorPressed.value = false;
}

function handlePointerLeave() {
  isCursorVisible.value = false;
  isCursorPressed.value = false;
}

async function handleContentClick(event) {
  const copyButton = event.target.closest("[data-copy-value]");

  if (!copyButton) {
    return;
  }

  await navigator.clipboard.writeText(copyButton.dataset.copyValue);
  copyButton.classList.add("is-copied");
  copyButton.title = "Copied";
  copyButton.setAttribute("aria-label", "Copied");

  window.setTimeout(() => {
    copyButton.classList.remove("is-copied");
    copyButton.title = "Copy";
    copyButton.setAttribute("aria-label", `Copy ${copyButton.dataset.copyValue}`);
  }, 1400);
}

onMounted(() => {
  timerId = window.setInterval(() => {
    taipeiNow.value = new Date();
  }, 1000);

  compactViewportQuery = window.matchMedia(
    "(max-width: 720px), (max-width: 1100px) and (orientation: portrait)",
  );
  syncLauncherWithViewport(compactViewportQuery);
  compactViewportQuery.addEventListener("change", syncLauncherWithViewport);

  canUseTouchCursor = window.matchMedia("(pointer: fine)").matches;

  if (!canUseTouchCursor) {
    return;
  }

  window.addEventListener("pointermove", handlePointerMove);
  window.addEventListener("pointerdown", handlePointerDown);
  window.addEventListener("pointerup", handlePointerUp);
  window.addEventListener("pointerleave", handlePointerLeave);
});

onBeforeUnmount(() => {
  window.clearInterval(timerId);

  compactViewportQuery?.removeEventListener("change", syncLauncherWithViewport);

  if (!canUseTouchCursor) {
    return;
  }

  window.removeEventListener("pointermove", handlePointerMove);
  window.removeEventListener("pointerdown", handlePointerDown);
  window.removeEventListener("pointerup", handlePointerUp);
  window.removeEventListener("pointerleave", handlePointerLeave);
});

const dateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Taipei",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  weekday: "short",
});

const timeFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Taipei",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

const formattedDate = computed(() =>
  dateFormatter.format(taipeiNow.value).replace(",", "").toUpperCase(),
);
const formattedTime = computed(() => timeFormatter.format(taipeiNow.value));

function openWindow(app) {
  isWindowClosing.value = false;

  if (selectedApp.value?.name === app.name && isWindowOpen.value) {
    closeWindow();
    return;
  }

  selectedApp.value = app;
  isWindowOpen.value = true;

  if (compactViewportQuery?.matches) {
    isLauncherExpanded.value = false;
  }
}

function closeWindow() {
  isWindowClosing.value = compactViewportQuery?.matches ?? false;
  isWindowOpen.value = false;
  selectedApp.value = null;

  if (compactViewportQuery?.matches) {
    isLauncherExpanded.value = true;
  }

  window.requestAnimationFrame(() => {
    isWindowClosing.value = false;
  });
}

function toggleLauncher() {
  if (compactViewportQuery?.matches && isWindowOpen.value) {
    isWindowClosing.value = true;
    isWindowOpen.value = false;
    selectedApp.value = null;
    isLauncherExpanded.value = true;
    window.requestAnimationFrame(() => {
      isWindowClosing.value = false;
    });
    return;
  }

  isLauncherExpanded.value = !isLauncherExpanded.value;
}
</script>

<template>
  <main
    class="desktop"
    :style="{
      '--art-image-desktop': `url(${bgDesktop})`,
      '--art-image-tablet': `url(${bgTablet})`,
      '--art-image-tablet-landscape': `url(${bgTabletLandscape})`,
      '--art-image-mobile': `url(${bgMobile})`,
    }"
  >
    <div
      v-if="isCursorVisible"
      class="touch-cursor"
      :class="{
        'touch-cursor--pressed': isCursorPressed,
        'touch-cursor--dark': isCursorOnLightSurface,
      }"
      :style="{
        transform: `translate(${cursorX}px, ${cursorY}px)`,
      }"
      aria-hidden="true"
    ></div>

    <div class="desktop-art" aria-hidden="true">
      <div class="desktop-art__dots"></div>
      <div class="desktop-art__hero">
        <div class="desktop-art__marks">
          <span class="mark mark--circle"></span>
          <span class="mark mark--square"></span>
          <span class="mark mark--triangle"></span>
        </div>
        <div class="desktop-art__copy">
          <p>`fmt.Println("Hello, World")`</p>
          <p>&gt;&gt; Nice to meet you!</p>
        </div>
      </div>
      <div class="desktop-art__geometry">
        <span class="geo geo--arc"></span>
        <span class="geo geo--line"></span>
        <span class="geo geo--frame"></span>
      </div>
    </div>

    <section class="clock-panel">
      <p class="clock-panel__date">{{ formattedDate }}</p>
      <p class="clock-panel__time">{{ formattedTime }}</p>
      <p class="clock-panel__zone">UTC+8 Taipei</p>
    </section>

    <section
      class="workspace"
      :class="{ 'workspace--detail-open': isWindowOpen }"
    >
      <aside
        class="launcher"
        :class="{
          'launcher--collapsed': !isLauncherExpanded,
          'launcher--mobile-peek': isWindowOpen,
        }"
      >
        <div class="launcher-shell">
          <div class="profile-strip">
            <button
              class="launcher-toggle"
              :class="{ 'launcher-toggle--collapsed': !isLauncherExpanded }"
              :aria-label="
                isLauncherExpanded ? 'Collapse launcher' : 'Expand launcher'
              "
              @click="toggleLauncher"
            >
              <span
                class="launcher-toggle__disclosure"
                aria-hidden="true"
              ></span>
            </button>

            <button
              class="profile"
              type="button"
              @click="openWindow(profileItem)"
            >
              <div class="profile__avatar">
                <img :src="profileAvatar" alt="Felix Huang avatar" />
              </div>
              <div class="profile__meta">
                <strong>Felix Huang</strong>
                <span>About Me</span>
              </div>
            </button>

            <div class="profile-actions">
              <a
                v-for="action in userActions"
                :key="action.label"
                :href="action.href"
                :title="action.label"
                :aria-label="action.label"
                :target="action.target"
                rel="noreferrer"
              >
                <img :src="action.iconSrc" :alt="action.label" />
              </a>
            </div>
          </div>

          <div class="launcher__body">
            <section class="launcher-card launcher-card--secondary">
              <div class="section-head section-head--recommended">
                <h2>Blockchain</h2>
              </div>

              <div class="recommended-grid">
                <button
                  v-for="item in pinnedBlockchain"
                  :key="item.name"
                  class="app-tile app-tile--recommended"
                  :class="{
                    'app-tile--active':
                      isWindowOpen && selectedApp?.name === item.name,
                  }"
                  @click="openWindow(item)"
                >
                  <div class="app-icon" :style="{ background: item.color }">
                    {{ item.badge }}
                  </div>
                  <span>{{ item.name }}</span>
                </button>
              </div>
            </section>

            <section class="launcher-card launcher-card--secondary">
              <div class="section-head section-head--recommended">
                <h2>Game</h2>
              </div>

              <div class="recommended-grid">
                <button
                  v-for="item in pinnedGame"
                  :key="item.name"
                  class="app-tile app-tile--recommended"
                  :class="{
                    'app-tile--active':
                      isWindowOpen && selectedApp?.name === item.name,
                  }"
                  @click="openWindow(item)"
                >
                  <div class="app-icon" :style="{ background: item.color }">
                    {{ item.badge }}
                  </div>
                  <span>{{ item.name }}</span>
                </button>
              </div>
            </section>

            <section class="launcher-card launcher-card--secondary">
              <div class="section-head section-head--recommended">
                <h2>Project</h2>
              </div>

              <div class="recommended-grid">
                <button
                  v-for="app in pinnedProject"
                  :key="app.name"
                  class="app-tile app-tile--recommended"
                  :class="{
                    'app-tile--active':
                      isWindowOpen && selectedApp?.name === app.name,
                  }"
                  @click="openWindow(app)"
                >
                  <div class="app-icon" :style="{ background: app.color }">
                    {{ app.badge }}
                  </div>
                  <span>{{ app.name }}</span>
                </button>
              </div>
            </section>
          </div>
        </div>
      </aside>

      <section
        class="detail-window"
        :class="{
          'detail-window--open': isWindowOpen,
          'detail-window--closing': isWindowClosing,
        }"
      >
        <div class="detail-window__frame">
          <div class="detail-window__bar">
            <div class="detail-window__title">
              <div
                class="detail-window__appicon"
                :style="{ background: selectedApp?.color }"
              >
                <img
                  v-if="selectedApp?.iconImage"
                  :src="selectedApp.iconImage"
                  :alt="`${selectedApp.name} icon`"
                />
                <template v-else>{{ selectedApp?.badge }}</template>
              </div>
              <div>
                <strong>{{ selectedApp?.name }}</strong>
                <span>{{ selectedApp?.detailTitle }}</span>
              </div>
            </div>

            <div class="detail-window__controls">
              <button @click="closeWindow" aria-label="Close window">
                <span class="traffic-dot traffic-dot--close"></span>
                <span class="traffic-dot traffic-dot--minimize"></span>
                <span class="traffic-dot traffic-dot--zoom"></span>
              </button>
            </div>
          </div>

          <div class="detail-window__body">
            <div
              class="markdown-slot"
              @click="handleContentClick"
              v-html="selectedApp?.contentHtml"
            ></div>
          </div>
        </div>
      </section>
    </section>
  </main>
</template>

<style>
:root {
  font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif;
  color: #e5eef7;
  background: #020304;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
}

html,
body,
#app {
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
}

body {
  overflow: hidden;
  background: #020304;
}

@media (pointer: fine) {
  body,
  body * {
    cursor: none !important;
  }
}

button {
  font: inherit;
}

.desktop {
  --viewport-height: 100vh;
  --workspace-left: 10px;
  --workspace-right: 16px;
  --workspace-gap: 22px;
  --launcher-width: max(40%, 360px);
  --right-pane-left: calc(
    var(--workspace-left) + var(--launcher-width) + var(--workspace-gap)
  );
  --right-pane-width: calc(
    100% - var(--right-pane-left) - var(--workspace-right)
  );
  position: relative;
  width: 100vw;
  height: var(--viewport-height);
  min-height: 0;
  overflow: hidden;
  background-color: #020304;
  background-image: var(--art-image-desktop);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 0 0;
}

@supports (height: 100svh) {
  .desktop {
    --viewport-height: 100svh;
  }
}

@supports (height: 100dvh) {
  .desktop {
    --viewport-height: 100dvh;
  }
}

@media (min-width: 721px) and (max-width: 1180px) and (orientation: landscape),
  (min-width: 1181px) and (max-width: 1366px) and (min-height: 900px) and (orientation: landscape) {
  .desktop {
    background-image: var(--art-image-tablet-landscape);
    background-size: cover;
    background-position: 0 0;
  }
}

.touch-cursor {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 20;
  width: 28px;
  height: 28px;
  margin-left: -14px;
  margin-top: -14px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  border: 1px solid rgba(15, 23, 42, 0.3);
  background: rgba(255, 255, 255, 0.52);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.92) inset,
    0 0 0 1.5px rgba(15, 23, 42, 0.14),
    0 10px 28px rgba(15, 23, 42, 0.18),
    0 0 0 6px rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  pointer-events: none;
  transition:
    width 140ms ease,
    height 140ms ease,
    margin 140ms ease,
    background 140ms ease,
    box-shadow 140ms ease,
    border-color 140ms ease;
}

.touch-cursor--pressed {
  width: 22px;
  height: 22px;
  margin-left: -11px;
  margin-top: -11px;
  background: rgba(255, 255, 255, 0.68);
  border-color: rgba(15, 23, 42, 0.24);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.96) inset,
    0 0 0 1.5px rgba(15, 23, 42, 0.12),
    0 6px 18px rgba(15, 23, 42, 0.18),
    0 0 0 4px rgba(255, 255, 255, 0.12);
}

.touch-cursor--dark {
  border-color: rgba(255, 255, 255, 0.34);
  background: rgba(15, 23, 42, 0.56);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.08) inset,
    0 0 0 1.5px rgba(15, 23, 42, 0.22),
    0 10px 28px rgba(2, 6, 23, 0.28),
    0 0 0 6px rgba(15, 23, 42, 0.08);
}

.touch-cursor--dark.touch-cursor--pressed {
  background: rgba(15, 23, 42, 0.72);
  border-color: rgba(255, 255, 255, 0.42);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.1) inset,
    0 0 0 1.5px rgba(15, 23, 42, 0.18),
    0 6px 18px rgba(2, 6, 23, 0.3),
    0 0 0 4px rgba(15, 23, 42, 0.12);
}

.desktop::before,
.desktop::after {
  content: none;
}

.desktop-art {
  display: none;
}

.desktop-art > * {
  display: none;
}

.clock-panel {
  position: absolute;
  top: 18px;
  right: 32px;
  z-index: 2;
  text-align: right;
  color: #d7fbff;
  text-shadow: 0 0 10px rgba(98, 239, 255, 0.9);
}

.clock-panel__date,
.clock-panel__zone,
.clock-panel__time {
  margin: 0;
}

.clock-panel__date {
  font-size: 13px;
  letter-spacing: 4px;
}

.clock-panel__time {
  font-size: 60px;
  line-height: 1;
  letter-spacing: 8px;
}

.clock-panel__zone {
  margin-top: 6px;
  font-size: 13px;
  letter-spacing: 2px;
}

.workspace {
  position: relative;
  display: flex;
  align-items: stretch;
  gap: 22px;
  min-height: calc(var(--viewport-height) - 128px);
  padding: 128px 16px 0 10px;
}

.launcher,
.detail-window {
  height: calc(var(--viewport-height) - 128px);
}

.launcher {
  --desktop-collapsed-peek: 166px;
  position: relative;
  align-self: flex-start;
  z-index: 1;
  width: 40%;
  min-width: 360px;
  overflow: hidden;
}

.launcher-shell {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  background:
    linear-gradient(
      180deg,
      rgba(252, 253, 255, 0.94),
      rgba(243, 247, 252, 0.9)
    ),
    linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.04));
  border-radius: 28px 28px 0 0;
  color: #0f172a;
  box-shadow:
    0 28px 70px rgba(4, 14, 28, 0.22),
    0 8px 18px rgba(255, 255, 255, 0.12) inset,
    0 0 0 1px rgba(255, 255, 255, 0.48) inset,
    0 0 0 1px rgba(148, 163, 184, 0.18);
  overflow: hidden;
  transform: translateY(0);
  transition:
    transform 0.6s ease,
    background 0.6s ease,
    box-shadow 0.6s ease;
}

.launcher-shell::before {
  content: "";
  position: absolute;
  inset: 108px 0 0;
  background:
    radial-gradient(
      circle at 18% 0%,
      rgba(255, 255, 255, 0.52),
      transparent 28%
    ),
    linear-gradient(180deg, rgba(255, 255, 255, 0.08), transparent 26%);
  pointer-events: none;
}

.launcher--collapsed .launcher-shell {
  transform: translateY(calc(100% - var(--desktop-collapsed-peek)));
}

.launcher--collapsed .launcher-shell::before {
  opacity: 0;
}

.profile-strip {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40px 26px 28px;
  border-bottom: 1px solid #e2e8f0;
  background: #ffffff;
  border-radius: 28px 28px 0 0;
  opacity: 1;
  transform: translateY(0);
  transition:
    transform 0.6s ease,
    box-shadow 0.6s ease,
    border-radius 0.6s ease,
    border-color 0.6s ease;
}

.launcher-toggle {
  position: absolute;
  top: -1px;
  left: 50%;
  width: 76px;
  height: 42px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(226, 232, 240, 0.76);
  border-top: 0;
  border-radius: 0 0 24px 24px;
  background: linear-gradient(180deg, #ffffff, #f4f7fb);
  transform: translateX(-50%);
  cursor: pointer;
  box-shadow:
    0 10px 20px rgba(15, 23, 42, 0.06),
    inset 0 -1px 0 rgba(255, 255, 255, 0.76);
}

.launcher-toggle__disclosure {
  width: 18px;
  height: 18px;
  border-right: 3px solid #5f6f82;
  border-bottom: 3px solid #5f6f82;
  transform: rotate(45deg) translate(-1px, -2px);
  border-radius: 3px;
  transition: transform 0.6s ease;
}

.launcher-toggle--collapsed .launcher-toggle__disclosure {
  transform: rotate(225deg) translate(-1px, -1px);
}

.profile {
  appearance: none;
  border: 0;
  background: transparent;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 20px;
  color: #1f2937;
  font-size: 15px;
  text-align: left;
  border-radius: 22px;
  transition:
    background 180ms ease,
    transform 180ms ease;
}

.profile:hover {
  background: rgba(15, 23, 42, 0.05);
}

.profile:active {
  transform: translateY(1px);
}

.profile__avatar,
.app-icon,
.detail-window__appicon {
  display: grid;
  place-items: center;
  color: #fff;
  font-weight: 700;
}

.profile__avatar {
  width: 68px;
  height: 68px;
  border-radius: 20px;
  overflow: hidden;
  background: #f8fafc;
  box-shadow:
    0 8px 18px rgba(15, 23, 42, 0.12),
    inset 0 0 0 1px rgba(255, 255, 255, 0.4);
}

.profile__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.detail-window__appicon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.profile__meta strong,
.profile__meta span {
  display: block;
}

.profile__meta strong {
  font-size: 21px;
}

.profile__meta span {
  margin-top: 4px;
  color: #64748b;
  font-size: 14px;
}

.profile-actions {
  display: flex;
  gap: 14px;
}

.profile-actions a,
.section-head button,
.catalog-head button {
  border: 0;
  background: transparent;
}

.profile-actions a {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  background: #fff;
  color: #334155;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  display: grid;
  place-items: center;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.88),
    0 10px 22px rgba(15, 23, 42, 0.08);
}

.profile-actions a img {
  width: 22px;
  height: 22px;
  display: block;
  object-fit: contain;
}

.launcher__body {
  flex: 1 1 auto;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 1000px;
  padding: 24px 24px 28px;
  opacity: 1;
  transform: translateY(0);
  -webkit-overflow-scrolling: touch;
  transition:
    max-height 0.6s ease,
    opacity 0.6s ease,
    transform 0.6s ease,
    padding 0.6s ease;
}

.launcher--collapsed .launcher__body {
  flex: 0 1 auto;
  overflow: hidden;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
  opacity: 0;
  transform: translateY(28px);
  pointer-events: none;
}

.launcher-card {
  position: relative;
  overflow: hidden;
  padding: 22px 20px 24px;
  border-radius: 24px;
  background: rgba(248, 250, 252, 0.24);
  border: 1px solid rgba(226, 232, 240, 0.56);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.52),
    0 18px 34px rgba(15, 23, 42, 0.05);
  backdrop-filter: blur(18px);
  opacity: 1;
  transform: translateY(0);
  transition:
    opacity 0.6s ease,
    transform 0.6s ease;
}

.launcher-card::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: rgba(255, 255, 255, 0.06);
  pointer-events: none;
}

.launcher-card::after {
  content: none;
}

.launcher-card--secondary {
  margin-top: 26px;
}

.launcher--collapsed .launcher-card {
  opacity: 0;
  transform: translateY(26px);
}

.section-head,
.catalog-head {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
}

.section-head--recommended {
  margin-top: 0;
}

.section-head h2,
.catalog-head h2 {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: #1f2937;
  letter-spacing: 0.04em;
}

.pinned-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 28px 18px;
  position: relative;
  z-index: 1;
}

.app-tile {
  display: grid;
  justify-items: center;
  gap: 14px;
  padding: 14px 8px;
  border: 1px solid transparent;
  border-radius: 18px;
  background: transparent;
  text-align: center;
  cursor: pointer;
}

.app-tile--active {
  border-color: rgba(191, 219, 254, 0.58);
  background: rgba(255, 255, 255, 0.84);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.72),
    0 10px 24px rgba(15, 23, 42, 0.08);
}

.app-icon {
  width: 52px;
  height: 52px;
  border-radius: 15px;
  font-size: 17px;
  box-shadow: 0 12px 26px rgba(31, 41, 55, 0.16);
}

.app-tile span {
  font-size: 13px;
  color: #334155;
  line-height: 1.35;
  letter-spacing: 0.03em;
}

.recommended-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 28px 18px;
  position: relative;
  z-index: 1;
}

.app-tile--recommended {
  min-height: 112px;
}

.detail-window {
  position: absolute;
  top: 128px;
  left: calc(40% + 14px);
  z-index: 3;
  width: calc(60% - 20px);
  height: calc(100vh - 128px);
  opacity: 0;
  transform: translateX(36px) scale(0.98);
  pointer-events: none;
  transition:
    opacity 180ms ease,
    transform 220ms ease;
}

.detail-window--open {
  opacity: 1;
  transform: translateX(0) scale(1);
  pointer-events: auto;
}

.detail-window__frame {
  height: 100%;
  border-radius: 28px 28px 0 0;
  overflow: hidden;
  background: rgba(9, 20, 34, 0.72);
  border: 1px solid rgba(194, 240, 255, 0.18);
  box-shadow:
    0 18px 60px rgba(2, 12, 24, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(14px);
}

.detail-window__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px;
  border-bottom: 1px solid rgba(194, 240, 255, 0.1);
  background: rgba(7, 18, 31, 0.5);
}

.detail-window__title {
  display: flex;
  align-items: center;
  gap: 14px;
}

.detail-window__appicon {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  flex: 0 0 auto;
}

.detail-window__title strong {
  display: block;
  font-size: 15px;
}

.detail-window__title span {
  display: block;
  margin-top: 3px;
  color: #9db5c9;
  font-size: 12px;
}

.detail-window__controls {
  display: flex;
  gap: 0;
}

.detail-window__controls button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  border: 0;
  cursor: pointer;
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.08) inset,
    0 8px 18px rgba(2, 12, 24, 0.18);
}

.traffic-dot {
  width: 12px;
  height: 12px;
  border-radius: 999px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08) inset;
}

.traffic-dot--close {
  background: #ff5f57;
}

.traffic-dot--minimize {
  background: #febc2e;
}

.traffic-dot--zoom {
  background: #28c840;
}

.detail-window__body {
  height: calc(100% - 75px);
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0;
  -webkit-overflow-scrolling: touch;
}

.markdown-slot {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(300px, 1.1fr);
  align-items: center;
  gap: 10px;
  min-height: 100%;
  margin-top: 0;
  border-radius: 0;
  border: 0;
  background: linear-gradient(
    180deg,
    rgba(18, 42, 70, 0.84),
    rgba(7, 22, 39, 0.92)
  );
  padding: 32px;
}

.markdown-copy {
  max-width: 360px;
}

.markdown-slot p,
.markdown-slot span {
  margin: 0;
}

.markdown-slot p {
  font-size: 30px;
  font-weight: 700;
  letter-spacing: 0.01em;
}

.markdown-slot span {
  margin-top: 12px;
  color: #bfd3e3;
  line-height: 1.6;
  font-size: 15px;
  display: block;
}

.markdown-caption {
  margin-top: 18px;
  color: #f2d45c;
  letter-spacing: 0.14em;
  font-size: 12px;
  text-transform: uppercase;
}

.markdown-visual {
  display: flex;
  justify-content: flex-start;
}

.markdown-visual img {
  width: min(100%, 780px);
  height: auto;
  display: block;
  object-fit: contain;
  filter: drop-shadow(0 24px 50px rgba(255, 208, 0, 0.12));
}

@keyframes glass-sheen {
  0%,
  100% {
    transform: translateX(0) rotate(18deg);
    opacity: 0.24;
  }

  50% {
    transform: translateX(126%) rotate(18deg);
    opacity: 0.72;
  }
}

@media (max-width: 720px), (max-width: 1100px) and (orientation: portrait) {
  .desktop {
    --compact-side: 10px;
    --compact-top: 148px;
    --compact-bottom-bar: 126px;
    --compact-drawer-gap: 10px;
    --compact-expanded-height: calc(
      var(--viewport-height) - var(--compact-top) - 12px
    );
    --compact-expanded-top: calc(
      var(--viewport-height) - var(--compact-expanded-height)
    );
    height: var(--viewport-height);
    min-height: 0;
    overflow: hidden;
  }

  .clock-panel {
    top: 18px;
    right: 18px;
    z-index: 8;
  }

  .desktop {
    background-image: var(--art-image-tablet);
    background-size: cover;
    background-position: 0 0;
  }

  .workspace {
    position: absolute;
    inset: 0;
    display: block;
    min-height: 0;
    padding: 0;
  }

  .launcher,
  .detail-window {
    width: auto;
    min-width: 0;
  }

  .launcher {
    position: absolute;
    right: var(--compact-side);
    bottom: 0;
    left: var(--compact-side);
    z-index: 6;
    overflow: hidden;
    height: var(--compact-expanded-height);
  }

  .workspace--detail-open .launcher {
    height: var(--compact-bottom-bar);
  }

  .launcher-shell {
    flex-direction: column;
    height: 100%;
    max-height: none;
    overflow-x: hidden;
    background: #ffffff;
    border-radius: 28px 28px 0 0;
    transform: translateY(calc(100% - var(--compact-bottom-bar)));
    box-shadow:
      0 -18px 46px rgba(2, 12, 24, 0.22),
      0 -1px 0 rgba(255, 255, 255, 0.86) inset,
      0 0 0 1px rgba(226, 232, 240, 0.72);
  }

  .launcher-shell::before {
    inset: 0;
  }

  .launcher--collapsed .launcher-shell,
  .workspace--detail-open .launcher .launcher-shell {
    transform: translateY(calc(100% - var(--compact-bottom-bar)));
  }

  .launcher:not(.launcher--collapsed) .launcher-shell {
    transform: none;
  }

  .profile-strip {
    padding: 30px 20px 22px;
    border-bottom: 1px solid #e2e8f0;
    border-radius: 28px 28px 0 0;
    box-shadow: none;
  }

  .profile {
    gap: 16px;
    font-size: 13px;
  }

  .profile__avatar {
    width: 56px;
    height: 56px;
    border-radius: 17px;
  }

  .profile__meta strong {
    font-size: 18px;
  }

  .profile__meta span {
    margin-top: 3px;
    font-size: 12px;
  }

  .profile-actions {
    gap: 10px;
  }

  .profile-actions a {
    width: 40px;
    height: 40px;
    border-radius: 12px;
  }

  .profile-actions a img {
    width: 20px;
    height: 20px;
  }

  .launcher-toggle {
    top: -1px;
    width: 68px;
    height: 38px;
    background: linear-gradient(180deg, #ffffff, #f7f9fc);
    box-shadow:
      0 14px 28px rgba(15, 23, 42, 0.08),
      inset 0 -1px 0 rgba(255, 255, 255, 0.86);
  }

  .launcher-toggle__disclosure {
    width: 16px;
    height: 16px;
    border-right-width: 3px;
    border-bottom-width: 3px;
  }

  .launcher__body {
    flex: 1 1 auto;
    max-height: none;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 18px 18px 22px;
    opacity: 0;
    transform: translateY(28px);
    pointer-events: none;
  }

  .launcher:not(.launcher--collapsed) .launcher__body {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }

  .workspace--detail-open .launcher .launcher__body {
    opacity: 0;
    transform: translateY(28px);
    pointer-events: none;
  }

  .launcher--collapsed .launcher-toggle__disclosure {
    transform: rotate(225deg) translate(-1px, -1px);
  }

  .launcher:not(.launcher--collapsed) .launcher-toggle__disclosure {
    transform: rotate(45deg) translate(-1px, -2px);
  }

  .detail-window {
    position: absolute;
    top: var(--compact-expanded-top);
    right: var(--compact-side);
    bottom: calc(var(--compact-bottom-bar) + var(--compact-drawer-gap));
    left: var(--compact-side);
    z-index: 7;
    height: auto;
    margin: 0;
    opacity: 0;
    transform: translateY(14px);
    transition:
      opacity 360ms ease,
      transform 420ms ease;
    pointer-events: none;
  }

  .detail-window__frame {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
    border-radius: 26px;
  }

  .detail-window__body {
    flex: 1 1 auto;
    min-height: 0;
    height: auto;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .detail-window--open {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }

  .detail-window--closing {
    transition: none;
  }

  .markdown-slot {
    grid-template-columns: 1fr;
    align-items: start;
    min-height: 100%;
  }

  .markdown-copy {
    max-width: none;
  }

  .markdown-visual {
    justify-content: center;
  }
}

@media (max-width: 720px), (max-width: 920px) and (max-aspect-ratio: 9 / 16) {
  .desktop {
    --compact-side: 12px;
    --compact-top: 106px;
    --compact-bottom-bar: 112px;
    --compact-drawer-gap: 8px;
    --compact-expanded-height: calc(
      var(--viewport-height) - var(--compact-top) - 12px
    );
    background-image: var(--art-image-mobile);
    background-size: cover;
    background-position: 0 0;
  }

  .clock-panel {
    right: 18px;
  }

  .clock-panel__time {
    font-size: 42px;
    letter-spacing: 5px;
  }

  .profile-strip {
    padding: 28px 16px 20px;
  }

  .profile {
    gap: 12px;
  }

  .profile__avatar {
    width: 50px;
    height: 50px;
    border-radius: 15px;
  }

  .profile__meta strong {
    font-size: 16px;
  }

  .profile__meta span {
    font-size: 11px;
  }

  .profile-actions {
    gap: 8px;
  }

  .profile-actions a {
    width: 36px;
    height: 36px;
    border-radius: 11px;
  }

  .profile-actions a img {
    width: 18px;
    height: 18px;
  }

  .launcher-toggle {
    width: 58px;
    height: 32px;
    border-radius: 0 0 18px 18px;
  }

  .launcher-toggle__disclosure {
    width: 13px;
    height: 13px;
    border-right-width: 3px;
    border-bottom-width: 3px;
  }

  .markdown-slot {
    padding: 22px 18px 26px;
  }

  .pinned-grid,
  .recommended-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) and (min-aspect-ratio: 3 / 4) and (orientation: portrait) {
  .desktop {
    --compact-side: 10px;
    --compact-top: 148px;
    --compact-bottom-bar: 126px;
    --compact-drawer-gap: 10px;
    background-image: var(--art-image-tablet);
  }
}
</style>
