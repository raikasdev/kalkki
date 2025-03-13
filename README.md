<h1 align="center">
  <img src="/public/kalkki.svg" height="96" width="96">
  <div>kalkki</div>
</h1>

<div align="center">
  <p>Modern scientific calculator in the browser inspired by <a href="https://speedcrunch.org">SpeedCrunch</a></p>
  <p><a href="https://kalkki.raikas.dev">Demo</a></p>
</div>

---
Kalkki is a modern web-based scientific calculator designed as an replacement for SpeedCrunch. I started developing this because the Finnish matriculation exams are moving from a Linux based environment to a restricted browser one meaning SpeedCrunch wouldn't be available.

## Features

- Familiar terminal style
- Experimental LaTeX pasting support
- Support for user defined variables and functions
- Vast selection of built-in functions
- History (up and down arrow)
- Progressive Web App for offline usage
- Super fast math evaluation powered by [GMP and WASM](https://github.com/Daninet/gmp-wasm)
- Tokenizer based math parser (forked from Abicus)

## Usage

You can do these with your *favorite package manager*. I like [Bun](https://bun.sh), but it isn't required to run this.

1. `bun install`
2. `bun run dev`

Tada! You have a dev server running on :5173. Consult package.json 'scripts' for more information.

The project uses [Biome](https://biomejs.dev/) for linting and code formatting. Make sure to `bun run check` your code before submitting a PR. We use `husky` for pre-commit checks.

## TODO

- Autocorrect / suggestions
- Unit conversion
- Make the LaTeX support more stable
- Check the AI-generated Swedish translation
- Add bouncing(?) and some sort of job queue -> same expression (for suggestion and calc) could wait for the original one

## License

Licensed under the AGPLv3 license, consult LICENSE for more information.

### Credits

- Logo icon: Tabler Icons math-function-x, licensed under MIT, see [license](https://tabler.io/license).
- [Abicus](https://github.com/digabi/abicus) for the math engine, licensed under MIT, see [license](https://github.com/digabi/abicus/blob/master/LICENCE.md) or src/math/LICENSE
