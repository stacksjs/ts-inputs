# Phone Number Formatting

Format and validate phone numbers with international support.

## Basic Usage

```typescript
import { formatPhone, isValidPhone, parsePhone } from 'ts-inputs'

// Format a phone number
const formattedPhone = formatPhone('1234567890', 'US')
// Output: '(123) 456-7890'

// Parse a phone number
const parsedPhone = parsePhone('(123) 456-7890', 'US')
// Output: '1234567890'

// Validate a phone number
const isValid = isValidPhone('1234567890', 'US')
// Output: true
```

## Country Support

The library supports phone number formatting for various countries:

- United States (US)
- Canada (CA)
- United Kingdom (GB)
- Australia (AU)
- Germany (DE)
- France (FR)
- Japan (JP)
- And many more...

## Format Options

```typescript
import { formatPhone, PhoneFormat } from 'ts-inputs'

// Different format options
const formats = {
  international: formatPhone('1234567890', 'US', PhoneFormat.INTERNATIONAL),
  // Output: '+1 123-456-7890'

  national: formatPhone('1234567890', 'US', PhoneFormat.NATIONAL),
  // Output: '(123) 456-7890'

  e164: formatPhone('1234567890', 'US', PhoneFormat.E164),
  // Output: '+11234567890'
}
```

## Validation

```typescript
import { validatePhone } from 'ts-inputs'

// Validate with options
const validation = validatePhone('1234567890', {
  country: 'US',
  format: PhoneFormat.NATIONAL,
  strict: true
})
```

## Error Handling

```typescript
try {
  const formattedPhone = formatPhone('invalid-number', 'US')
}
catch (error) {
  console.error('Invalid phone number:', error.message)
}
```
