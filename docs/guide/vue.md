# Vue Components

ts-inputs provides a dedicated Vue package with ready-to-use input components.

## Installation

::: code-group

```sh [npm]
npm install @ts-inputs/vue
```

```sh [pnpm]
pnpm add @ts-inputs/vue
```

```sh [bun]
bun add @ts-inputs/vue
```

:::

## Plugin Registration

Register the plugin globally:

```typescript
// main.ts
import { createApp } from 'vue'
import TsInputsVue from '@ts-inputs/vue'
import App from './App.vue'

const app = createApp(App)
app.use(TsInputsVue)
app.mount('#app')
```

This registers all input components globally:
- `BaseInput` - Generic masked input
- `CreditCardInput` - Credit card formatting
- `PhoneInput` - Phone number formatting
- `NumeralInput` - Number formatting
- `DateTimePicker` - Date and time picker

## Individual Components

Import components directly:

```vue
<script setup lang="ts">
import {
  BaseInput,
  CreditCardInput,
  PhoneInput,
  NumeralInput,
  DateTimePicker,
} from '@ts-inputs/vue'
</script>
```

## CreditCardInput

Credit card input with automatic formatting and card type detection:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { CreditCardInput } from '@ts-inputs/vue'

const cardNumber = ref('')
const cardType = ref('')

function handleCardTypeChange(type: string) {
  cardType.value = type
}
</script>

<template>
  <div>
    <CreditCardInput
      v-model="cardNumber"
      placeholder="Card Number"
      @card-type-change="handleCardTypeChange"
    />

    <p v-if="cardType">Card Type: {{ cardType }}</p>
  </div>
</template>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | `''` | Card number (v-model) |
| `placeholder` | `string` | `''` | Placeholder text |
| `delimiter` | `string` | `' '` | Separator character |
| `disabled` | `boolean` | `false` | Disable input |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string` | Value changed |
| `card-type-change` | `string` | Card type detected |
| `focus` | `FocusEvent` | Input focused |
| `blur` | `FocusEvent` | Input blurred |

## PhoneInput

Phone number input with region-based formatting:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PhoneInput } from '@ts-inputs/vue'

const phone = ref('')
</script>

<template>
  <PhoneInput
    v-model="phone"
    region="US"
    placeholder="Phone Number"
  />
</template>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | `''` | Phone number (v-model) |
| `region` | `string` | `'US'` | ISO country code |
| `format` | `'national' \| 'international'` | `'national'` | Format style |
| `placeholder` | `string` | `''` | Placeholder text |
| `disabled` | `boolean` | `false` | Disable input |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string` | Value changed |
| `format-change` | `string` | Formatted value changed |

## NumeralInput

Number input with formatting:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { NumeralInput } from '@ts-inputs/vue'

const amount = ref('')
</script>

<template>
  <NumeralInput
    v-model="amount"
    prefix="$"
    :thousands-separator="','"
    :decimal-separator="'.'"
    :decimal-places="2"
    placeholder="Amount"
  />
