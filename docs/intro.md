<p align="center"><img src="https://github.com/stacksjs/rpx/blob/main/.github/art/cover.jpg?raw=true" alt="Social Card of this repo"></p>

# A Better Developer Experience

> A TypeScript Starter Kit that will help you bootstrap your next project without minimal opinion.

# ts-inputs

A comprehensive TypeScript library for formatting and validating various types of input fields. Perfect for creating polished user experiences with properly formatted credit cards, dates, times, numbers, and more.

## Features

- **Credit Card Formatting**: Format and validate credit card numbers with support for various card types
- **Date & Time Handling**: Flexible formatting for dates and times with customizable patterns
- **Numerical Inputs**: Format numbers with customizable delimiters and thousand group styles
- **Cursor Tracking**: Advanced cursor position management for input fields
- **General Formatting**: Universal formatting utilities for text inputs
- **TypeScript First**: Fully typed with comprehensive TypeScript support

## Quick Start

Install the package:

::: code-group

```sh [bun]
bun install --dev ts-inputs
# bun add --dev ts-inputs
# bun i -d ts-inputs

# or, install globally via
bun add --global ts-inputs
```

```sh [npm]
npm install --save-dev ts-inputs
# npm i -d ts-inputs

# or, install globally via
npm i -g ts-inputs
```

```sh [pnpm]
pnpm add --save-dev ts-inputs
# pnpm i -d ts-inputs

# or, install globally via
pnpm add --global ts-inputs
```

```sh [yarn]
yarn add --dev ts-inputs
# yarn i -d ts-inputs

# or, install globally via
yarn global add ts-inputs
```

:::

Basic usage:

```typescript
import { formatCreditCard, formatDate, formatNumeral } from 'ts-inputs'

// Format a credit card number
const formattedCard = formatCreditCard('4111111111111111')
// Output: '4111 1111 1111 1111'

// Format a date
const formattedDate = formatDate('2023-04-15', { pattern: 'MM/DD/YYYY' })
// Output: '04/15/2023'

// Format a number
const formattedNumber = formatNumeral('1000000', {
  thousandGroupStyle: 'thousand',
  delimiter: ','
})
// Output: '1,000,000'
```

## Why ts-inputs?

- **Type Safety**: Built with TypeScript for better development experience
- **Comprehensive**: Covers all common input formatting needs
- **Customizable**: Flexible options for different formatting requirements
- **Lightweight**: Zero dependencies, minimal bundle size
- **Well-Tested**: Thoroughly tested for reliability

## Documentation

Explore our documentation to learn more about:

- [Installation Guide](/install)
- [Usage Examples](/usage)
- [API Reference](/api)

## Contributing

We welcome contributions! Please see our [Contributing Guide](https://github.com/stacksjs/contributing) for details.

## Community

Join our community for help, discussions, and updates:

- [GitHub Discussions](https://github.com/stacksjs/ts-inputs/discussions)
- [Discord Server](https://discord.gg/stacksjs)

## License

The MIT License (MIT). Please see [LICENSE](https://github.com/stacksjs/ts-inputs/tree/main/LICENSE.md) for more information.

Made with 💙 by the Stacks team

<!-- Badges -->

<!-- [codecov-src]: https://img.shields.io/codecov/c/gh/stacksjs/rpx/main?style=flat-square
[codecov-href]: https://codecov.io/gh/stacksjs/rpx -->
