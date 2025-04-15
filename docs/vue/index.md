# Vue Components

`ts-inputs` provides a set of pre-built Vue components that make it easy to integrate formatted inputs into your Vue applications. These components handle all the formatting logic internally while providing a familiar Vue interface.

## Installation

Make sure you have `ts-inputs` installed in your project:

```bash
# using bun
bun add ts-inputs

# using npm
npm install ts-inputs

# using yarn
yarn add ts-inputs

# using pnpm
pnpm add ts-inputs
```

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
