import { RefObject, useEffect } from "react";
import {
  configureScrollStore,
  initScrollEvents,
  useScrollStore,
} from "./scroll-store";

export interface UseScrollOptions {
  target?: RefObject<HTMLElement>;
  container?: RefObject<HTMLElement>;
  disabled?: boolean;
}

export function useScroll(options: UseScrollOptions = {}) {
  const { target, container, disabled } = options;

  useEffect(() => {
    if (disabled) return;

    configureScrollStore({
      target: target?.current ?? null,
      container: container?.current ?? null,
    });

    initScrollEvents();
  }, [target, container, disabled]);

  return useScrollStore();
}
