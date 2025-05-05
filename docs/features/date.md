# Date & DateTime Formatting

Format and validate dates with support for various formats, time components, and locales.

## Basic Usage

```typescript
import { BaseInput } from 'ts-inputs'

// Create a date input
const dateInput = new BaseInput('#date-input', {
  dateTime: true,
  dateTimeOptions: {
    format: 'YYYY-MM-DD',
    showSeconds: false,
    is24Hour: true,
  },
  onDateTimeFormatChanged: (formatted) => {
    console.log('Formatted date:', formatted)
  },
  onDateTimeValidityChanged: (isValid) => {
    console.log('Is valid date:', isValid)
  },
})

// Get the formatted value
const formattedValue = dateInput.getValue()
// Example: '2024-03-21'

// Get the unformatted value (numeric only)
const unformattedValue = dateInput.getUnformattedValue()
// Example: '20240321'
```

## Date Formats & Options

The datetime input supports various configuration options:

```typescript
const dateTimeInput = new BaseInput('#date-time-input', {
  dateTime: true,
  dateTimeOptions: {
    // Date format options
    format: 'YYYY-MM-DD HH:mm:ss', // Full format
    dateFormat: 'YYYY-MM-DD', // Date part format
    timeFormat: 'HH:mm:ss', // Time part format
    dateSeparator: '-', // Date component separator
    timeSeparator: ':', // Time component separator
    separator: ' ', // Separator between date and time

    // Time format options
    is24Hour: true, // Use 24-hour format
    showSeconds: true, // Show seconds in time

    // Validation options
    strictMode: true, // Enforce strict validation
    minDate: '2024-01-01', // Minimum allowed date
    maxDate: '2024-12-31', // Maximum allowed date
    disabledDates: ['2024-03-15'], // Disabled dates

    // Other options
    locale: 'en-US', // Locale for formatting
    allowEmpty: true, // Allow empty input
    placeholder: 'Enter date...', // Input placeholder
  },
})
```

## Validation Features

The datetime input includes comprehensive validation:

```typescript
const dateInput = new BaseInput('#validated-date-input', {
  dateTime: true,
  dateTimeOptions: {
    strictMode: true,
    minDate: new Date('2024-01-01'),
    maxDate: new Date('2024-12-31'),
    disabledDates: [
      '2024-03-15',
      '2024-03-16',
    ],
  },
  onDateTimeValidityChanged: (isValid) => {
    if (!isValid) {
      console.log('Invalid date selected')
    }
  },
})
```

## Direct API Usage

You can also use the formatting functions directly:

```typescript
import { formatDateTime, isValidDateTime, unformatDateTime } from 'ts-inputs'

// Format a date string
const formatted = formatDateTime('20240321', {
  format: 'YYYY-MM-DD',
  strictMode: true,
})
// Output: '2024-03-21'

// Validate a date
const isValid = isValidDateTime('2024-03-21', {
  minDate: '2024-01-01',
  maxDate: '2024-12-31',
})
// Output: true

// Get unformatted value
const unformatted = unformatDateTime('2024-03-21')
// Output: '20240321'
```

## Error Handling

The input handles various edge cases gracefully:

- Invalid dates are prevented in strict mode
- Out-of-range values are handled according to validation rules
- Empty values are allowed when `allowEmpty` is true
- Disabled dates are prevented from being selected
- Min/max date constraints are enforced
