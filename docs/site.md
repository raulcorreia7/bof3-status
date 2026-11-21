# Site internals

`data/report.json` is the only input: the objdiff report that bof3-decomp writes ([Publish](../README.md#publish)).
`src/model/schema.ts` holds its Zod schema, limited to the fields the page reads. `modelFromReport`
(`src/model/report.ts`) checks the file, so a changed shape fails with the file and field named, then
builds the model (`src/types.ts`) that the views draw. No view reads the JSON.

The home page shows a treemap of game parts or images beside one PsyQ SDK group, then game-code totals, function search and the parts list. An image block is sized by code bytes and shaded grey to green by the share rebuilt in C. A part opens its images, an image opens its function treemap. The search finds a function by name, address or status.

## How the page is built

- `src/views/App.tsx` lists the home page sections. Each has an anchor `id` (`#map`) and a title, which is also its navigation link, and draws views from a selector.
- A selector (`src/selectors.ts`) is a pure function from the model and the route to the data one view draws (`src/viewtypes.ts`).
- The route names a page (home, a part, an image) and, apart from it, the source file open in the side panel (`src/views/Inspector.tsx`, `src/inspect.ts`).
- Links are `Jump` (`src/views/ui.tsx`): a real `href`; a plain click calls `go`, which pushes the route and starts the page at the top or scrolls to the named section.
- State is in `src/state.ts`: a Solid store for the route, the theme and the table's row limit. The route moves through the pure `step` in `src/model/route.ts`; `src/browser.ts` holds the history, hashchange, scroll and resize side effects. `go` copies what it stores because the store changes objects in place.
- `src/views/Chart.tsx` keeps one ECharts instance per chart. Option updates merge; a treemap replaces its data and crossfades for 180 ms (`prefers-reduced-motion` turns it off). Builders set `animation: false` on the series, because the treemap series otherwise runs a 900 ms update that ignores the top-level flag. A label formatter must not read the layout back, or the first paint has no labels. Only the treemap and tooltip parts load; bars are plain DOM.
- Styling is Tailwind CSS v4. `src/styles/app.css` maps the theme tokens to Tailwind colors and holds the shared classes (`card`, `btn`, `link`, `bar`). Status colors are inline custom properties (`var(--st-pure)`).
- `src/model/`, `src/charts/` and `src/snapshot/` know nothing about the framework; the picture and the page share them.

## Add or change things

| Task                              | Edit                                                                                                                                                                                                           |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Add, remove or reorder a section  | `NAV` and `Sections` in `src/views/App.tsx`; reuse a view with a new selector.                                                                                                                                 |
| Add a view                        | A data shape in `src/viewtypes.ts`, a component in `src/views/`, its use in `Sections`.                                                                                                                        |
| Add a status                      | A row in `STATUS_TABLE` (`src/model/status.ts`), its label in `STATUS_LABEL` (`src/strings.ts`), its colors in `src/theme/tokens.ts`.                                                                          |
| Add or reshape a part of the game | `GROUP_RULES` in `src/model/groups.ts` (id pattern to group; `tiles` for a tile grid), its place in `PAGE_ORDER`, its heading and note in `GROUP_LABEL` and `GROUP_NOTE`. A target no rule matches is `other`. |
| Change wording                    | `src/strings.ts`, one name per thing.                                                                                                                                                                          |
| Change the data shape             | `src/model/schema.ts` and `src/model/report.ts`, then publish a matching `data/report.json`.                                                                                                                   |

Links: `#fn/exe%2Fslus_004_22%2Ffunc_80164028` (a source file open on the home page), `#image/emi%2Fworld00%2Farea037%2F13` (`?fn=` opens a file beside it), `#part/battle`, `#map` (a home section). Old `#target/...` and `#group/...` links redirect. The function list takes `q`, `st`, `part`, `image`, `sort` and `dir`.

## File layout

| Path                                                     | Role                                                                          |
| -------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `data/report.json`                                       | The published report. Vite serves it in dev and copies it into `site/`.       |
| `src/model/`                                             | Schema, adapter, status table, parts of the game, route, search.              |
| `src/types.ts`                                           | The input type (from the schema) and the model.                               |
| `src/selectors.ts`, `src/inspect.ts`, `src/viewtypes.ts` | Pure selectors and the data shapes they return.                               |
| `src/state.ts`, `src/views/`, `src/strings.ts`           | Route store and theme, Solid views, all copy.                                 |
| `src/charts/`, `src/snapshot/`                           | ECharts option builders; the `progress.svg` poster, tile map and `badge.svg`. |
| `src/theme/`, `src/styles/app.css`                       | Color tokens and the Tailwind entry.                                          |
| `render/snapshot.ts`                                     | Writes `progress.svg`, `progress.png` and `badge.svg` into `site/`.           |
| `test/`                                                  | `node:test`: model totals from `data/report.json`.                            |

## Data file

`report.json` is objdiff-cli's report version 2: `version`, `categories` (`id`, `name`, `measures`) and `units`. A unit is a source file with a `name` (`<image>/<source stem>`), a `functions` array and `metadata` (`source_path`, `progress_categories`: `game`, `sdk` or `hand-asm`; for SDK units `sdk`: `library`, `member`, `linkage` of `object`, `split-assembly` or `assembly`). Each function has a `name`, a `size`, an `address` offset in the file and, when measured, a `fuzzy_match_percent`.

The image comes from the unit name: `exe/<name>` for the main executables, `emi/<family>/<archive>/<slot>` for overlays. Images with no units do not appear. Treemaps show SDK units as one neutral "PsyQ SDK (linked)" group per executable, by library, outside every progress figure.

| Function                                         | Status                                                                                          |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| game, fuzzy 100                                  | `pure` (rebuilt in C)                                                                           |
| game, fuzzy above 0 but below 100                | `nonmatching` (draft in C)                                                                      |
| game, no fuzzy match                             | `open` (not started: original assembly, also a C file that only includes it with `INCLUDE_ASM`) |
| sdk, `linkage` is `object`                       | `object` (linked from a PsyQ object)                                                            |
| sdk, `linkage` is `split-assembly` or `assembly` | `assembly` (SDK, split assembly; matched when its fuzzy match is 100)                           |
| hand-asm, fuzzy 100                              | `asm`                                                                                           |
| hand-asm, otherwise                              | `assembly`                                                                                      |

A function is matched only at `fuzzy_match_percent` 100; a complete unit can still hold a function below 100. The adapter counts functions, matched functions and both byte totals from `units[].functions`, so the headline, images, parts and treemap agree with the category measures (`total_functions`, `matched_functions`, `total_code`, `matched_code`).