</template>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | `''` | Numeric value (v-model) |
| `thousandsSeparator` | `string` | `','` | Thousands grouping |
| `decimalSeparator` | `string` | `'.'` | Decimal point |
| `decimalPlaces` | `number` | - | Fixed decimal places |
| `prefix` | `string` | `''` | Value prefix |
| `suffix` | `string` | `''` | Value suffix |
| `positiveOnly` | `boolean` | `false` | Positive numbers only |
| `placeholder` | `string` | `''` | Placeholder text |
| `disabled` | `boolean` | `false` | Disable input |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string` | Value changed |
| `format-change` | `string` | Formatted value changed |

## DateTimePicker

Comprehensive date and time picker:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { DateTimePicker } from '@ts-inputs/vue'

const selectedDate = ref<Date | null>(null)
</script>

<template>
  <DateTimePicker
    v-model="selectedDate"
    format="MM/DD/YYYY"
    placeholder="Select Date"
    :enable-time="false"
  />
</template>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `Date \| null` | `null` | Selected date (v-model) |
| `format` | `string` | `'MM/DD/YYYY'` | Display format |
| `placeholder` | `string` | `''` | Placeholder text |
| `enableTime` | `boolean` | `false` | Show time picker |
| `minDate` | `Date` | - | Minimum selectable date |
| `maxDate` | `Date` | - | Maximum selectable date |
| `disabledDates` | `Date[]` | `[]` | Dates to disable |
| `disabled` | `boolean` | `false` | Disable picker |
| `clearable` | `boolean` | `true` | Allow clearing |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `Date \| null` | Value changed |
| `open` | - | Picker opened |
| `close` | - | Picker closed |

### Date Range Selection

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { DateTimePicker } from '@ts-inputs/vue'

const dateRange = ref<[Date, Date] | null>(null)
</script>

<template>
  <DateTimePicker
    v-model="dateRange"
    range
    format="MM/DD/YYYY"
    placeholder="Select Date Range"
  />
</template>
```

### Time Only Mode

```vue
<template>
  <DateTimePicker
    v-model="time"
    time-only
    format="HH:mm"
    placeholder="Select Time"
  />
</template>
```

## BaseInput

Generic masked input for custom patterns:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { BaseInput } from '@ts-inputs/vue'

const ssn = ref('')
</script>

<template>
  <BaseInput
    v-model="ssn"
    type="general"
    :options="{
      blocks: [3, 2, 4],
      delimiter: '-',
      numericOnly: true,
    }"
    placeholder="SSN"
  />
</template>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | `''` | Value (v-model) |
| `type` | `'creditCard' \| 'phone' \| 'numeral' \| 'dateTime' \| 'general'` | - | Input type |
| `options` | `object` | `{}` | Type-specific options |
| `placeholder` | `string` | `''` | Placeholder text |
| `disabled` | `boolean` | `false` | Disable input |

## Styling

### Using CSS Classes

```vue
<template>
  <CreditCardInput
    v-model="cardNumber"
    class="custom-input"
  />
</template>

<style scoped>
.custom-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
}

.custom-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
</style>
```

### Tailwind CSS

```vue
<template>
  <CreditCardInput
    v-model="cardNumber"
    class="w-full px-4 py-3 border border-gray-300 rounded-lg
           focus:outline-none focus:ring-2 focus:ring-blue-500
           focus:border-transparent"
  />
</template>
```

## Form Validation

Integrate with form validation libraries:

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import { CreditCardInput } from '@ts-inputs/vue'
import { getCreditCardType } from 'ts-inputs'

const cardNumber = ref('')

const isValidCard = computed(() => {
  const type = getCreditCardType(cardNumber.value.replace(/\s/g, ''))
  const length = cardNumber.value.replace(/\s/g, '').length

  if (type === 'amex') return length === 15
  return length === 16
})
</script>

<template>
  <div>
    <CreditCardInput
      v-model="cardNumber"
      :class="{ 'border-red-500': !isValidCard && cardNumber }"
    />
    <p v-if="!isValidCard && cardNumber" class="text-red-500 text-sm">
      Invalid card number
    </p>
  </div>
</template>
```

## TypeScript Support

Full TypeScript support with exported types:

```typescript
import type {
  FormatCreditCardOptions,
  FormatPhoneOptions,
  FormatNumeralOptions,
  FormatDateTimeOptions,
  FormatGeneralOptions,
  CreditCardType,
} from 'ts-inputs'
```

## Accessing Raw Values

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { CreditCardInput } from '@ts-inputs/vue'
import { unformatCreditCard } from 'ts-inputs'

const cardNumber = ref('')

function handleSubmit() {
  // Get raw card number without formatting
  const rawNumber = unformatCreditCard(cardNumber.value)
  console.log(rawNumber) // '4111111111111111'
}
</script>
```

## Next Steps

- [Getting Started](/guide/getting-started) - Core library usage
- [Mask Patterns](/guide/masks) - Custom patterns
