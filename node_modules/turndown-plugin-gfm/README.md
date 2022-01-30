# turndown-plugin-gfm

A [Turndown](https://github.com/domchristie/turndown) plugin which adds GitHub Flavored Markdown extensions.

## Installation

npm:

```
npm install turndown-plugin-gfm
```

Browser:

```html
<script src="https://unpkg.com/turndown/dist/turndown.js"></script>
<script src="https://unpkg.com/turndown-plugin-gfm/dist/turndown-plugin-gfm.js"></script>
```

## Usage

```js
// For Node.js
var TurndownService = require('turndown')
var turndownPluginGfm = require('turndown-plugin-gfm')

var gfm = turndownPluginGfm.gfm
var turndownService = new TurndownService()
turndownService.use(gfm)
var markdown = turndownService.turndown('<strike>Hello world!</strike>')
```

turndown-plugin-gfm is a suite of plugins which can be applied individually. The available plugins are as follows:

- `strikethrough` (for converting `<strike>`, `<s>`, and `<del>` elements)
- `tables`
- `taskListItems`
- `gfm` (which applies all of the above)

So for example, if you only wish to convert tables:

```js
var tables = require('turndown-plugin-gfm').tables
var turndownService = new TurndownService()
turndownService.use(tables)
```

## License

turndown-plugin-gfm is copyright © 2017+ Dom Christie and released under the MIT license.
