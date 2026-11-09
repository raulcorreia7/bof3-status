# Agent guide

bof3-status is the progress site of the *Breath of Fire III* decompilation: a Vite and Solid page
over the decompilation's objdiff report. Read [README.md](README.md) first (requirements, set up, build, run, check), then
[docs/site.md](docs/site.md).

## Where things are

| Path                       | What it holds                                                 | Doc                                               |
| -------------------------- | ------------------------------------------------------------- | ------------------------------------------------- |
| `data/report.json`         | The published objdiff report, the only data input             | [docs/site.md](docs/site.md#data-file)            |
| `src/model/`               | The report schema, the adapter and the page model             | [docs/site.md](docs/site.md#file-layout)          |
| `src/views/`               | The Solid views and the app shell                             | [docs/site.md](docs/site.md#file-layout)          |
| `src/strings.ts`           | All page copy                                                 | [docs/site.md](docs/site.md#add-or-change-things) |
| `src/snapshot/`, `render/` | The `progress.svg` poster, `badge.svg` and the publish script | [docs/site.md](docs/site.md#file-layout)          |
| `test/`                    | `node:test` checks of the model totals                        | [docs/site.md](docs/site.md#file-layout)          |
| `Makefile`                 | `build`, `test`, `format`, `lint`, `licenses`, `check`        | `make help`                                       |

## Changes

- Write only paths granted by the task.
- Keep `data/report.json` as produced by bof3-decomp; never hand-edit it.
- Do not add game data.
- Format with dprint.
- Add only dependencies whose license `npm run licenses` allows.

## Verification

Run `make check` before committing.

## Commits

Use `type(scope): subject` headers with an imperative, lowercase subject.
Do not add AI attribution, amend commits or force-push.

## Index

- Skills: none; this guide is the entry point.
- Tools: `make help`.
- Docs: [docs/site.md](docs/site.md).
- CI: [.github/workflows/deploy.yml](.github/workflows/deploy.yml) builds and publishes the site.
- Wiki (game and format facts): [site](https://raulcorreia7.github.io/bof3-wiki/). For a model: [llms.txt](https://raulcorreia7.github.io/bof3-wiki/llms.txt) (index), [llms-small.txt](https://raulcorreia7.github.io/bof3-wiki/llms-small.txt) (compact, for a small context), [llms-full.txt](https://raulcorreia7.github.io/bof3-wiki/llms-full.txt) (everything).
- Project standard: [docs/standard.md](https://github.com/raulcorreia7/bof3/blob/main/docs/standard.md).

## Writing

Docs, comments, commit messages and pull requests follow the [project standard](https://github.com/raulcorreia7/bof3/blob/main/docs/standard.md#writing): present tense, what and why instead of how, in the game developer's own terms, and Orwell's six rules.
Comments say what, never how: one line, only where a name cannot say it ([standard](https://github.com/raulcorreia7/bof3/blob/main/docs/standard.md#comments)).
