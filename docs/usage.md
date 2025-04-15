# Usage Guide

`ts-inputs` provides a comprehensive set of utilities for formatting various types of input fields. Here's how to use the library:

## Time Formatting

Format time values:

```typescript
import { DefaultTimeDelimiter, formatTime } from 'ts-inputs'

// Basic usage
const formattedTime = formatTime('14:30:00')
// Output: '02:30 PM'

// With custom options
const customTime = formatTime('14:30:00', {
  format: '24h',
  delimiter: DefaultTimeDelimiter
})
// Output: '14:30'
```

## Numerical Formatting

Format numbers with customizable delimiters and thousand group styles:

```typescript
import { DefaultNumeralDelimiter, formatNumeral, NumeralThousandGroupStyles, unformatNumeral } from 'ts-inputs'

// Basic usage
const formattedNumber = formatNumeral('1000000')
// Output: '1,000,000'

// With custom options
const customNumber = formatNumeral('1000000', {
  thousandGroupStyle: NumeralThousandGroupStyles.THOUSAND,
  delimiter: DefaultNumeralDelimiter
})

// Remove formatting
const unformattedNumber = unformatNumeral('1,000,000')
// Output: '1000000'
```

## General Text Formatting

Format general text inputs:

```typescript
import { formatGeneral, unformatGeneral } from 'ts-inputs'

// Format text
const formattedText = formatGeneral('hello world', {
  // formatting options...
})

// Remove formatting
const unformattedText = unformatGeneral(formattedText)
```

## Cursor Tracking

Manage cursor position in input fields:

```typescript
import { registerCursorTracker } from 'ts-inputs'

const inputElement = document.querySelector('input')

const cleanup = registerCursorTracker(inputElement, {
  // tracking options...
})

// Clean up when done
cleanup()
```

## TypeScript Support

All functions are fully typed with TypeScript:

```typescript
import type {
  CreditCardType,
  FormatCreditCardOptions,
  FormatDateOptions,
  FormatGeneralOptions,
  FormatNumeralOptions,
  FormatTimeOptions,
  RegisterCursorTrackerPropsType
} from 'ts-inputs'

// Use types for better development experience
const options: FormatCreditCardOptions = {
  // options...
}
```

## Common Patterns

Here are some common patterns you might find useful:

### Formatting User Input in Real-time

```typescript
import { formatCreditCard } from 'ts-inputs'

const inputElement = document.querySelector('input')

inputElement.addEventListener('input', (event) => {
  const formattedValue = formatCreditCard(event.target.value)
  event.target.value = formattedValue
})
```

### Formatting Multiple Fields

```typescript
import { formatDate, formatNumeral } from 'ts-inputs'

const formatInputs = {
  date: formatDate,
  number: formatNumeral,
  // add more formatters as needed
}

const inputElement = document.querySelector('input')
const inputType = inputElement.dataset.format // e.g., 'date' or 'number'

if (formatInputs[inputType]) {
  inputElement.value = formatInputs[inputType](inputElement.value)
}
```

For more detailed information about specific features, check out the [Features Guide](/features).

## Vue Components

`ts-inputs` comes with pre-built Vue components for easy integration into your Vue applications. These components handle all the formatting logic internally while providing a familiar Vue interface.

### Credit Card Input

A component for formatting and validating credit card numbers:

```vue
<script setup lang="ts">
import type { CreditCardType } from 'ts-inputs'
import { CreditCardInput } from 'ts-inputs'

const cardNumber = ref('')

function handleCardTypeChange(type: CreditCardType) {
  console.log('Card type:', type)
}
</script>

<template>
  <CreditCardInput
    v-model="cardNumber"
    placeholder="Enter card number"
    @card-type-change="handleCardTypeChange"
  />
</template>
```

#### Props

- `modelValue` (required): The v-model value
- `delimiter` (optional): Custom delimiter (defaults to space)
- `className` (optional): Additional CSS classes
- `placeholder` (optional): Input placeholder text
- `options` (optional): Additional formatting options

#### Events

- `update:modelValue`: Emitted when the value changes
- `cardTypeChange`: Emitted when the card type is detected

### Date Input

A component for formatting dates:

```vue
<script setup lang="ts">
import { DateInput } from 'ts-inputs'

const date = ref('')
</script>

<template>
  <DateInput
    v-model="date"
    pattern="YYYY-MM-DD"
    placeholder="Enter date"
  />
</template>
```

### Time Input

A component for formatting time values:

```vue
<script setup lang="ts">
import { TimeInput } from 'ts-inputs'

const time = ref('')
</script>

<template>
  <TimeInput
    v-model="time"
    format="24h"
    placeholder="Enter time"
  />
</template>
```

### Numeral Input

A component for formatting numbers:

```vue
<script setup lang="ts">
import { NumeralInput } from 'ts-inputs'

const number = ref('')
</script>

<template>
  <NumeralInput
    v-model="number"
    thousand-group-style="thousand"
    placeholder="Enter number"
  />
</template>
```

### Component Props

All input components share these common props:

- `modelValue` (required): The v-model value
- `className` (optional): Additional CSS classes
- `placeholder` (optional): Input placeholder text
- `options` (optional): Component-specific formatting options

### Component Events

All components emit:

- `update:modelValue`: When the formatted value changes
