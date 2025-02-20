# abikalkki

Abikalkki is a scientific calculator inspired by [SpeedCrunch](https://speedcrunch.org) designed to work fully in the browser. The project is currently maintained for fun and no support is guaranteed.

I started this project to try the [Abitti 2](https://abitti.net/abitti-2-apps.html) application protocol. I might submit it to YTL/Digabi if they can't find a suitable replacement for SpeedCrunch.

## Features

- Familiar terminal style
- Experimental LaTeX pasting support
- Tokenizer based math engine (forked from Abicus)
- History (up and down arrow)

## Usage

You can do these with your *favorite package manager*. I like [Bun](https://bun.sh), but it isn't required to run this.

1. `bun install`
2. `bun run dev`

Tada! You have a dev server running on :5173. Consult package.json 'scripts' for more information.

## TODO

- WASM
- Variable support
- Autocorrect / suggestions
- Options / top bar
- Languages
- History (up down arrow)
- Unit conversion

## License

Licensed under the MIT license, consult LICENSE for more information.

### Credits

- Logo icon: Tabler Icons math-function-x, licensed under MIT, see [license](https://tabler.io/license).
- [Abicus](https://github.com/digabi/abicus) for the math engine, licensed under MIT, see [license](https://github.com/digabi/abicus/blob/master/LICENCE.md) or src/math/LICENSE