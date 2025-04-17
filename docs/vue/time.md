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

## Demo

<TimeInputDemo />

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | `''` | The v-model binding value |
| `format` | `'12h' \| '24h'` | `'12h'` | Time format to display |
| `className` | `string` | - | Additional CSS classes |
| `placeholder` | `string` | - | Input placeholder text |
| `options` | `object` | - | Additional formatting options |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string` | Emitted when the input value changes |
| `blur` | `Event` | Emitted when the input loses focus |
