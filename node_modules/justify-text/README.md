# justify-text

This is a simple module, which allows for left or right justifying text
in a given width. The padding character can be specified, and it defaults
to a space.

Numbers are explicily handled now, so they do not need to be converted to
a string before passing them to `ljust` or `rjust` any more.

If the padding width specified is less than the length of the initial string,
no truncation occurs.

## Installation

```
npm install -S justify-text
```

or

```
yarn add justify-text
```

## Functions

`ljust()` and `rjust()` take a string or number, a width to render it in,
and an optional padding character, which is a space by default.

``` js
ljust(string, width, padding=' ')
rjust(string, width, padding=' ')
```

### Usage

``` js
const { ljust, rjust } = require('justify-text');

ljust('text', 7);
// => "text   "

ljust('text', 6, '0');
// => "text00"

rjust('text', 8);
// => "    text"

rjust('longtext', 7);
// => "longtext", i.e. unchanged because it is already more than 7 characters

rjust('text', 9, '.');
// => ".....text"

rjust(936, 5);
// => "  936"

ljust(780.25, 8);
// => "780.25  "
```

## License

MIT
