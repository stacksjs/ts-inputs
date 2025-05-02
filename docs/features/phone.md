# Phone Number Formatting

A powerful utility for formatting and validating phone numbers with international support. The library provides flexible formatting options and robust validation capabilities.

## Features

- Automatic formatting of phone numbers
- Support for multiple international formats
- Region-based formatting
- Customizable delimiters and patterns
- Validation and error handling
- Clean internal storage of digits
- TypeScript support
- Lightweight and performant
- Integration with BaseInput component

## Basic Usage

### Core Functionality

```typescript
import { formatPhone, unformatPhone } from 'ts-inputs'

// Format a phone number with region
const formatted = formatPhone('1234567890', {
  region: 'US',
  delimiter: '-'
})
// Output: '(123) 456-7890'

// Unformat a phone number
const unformatted = unformatPhone('(123) 456-7890')
// Output: '1234567890'
```

## API Reference

### `formatPhone(value: string, options?: FormatPhoneOptions): string`

Formats a phone number according to the specified options.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `value` | `string` | The phone number to format |
| `options` | `FormatPhoneOptions` | Optional formatting options |

#### `FormatPhoneOptions`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `region` | `string` | `'US'` | Region code for phone formatting (e.g., 'US', 'GB', 'FR') |
| `delimiter` | `string` | `'-'` | Character used to separate phone number groups |
| `pattern` | `number[]` | - | Array of numbers defining the group sizes (overrides region pattern) |
| `includeCountryCode` | `boolean` | `false` | Whether to include country code in the output |
| `format` | `'national' \| 'international'` | `'national'` | Format style (national or international) |

### `unformatPhone(value: string): string`

Removes all formatting from a phone number, returning only the digits.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `value` | `string` | The formatted phone number |

## Region Support

The library supports phone number formatting for various regions:

| Region | Code | Format | Example |
|--------|------|--------|---------|
| United States | `'US'` | (XXX) XXX-XXXX | (123) 456-7890 |
| United Kingdom | `'GB'` | XXXX XXX XXXX | 0123 456 7890 |
| France | `'FR'` | XX XX XX XX XX | 01 23 45 67 89 |
| Germany | `'DE'` | XXX XX XX XX | 012 34 56 78 |
| Japan | `'JP'` | XXX-XXXX-XXXX | 012-3456-7890 |
| China | `'CN'` | XXX XXXX XXXX | 012 3456 7890 |
| India | `'IN'` | XXXX XXX XXXX | 0123 456 7890 |
| Brazil | `'BR'` | (XX) XXXX-XXXX | (01) 2345-6789 |
| Australia | `'AU'` | XXXX XXX XXX | 0123 456 789 |
| Canada | `'CA'` | (XXX) XXX-XXXX | (123) 456-7890 |

## Examples

### Region-based Formatting

```typescript
import { formatPhone } from 'ts-inputs'

// US Format
const usPhone = formatPhone('1234567890', { region: 'US' })
// Output: '(123) 456-7890'

// UK Format
const ukPhone = formatPhone('1234567890', { region: 'GB' })
// Output: '0123 456 7890'

// French Format
const frPhone = formatPhone('1234567890', { region: 'FR' })
// Output: '01 23 45 67 89'

// German Format
const dePhone = formatPhone('1234567890', { region: 'DE' })
// Output: '012 34 56 78'
```

### International Format

```typescript
import { formatPhone } from 'ts-inputs'

// US number with country code
const usInternational = formatPhone('1234567890', {
  region: 'US',
  includeCountryCode: true,
  format: 'international'
})
// Output: '+1 (123) 456-7890'

// UK number with country code
const ukInternational = formatPhone('1234567890', {
  region: 'GB',
  includeCountryCode: true,
  format: 'international'
})
// Output: '+44 0123 456 7890'
```

### Custom Delimiters

```typescript
import { formatPhone } from 'ts-inputs'

// Using space as delimiter
const spaceDelimited = formatPhone('1234567890', {
  region: 'US',
  delimiter: ' '
})
// Output: '(123) 456 7890'

// Using dot as delimiter
const dotDelimited = formatPhone('1234567890', {
  region: 'US',
  delimiter: '.'
})
// Output: '(123).456.7890'
```

### Custom Patterns

```typescript
import { formatPhone } from 'ts-inputs'

// Custom pattern: XXXX-XX-XXX-XX
const customPattern = formatPhone('1234567890', {
  pattern: [4, 2, 3, 2],
  delimiter: '-'
})
// Output: '1234-56-789-0'

// Complex pattern: XXX-XX-XX-XX-XX
const complexPattern = formatPhone('1234567890', {
  pattern: [3, 2, 2, 2, 2],
  delimiter: '-'
})
// Output: '123-45-67-89-0'
```

## Error Handling

The library provides robust error handling for invalid inputs:

```typescript
import { formatPhone } from 'ts-inputs'

try {
  const formatted = formatPhone('invalid-number', {
    region: 'US'
  })
}
catch (error) {
  console.error('Invalid phone number:', error.message)
}
```

## Best Practices

1. **Region Selection**
   - Use appropriate region for the target audience
   - Consider using dynamic region selection for international applications
   - Test with various region formats

2. **Format Consistency**
   - Use consistent formatting across the application
   - Consider user preferences for format style
   - Handle international numbers appropriately

3. **Storage**
   - Store phone numbers in unformatted form
   - Format only for display purposes
   - Include region information when storing

4. **Validation**
   - Validate phone numbers before formatting
   - Handle international numbers correctly
   - Consider using a validation library for complex rules

5. **Performance**
   - Format only when necessary
   - Cache formatted results when possible
   - Consider using memoization for repeated formatting

## TypeScript Support

The library is written in TypeScript and provides full type support:

```typescript
import type { FormatPhoneOptions } from 'ts-inputs'

const options: FormatPhoneOptions = {
  region: 'US',
  delimiter: '-',
  includeCountryCode: true,
  format: 'international'
}
```

## Constants

The library provides default constants for common use cases:

```typescript
import { DefaultPhoneDelimiter, DefaultPhoneRegion } from 'ts-inputs'

const defaultRegion = DefaultPhoneRegion // 'US'
const defaultDelimiter = DefaultPhoneDelimiter // '-'
```
