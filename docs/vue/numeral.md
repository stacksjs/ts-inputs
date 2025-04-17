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

## Demo

<NumeralInputDemo />

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | `''` | The v-model binding value |
| `thousandGroupStyle` | `'thousand' \| 'lakh'` | `'thousand'` | Thousand group formatting style |
| `className` | `string` | - | Additional CSS classes |
| `placeholder` | `string` | - | Input placeholder text |
| `options` | `object` | - | Additional formatting options |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string` | Emitted when the input value changes |
| `blur` | `Event` | Emitted when the input loses focus |
