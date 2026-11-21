import { STATUS_LABEL } from "../strings.ts";
import type { Code, Fn, Status, Tier } from "../types.ts";

interface StatusRow {
  key: Status;
  label: string;
  color: string;
  doneIn: readonly Fn["kind"][];
}

export const statusProp = (key: string): string => `--st-${key.replaceAll("_", "-")}`;
export const statusVar = (key: string): string => `var(${statusProp(key)})`;

const row = (key: Status, doneIn: readonly Fn["kind"][]): StatusRow => ({
  key,
  label: STATUS_LABEL[key],
  color: statusVar(key),
  doneIn,
});

export const STATUS_TABLE: readonly StatusRow[] = [
  row("pure", ["game"]),
  row("nonmatching", []),
  row("open", []),
  row("object", ["sdk"]),
  row("asm", ["hand"]),
  // An SDK unit kept as assembly is the original PsyQ code, so it is matched too.
  row("assembly", ["sdk"]),
];

export const STATUS = Object.fromEntries(STATUS_TABLE.map((entry) => [entry.key, entry])) as Record<
  Status,
  StatusRow
>;
export const STATUSES: readonly Status[] = STATUS_TABLE.map((entry) => entry.key);
export const TIERS: readonly Tier[] = ["object", "assembly"];

export const isStatus = (value: string): value is Status => Object.hasOwn(STATUS, value);
const nonzero = (pairs: [Status, number][]): [Status, number][] => pairs.filter(([, n]) => n);

export const codeCounts = (code: Code): [Status, number][] =>
  nonzero([["pure", code.exact], ["nonmatching", code.draft], [
    "open",
    code.functions - code.exact - code.draft,
  ]]);

export const codeSizes = (code: Code): [Status, number][] =>
  nonzero([["pure", code.exactBytes], ["nonmatching", code.draftBytes], [
    "open",
    code.bytes - code.exactBytes - code.draftBytes,
  ]]);

export const isDone = (fn: Pick<Fn, "kind" | "status" | "fuzzy">): boolean =>
  STATUS[fn.status].doneIn.includes(fn.kind) && fn.fuzzy === 100;
