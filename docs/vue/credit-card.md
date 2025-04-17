# Credit Card Input

A component for formatting and validating credit card numbers.

## Usage

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

## Demo

<CreditCardDemo />

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | `''` | The v-model binding value |
| `delimiter` | `string` | `' '` | Custom delimiter for card number formatting |
| `className` | `string` | - | Additional CSS classes |
| `placeholder` | `string` | - | Input placeholder text |
| `options` | `object` | - | Additional formatting options |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string` | Emitted when the input value changes |
| `cardTypeChange` | `CreditCardType` | Emitted when the card type is detected |
| `blur` | `Event` | Emitted when the input loses focus |
