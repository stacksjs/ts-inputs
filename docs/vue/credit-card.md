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

- `modelValue` (required): The v-model value
- `delimiter` (optional): Custom delimiter (defaults to space)
- `className` (optional): Additional CSS classes
- `placeholder` (optional): Input placeholder text
- `options` (optional): Additional formatting options

## Events

- `update:modelValue`: Emitted when the value changes
- `cardTypeChange`: Emitted when the card type is detected
