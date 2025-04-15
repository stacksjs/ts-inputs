# Time Formatting

Format and validate time values with support for different formats.

## Basic Usage

```typescript
import { formatTime, isValidTime, parseTime } from 'ts-inputs'

// Format a time
const formattedTime = formatTime('14:30:00')
// Output: '02:30 PM'

// Parse a time string
const parsedTime = parseTime('02:30 PM')
// Output: '14:30:00'

// Validate a time
const isValid = isValidTime('14:30:00')
// Output: true
```

## Time Formats

The library supports various time formats:

- `HH:mm:ss` (24-hour format)
- `hh:mm:ss a` (12-hour format with AM/PM)
- `HH:mm` (24-hour format without seconds)
- `hh:mm a` (12-hour format without seconds)

## Format Options

```typescript
import { formatTime, TimeFormat } from 'ts-inputs'

// Different format options
const formats = {
  twentyFourHour: formatTime('14:30:00', TimeFormat.TWENTY_FOUR_HOUR),
  // Output: '14:30'

  twelveHour: formatTime('14:30:00', TimeFormat.TWELVE_HOUR),
  // Output: '02:30 PM'

  withSeconds: formatTime('14:30:00', TimeFormat.WITH_SECONDS),
  // Output: '14:30:00'
}
```

## Validation

```typescript
import { validateTime } from 'ts-inputs'

// Validate with options
const validation = validateTime('14:30:00', {
  format: TimeFormat.TWENTY_FOUR_HOUR,
  strict: true
})
```

## Error Handling

```typescript
try {
  const formattedTime = formatTime('invalid-time')
}
catch (error) {
  console.error('Invalid time:', error.message)
}
```
