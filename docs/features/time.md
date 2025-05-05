# Time Formatting

Format and validate time values with support for both 12-hour and 24-hour formats.

## Basic Usage

```typescript
import { BaseInput } from 'ts-inputs'

// Create a time-only input
const timeInput = new BaseInput('#time-input', {
  dateTime: true,
  dateTimeOptions: {
    format: 'HH:mm:ss',
    is24Hour: false,
    showSeconds: true,
  },
  onDateTimeFormatChanged: (formatted) => {
    console.log('Formatted time:', formatted)
  },
  onDateTimeValidityChanged: (isValid) => {
    console.log('Is valid time:', isValid)
  },
})

// Get the formatted value
const formattedValue = timeInput.getValue()
// Example: '02:30:00 PM'

// Get the unformatted value (numeric only)
const unformattedValue = timeInput.getUnformattedValue()
// Example: '143000'
```

## Time Format Options

The datetime input supports various time formats:

```typescript
const timeInput = new BaseInput('#time-input', {
  dateTime: true,
  dateTimeOptions: {
    // Time format options
    format: 'HH:mm:ss', // Full time format
    timeFormat: 'HH:mm:ss', // Time format pattern
    timeSeparator: ':', // Time component separator

    // Display options
    is24Hour: true, // Use 24-hour format (false for 12-hour with AM/PM)
    showSeconds: true, // Include seconds in the time

    // Validation options
    strictMode: true, // Enforce strict time validation

    // Other options
    allowEmpty: true, // Allow empty input
    placeholder: 'Enter time...', // Input placeholder
  },
})
```

## Format Examples

The input supports multiple time formats:

```typescript
// 24-hour format with seconds
const militaryTime = new BaseInput('#military-time', {
  dateTime: true,
  dateTimeOptions: {
    format: 'HH:mm:ss',
    is24Hour: true,
    showSeconds: true,
  },
})
// Output: '14:30:00'

// 12-hour format without seconds
const standardTime = new BaseInput('#standard-time', {
  dateTime: true,
  dateTimeOptions: {
    format: 'hh:mm a',
    is24Hour: false,
    showSeconds: false,
  },
})
// Output: '02:30 PM'

// 24-hour format without seconds
const shortTime = new BaseInput('#short-time', {
  dateTime: true,
  dateTimeOptions: {
    format: 'HH:mm',
    is24Hour: true,
    showSeconds: false,
  },
})
// Output: '14:30'
```

## Time Validation

The input includes built-in validation for time values:

```typescript
const timeInput = new BaseInput('#validated-time', {
  dateTime: true,
  dateTimeOptions: {
    strictMode: true, // Enables strict validation
  },
  onDateTimeValidityChanged: (isValid) => {
    if (!isValid) {
      console.log('Invalid time format')
    }
  },
})
```

## Direct API Usage

You can also use the formatting functions directly:

```typescript
import { formatDateTime, isValidDateTime, unformatDateTime } from 'ts-inputs'

// Format a time string
const formatted = formatDateTime('143000', {
  format: 'HH:mm:ss',
  is24Hour: true,
  showSeconds: true,
})
// Output: '14:30:00'

// Validate a time
const isValid = isValidDateTime('14:30:00', {
  strictMode: true,
})
// Output: true

// Get unformatted value
const unformatted = unformatDateTime('14:30:00')
// Output: '143000'
```

## Error Handling

The time input handles various edge cases:

- Invalid hours (>23 in 24-hour format or >12 in 12-hour format)
- Invalid minutes or seconds (>59)
- Automatic AM/PM conversion
- Empty value handling
- Strict mode validation
