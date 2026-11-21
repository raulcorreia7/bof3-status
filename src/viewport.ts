import { createSignal, onCleanup } from "solid-js";
import { watchViewport } from "./browser.ts";

const NARROW = 700;

// The window width, and whether it is a phone-sized page.
export function useViewport(): { width: () => number; narrow: () => boolean } {
  const [width, setWidth] = createSignal(window.innerWidth);
  onCleanup(watchViewport(setWidth));
  return { width, narrow: () => width() < NARROW };
}
