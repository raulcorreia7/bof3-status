# Contributing

Issues and pull requests are welcome. All contributions follow the
[code of conduct](CODE_OF_CONDUCT.md). Ask questions in
[Discussions](https://github.com/raulcorreia7/bof3-status/discussions). `AGENTS.md` is optional
guidance for coding agents.

## Set up

Install the tools in the README [requirements](README.md#requirements), then follow
[set up](README.md#set-up) and [run](README.md#run).

## What to change

- The page and the picture: `src/` and `render/`. [docs/site.md](docs/site.md) describes the
  structure.
- The numbers: `data/report.json` is the objdiff report that bof3-decomp produces. Do not edit it by
  hand; the maintainer publishes a fresh report with `npm run report`.
- Dependencies: `npm run licenses` allows only the licenses listed in `package.json`.

No game data belongs in the repository.

## Submit a change

1. Create a branch and keep the change focused.
2. Run the gate: `make check` (format check, type check, license gate, tests). CI runs the same
   checks and builds the site.
3. Write the commit subject as `type(scope): subject`, for example `fix(page): label the match bar`.
4. Open a pull request. Describe the behavior and the checks you ran.

Writing rules: the [project standard](https://github.com/raulcorreia7/bof3/blob/main/docs/standard.md#writing).

## License

Contributions are under the repository's [MIT license](LICENSE). Do not submit code you did not
write or cannot license.
