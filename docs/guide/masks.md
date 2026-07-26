# Mask Patterns

ts-inputs provides flexible mask patterns for formatting various types of input data.

## General Pattern Masking

Use the `formatGeneral` function for custom patterns:

```typescript
import { formatGeneral } from 'ts-inputs'

const formatted = formatGeneral('ABC123DEF456', {
  blocks: [3, 3, 3, 3],
  delimiter: '-',
})
// Result: 'ABC-123-DEF-456'
```

### Block Patterns

Blocks define the length of each segment:

```typescript
// Social Security Number: XXX-XX-XXXX
formatGeneral('123456789', {
  blocks: [3, 2, 4],
  delimiter: '-',
})
// Result: '123-45-6789'

// License Plate: XXX XXXX
formatGeneral('ABC1234', {
  blocks: [3, 4],
  delimiter: ' ',
})
// Result: 'ABC 1234'

// Custom code: XX-XXX-XXXX-X
formatGeneral('AB123CDEF4G', {
  blocks: [2, 3, 4, 1],
  delimiter: '-',
})
// Result: 'AB-123-CDEF-4'
```

### Case Transformation

Force uppercase or lowercase:

```typescript
// Uppercase
formatGeneral('abc123', {
  blocks: [3, 3],
  delimiter: '-',
  uppercase: true,
})
// Result: 'ABC-123'

// Lowercase
formatGeneral('ABC123', {
  blocks: [3, 3],
  delimiter: '-',
  lowercase: true,
})
// Result: 'abc-123'
```

### Prefix and Suffix

Add static prefix or suffix:

```typescript
formatGeneral('12345', {
  blocks: [5],
  prefix: 'ID-',
})
// Result: 'ID-12345'
```

## Credit Card Patterns

Credit cards are automatically formatted based on card type:

```typescript
import { formatCreditCard } from 'ts-inputs'

// Visa/Mastercard/Discover (4-4-4-4)
formatCreditCard('4111111111111111')
// Result: '4111 1111 1111 1111'

// American Express (4-6-5)
formatCreditCard('378282246310005')
// Result: '3782 822463 10005'

// Diners Club (4-6-4)
formatCreditCard('30569309025904')
// Result: '3056 930902 5904'
```

### Credit Card Options

```typescript
interface FormatCreditCardOptions {
  delimiter?: string    // Default: ' '
}

formatCreditCard('4111111111111111', {
  delimiter: '-',
})
// Result: '4111-1111-1111-1111'
```

## Phone Number Patterns

Phone numbers are formatted based on region:

```typescript
import { formatPhone } from 'ts-inputs'

// US National
formatPhone('2025551234', { region: 'US' })
// Result: '(202) 555-1234'

// UK
formatPhone('2071234567', { region: 'GB' })
// Result: '020 7123 4567'

// Germany
formatPhone('301234567', { region: 'DE' })
// Result: '030 1234567'
```

### Phone Options

```typescript
interface FormatPhoneOptions {
  region?: string           // ISO 3166-1 alpha-2 code
  format?: 'national' | 'international'
  delimiter?: string
}

// International format
formatPhone('2025551234', {
  region: 'US',
  format: 'international',
})
// Result: '+1 202-555-1234'
```

## Date/Time Patterns

Flexible date and time formatting:

```typescript
import { formatDateTime } from 'ts-inputs'

// European date
formatDateTime('25122024', {
  pattern: 'DD/MM/YYYY',
  delimiter: '/',
})
// Result: '25/12/2024'

// US date
formatDateTime('12252024', {
  pattern: 'MM/DD/YYYY',
  delimiter: '/',
})
// Result: '12/25/2024'

// ISO date
formatDateTime('20241225', {
  pattern: 'YYYY-MM-DD',
  delimiter: '-',
})
// Result: '2024-12-25'
```

### Date/Time Options

```typescript
interface FormatDateTimeOptions {
  pattern?: string          // Date pattern
  delimiter?: string        // Separator character
  datePattern?: string[]    // Custom pattern blocks
  timePattern?: string[]    // Custom time blocks
}

// Date with time
formatDateTime('2512202414:30', {
  pattern: 'DD/MM/YYYY HH:mm',
})
// Result: '25/12/2024 14:30'
```

