# Agent guide

bof3-status is the progress site of the *Breath of Fire III* decompilation: a Vite and Solid page
over the decompilation's objdiff report. Read [README.md](README.md), then [docs/site.md](docs/site.md)
(file layout, data file, where to change what).

## Changes

- Write only paths granted by the task.
- Keep `data/report.json` as bof3-decomp produces it; never hand-edit it.
- Do not add game data.
- Format with dprint.
- Add only dependencies whose license `npm run licenses` allows.
- Run `make check` before committing.

## Commits

`type(scope): subject`, imperative and lowercase. No AI attribution, amends or force-pushes.

## Index

- Skills: none.
- Tools: `make help`.
- Docs: [docs/site.md](docs/site.md).
- CI: [.github/workflows/deploy.yml](.github/workflows/deploy.yml) builds and publishes the site.
- Wiki (game and format facts): [site](https://raulcorreia7.github.io/bof3-wiki/). For a model: [llms.txt](https://raulcorreia7.github.io/bof3-wiki/llms.txt) (index), [llms-small.txt](https://raulcorreia7.github.io/bof3-wiki/llms-small.txt) (compact), [llms-full.txt](https://raulcorreia7.github.io/bof3-wiki/llms-full.txt) (everything).
- Project standard: [docs/standard.md](https://github.com/raulcorreia7/bof3/blob/main/docs/standard.md).

## Writing

Docs, comments, commit messages and pull requests follow the [project standard](https://github.com/raulcorreia7/bof3/blob/main/docs/standard.md#writing): present tense, what and why instead of how, in the game developer's own terms, and Orwell's six rules.
Comments say what, never how: one line, only where a name cannot say it ([standard](https://github.com/raulcorreia7/bof3/blob/main/docs/standard.md#comments)).
