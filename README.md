<p align="center"><img src=".github/art/cover.jpg" alt="Social Card of this repo"></p>

[![npm version][npm-version-src]][npm-version-href]
[![GitHub Actions][github-actions-src]][github-actions-href]
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
<!-- [![npm downloads][npm-downloads-src]][npm-downloads-href] -->
<!-- [![Codecov][codecov-src]][codecov-href] -->

# TS-Inputs

A TypeScript library providing specialized input handling and formatting for various data types.

## Overview

TS-Inputs is a modular library that provides specialized input handling, formatting, and validation for different types of data. It's designed to be used in web applications where precise input control and formatting are required.

## Features

- **Credit Card Input**: Formatting and validation for credit card numbers
- **Date Input**: Specialized date input handling
- **Time Input**: Time format handling
- **Numeral Input**: Number formatting and validation
- **General Input**: Common input handling utilities
- **Cursor Tracker**: Input cursor position tracking

## Project Structure

```
src/
├── common/           # Shared utilities and types
│   ├── types.ts     # Common type definitions
│   └── utils.ts     # Shared utility functions
├── credit-card/     # Credit card input handling
├── cursor-tracker/  # Cursor position tracking
├── date/           # Date input handling
├── general/        # General input utilities
├── numeral/        # Number formatting
└── time/           # Time input handling
```

## Common Utilities

The library provides several common utilities and types:

- `RequireExactlyOne`: Type utility for requiring exactly one property from a set
- `DelimiterType`: Type definition for input delimiters
- `BlocksType`: Type for input block definitions
- Various interfaces for input formatting and delimiter handling

## Usage

```typescript
import { creditCard, date, numeral, time } from 'ts-inputs'

// Example usage with credit card input
const formattedCard = creditCard.format('4111111111111111')
// Result: '4111 1111 1111 1111'
```

## Installation

```bash
npm install ts-inputs
# or
yarn add ts-inputs
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Testing

```bash
bun test
```

## Changelog

Please see our [releases](https://github.com/stackjs/ts-inputs/releases) page for more information on what has changed recently.

## Stargazers

[![Stargazers](https://starchart.cc/stacksjs/ts-inputs.svg?variant=adaptive)](https://starchart.cc/stacksjs/ts-inputs)

## Community

For help, discussion about best practices, or any other conversation that would benefit from being searchable:

[Discussions on GitHub](https://github.com/stacksjs/ts-inputs/discussions)

For casual chit-chat with others using this package:

[Join the Stacks Discord Server](https://discord.gg/stacksjs)

## Postcardware

"Software that is free, but hopes for a postcard." We love receiving postcards from around the world showing where Stacks is being used! We showcase them on our website too.

Our address: Stacks.js, 12665 Village Ln #2306, Playa Vista, CA 90094, United States 🌎

## Credits

- [cleave-zen](https://github.com/nosir/cleave-zen)
- [Chris Breuer](https://github.com/chrisbbreuer)
- [All Contributors](https://github.com/stacksjs/clarity/contributors)

## Sponsors

We would like to extend our thanks to the following sponsors for funding Stacks development. If you are interested in becoming a sponsor, please reach out to us.

- [JetBrains](https://www.jetbrains.com/)
- [The Solana Foundation](https://solana.com/)

## License

The MIT License (MIT). Please see [LICENSE](LICENSE.md) for more information.

Made with 💙

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/ts-inputs?style=flat-square
[npm-version-href]: https://npmjs.com/package/ts-inputs
[github-actions-src]: https://img.shields.io/github/actions/workflow/status/stacksjs/ts-inputs/ci.yml?style=flat-square&branch=main
[github-actions-href]: https://github.com/stacksjs/ts-inputs/actions?query=workflow%3Aci

<!-- [codecov-src]: https://img.shields.io/codecov/c/gh/stacksjs/ts-inputs/main?style=flat-square
[codecov-href]: https://codecov.io/gh/stacksjs/ts-inputs -->
