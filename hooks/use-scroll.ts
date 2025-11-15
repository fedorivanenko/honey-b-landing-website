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
  const resolvedTarget = target?.current ?? null;
  const resolvedContainer = container?.current ?? null;

  useEffect(() => {
    if (disabled) return;

    configureScrollStore({
      target: resolvedTarget,
      container: resolvedContainer,
    });

    initScrollEvents();
  }, [resolvedTarget, resolvedContainer, disabled]);

  return useScrollStore();
}
