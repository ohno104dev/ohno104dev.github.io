<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import bgDesktop from "./assets/bg-desktop.png";
import bgMobile from "./assets/bg-mobile.png";
import bgTablet from "./assets/bg-tablet.png";
import profileAvatar from "./assets/profile-avatar.png";

const pinnedApps = [
  {
    name: "Edge",
    badge: "E",
    color: "linear-gradient(135deg, #52c8ff, #2f74ff)",
    detailTitle: "Browser Workspace",
    detailBody:
      "Use the right-side window to show web previews, tabs, and browsing context without overlapping the live Taipei clock.",
  },
  {
    name: "Word",
    badge: "W",
    color: "linear-gradient(135deg, #275efe, #2c3e9f)",
    detailTitle: "Document Workspace",
    detailBody:
      "A focused reading and editing surface for reports, specs, and shared notes.",
  },
  {
    name: "Excel",
    badge: "X",
    color: "linear-gradient(135deg, #36c275, #0a7847)",
    detailTitle: "Spreadsheet Workspace",
    detailBody:
      "Charts, budgets, and tabular summaries can live in this main window area.",
  },
  {
    name: "PowerPoint",
    badge: "P",
    color: "linear-gradient(135deg, #ff7d4a, #ca4427)",
    detailTitle: "Presentation Workspace",
    detailBody:
      "A large stage for slides, layout review, and presenter materials.",
  },
  {
    name: "Outlook",
    badge: "O",
    color: "linear-gradient(135deg, #0095ff, #1458d4)",
    detailTitle: "Communication Workspace",
    detailBody:
      "Pin your inbox, meeting agenda, or follow-up tasks on the right.",
  },
  {
    name: "Store",
    badge: "S",
    color: "linear-gradient(135deg, #18c8ff, #0078d4)",
    detailTitle: "Store Workspace",
    detailBody:
      "Show application listings, updates, and downloads in the content panel.",
  },
  {
    name: "Settings",
    badge: "G",
    color: "linear-gradient(135deg, #9099aa, #667085)",
    detailTitle: "Settings Workspace",
    detailBody:
      "A neutral control surface for preferences, connectivity, and account settings.",
  },
  {
    name: "Photos",
    badge: "P",
    color: "linear-gradient(135deg, #4c95ff, #2a5fbf)",
    detailTitle: "Media Workspace",
    detailBody:
      "A larger preview region for image browsing, galleries, and asset details.",
  },
  {
    name: "Xbox",
    badge: "X",
    color: "linear-gradient(135deg, #69d24a, #179b3e)",
    detailTitle: "Gaming Workspace",
    detailBody:
      "Use the window for library highlights, updates, and launch actions.",
  },
  {
    name: "Solitaire",
    badge: "S",
    color: "linear-gradient(135deg, #59b8ff, #1d83cf)",
    detailTitle: "Casual Workspace",
    detailBody:
      "A relaxed content view for games, scoreboards, and quick previews.",
  },
  {
    name: "Paint",
    badge: "P",
    color: "linear-gradient(135deg, #65d8c2, #4198ff)",
    detailTitle: "Canvas Workspace",
    detailBody:
      "A drawing and asset sketching surface with room for larger previews.",
  },
  {
    name: "LinkedIn",
    badge: "in",
    color: "linear-gradient(135deg, #3e8cff, #0a66c2)",
    detailTitle: "Network Workspace",
    detailBody:
      "Profiles, hiring notes, and networking activity can appear here.",
  },
  {
    name: "Calculator",
    badge: "C",
    color: "linear-gradient(135deg, #7da9ff, #425dcb)",
    detailTitle: "Utility Workspace",
    detailBody:
      "A compact utility view for quick calculations and small tools.",
  },
  {
    name: "Clock",
    badge: "K",
    color: "linear-gradient(135deg, #f3f4f6, #d0d5dd)",
    detailTitle: "Time Workspace",
    detailBody:
      "Secondary clocks, timers, and scheduling helpers can render in this area.",
  },
  {
    name: "Notepad",
    badge: "N",
    color: "linear-gradient(135deg, #5ed0e6, #2488b6)",
    detailTitle: "Notes Workspace",
    detailBody:
      "Quick notes and scratch text can open in the large right-side window.",
  },
  {
    name: "Snipping Tool",
    badge: "T",
    color: "linear-gradient(135deg, #ffb86c, #ff7a59)",
    detailTitle: "Capture Workspace",
    detailBody:
      "Previews, crops, and screenshot history fit naturally in this panel.",
  },
];

