# Getting Started

ts-inputs is a modern, lightweight input masking library for TypeScript that helps you format user input in real-time.

## Installation

::: code-group

```sh [npm]
npm install ts-inputs
```

```sh [pnpm]
pnpm add ts-inputs
```

```sh [bun]
bun add ts-inputs
```

```sh [yarn]
yarn add ts-inputs
```

:::

## Core Concepts

ts-inputs provides two ways to format input:

1. **Pure Functions** - Format strings directly without DOM manipulation
2. **BaseInput Class** - Attach formatting to HTML input elements

## Pure Functions

Use formatting functions for string manipulation:

### Credit Card Formatting

```typescript
import {
  formatCreditCard,
  getCreditCardType,
  unformatCreditCard
} from 'ts-inputs'

// Format a credit card number
const formatted = formatCreditCard('4111111111111111')
console.log(formatted) // '4111 1111 1111 1111'

// Detect card type
const type = getCreditCardType('4111111111111111')
console.log(type) // 'visa'

// Remove formatting
const raw = unformatCreditCard('4111 1111 1111 1111')
console.log(raw) // '4111111111111111'
```

### Phone Number Formatting

```typescript
import { formatPhone } from 'ts-inputs'

// US phone number
const usPhone = formatPhone('2025551234', {
  region: 'US',
  format: 'national',
})
console.log(usPhone) // '(202) 555-1234'

// International format
const intlPhone = formatPhone('12025551234', {
  region: 'US',
  format: 'international',
})
console.log(intlPhone) // '+1 202-555-1234'
```

### Date/Time Formatting

```typescript
import { formatDateTime, isValidDateTime, unformatDateTime } from 'ts-inputs'

// Format date input
const date = formatDateTime('25122024', {
  pattern: 'DD/MM/YYYY',
  delimiter: '/',
})
console.log(date) // '25/12/2024'

// Validate date
const isValid = isValidDateTime('25/12/2024', {
  pattern: 'DD/MM/YYYY',
})
console.log(isValid) // true

// Remove formatting
const raw = unformatDateTime('25/12/2024')
console.log(raw) // '25122024'
```

### Numeral Formatting

```typescript
import { formatNumeral } from 'ts-inputs'

// Basic number formatting
const number = formatNumeral('1234567', {
  thousandsSeparator: ',',
})
console.log(number) // '1,234,567'

// With decimals
const decimal = formatNumeral('1234567.89', {
  thousandsSeparator: ',',
  decimalSeparator: '.',
  decimalPlaces: 2,
})
console.log(decimal) // '1,234,567.89'

// Currency-like formatting
const currency = formatNumeral('1234.5', {
  prefix: '$',
  thousandsSeparator: ',',
  decimalSeparator: '.',
  decimalPlaces: 2,
})
console.log(currency) // '$1,234.50'
```

### General Pattern Formatting

```typescript
import { formatGeneral } from 'ts-inputs'

// Custom block pattern
const formatted = formatGeneral('ABC123DEF456', {
  blocks: [3, 3, 3, 3],
  delimiter: '-',
  uppercase: true,
})
console.log(formatted) // 'ABC-123-DEF-456'
```

## BaseInput Class

Attach formatting to HTML input elements:

```html
<input type="text" id="credit-card" placeholder="Card Number" />
<input type="text" id="phone" placeholder="Phone Number" />
<input type="text" id="date" placeholder="Date" />
```

```typescript
import { BaseInput } from 'ts-inputs'

// Credit card input
const cardInput = new BaseInput('#credit-card', {
  creditCard: true,
  onCreditCardTypeChanged: (type) => {
    console.log(`Detected: ${type}`)
  },
  onValueChanged: (formatted, raw) => {
    console.log(`Formatted: ${formatted}`)
    console.log(`Raw: ${raw}`)
  },
})

// Phone input
const phoneInput = new BaseInput('#phone', {
  phone: true,
  phoneOptions: {
    region: 'US',
  },
})

// Date input
const dateInput = new BaseInput('#date', {
  dateTime: true,
  dateTimeOptions: {
    pattern: 'MM/DD/YYYY',
  },
  onDateTimeValidityChanged: (isValid) => {
    console.log(`Valid: ${isValid}`)
  },
})
```

## BaseInput Options

```typescript
interface BaseInputOptions {
  // Input type (choose one)
  creditCard?: boolean
  phone?: boolean
  numeral?: boolean
  dateTime?: boolean
  general?: boolean

  // Type-specific options
  creditCardOptions?: FormatCreditCardOptions
  phoneOptions?: FormatPhoneOptions
  numeralOptions?: FormatNumeralOptions
  dateTimeOptions?: FormatDateTimeOptions
  generalOptions?: FormatGeneralOptions

  // Event callbacks
  onValueChanged?: (formatted: string, raw: string) => void
  onCreditCardTypeChanged?: (type: CreditCardType) => void
  onPhoneFormatChanged?: (formatted: string) => void
  onNumeralFormatChanged?: (formatted: string) => void
  onDateTimeFormatChanged?: (formatted: string) => void
  onDateTimeValidityChanged?: (isValid: boolean) => void
  onGeneralFormatChanged?: (formatted: string) => void
  onFocus?: (event: FocusEvent) => void
  onBlur?: (event: FocusEvent) => void
}
```

## Instance Methods

```typescript
const input = new BaseInput('#my-input', { creditCard: true })

// Get formatted value
const formatted = input.getValue()

// Get raw (unformatted) value
const raw = input.getUnformattedValue()

// Set value programmatically
input.setValue('4111111111111111')

// Clean up event listeners
input.destroy()
```

## Credit Card Types

The library detects the following card types:

| Type | Prefix Pattern |
|------|----------------|
| `visa` | 4xxx |
| `mastercard` | 51-55, 2221-2720 |
| `amex` | 34, 37 |
| `discover` | 6011, 622, 64, 65 |
| `diners` | 300-305, 36, 38 |
| `jcb` | 2131, 1800, 35 |
| `unionpay` | 62 |

## Date/Time Patterns

Supported pattern tokens:

| Token | Description | Example |
|-------|-------------|---------|
| `DD` | Day (2 digits) | 01-31 |
| `MM` | Month (2 digits) | 01-12 |
| `YYYY` | Year (4 digits) | 2024 |
| `YY` | Year (2 digits) | 24 |
| `HH` | Hour 24h (2 digits) | 00-23 |
| `hh` | Hour 12h (2 digits) | 01-12 |
| `mm` | Minutes (2 digits) | 00-59 |
| `ss` | Seconds (2 digits) | 00-59 |

Example patterns:
- `DD/MM/YYYY` - European date
- `MM/DD/YYYY` - US date
- `YYYY-MM-DD` - ISO date
- `HH:mm` - 24-hour time
- `hh:mm` - 12-hour time
- `DD/MM/YYYY HH:mm` - Date and time

## Next Steps

- [Mask Patterns](/guide/masks) - Create custom input masks
- [Vue Components](/guide/vue) - Use with Vue.js
