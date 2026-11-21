import { modelFromReport } from "./model/report.ts";
import type { Model } from "./types.ts";

export type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };
export interface LoadError {
  message: string;
}

export async function loadReport(): Promise<Result<Model, LoadError>> {
  try {
    const response = await fetch("report.json");
    if (!response.ok) {
      return {
        ok: false,
        error: { message: `report.json: ${response.status} ${response.statusText}`.trim() },
      };
    }
    return { ok: true, value: modelFromReport(await response.json()) };
  } catch (error) {
    return {
      ok: false,
      error: { message: error instanceof Error ? error.message : String(error) },
    };
  }
}
