# Numerical Formatting

Format and validate numbers with customizable delimiters and thousand group styles.

## Basic Usage

```typescript
import { formatNumeral, isValidNumeral, parseNumeral } from 'ts-inputs'

// Format a number
const formattedNumber = formatNumeral('1000000')
// Output: '1,000,000'

// Parse a formatted number
const parsedNumber = parseNumeral('1,000,000')
// Output: '1000000'

// Validate a number
const isValid = isValidNumeral('1000000')
// Output: true
```

## Thousand Group Styles

The library supports different thousand group styles:

- `thousand` (1,000,000) - Default for most Western countries
- `lakh` (10,00,000) - Used in India and some other countries
- `wan` (100,0000) - Used in China and some other Asian countries

## Format Options

```typescript
import { formatNumeral, NumeralThousandGroupStyles } from 'ts-inputs'

// Different format options
const formats = {
  thousand: formatNumeral('1000000', {
    thousandGroupStyle: NumeralThousandGroupStyles.THOUSAND
  }),
  // Output: '1,000,000'

  lakh: formatNumeral('1000000', {
    thousandGroupStyle: NumeralThousandGroupStyles.LAKH
  }),
  // Output: '10,00,000'

  wan: formatNumeral('1000000', {
    thousandGroupStyle: NumeralThousandGroupStyles.WAN
  }),
  // Output: '100,0000'
}
```

## Advanced Options

```typescript
import { formatNumeral } from 'ts-inputs'

const options = {
  thousandGroupStyle: 'thousand',
  delimiter: ',', // Custom delimiter
  decimalSeparator: '.', // Decimal separator
  precision: 2, // Number of decimal places
  prefix: '$', // Currency prefix
  suffix: ' USD' // Currency suffix
}

const formatted = formatNumeral('1234.5678', options)
// Output: '$1,234.57 USD'
```

## Validation

```typescript
import { validateNumeral } from 'ts-inputs'

// Validate with options
const validation = validateNumeral('1,000,000', {
  thousandGroupStyle: 'thousand',
  allowDecimals: true,
  min: 0,
  max: 1000000
})
```

## Error Handling

```typescript
try {
  const formattedNumber = formatNumeral('invalid-number')
}
catch (error) {
  console.error('Invalid number:', error.message)
}
```
