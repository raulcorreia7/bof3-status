# bof3-status

[![CI](https://github.com/raulcorreia7/bof3-status/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/raulcorreia7/bof3-status/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![C match](https://raulcorreia7.github.io/bof3-status/badge.svg)](https://raulcorreia7.github.io/bof3-status/)

The progress site for the *Breath of Fire III* decompilation:
**<https://raulcorreia7.github.io/bof3-status/>**

It renders the published objdiff report of [bof3-decomp](https://github.com/raulcorreia7/bof3-decomp)
as a treemap of the game's parts and images, a function search and a progress picture. This
repository holds the report and the page that renders it.

No game data is included. This is a fan project, not affiliated with or endorsed by Capcom.
*Breath of Fire* is Capcom's trademark.

## Requirements

| Tool                                               | Version              | Install                                        |
| -------------------------------------------------- | -------------------- | ---------------------------------------------- |
| Git                                                | any                  | Your package manager                           |
| [Node.js](https://nodejs.org/en/download) with npm | 24 (`.node-version`) | The official installer or your package manager |

No game data or disc is needed.

## Set up

From the [bof3 workspace](https://github.com/raulcorreia7/bof3#choose-a-goal), run
`make init-status` and work in `status/`. Alone:

```sh
git clone https://github.com/raulcorreia7/bof3-status.git
cd bof3-status
npm ci
```

## Build

```sh
npm run build    # site/ and the pictures
```

## Run

```sh
npm run dev   # dev server on `data/report.json`
```

The site links `report.json` and `progress.png` and serves `progress.svg` and `badge.svg`.

## Check

```sh
npm run check    # dprint, tsc, license gate, build, tests
```

`npm run` lists the scripts. Reviewed license exceptions live in `licenses.json`.

## How progress is measured

- A function counts as rebuilt in C only when its objdiff fuzzy match is exactly 100 percent: the C
  source compiles to the same bytes as the original code.
- A draft in C compiles but still differs. It does not count as rebuilt.
- Figures come by function count and by code bytes. The PsyQ SDK and hand-written assembly stay out
  of every game code figure.

Report fields and status rules: [docs/site.md](docs/site.md#data-file).

## Publish

`deploy.yml` publishes every push to `main` and every manual or dispatched run. A deploy takes the
newest report: the `report.json` asset of the [`progress` release](https://github.com/raulcorreia7/bof3-status/releases/tag/progress)
when it exists, else the committed `data/report.json`.

To publish fresh progress, with bof3-decomp checked out as `decomp/` beside this folder in the
[bof3 workspace](https://github.com/raulcorreia7/bof3):

```sh
(cd ../decomp && meson compile -C build/meson report)
gh release upload progress ../decomp/build/report.json --clobber
gh workflow run deploy.yml
```

Commit `data/report.json` (`npm run report`) when the data shape changes, so pull requests test it.

## Next

- [CONTRIBUTING.md](CONTRIBUTING.md), the [code of conduct](CODE_OF_CONDUCT.md) and the
  [security policy](SECURITY.md).
- [docs/site.md](docs/site.md): page structure and the report format.
- [AGENTS.md](AGENTS.md): guide for a coding agent.

## License

MIT. See [LICENSE](LICENSE). The picture uses DejaVu Sans, shipped in [render/fonts/](render/fonts/)
under its own license.
