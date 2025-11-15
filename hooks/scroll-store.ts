import { useSyncExternalStore } from "react";

export interface ScrollState {
  scrollX: number;
  scrollY: number;
  scrollXProgress: number;
  scrollYProgress: number;
}

const clamp = (v: number) => Math.max(0, Math.min(1, v));

/** Internal mutable state */
let state: ScrollState = {
  scrollX: 0,
  scrollY: 0,
  scrollXProgress: 0,
  scrollYProgress: 0,
};

const listeners = new Set<() => void>();

let frame: number | null = null;
let targetEl: HTMLElement | null = null;
let containerEl: HTMLElement | Window | null = null;

/** Type guard */
function isHTMLElement(
  el: HTMLElement | Window | null
): el is HTMLElement {
  return el instanceof HTMLElement;
}

const getDocumentElement = () =>
  document.scrollingElement ?? document.documentElement;

function readContainerScroll(container: HTMLElement | null): ScrollState {
  if (container) {
    const maxX = container.scrollWidth - container.clientWidth;
    const maxY = container.scrollHeight - container.clientHeight;

    const scrollX = container.scrollLeft;
    const scrollY = container.scrollTop;

    return {
      scrollX,
      scrollY,
      scrollXProgress: maxX <= 0 ? 0 : clamp(scrollX / maxX),
      scrollYProgress: maxY <= 0 ? 0 : clamp(scrollY / maxY),
    };
  }

  const doc = getDocumentElement();
  const scrollX = window.scrollX ?? window.pageXOffset;
  const scrollY = window.scrollY ?? window.pageYOffset;

  const maxX = doc.scrollWidth - window.innerWidth;
  const maxY = doc.scrollHeight - window.innerHeight;

  return {
    scrollX,
    scrollY,
    scrollXProgress: maxX <= 0 ? 0 : clamp(scrollX / maxX),
    scrollYProgress: maxY <= 0 ? 0 : clamp(scrollY / maxY),
  };
}

function applyTargetProgress(
  values: ScrollState,
  target: HTMLElement | null,
  container: HTMLElement | null
): ScrollState {
  // When using a custom container, viewport-relative target progress
  // does not make sense (same as motion.dev behavior).
  if (!target || container) return values;

  const rect = target.getBoundingClientRect();
  const vw = window.innerWidth || 1;
  const vh = window.innerHeight || 1;

  return {
    ...values,
    scrollXProgress: clamp((vw - rect.left) / (vw + rect.width)),
    scrollYProgress: clamp((vh - rect.top) / (vh + rect.height)),
  };
}

function update() {
  const containerForCalc = isHTMLElement(containerEl)
    ? containerEl
    : null;

  const base = readContainerScroll(containerForCalc);
  const next = applyTargetProgress(base, targetEl, containerForCalc);

  // Dedup — prevent unnecessary listener executions
  if (
    next.scrollX === state.scrollX &&
    next.scrollY === state.scrollY &&
    next.scrollXProgress === state.scrollXProgress &&
    next.scrollYProgress === state.scrollYProgress
  ) {
    return;
  }

  state = next;

  listeners.forEach((fn) => fn());
}

function scheduleUpdate() {
  if (frame !== null) return;
  frame = requestAnimationFrame(() => {
    frame = null;
    update();
  });
}

/* ---------------- PUBLIC API ---------------- */

export function configureScrollStore(opts: {
  target?: HTMLElement | null;
  container?: HTMLElement | Window | null;
}) {
  targetEl = opts.target ?? null;
  containerEl = opts.container ?? window;
}

export function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getSnapshot(): ScrollState {
  return state;
}

export function useScrollStore() {
  return useSyncExternalStore(subscribe, getSnapshot, () => state);
}

let initialized = false;

export function initScrollEvents() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  const scrollSource = containerEl ?? window;

  scrollSource.addEventListener("scroll", scheduleUpdate, {
    passive: true,
  });

  window.addEventListener("resize", scheduleUpdate);
}
