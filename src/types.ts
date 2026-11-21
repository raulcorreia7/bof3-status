import type * as z from "zod/mini";
import type { ReportSchema } from "./model/schema.ts";

export type Status = "pure" | "nonmatching" | "open" | "object" | "assembly" | "asm";
export type Tier = "object" | "assembly";
export type Part = "game" | "sdk" | "hand";

export type Report = z.output<typeof ReportSchema>;

export interface Fn {
  id: string;
  unit: string;
  target: string;
  addr: string;
  address: number | null;
  offset: number;
  name: string;
  bytes: number;
  /** objdiff's fuzzy match of the function, 0-100. A function is matched at 100. */
  fuzzy: number;
  fuzzyReported: boolean;
  status: Status;
  type: Part;
  key: string;
  library?: string;
  member?: string;
  tier?: Tier;
  version?: string | null;
}

export interface Unit {
  id: string;
  target: string;
  name: string;
  source: string | null;
  type: Part;
  addr: string;
  address: number | null;
  bytes: number;
  matched: number;
  matchedBytes: number;
  fuzzy: number;
  fuzzyReported: boolean;
  status: Status;
  functions: Fn[];
  library?: string;
  member?: string;
  tier?: Tier;
  version?: string | null;
}

export interface Tally {
  count: number;
  bytes: number;
  done: number;
  doneBytes: number;
  statuses: Record<Status, { functions: number; bytes: number }>;
  percent: number;
  fuzzy: number;
}

export interface Code {
  functions: number;
  exact: number;
  draft: number;
  bytes: number;
  exactBytes: number;
  draftBytes: number;
}

export interface Target {
  id: string;
  name: string;
  group: string;
  groupLabel: string;
  code: Code;
  functions: Fn[];
  units: Unit[];
  game: Tally;
  all: Tally;
}

export interface Group extends Tally {
  key: string;
  label: string;
  note: string;
  tiles: boolean;
  code: Code;
  targets: Target[];
}

export interface Library extends Tally {
  name: string;
  versions: Record<string, number>;
  tiers: Record<Tier, number>;
  functions: Fn[];
}

export interface Quality {
  exact: number;
  inProgress: number;
  notStarted: number;
  hand: number;
  handDone: number;
  fuzzy: number;
}

export interface Model {
  source: NonNullable<Report["source"]> | null;
  code: Code;
  game: Tally;
  sdk: Tally;
  hand: Tally;
  quality: Quality;
  groups: Group[];
  targets: Target[];
  targetById: Map<string, Target>;
  unitById: Map<string, Unit>;
  functions: Fn[];
  libraries: Library[];
}
