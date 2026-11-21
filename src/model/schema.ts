import * as z from "zod/mini";

/** objdiff writes byte counts as strings. */
const measure = z.optional(z.coerce.number());

export const ReportSchema = z.object({
  version: z.optional(z.number()),
  source: z.optional(
    z.object({ repository: z.string(), commit: z.string(), published: z.string() }),
  ),
  categories: z.array(
    z.object({ id: z.string(), measures: z.object({ fuzzy_match_percent: measure }) }),
  ),
  units: z.array(
    z.object({
      name: z.string(),
      functions: z.array(
        z.object({
          name: z.string(),
          size: measure,
          fuzzy_match_percent: measure,
          address: z.optional(z.string()),
        }),
      ),
      metadata: z.object({
        source_path: z.optional(z.string()),
        sdk: z.optional(
          z.object({
            library: z.string(),
            member: z.string(),
            linkage: z.enum(["object", "split-assembly", "assembly"]),
          }),
        ),
        progress_categories: z.optional(z.array(z.string())),
      }),
    }),
  ),
});
