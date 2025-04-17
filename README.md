<p align="center"><img src=".github/art/cover.jpg" alt="Social Card of this repo"></p>

[![npm version][npm-version-src]][npm-version-href]
[![GitHub Actions][github-actions-src]][github-actions-href]
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
<!-- [![npm downloads][npm-downloads-src]][npm-downloads-href] -->
<!-- [![Codecov][codecov-src]][codecov-href] -->

# ts-inputs

A collection of smart, type-safe input components for Vue.js that provides automatic formatting, validation, and internationalization support. Built to make form input handling both powerful and developer-friendly.

## Features

ts-inputs comes with the following powerful features:

- 🎯 **Smart Input Components**
  - Credit Card formatting with automatic card type detection
  - Date formatting with customizable patterns
  - Time formatting with 12h/24h support
  - Numerical formatting with thousand/lakh grouping
  - Google Places autocomplete integration

- 💪 **Type Safety**
  - Full TypeScript support
  - Type-safe props and events
  - Intelligent autocompletion

- 🌈 **Developer Experience**
  - Simple Vue.js integration
  - Customizable formatting options
  - Automatic validation
  - Internationalization support
  - Modern and clean UI

## Get Started

```bash
# Install using your preferred package manager
npm install ts-inputs
# or
yarn add ts-inputs
# or
pnpm add ts-inputs
```

Basic usage example:

```vue
<script setup lang="ts">
import { CreditCardInput, DateInput, NumeralInput, TimeInput } from 'ts-inputs'

const cardNumber = ref('')
const date = ref('')
const time = ref('')
const number = ref('')
</script>

<template>
  <CreditCardInput v-model="cardNumber" placeholder="Enter card number" />
  <DateInput v-model="date" pattern="YYYY-MM-DD" />
  <TimeInput v-model="time" format="24h" />
  <NumeralInput v-model="number" thousand-group-style="thousand" />
</template>
```

## Testing

```bash
bun test
```

## Changelog

Please see our [releases](https://github.com/stackjs/ts-inputs/releases) page for more information on what has changed recently.

## Stargazers

[![Stargazers](https://starchart.cc/stacksjs/ts-inputs.svg?variant=adaptive)](https://starchart.cc/stacksjs/ts-inputs)

## Contributing

Please see [CONTRIBUTING](.github/CONTRIBUTING.md) for details.

## Community

For help, discussion about best practices, or any other conversation that would benefit from being searchable:

[Discussions on GitHub](https://github.com/stacksjs/ts-inputs/discussions)

For casual chit-chat with others using this package:

[Join the Stacks Discord Server](https://discord.gg/stacksjs)

## Postcardware

“Software that is free, but hopes for a postcard.” We love receiving postcards from around the world showing where Stacks is being used! We showcase them on our website too.

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
