import { formatHash, isLegacyPath, parseHash, type Route, sectionOfHash } from "./model/route.ts";
import { scrollToSection } from "./views/scroll.ts";

export function readRoute(): Route {
  const hash = window.location.hash;
  const route = parseHash(hash);
  if (isLegacyPath(hash)) {
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}${formatHash(route)}`,
    );
  }
  return route;
}

export const currentHash = (): string => window.location.hash;

export function writeHash(hash: string, replace: boolean): void {
  const url = hash || `${window.location.pathname}${window.location.search}`;
  if (replace) window.history.replaceState(null, "", url);
  else window.history.pushState(null, "", url);
}

// Calls `listener` with the new route after the browser moves in history; returns the stop function.
export function watchRoute(listener: (route: Route) => void): () => void {
  const sync = () => {
    const route = readRoute();
    listener(route);
    const section = sectionOfHash(window.location.hash) ?? (route.q ? "find" : null);
    if (section) requestAnimationFrame(() => scrollToSection(section, false));
  };
  window.addEventListener("hashchange", sync);
  window.addEventListener("popstate", sync);
  return () => {
    window.removeEventListener("hashchange", sync);
    window.removeEventListener("popstate", sync);
  };
}

// After the new page has drawn, so the browser does not move the scroll to keep content in view.
export function scrollAfterDraw(section: string | undefined, newPage: boolean): void {
  if (section) requestAnimationFrame(() => scrollToSection(section));
  else if (newPage) requestAnimationFrame(() => window.scrollTo(0, 0));
}

export function watchViewport(listener: (width: number) => void): () => void {
  const update = () => listener(window.innerWidth);
  window.addEventListener("resize", update);
  return () => window.removeEventListener("resize", update);
}
