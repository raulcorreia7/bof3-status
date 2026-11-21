import type { Model, Unit } from "../types.ts";

export function neighbours(model: Model, unit: Unit): { previous: Unit | null; next: Unit | null } {
  const list = model.targetById.get(unit.target)?.units ?? [];
  const at = list.indexOf(unit);
  return { previous: list[at - 1] ?? null, next: list[at + 1] ?? null };
}

export const findUnit = (model: Model, id: string): Unit | null => model.unitById.get(id) ?? null;
