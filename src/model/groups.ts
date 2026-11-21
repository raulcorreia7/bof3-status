import { GROUP_LABEL, GROUP_NOTE } from "../strings.ts";

interface Rule {
  key: string;
  pattern: RegExp;
  tiles: boolean;
}

const GROUP_RULES: readonly Rule[] = [
  { key: "main", pattern: /^exe\/slus_004_22$/, tiles: false },
  { key: "logo", pattern: /^exe\/logo$/, tiles: false },
  { key: "battle", pattern: /^emi\/etc\/bate\//, tiles: false },
  { key: "system", pattern: /^emi\/etc\//, tiles: false },
  { key: "battle", pattern: /^emi\/battle\//, tiles: false },
  { key: "magic", pattern: /^emi\/bmagic\//, tiles: true },
  { key: "bosses", pattern: /^emi\/boss\//, tiles: true },
  { key: "characters", pattern: /^emi\/plchar\//, tiles: true },
  { key: "world", pattern: /^emi\/world\d+\//, tiles: true },
  { key: "scenario", pattern: /^emi\/scenario\//, tiles: false },
];
export const OTHER = "other";
const PAGE_ORDER = [
  "main",
  "logo",
  "system",
  "battle",
  "magic",
  "bosses",
  "characters",
  "world",
  "scenario",
  OTHER,
];

export const groupKey = (targetId: string): string =>
  GROUP_RULES.find((rule) => rule.pattern.test(targetId))?.key ?? OTHER;

export const compareGroups = (a: { key: string }, b: { key: string }): number =>
  PAGE_ORDER.indexOf(a.key) - PAGE_ORDER.indexOf(b.key);

export const describeGroup = (
  key: string,
): { key: string; label: string; note: string; tiles: boolean } => ({
  key,
  label: GROUP_LABEL[key] ?? GROUP_LABEL[OTHER] ?? "",
  note: GROUP_NOTE[key] ?? "",
  tiles: GROUP_RULES.some((rule) => rule.key === key && rule.tiles),
});
