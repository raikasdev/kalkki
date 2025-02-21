<h1 align="center">
  <img src="/public/kalkki.svg" height="96" width="96">
  <div>kalkki</div>
</h1>

<div align="center">
  <p>Modern scientific calculator inspired by <a href="https://speedcrunch.org">SpeedCrunch</a> working in the browser</p>
  <p><a href="https://kalkki.raikas.dev">Demo</a></p>
</div>

---
Little backstory: I like SpeedCrunch a lot! But with the Finnish matriculation exams moving to a browser-based environment, it will no longer be available! I started this project for fun to try creating a replacement for SpeedCrunch suitable for use in [Abitti 2](https://abitti.net/abitti-2-apps.html). I might submit it to YTL/Digabi if they can't find a suitable replacement for SpeedCrunch, as I don't like the calculator selection it currently has.

## Features

- Familiar terminal style
- Experimental LaTeX pasting support
- Tokenizer based math engine (forked from Abicus)
- History (up and down arrow)
- Progressive Web App for offline usage

## Usage

You can do these with your *favorite package manager*. I like [Bun](https://bun.sh), but it isn't required to run this.

1. `bun install`
2. `bun run dev`

Tada! You have a dev server running on :5173. Consult package.json 'scripts' for more information.

## TODO

- WASM
- Variable support
- Autocorrect / suggestions
- Languages
- Unit conversion

## License

Licensed under the MIT license, consult LICENSE for more information.

### Credits

- Logo icon: Tabler Icons math-function-x, licensed under MIT, see [license](https://tabler.io/license).
- [Abicus](https://github.com/digabi/abicus) for the math engine, licensed under MIT, see [license](https://github.com/digabi/abicus/blob/master/LICENCE.md) or src/math/LICENSE
