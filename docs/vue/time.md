# Time Input

A component for formatting time values.

## Usage

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

## Props

- `modelValue` (required): The v-model value
- `format` (optional): Time format ('12h' or '24h', defaults to '12h')
- `className` (optional): Additional CSS classes
- `placeholder` (optional): Input placeholder text
- `options` (optional): Additional formatting options

## Events

- `update:modelValue`: Emitted when the value changes