const recommendedItems = [
  {
    name: "Grammarly",
    badge: "G",
    color: "linear-gradient(135deg, #37c28d, #178b64)",
    detailTitle: "Writing Workspace",
    detailBody:
      "A focused side window for polished drafts, edits, and AI writing support.",
  },
  {
    name: "Book Report",
    badge: "W",
    color: "linear-gradient(135deg, #275efe, #2c3e9f)",
    detailTitle: "Reading Notes",
    detailBody:
      "Use this panel for summaries, reading highlights, and document annotations.",
  },
  {
    name: "Budget Estimate",
    badge: "X",
    color: "linear-gradient(135deg, #36c275, #0a7847)",
    detailTitle: "Budget Workspace",
    detailBody:
      "A clean area for forecasts, estimates, and lightweight financial planning.",
  },
  {
    name: "MRP Impact",
    badge: "X",
    color: "linear-gradient(135deg, #36c275, #0a7847)",
    detailTitle: "Planning Workspace",
    detailBody:
      "Review manufacturing impacts, planning notes, and quick operational summaries.",
  },
  {
    name: "Figma",
    badge: "F",
    color: "linear-gradient(135deg, #b859ff, #ff5f6d)",
    detailTitle: "Design Workspace",
    detailBody:
      "A presentation area for interface drafts, component explorations, and design handoff.",
  },
  {
    name: "Design Concepts",
    badge: "P",
    color: "linear-gradient(135deg, #ff7d4a, #ca4427)",
    detailTitle: "Concept Workspace",
    detailBody:
      "Keep moodboards, concept notes, and visual directions visible on the right.",
  },
];

const userActions = [
  { label: "Profile", icon: "D" },
  { label: "LinkedIn", icon: "in" },
  { label: "GitHub", icon: "GH" },
  { label: "Email", icon: "@" },
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

onMounted(() => {
  timerId = window.setInterval(() => {
    taipeiNow.value = new Date();
  }, 1000);

  compactViewportQuery = window.matchMedia("(max-width: 1100px)");
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
  <main class="desktop">
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
    >
      <span class="touch-cursor__core"></span>
    </div>

    <div
      class="desktop-art"
      :style="{
        '--art-image-desktop': `url(${bgDesktop})`,
        '--art-image-tablet': `url(${bgTablet})`,
        '--art-image-mobile': `url(${bgMobile})`,
      }"
      aria-hidden="true"
    >
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

    <section class="workspace" :class="{ 'workspace--detail-open': isWindowOpen }">
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

            <div class="profile">
              <div class="profile__avatar">
                <img :src="profileAvatar" alt="Felix Huang avatar" />
              </div>
              <div class="profile__meta">
                <strong>Felix Huang</strong>
                <span>Software Developer</span>
              </div>
            </div>

            <div class="profile-actions">
              <button
                v-for="action in userActions"
                :key="action.label"
                :title="action.label"
              >
                {{ action.icon }}
              </button>
            </div>
          </div>

          <div class="launcher__body">
            <section class="launcher-card">
              <div class="section-head">
                <h2>Project</h2>
              </div>

              <div class="pinned-grid">
                <button
                  v-for="app in pinnedApps.slice(0, 9)"
                  :key="app.name"
                  class="app-tile"
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

            <section class="launcher-card launcher-card--secondary">
              <div class="section-head section-head--recommended">
                <h2>Game</h2>
              </div>

              <div class="recommended-grid">
                <button
                  v-for="item in recommendedItems"
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
                {{ selectedApp?.badge }}
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
            <div class="markdown-slot">
              <div class="markdown-copy">
                <p># Under Construction</p>
                <span
                  >This space is being shaped into a cleaner portfolio
                  workspace.</span
                >
                <span
                  >Projects, notes, and experiments will land here soon with a
                  calmer layout.</span
                >
                <span class="markdown-caption">WIP • UI refresh in progress</span>
              </div>

              <div class="markdown-visual" aria-hidden="true">
                <img
                  src="/under-construction.png"
                  alt="Under construction neon sign"
                />
              </div>
            </div>
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
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
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
  min-height: 100vh;
  overflow: hidden;
  background: #020304;
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

.touch-cursor__core {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.58);
  box-shadow:
    0 0 0 2px rgba(255, 255, 255, 0.44),
    0 0 0 3px rgba(15, 23, 42, 0.08);
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

.touch-cursor--dark .touch-cursor__core {
  background: rgba(255, 255, 255, 0.92);
  box-shadow:
    0 0 0 2px rgba(15, 23, 42, 0.26),
    0 0 0 3px rgba(255, 255, 255, 0.08);
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
  position: absolute;
  top: 128px;
  right: var(--workspace-right);
  bottom: 0;
  left: var(--right-pane-left);
  overflow: hidden;
  border-radius: 28px 28px 0 0;
  background-color: #020304;
  background-image: var(--art-image-desktop);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.04),
    0 24px 60px rgba(15, 23, 42, 0.18);
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
  min-height: calc(100vh - 128px);
  padding: 128px 16px 0 10px;
}

.launcher,
.detail-window {
  height: calc(100vh - 128px);
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
  display: flex;
  align-items: center;
  gap: 20px;
  color: #1f2937;
  font-size: 15px;
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

.profile-actions button,
.section-head button,
.catalog-head button {
  border: 0;
  background: transparent;
}

.profile-actions button {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  background: #fff;
  color: #334155;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  font-size: 15px;
  font-weight: 700;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.88),
    0 10px 22px rgba(15, 23, 42, 0.08);
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
  background:
    linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.34) 0%,
      rgba(255, 255, 255, 0.08) 34%,
      rgba(255, 255, 255, 0.02) 100%
    ),
    linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.46),
      rgba(244, 247, 251, 0.2)
    ),
    linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.16),
      rgba(255, 255, 255, 0.04)
    );
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.68),
    inset 0 18px 32px rgba(255, 255, 255, 0.1),
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
  background:
    linear-gradient(
      120deg,
      rgba(255, 255, 255, 0.52) 0%,
      rgba(255, 255, 255, 0.14) 22%,
      rgba(255, 255, 255, 0) 44%
    ),
    radial-gradient(
      circle at 16% 2%,
      rgba(255, 255, 255, 0.56),
      transparent 30%
    ),
    linear-gradient(180deg, rgba(255, 255, 255, 0.12), transparent 34%);
  pointer-events: none;
}

