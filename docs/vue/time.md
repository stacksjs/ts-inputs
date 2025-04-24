# Time Input

A component for formatting time values using the BaseInput component with time picker mode.

## Usage

```vue
<script setup lang="ts">
import { BaseInput } from 'ts-inputs-vue'

const time = ref('')
</script>

<template>
  <BaseInput
    v-model="time"
    type="date"
    :date-options="{
      timePicker: true,
      is24: true,
      enableSeconds: true,
      format: 'HH:mm:ss',
    }"
    placeholder="Select time"
  />
</template>
```

## Time Picker Modes

### 12-hour Format

```vue
<template>
  <BaseInput
    v-model="time"
    type="date"
    :date-options="{
      timePicker: true,
      is24: false,
      format: 'HH:mm',
    }"
  />
</template>
```

### 24-hour Format

```vue
<template>
  <BaseInput
    v-model="time"
    type="date"
    :date-options="{
      timePicker: true,
      is24: true,
      format: 'HH:mm',
    }"
  />
</template>
```

### With Seconds

```vue
<template>
  <BaseInput
    v-model="time"
    type="date"
    :date-options="{
      timePicker: true,
      is24: true,
      enableSeconds: true,
      format: 'HH:mm:ss',
    }"
  />
</template>
```

### With Custom Increments

```vue
<template>
  <BaseInput
    v-model="time"
    type="date"
    :date-options="{
      timePicker: true,
      is24: true,
      hoursIncrement: 2,
      minutesIncrement: 15,
      secondsIncrement: 30,
    }"
  />
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | `''` | The v-model binding value |
| `type` | `'date'` | `'date'` | Must be set to 'date' for time picker |
| `className` | `string` | - | Additional CSS classes |
| `placeholder` | `string` | - | Input placeholder text |
| `dateOptions` | `object` | - | Time picker configuration options |

### Time Picker Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `timePicker` | `boolean` | `false` | Enable time picker mode |
| `is24` | `boolean` | `true` | Use 24-hour format |
| `enableSeconds` | `boolean` | `false` | Enable seconds selection |
| `enableMinutes` | `boolean` | `true` | Enable minutes selection |
| `format` | `string` | `'HH:mm'` | Time format string |
| `hoursIncrement` | `number` | `1` | Hours increment step |
| `minutesIncrement` | `number` | `1` | Minutes increment step |
| `secondsIncrement` | `number` | `1` | Seconds increment step |
| `hoursGridIncrement` | `number` | `1` | Hours grid increment step |
| `minutesGridIncrement` | `number` | `5` | Minutes grid increment step |
| `secondsGridIncrement` | `number` | `5` | Seconds grid increment step |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string` | Emitted when the time value changes |
| `blur` | `Event` | Emitted when the input loses focus |
| `time-picker-open` | - | Emitted when time picker opens |
| `time-picker-close` | - | Emitted when time picker closes |
| `am-pm-change` | - | Emitted when AM/PM changes (12h format only) |

## Demo

<TimeInputDemo />
