# Numeral Input

A component for formatting numbers with various formatting options and styles.

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
| `thousandGroupStyle` | `'thousand' \| 'lakh' \| 'wan'` | `'thousand'` | Thousand group formatting style. 'thousand' (1,234,567.89), 'lakh' (12,34,567.89), 'wan' (123,4567.89) |
| `delimiter` | `string` | `','` | Character used to separate thousands |
| `decimalMark` | `string` | `'.'` | Character used as decimal mark |
| `decimalScale` | `number` | `2` | Number of decimal places to show |
| `integerScale` | `number` | `0` | Maximum number of integer digits |
| `stripLeadingZeroes` | `boolean` | `true` | Whether to remove leading zeroes |
| `positiveOnly` | `boolean` | `false` | Whether to allow only positive numbers |
| `tailPrefix` | `boolean` | `false` | Whether to show prefix at the end of the number |
| `signBeforePrefix` | `boolean` | `false` | Whether to show the sign before the prefix |
| `prefix` | `string` | `''` | Prefix to add before/after the number (e.g., '$', '€') |
| `placeholder` | `string` | `''` | Input placeholder text |
| `disabled` | `boolean` | `false` | Whether the input is disabled |
| `readonly` | `boolean` | `false` | Whether the input is readonly |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string` | Emitted when the input value changes |
| `focus` | `Event` | Emitted when the input receives focus |
| `blur` | `Event` | Emitted when the input loses focus |

## Examples

### Basic Usage

```vue
<NumeralInput
  v-model="number"
  thousand-group-style="thousand"
  placeholder="Enter number"
/>
```

### Currency Format

```vue
<NumeralInput
  v-model="price"
  thousand-group-style="thousand"
  delimiter=","
  decimal-mark="."
  decimal-scale="2"
  prefix="$"
  placeholder="Enter price"
/>
```

### Custom Format

```vue
<NumeralInput
  v-model="percentage"
  thousand-group-style="thousand"
  delimiter=" "
  decimal-mark=","
  decimal-scale="1"
  prefix="%"
  tail-prefix
  placeholder="Enter percentage"
/>
```

### Lakh Format (Indian Number System)

```vue
<NumeralInput
  v-model="amount"
  thousand-group-style="lakh"
  delimiter=","
  decimal-mark="."
  decimal-scale="2"
  prefix="₹"
  placeholder="Enter amount"
/>
```

### Wan Format (Chinese Number System)

```vue
<NumeralInput
  v-model="value"
  thousand-group-style="wan"
  delimiter=","
  decimal-mark="."
  decimal-scale="2"
  prefix="¥"
  placeholder="Enter value"
/>
```

## Notes

- The component automatically formats numbers as you type
- Invalid input is handled gracefully with error messages
- The component supports both positive and negative numbers
- Decimal places are automatically rounded based on the `decimalScale` prop
- The `integerScale` prop can be used to limit the maximum number of integer digits
- The `stripLeadingZeroes` prop can be used to remove leading zeroes from the input
- The `positiveOnly` prop can be used to restrict input to positive numbers only
- The `tailPrefix` and `signBeforePrefix` props can be used to customize the position of the prefix and sign