.launcher-card::after {
  content: "";
  position: absolute;
  top: -22%;
  left: -48%;
  width: 72%;
  height: 160%;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.08) 24%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(255, 255, 255, 0.08) 76%,
    rgba(255, 255, 255, 0) 100%
  );
  transform: rotate(18deg);
  opacity: 0.78;
  mix-blend-mode: screen;
  pointer-events: none;
  animation: glass-sheen 6.4s ease-in-out infinite;
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

@media (max-width: 1100px) {
  .desktop {
    --compact-side: 10px;
    --compact-top: 112px;
    --compact-bottom-bar: 126px;
    --compact-drawer-gap: 10px;
    --compact-expanded-height: calc(100vh - var(--compact-top) - 12px);
    --compact-expanded-top: calc(100vh - var(--compact-expanded-height));
    height: 100vh;
    min-height: 100vh;
    overflow: hidden;
  }

  .clock-panel {
    top: 18px;
    right: 18px;
    z-index: 8;
  }

  .desktop-art {
    position: absolute;
    top: var(--compact-top);
    right: var(--compact-side);
    bottom: 0;
    left: var(--compact-side);
    height: auto;
    margin: 0;
    border-radius: 26px;
    background-image: var(--art-image-tablet);
    background-size: cover;
    background-position: center;
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

  .profile-actions button {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    font-size: 13px;
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

@media (max-width: 720px) {
  .desktop-art {
    top: var(--compact-top);
    background-image: var(--art-image-mobile);
    background-position: center;
  }

  .desktop {
    --compact-side: 12px;
    --compact-top: 106px;
    --compact-bottom-bar: 112px;
    --compact-drawer-gap: 8px;
    --compact-expanded-height: calc(100vh - var(--compact-top) - 12px);
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

  .profile-actions button {
    width: 36px;
    height: 36px;
    border-radius: 11px;
    font-size: 12px;
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
</style>
