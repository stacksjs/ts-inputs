# Credit Card Formatting

Format and validate credit card numbers with support for various card types. This module provides utilities for formatting, validating, and detecting credit card types.

## Features

- Automatic card type detection
- Formatting with customizable delimiters
- Lazy delimiter display
- Strict mode for extended card number support
- Unformatting utility
- Support for major card types

## Basic Usage

```typescript
import { formatCreditCard, getCreditCardType, unformatCreditCard } from 'ts-inputs'

// Format a credit card number
const formattedCard = formatCreditCard('4111111111111111')
// Output: '4111 1111 1111 1111'

// Get the card type
const cardType = getCreditCardType('4111111111111111')
// Output: 'visa'

// Remove formatting
const unformattedCard = unformatCreditCard('4111 1111 1111 1111')
// Output: '4111111111111111'
```

## Advanced Usage

```typescript
import { DefaultCreditCardDelimiter, formatCreditCard } from 'ts-inputs'

const options = {
  delimiter: DefaultCreditCardDelimiter, // defaults to ' '
  delimiterLazyShow: false, // show delimiters immediately
  strictMode: false, // enable extended card number support
}

const formattedCard = formatCreditCard('4111111111111111', options)
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `delimiter` | string | ' ' | Character used to separate card number blocks |
| `delimiterLazyShow` | boolean | false | Show delimiters only when typing |
| `strictMode` | boolean | false | Enable support for extended card numbers (up to 19 digits) |

## Supported Card Types

- Visa
- Mastercard
- American Express
- Discover
- JCB
- Diners Club
- Maestro
- UnionPay

## Validation

The library automatically validates card numbers using:

- Luhn algorithm
- Card type pattern matching
- Length validation based on card type

## Error Handling

```typescript
try {
  const formattedCard = formatCreditCard('invalid-card-number')
}
catch (error) {
  console.error('Invalid card number:', error.message)
}
```

## Type Definitions

```typescript
type CreditCardType =
  | 'visa'
  | 'mastercard'
  | 'amex'
  | 'discover'
  | 'jcb'
  | 'diners'
  | 'maestro'
  | 'unionpay'
  | 'general'

interface FormatCreditCardOptions {
  delimiter?: string
  delimiterLazyShow?: boolean
  strictMode?: boolean
}
```
