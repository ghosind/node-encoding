# @antmind/encoding

[![Latest version](https://img.shields.io/github/v/release/ghosind/node-encoding?include_prereleases)](https://github.com/ghosind/node-encoding)
[![NPM Package](https://img.shields.io/npm/v/%40antmind%2Fencoding)](https://img.shields.io/npm/v/%40antmind%2Fencoding)
[![Github Actions build](https://img.shields.io/github/actions/workflow/status/ghosind/node-encoding/test.yaml?branch=main)](https://github.com/ghosind/node-encoding)
[![codecov](https://codecov.io/gh/ghosind/node-encoding/branch/main/graph/badge.svg)](https://codecov.io/gh/ghosind/node-encoding)
[![License](https://img.shields.io/github/license/ghosind/node-encoding)](https://github.com/ghosind/node-encoding)

Lightweight data encoding utilities for Node.js and browsers.

## Features

- Base32 encoding/decoding.
- Node.js and browser compatible.

## Installation

Install from npm:

```bash
npm install @antmind/encoding
```

## Quick Start

Encode and decode Base32 strings with default settings:

```js
import { base32 } from '@antmind/encoding';

// encode
const encoded = base32.encode('foo');
// => 'MZXW6==='

// decode
const decoded = base32.decode('MZXW6===');
// => 'foo'
```

You can also create a custom Base32 encoding instance with your own alphabet and padding character:

```js
import { Base32Encoding } from '@antmind/encoding';

const customBase32 = new Base32Encoding({
  encoder: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567', // standard Base32 alphabet
  padChar: '*', // custom padding character
});

const encoded = customBase32.encode('foo');
// => 'MZXW6***'

// or method override
const encoded2 = customBase32.encode('foo', { padChar: '+' });
// => 'MZXW6+++'
```

## API

- `new Base32Encoding(options?: Base32Options)`
  - `options.encoder?: string` — 32-character alphabet string. Defaults to `Base32StdEncoder`.
  - `options.padChar?: string` — padding character (set to empty string `''` to disable padding). Defaults to `'='`.

- `encode(data: string, options?: Base32Options)` — Encodes `data` to a Base32 string. Accepts the same `options` as the constructor to override encoder/pad for a single call.

- `decode(str: string, options?: Base32Options)` — Decodes a Base32 `str` to the original string. Accepts the same `options` to override encoder/pad.

## Tests

Run the test suite with:

```bash
npm test
```

## Contributing

Contributions and bug reports are welcome. Please open issues or pull requests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
