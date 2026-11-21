import type { MapNode } from "./charts/treemap.ts";
import type { Route, SortKey } from "./model/route.ts";
import type { Tokens } from "./theme/tokens.ts";
import type { Fn, Model, Status } from "./types.ts";

export interface Ctx {
  model: Model;
  route: Route;
  tokens: Tokens;
  limit: number;
}

export interface Link {
  label: string;
  to: Partial<Route>;
  scroll?: string;
}

export interface Part {
  text: string;
  to?: Partial<Route>;
  scroll?: string;
  url?: string;
  code?: boolean;
  mute?: boolean;
  status?: Status;
}

export interface MeterRow {
  label?: string;
  aria: string;
  parts: { width: string; color: string }[];
}

export interface Card {
  id: string;
  title: string;
  big: string;
  sub?: string;
  color?: string;
}

export interface Views {
  cards: { cards: Card[] };
  meters: { key?: { label: string; color: string; sub: string }[]; rows: MeterRow[] };
  text: { paragraphs: { label?: string; text: string }[] };
  domains: {
    groups: {
      key: string;
      title: Link;
      note: string;
      percent: string;
      line: string;
      meter: MeterRow;
      tiles: boolean;
      images: {
        id: string;
        label: string;
        line: string;
        size: string;
        aria: string;
        width: number;
        parts: MeterRow["parts"];
        to: Partial<Route>;
      }[];
    }[];
  };
  filters: {
    search: { label: string; hint: string; placeholder: string };
    statuses: { value: string; label: string }[];
    parts: { value: string; label: string }[];
    images: { value: string; label: string }[];
  };
  table: {
    columns: { label: string; align?: "r"; sort?: SortKey }[];
    rows: { id: string; cells: Part[][] }[];
    message: string;
    more?: string;
  };
  inspector:
    | {
      title: string;
      fields: { label: string; value: Part[] }[];
      selected?: { fields: { label: string; value: Part[] }[] };
      message?: string;
    }
    | null;
}

export interface GamePage {
  title: string;
  crumbs: Link[];
  found: boolean;
  message?: string;
  percent: string;
  line: string;
  meter: MeterRow | null;
  key: { label: string; color: string; sub: string }[];
  note: string;
  tree: MapNode | null;
  functions: Fn[];
  inPart: boolean;
}
