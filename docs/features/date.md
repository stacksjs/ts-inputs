# Date Formatting

Format and validate dates with support for various formats and locales.

## Basic Usage

```typescript
import { formatDate, isValidDate, parseDate } from 'ts-inputs'

// Format a date
const formattedDate = formatDate(new Date(), 'YYYY-MM-DD')
// Output: '2024-03-21'

// Parse a date string
const parsedDate = parseDate('2024-03-21', 'YYYY-MM-DD')
// Output: Date object

// Validate a date
const isValid = isValidDate('2024-03-21')
// Output: true
```

## Date Formats

The library supports various date formats:

- `YYYY-MM-DD` (ISO format)
- `MM/DD/YYYY` (US format)
- `DD/MM/YYYY` (European format)
- `YYYY/MM/DD` (Japanese format)

## Locale Support

```typescript
import { formatDate, setLocale } from 'ts-inputs'

// Set locale
setLocale('en-US')

// Format with locale
const formattedDate = formatDate(new Date(), 'LL', { locale: 'en-US' })
// Output: 'March 21, 2024'
```

## Date Validation

```typescript
import { isValidDate, validateDate } from 'ts-inputs'

// Simple validation
const isValid = isValidDate('2024-03-21')

// Advanced validation with options
const validation = validateDate('2024-03-21', {
  minDate: new Date('2024-01-01'),
  maxDate: new Date('2024-12-31'),
  format: 'YYYY-MM-DD'
})
```

## Error Handling

```typescript
try {
  const formattedDate = formatDate('invalid-date', 'YYYY-MM-DD')
}
catch (error) {
  console.error('Invalid date:', error.message)
}
```
