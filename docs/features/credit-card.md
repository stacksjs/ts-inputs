# Credit Card Formatting

Format and validate credit card numbers with support for various card types.

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

## Options

```typescript
import { DefaultCreditCardDelimiter, formatCreditCard } from 'ts-inputs'

const options = {
  delimiter: DefaultCreditCardDelimiter, // defaults to ' '
  // other options...
}

const formattedCard = formatCreditCard('4111111111111111', options)
```

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

The library automatically validates card numbers using the Luhn algorithm and checks for valid card type patterns.

## Error Handling

```typescript
try {
  const formattedCard = formatCreditCard('invalid-card-number')
}
catch (error) {
  console.error('Invalid card number:', error.message)
}
```
