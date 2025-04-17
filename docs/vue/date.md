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

## Demo

<DateInputDemo />

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | `''` | The v-model binding value |
| `pattern` | `string` | `'YYYY-MM-DD'` | Date format pattern |
| `className` | `string` | - | Additional CSS classes |
| `placeholder` | `string` | - | Input placeholder text |
| `options` | `object` | - | Additional formatting options |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string` | Emitted when the input value changes |
| `blur` | `Event` | Emitted when the input loses focus |
