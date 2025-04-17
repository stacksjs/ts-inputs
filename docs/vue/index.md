# Vue Components

The Vue package provides a set of input components that are built on top of the core `ts-inputs` package. These components are designed to be easy to use and highly customizable.

## Available Components

- [Credit Card Input](/vue/credit-card) - Input component for credit card numbers with automatic formatting
- [Date Input](/vue/date) - Input component for dates with various formatting options
- [Time Input](/vue/time) - Input component for time values with 12/24 hour format support
- [Numeral Input](/vue/numeral) - Input component for numerical values with formatting options
- [Google Places Autocomplete](/vue/google-places) - Input component for Google Places Autocomplete with address suggestions

## Installation

Make sure you have `ts-inputs` installed in your project:

::: code-group

```sh [npm]
npm install --save-dev ts-inputs-vue
```

```sh [bun]
bun add --dev ts-inputs-vue
```

```sh [pnpm]
pnpm add --save-dev ts-inputs-vue
```

```sh [yarn]
yarn add --dev ts-inputs-vue
```

:::

## Common Features

All input components share these common features:

### Props

- `modelValue` (required): The v-model value
- `className` (optional): Additional CSS classes
- `placeholder` (optional): Input placeholder text
- `options` (optional): Component-specific formatting options

### Events

- `update:modelValue`: When the formatted value changes

## Advanced Usage

### Custom Styling

You can customize the appearance of the components using the `className` prop:

```vue
<template>
  <CreditCardInput
    v-model="cardNumber"
    class="custom-input"
    placeholder="Enter card number"
  />
</template>

<style>
.custom-input {
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
}

.custom-input:focus {
  border-color: #3b82f6;
  outline: none;
}
</style>
```

### Form Integration

The components work seamlessly with Vue forms:

```vue
<script setup lang="ts">
import { CreditCardInput, DateInput } from 'ts-inputs'

const form = ref({
  cardNumber: '',
  expiryDate: '',
})

function handleSubmit() {
  console.log('Form submitted:', form.value)
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <CreditCardInput
      v-model="form.cardNumber"
      placeholder="Card number"
    />

    <DateInput
      v-model="form.expiryDate"
      pattern="MM/YY"
      placeholder="Expiry date"
    />

    <button type="submit">
      Submit
    </button>
  </form>
</template>
```
