// Game function treemaps of one part of the game or one image, sized by code bytes. Pure option
// builders; views/Treemap.tsx draws them.

import { bytes, escapeText, number, percent } from "../model/format.ts";
import { ASSEMBLY_LIBRARY } from "../model/report.ts";
import { STATUS } from "../model/status.ts";
import { SDK } from "../strings.ts";
import type { Tokens } from "../theme/tokens.ts";
import type { Fn, Group, Model, Target } from "../types.ts";
import type { ChartOption } from "./register.ts";

/** A zero-byte function keeps one byte of area, so it stays in the map. */
const MIN_WEIGHT = 1;

/**
 * The WCAG relative luminance of a `#rrggbb` fill. Black and white text have equal contrast
 * where the fill's luminance is 0.179, so that crossover chooses the label colour.
 */
const luminance = (fill: string): number => {
  const hex = fill.replace(/^#/, "");
  if (!/^[0-9a-f]{6}$/i.test(hex)) return 1;
  const channel = (offset: number) => {
    const value = Number.parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(0) + 0.7152 * channel(2) + 0.0722 * channel(4);
};

/** Black or white, whichever has the higher contrast against `fill`. */
const readableOn = (fill: string): string => (luminance(fill) > 0.179 ? "#000000" : "#ffffff");

export type MapRef = { kind: "home" | "part" | "image" | "fn" | "sdk"; id: string };

export interface MapNode {
  id: string;
  name: string;
  value: number;
  ref: MapRef;
  tip: string;
  itemStyle?: Record<string, string | number>;
  label?: { show?: boolean; color?: string };
  upperLabel?: Record<string, string | number | boolean>;
  children?: MapNode[];
}

const fnTip = (fn: Fn): string =>
  [
    `<b>${escapeText(fn.name)}</b>`,
    fn.addr ? escapeText(fn.addr) : "",
    escapeText(bytes(fn.bytes)),
    escapeText(STATUS[fn.status].label),
    fn.fuzzyReported ? escapeText(`fuzzy match ${fn.fuzzy.toFixed(1)}%`) : "",
  ]
    .filter(Boolean)
    .join("<br>");

const fnNode = (fn: Fn, tokens: Tokens): MapNode => ({
  id: `f:${fn.id}`,
  name: fn.name,
  value: Math.max(fn.bytes, MIN_WEIGHT),
  ref: { kind: "fn", id: fn.unit },
  tip: fnTip(fn),
  itemStyle: { color: tokens.status[fn.status] },
  label: { color: readableOn(tokens.status[fn.status]) },
});

const sdkTip = (fn: Fn): string =>
  [
    `<b>${escapeText(fn.library ?? "")}${fn.member ? ` / ${escapeText(fn.member)}` : ""}</b>`,
    escapeText(fn.name),
    escapeText(bytes(fn.bytes)),
    escapeText(fn.tier === "object" ? SDK.legend(fn.version ?? "") : SDK.splitTip),
  ].join("<br>");

const sdkNode = (fn: Fn, tokens: Tokens): MapNode => ({
  id: `f:${fn.id}`,
  name: fn.member || fn.name,
  value: Math.max(fn.bytes, MIN_WEIGHT),
  ref: { kind: "fn", id: fn.unit },
  tip: sdkTip(fn),
  itemStyle: { color: tokens.sdk },
  label: { show: true, color: readableOn(tokens.sdk) },
});

const total = (nodes: MapNode[]): number => nodes.reduce((sum, node) => sum + node.value, 0);

/**
 * One image's SDK code: a group, then a node per library, then a cell per member. It is drawn in
 * the neutral SDK color and never counts toward the progress figures.
 */
export function sdkGroupTree(target: Target, tokens: Tokens, named = false): MapNode | null {
  return sdkTree(
    target.functions,
    target.id,
    named ? `${SDK.group} · ${target.name}` : SDK.group,
    tokens,
  );
}

function sdkTree(functions: Fn[], id: string, title: string, tokens: Tokens): MapNode | null {
  const libraries = new Map<string, Fn[]>();
  for (const fn of functions.filter((item) => item.kind === "sdk")) {
    const name = fn.library ?? ASSEMBLY_LIBRARY;
    const list = libraries.get(name);
    if (list) list.push(fn);
    else libraries.set(name, [fn]);
  }
  if (!libraries.size) return null;
  const children: MapNode[] = [...libraries.entries()].sort(([a], [b]) => a.localeCompare(b)).map((
    [name, members],
  ) => {
    const cells = members.map((fn) => sdkNode(fn, tokens));
    const size = members.reduce((sum, fn) => sum + fn.bytes, 0);
    return {
      id: `sdklib:${id}:${name}`,
      name,
      value: total(cells),
      ref: { kind: "sdk", id: name },
      tip: `<b>${escapeText(name)}</b><br>${escapeText(SDK.libraryTip(members.length, size))}`,
      itemStyle: { color: "transparent", borderColor: tokens.bg, borderWidth: 1, gapWidth: 1 },
      label: { show: false },
      upperLabel: {
        show: true,
        height: 14,
        color: readableOn(tokens.sdk),
        fontSize: 10,
      },
      children: cells,
    };
  });
  return {
    id: `sdk:${id}`,
    name: title,
    value: total(children),
    ref: { kind: "sdk", id },
    tip: `<b>${escapeText(title)}</b>`,
    itemStyle: { color: "transparent", borderColor: tokens.bg, borderWidth: 2, gapWidth: 1 },
    label: { show: false },
    upperLabel: {
      show: true,
      height: 18,
      color: readableOn(tokens.sdk),
      fontSize: 12,
      fontWeight: "bold",
    },
    children,
  };
}

/** One image's game functions, then its SDK group. */
export function gameImageTree(target: Target, tokens: Tokens, withSdk = false): MapNode {
  const children = target.functions.filter((fn) => fn.kind === "game").map((fn) =>
    fnNode(fn, tokens)
  );
  const sdk = withSdk ? sdkGroupTree(target, tokens) : null;
  if (sdk) children.push(sdk);
  return {
    id: `image:${target.id}`,
    name: target.name,
    value: children.reduce((sum, child) => sum + child.value, 0),
    ref: { kind: "image", id: target.id },
    tip: `<b>${escapeText(target.name)}</b><br>${number(target.code.exact)} of ${
      number(target.code.functions)
    } rebuilt in C`,
    children,
  };
}

/** A part's game functions, grouped into images. */
export function gamePartTree(group: Group, tokens: Tokens): MapNode {
  const images = group.targets.map((target) => gameImageTree(target, tokens)).filter((image) =>
    image.children?.length
  );
  for (const target of group.targets) {
    const sdk = sdkGroupTree(target, tokens, true);
    if (sdk) images.push(sdk);
  }
  return {
    id: `part:${group.key}`,
    name: group.label,
    value: images.reduce((sum, image) => sum + image.value, 0),
    ref: { kind: "part", id: group.key },
    tip: "",
    children: images,
  };
}

/** One block per part or image, sized by bytes and shaded by rebuilt byte share. */
export function overviewTree(
  model: Model,
  tokens: Tokens,
  by: "part" | "image",
  width = 992,
  height = 540,
  part?: string,
): MapNode {
  if (by === "part") {
    const children: MapNode[] = model.groups.map((group) => {
      const scale = Math.sqrt(group.code.bytes / (model.game.bytes + model.sdk.bytes));
      const images = overviewTree(model, tokens, "image", width * scale, height * scale, group.key)
        .children!
        .filter((node) => node.ref.kind === "image");
      return {
        id: `part:${group.key}`,
        name: group.label,
        value: total(images),
        ref: { kind: "part" as const, id: group.key },
        tip: group.note,
        children: images,
      };
    }).filter((node) => node.value > 0);
    const libraries: MapNode[] = model.libraries.filter((library) => library.bytes > 0).map((
      library,
    ) => ({
      id: `library:${library.name}`,
      name: library.name,
      value: library.bytes,
      ref: { kind: "sdk", id: library.name },
      tip: escapeText(library.name),
      itemStyle: { color: tokens.sdk },
    }));
    for (const library of libraries) {
      const room = Math.sqrt(width * height * library.value / (model.game.bytes + model.sdk.bytes))
        / 1.3;
      library.label = {
        show: room >= library.name.length * 6 + 10,
        color: readableOn(tokens.sdk),
      };
    }
    if (libraries.length) {
      children.push({
        id: "sdk:all",
        name: SDK.group,
        value: total(libraries),
        ref: { kind: "sdk", id: "all" },
        tip: SDK.group,
        children: libraries,
      });
    }
    return {
      id: "home:part",
      name: "Game",
      value: total(children),
      ref: { kind: "home", id: "part" },
      tip: "",
      children,
    };
  }
  const targets = part ? model.targets.filter((target) => target.group === part) : model.targets;
  const entries = targets.map((target) => ({
    id: target.id,
    name: target.name.replace(/\.EMI\b/i, ""),
    code: target.code,
  }));
  const children: MapNode[] = entries.filter((entry) => entry.code.bytes > 0).map((entry) => {
    const share = entry.code.exactBytes / entry.code.bytes;
    const amount = share;
    const blend = (base: string, color: string) => {
      const a = Number.parseInt(base.slice(1), 16);
      const b = Number.parseInt(color.slice(1), 16);
      const channel = (shift: number) =>
        Math.round(((a >> shift) & 255) * (1 - amount) + ((b >> shift) & 255) * amount);
      return `#${[16, 8, 0].map((shift) => channel(shift).toString(16).padStart(2, "0")).join("")}`;
    };
    const name = `${entry.name}\n${percent(entry.code.exactBytes, entry.code.bytes, 1)}%`;
    const fill = blend(tokens.status.open, tokens.status.pure);
    return {
      id: `${by}:${entry.id}`,
      name,
      value: entry.code.bytes,
      ref: { kind: by, id: entry.id },
      tip: `${escapeText(entry.name)}<br>${
        percent(entry.code.exactBytes, entry.code.bytes, 1)
      }% rebuilt in C by size`,
      itemStyle: { color: fill },
      label: { color: readableOn(fill) },
    };
  });
  const sdkBytes = part
    ? targets.reduce(
      (sum, target) =>
        sum + target.functions.filter((fn) => fn.kind === "sdk").reduce((n, fn) => n + fn.bytes, 0),
      0,
    )
    : model.sdk.bytes;
  if (sdkBytes) {
    children.push({
      id: "sdk:all",
      name: "PsyQ SDK",
      value: sdkBytes,
      ref: { kind: "sdk", id: "all" },
      tip: SDK.group,
      itemStyle: { color: tokens.sdk },
    });
  }
  {
    const size = total(children);
    for (const node of children) {
      const fill = typeof node.itemStyle?.color === "string" ? node.itemStyle.color : tokens.ink;
      if (node.ref.kind === "image") {
        const room = Math.sqrt(width * height * node.value / size) / 1.3;
        node.label = {
          show: room >= Math.max(60, node.name.split("\n")[0].length * 6 + 10),
          color: readableOn(fill),
        };
      } else if (node.ref.kind === "sdk" && !node.children) {
        node.label = { show: true, color: readableOn(fill) };
      }
    }
  }
  return {
    id: `home:${part ?? by}`,
    name: "Game",
    value: total(children),
    ref: { kind: "home", id: by },
    tip: "",
    children,
  };
}

/**
 * The option for the children of `view`. A part frames its images and leaves the functions
 * unnamed; an image names its functions. ECharts fits every label to its rectangle (it truncates
 * the text and drops lines that do not fit), so labels are right on the first paint without
 * reading the layout back.
 */
export function treemapOption(view: MapNode, tokens: Tokens): ChartOption {
  const upper = {
    show: true,
    height: 18,
    color: tokens.ink,
    fontSize: 12,
    fontWeight: "bold" as const,
  };
  const parent = {
    itemStyle: { color: "transparent", borderColor: tokens.bg, borderWidth: 2, gapWidth: 1 },
    label: { show: false },
    upperLabel: { ...upper, overflow: "truncate", ellipsis: "" },
  };
  const leaf = (named: boolean) => ({
    itemStyle: { borderColor: tokens.bg, borderWidth: 1, gapWidth: 1 },
    label: { show: named },
    upperLabel: { show: false },
  });
  const hidden = {
    itemStyle: { color: "transparent", borderWidth: 0, gapWidth: 0 },
    label: { show: false },
    upperLabel: { show: false },
  };
  return {
    animation: false,
    tooltip: {
      confine: true,
      backgroundColor: tokens.card,
      borderColor: tokens.line,
      textStyle: { color: tokens.ink, fontSize: 12 },
      formatter: (params: { data?: { tip?: string } }) => params.data?.tip ?? "",
    },
    series: [
      {
        type: "treemap",
        // The treemap series defaults to a 900 ms quinticInOut update, ignoring the
        // top-level `animation: false`. The drill transition is the chart's canvas crossfade
        // (views/Chart.tsx), so every layout update snaps.
        animation: false,
        animationDuration: 0,
        animationDurationUpdate: 0,
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        roam: false,
        nodeClick: false,
        breadcrumb: { show: false },
        squareRatio: 1,
        label: {
          show: true,
          color: "#ffffff",
          fontSize: 10,
        },
        upperLabel: upper,
        // Depth 0 is the hidden root.
        levels: view.ref.kind === "home"
          ? [hidden, ...(view.ref.id === "part" ? [parent] : []), {
            ...leaf(true),
            label: {
              show: true,
              fontSize: 12,
              fontWeight: "bold",
            },
          }]
          : view.ref.kind === "part"
          ? [hidden, parent, leaf(false), leaf(false)]
          : [hidden, leaf(true), leaf(false), leaf(false)],
        data: view.children,
      },
    ],
  };
}