### Pattern Tokens

| Token | Description | Valid Range |
|-------|-------------|-------------|
| `DD` | Day | 01-31 |
| `MM` | Month | 01-12 |
| `YYYY` | Full year | 0000-9999 |
| `YY` | Short year | 00-99 |
| `HH` | Hour (24h) | 00-23 |
| `hh` | Hour (12h) | 01-12 |
| `mm` | Minutes | 00-59 |
| `ss` | Seconds | 00-59 |

### Date Validation

```typescript
import { isValidDateTime } from 'ts-inputs'

isValidDateTime('25/12/2024', { pattern: 'DD/MM/YYYY' })
// true

isValidDateTime('32/12/2024', { pattern: 'DD/MM/YYYY' })
// false (day > 31)

isValidDateTime('29/02/2024', { pattern: 'DD/MM/YYYY' })
// true (2024 is a leap year)

isValidDateTime('29/02/2023', { pattern: 'DD/MM/YYYY' })
// false (2023 is not a leap year)
```

## Numeral Patterns

Format numbers with separators:

```typescript
import { formatNumeral } from 'ts-inputs'

// Basic thousands separator
formatNumeral('1234567', {
  thousandsSeparator: ',',
})
// Result: '1,234,567'

// With decimals
formatNumeral('1234567.89', {
  thousandsSeparator: ',',
  decimalSeparator: '.',
  decimalPlaces: 2,
})
// Result: '1,234,567.89'

// European format
formatNumeral('1234567,89', {
  thousandsSeparator: '.',
  decimalSeparator: ',',
  decimalPlaces: 2,
})
// Result: '1.234.567,89'
```

### Numeral Options

```typescript
interface FormatNumeralOptions {
  thousandsSeparator?: string   // Thousands grouping character
  decimalSeparator?: string     // Decimal point character
  decimalPlaces?: number        // Fixed decimal places
  prefix?: string               // Prefix (e.g., '$')
  suffix?: string               // Suffix (e.g., '%')
  positiveOnly?: boolean        // Disallow negative numbers
  stripLeadingZeroes?: boolean  // Remove leading zeros
}

// Currency formatting
formatNumeral('1234.5', {
  prefix: '$',
  thousandsSeparator: ',',
  decimalSeparator: '.',
  decimalPlaces: 2,
})
// Result: '$1,234.50'

// Percentage
formatNumeral('85.5', {
  suffix: '%',
  decimalPlaces: 1,
})
// Result: '85.5%'
```

## Common Patterns

### Social Security Number (SSN)

```typescript
new BaseInput('#ssn', {
  general: true,
  generalOptions: {
    blocks: [3, 2, 4],
    delimiter: '-',
    numericOnly: true,
  },
})
// Input: 123456789 -> Output: 123-45-6789
```

### ZIP Code

```typescript
// US ZIP+4
new BaseInput('#zip', {
  general: true,
  generalOptions: {
    blocks: [5, 4],
    delimiter: '-',
    numericOnly: true,
  },
})
// Input: 123456789 -> Output: 12345-6789
```

### Serial Number

```typescript
new BaseInput('#serial', {
  general: true,
  generalOptions: {
    blocks: [4, 4, 4, 4],
    delimiter: '-',
    uppercase: true,
  },
})
// Input: abcd1234efgh5678 -> Output: ABCD-1234-EFGH-5678
```

### Time Duration

```typescript
new BaseInput('#duration', {
  dateTime: true,
  dateTimeOptions: {
    pattern: 'HH:mm:ss',
    delimiter: ':',
  },
})
// Input: 123045 -> Output: 12:30:45
```

## Cursor Position Handling

ts-inputs automatically handles cursor position during formatting:

```typescript
import { CursorTracker } from 'ts-inputs'

const tracker = new CursorTracker()

// Track cursor before formatting
tracker.capturePosition(inputElement)

// Apply formatting
inputElement.value = formattedValue

// Restore cursor to correct position
tracker.restorePosition(inputElement, previousValue, newValue)
```

## Next Steps

- [Getting Started](/guide/getting-started) - Basic usage
- [Vue Components](/guide/vue) - Vue integration
