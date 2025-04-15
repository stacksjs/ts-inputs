# Numeral Input

A component for formatting numbers.

## Usage

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

## Props

- `modelValue` (required): The v-model value
- `thousandGroupStyle` (optional): Thousand group style ('thousand' or 'lakh', defaults to 'thousand')
- `className` (optional): Additional CSS classes
- `placeholder` (optional): Input placeholder text
- `options` (optional): Additional formatting options

## Events

- `update:modelValue`: Emitted when the value changes
