# Credit Card Input

A component for formatting and validating credit card numbers. You can use either the dedicated `CreditCardInput` component or the `BaseInput` component with `type="credit-card"`.

## Usage with BaseInput

```vue
<script setup lang="ts">
import { BaseInput } from 'ts-inputs'
import type { CreditCardType } from 'ts-inputs'

const cardNumber = ref('')

function handleCardTypeChange(type: CreditCardType) {
  console.log('Card type:', type)
}
</script>

<template>
  <BaseInput
    v-model="cardNumber"
    type="credit-card"
    placeholder="Enter card number"
    :credit-card-options="{ delimiter: ' ' }"
    @card-type="handleCardTypeChange"
  />
</template>
```

## Usage with CreditCardInput

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
    @card-type="handleCardTypeChange"
  />
</template>
```

## Demo

<CreditCardDemo />

## Props

### BaseInput Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'credit-card'` | - | Must be set to 'credit-card' for credit card input |
| `modelValue` | `string` | `''` | The v-model binding value |
| `className` | `string` | - | Additional CSS classes |
| `placeholder` | `string` | - | Input placeholder text |
| `creditCardOptions` | `object` | - | Credit card formatting options |

### CreditCardInput Props

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
| `cardType` | `CreditCardType` | Emitted when the card type is detected |
| `blur` | `Event` | Emitted when the input loses focus |

## Credit Card Types

The component supports the following card types:

- Visa (starts with 4)
- Mastercard (starts with 51-55)
- American Express (starts with 34 or 37)
- Discover (starts with 6011 or 65)
- Diners Club (starts with 36, 38, or 39)
- JCB (starts with 35)

## Formatting

The component automatically formats the card number based on the card type:

- American Express: XXXX XXXXXX XXXXX
- Other cards: XXXX XXXX XXXX XXXX

You can customize the delimiter used for formatting by setting the `delimiter` prop or `creditCardOptions.delimiter`.
