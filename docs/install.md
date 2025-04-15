# Installation

Installing `ts-inputs` is straightforward. Simply add it to your project using your preferred package manager.

## Package Managers

Choose your package manager of choice:

::: code-group

```sh [npm]
npm install ts-inputs
# or
npm i ts-inputs
```

```sh [bun]
bun add ts-inputs
# or
bun install ts-inputs
```

```sh [pnpm]
pnpm add ts-inputs
# or
pnpm install ts-inputs
```

```sh [yarn]
yarn add ts-inputs
```

:::

## TypeScript Configuration

Since `ts-inputs` is a TypeScript library, make sure your project has TypeScript configured. If you haven't set up TypeScript yet, you can do so by:

```bash
# Install TypeScript
npm install --save-dev typescript

# Initialize TypeScript configuration
npx tsc --init
```

## Usage in Your Project

After installation, you can import and use the library in your TypeScript files:

```typescript
import { formatCreditCard, formatDate, formatNumeral } from 'ts-inputs'

// Use the formatting functions
const formattedCard = formatCreditCard('4111111111111111')
const formattedDate = formatDate('2023-04-15')
const formattedNumber = formatNumeral('1000000')
```

## Development Dependencies

If you're using `ts-inputs` in a development environment or for testing, you can install it as a dev dependency:

::: code-group

```sh [npm]
npm install --save-dev ts-inputs
```

```sh [bun]
bun add --dev ts-inputs
```

```sh [pnpm]
pnpm add --save-dev ts-inputs
```

```sh [yarn]
yarn add --dev ts-inputs
```

:::

## Requirements

- Node.js 14.x or higher
- TypeScript 4.x or higher
- Any of the supported package managers (npm, yarn, pnpm, or bun)

## Next Steps

- Learn how to use the library in the [Usage Guide](/usage)
- Explore available [Configuration Options](/config)
- Check out the [API Reference](/api)
