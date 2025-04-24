# DateTime Input

A component for formatting dates using the BaseInput component with date picker mode.

## Usage

```vue
<script setup lang="ts">
import { BaseInput } from 'ts-inputs-vue'

const date = ref('')
</script>

<template>
  <BaseInput
    v-model="date"
    type="date"
    :date-options="{
      format: 'yyyy-MM-dd',
      autoApply: true,
    }"
    placeholder="Select date"
  />
</template>
```

## Date Picker Modes

### Range Picker

```vue
<template>
  <BaseInput
    v-model="dateRange"
    type="date"
    :date-options="{
      range: true,
      format: 'yyyy-MM-dd',
      autoApply: true,
    }"
  />
</template>
```

### Month Picker

```vue
<template>
  <BaseInput
    v-model="month"
    type="date"
    :date-options="{
      monthPicker: true,
      format: 'MMMM yyyy',
    }"
  />
</template>
```

### Year Picker

```vue
<BaseInput
  v-model="year"
  type="date"
  :date-options="{
    yearPicker: true,
    format: 'yyyy',
  }"
/>
```

### Week Picker

```vue
<BaseInput
  v-model="week"
  type="date"
  :date-options="{
    weekPicker: true,
  }"
/>
```

### Quarter Picker

```vue
<BaseInput
  v-model="quarter"
  type="date"
  :date-options="{
    quarterPicker: true,
    format: 'QQQ yyyy',
  }"
/>
```

### Multi Dates

```vue
<BaseInput
  v-model="dates"
  type="date"
  :date-options="{
    multiDates: true,
    format: 'yyyy-MM-dd',
  }"
/>
```

### With Flow Steps

```vue
<script setup lang="ts">
import { BaseInput } from 'ts-inputs-vue'

const flow = ['month', 'year', 'calendar']
</script>

<template>
  <BaseInput
    v-model="date"
    type="date"
    :date-options="{
      flow,
      format: 'yyyy-MM-dd',
    }"
  />
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | `''` | The v-model binding value |
| `type` | `'date'` | `'date'` | Must be set to 'date' for date picker |
| `className` | `string` | - | Additional CSS classes |
| `placeholder` | `string` | - | Input placeholder text |
| `dateOptions` | `object` | - | Date picker configuration options |

### Date Picker Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `format` | `string` | `'yyyy-MM-dd'` | Date format string |
| `formatLocale` | `Locale` | - | Locale for date formatting |
| `minDate` | `Date \| string` | - | Minimum selectable date |
| `maxDate` | `Date \| string` | - | Maximum selectable date |
| `autoApply` | `boolean` | `false` | Auto apply selection |
| `range` | `boolean` | `false` | Enable range selection |
| `monthPicker` | `boolean` | `false` | Enable month picker mode |
| `yearPicker` | `boolean` | `false` | Enable year picker mode |
| `weekPicker` | `boolean` | `false` | Enable week picker mode |
| `quarterPicker` | `boolean` | `false` | Enable quarter picker mode |
| `multiDates` | `boolean` | `false` | Enable multiple date selection |
| `multiCalendars` | `boolean` | `false` | Show multiple calendars |
| `inline` | `boolean` | `false` | Show calendar inline |
| `textInput` | `boolean` | `false` | Enable text input |
| `flow` | `string[]` | `[]` | Define selection order |
| `weekStart` | `number` | `1` | First day of week (1-7) |
| `monthNameFormat` | `'long' \| 'short'` | `'short'` | Month name format |
| `disabledDates` | `Date[] \| function` | `[]` | Disabled dates |
| `dark` | `boolean` | `false` | Dark mode |
| `position` | `string` | `'center'` | Calendar position |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string` | Emitted when the date value changes |
| `blur` | `Event` | Emitted when the input loses focus |
| `closed` | - | Emitted when picker closes |
| `open` | - | Emitted when picker opens |
| `date-update` | - | Emitted when date is updated |
| `invalid-date` | - | Emitted when invalid date is entered |
| `range-start` | - | Emitted when range selection starts |
| `range-end` | - | Emitted when range selection ends |

## Demo

<DateInputDemo />
