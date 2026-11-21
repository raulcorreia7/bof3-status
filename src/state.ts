import {
  createContext,
  createEffect,
  createMemo,
  createSignal,
  on,
  onCleanup,
  useContext,
} from "solid-js";
import { createStore, reconcile, unwrap } from "solid-js/store";
import { currentHash, readRoute, scrollAfterDraw, watchRoute, writeHash } from "./browser.ts";
import { PAGE_STEP } from "./model/browse.ts";
import { hrefOf, type Route, step } from "./model/route.ts";
import { applyMode, type Mode, saveMode, storedMode, watchSystemScheme } from "./theme/apply.ts";
import type { Scheme, Tokens } from "./theme/tokens.ts";
import type { Model } from "./types.ts";
import type { Ctx } from "./viewtypes.ts";

type Navigate = (patch: Partial<Route>, replace?: boolean, section?: string) => void;

interface Page extends Ctx {
  go: Navigate;
  href: (patch: Partial<Route>, section?: string) => string;
  scheme: Scheme;
  mode: Mode;
  setMode: (mode: Mode) => void;
  showMore: () => void;
}

const PageContext = createContext<Page>();

export const PageProvider = PageContext.Provider;
export function usePage(): Page {
  const page = useContext(PageContext);
  if (!page) throw new Error("usePage needs a PageProvider");
  return page;
}

export function createPage(model: Model): Page {
  const [route, setRoute] = createStore<Route>(readRoute());
  onCleanup(watchRoute((next) => setRoute(reconcile(next))));

  const go: Navigate = (patch, replace = false, section) => {
    const next = step(unwrap(route), patch, section);
    if (next.hash !== currentHash()) {
      writeHash(next.hash, replace);
      setRoute(reconcile(next.route));
    }
    scrollAfterDraw(section, next.newPage);
  };
  const href = (patch: Partial<Route>, section?: string) => hrefOf(route, patch, section);

  const [mode, setModeSignal] = createSignal<Mode>(storedMode());
  const [applied, setApplied] = createSignal(applyMode(mode()));
  createEffect(() => {
    const current = mode();
    setApplied(applyMode(current));
    if (current === "auto") onCleanup(watchSystemScheme(() => setApplied(applyMode("auto"))));
  });
  const setMode = (next: Mode) => {
    saveMode(next);
    setModeSignal(next);
  };

  const filterKey = createMemo(() =>
    [route.q, route.st, route.part, route.image, route.sort, route.dir].join("|")
  );
  const [limit, setLimit] = createSignal(PAGE_STEP);
  createEffect(on(filterKey, () => setLimit(PAGE_STEP), { defer: true }));

  return {
    model,
    route,
    go,
    href,
    get tokens(): Tokens {
      return applied().tokens;
    },
    get scheme(): Scheme {
      return applied().scheme;
    },
    get mode(): Mode {
      return mode();
    },
    get limit(): number {
      return limit();
    },
    setMode,
    showMore: () => setLimit(limit() + PAGE_STEP),
  };
}
