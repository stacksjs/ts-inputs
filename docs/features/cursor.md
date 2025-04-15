# Cursor Tracking

Manage cursor position in input fields during formatting operations.

## Basic Usage

```typescript
import { registerCursorTracker } from 'ts-inputs'

const inputElement = document.querySelector('input')

// Register cursor tracker
const cleanup = registerCursorTracker(inputElement, {
  // tracking options...
})

// Clean up when done
cleanup()
```

## Options

```typescript
import { CursorTrackingOptions } from 'ts-inputs'

const options: CursorTrackingOptions = {
  preservePosition: true, // Whether to preserve cursor position after formatting
  trackSelection: true, // Whether to track text selection
  debounce: 100, // Debounce time in milliseconds
}
```

## Advanced Usage

### With Formatters

```typescript
import { formatCreditCard, registerCursorTracker } from 'ts-inputs'

const inputElement = document.querySelector('input')

// Register cursor tracker with formatter
const cleanup = registerCursorTracker(inputElement, {
  onFormat: value => formatCreditCard(value),
  preservePosition: true,
})
```

### With Multiple Fields

```typescript
import { registerCursorTracker } from 'ts-inputs'

// Track multiple inputs
const inputs = document.querySelectorAll('input[data-format]')

inputs.forEach((input) => {
  const cleanup = registerCursorTracker(input, {
    onFormat: (value) => {
      // Custom formatting logic based on data-format attribute
      const format = input.dataset.format
      return formatValue(value, format)
    },
  })
})
```

## Error Handling

```typescript
try {
  const cleanup = registerCursorTracker(inputElement, options)
}
catch (error) {
  console.error('Failed to register cursor tracker:', error.message)
}
```
