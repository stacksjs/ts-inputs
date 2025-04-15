# Date Input

A component for formatting dates.

## Usage

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

## Props

- `modelValue` (required): The v-model value
- `pattern` (optional): Date format pattern (defaults to 'YYYY-MM-DD')
- `className` (optional): Additional CSS classes
- `placeholder` (optional): Input placeholder text
- `options` (optional): Additional formatting options

## Events

- `update:modelValue`: Emitted when the value changes
