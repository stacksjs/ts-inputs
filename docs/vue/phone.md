# Phone Input

A powerful component for formatting and validating phone numbers with international support. The component automatically formats phone numbers as you type and supports various international formats.

## Features

- Automatic formatting as you type
- Support for multiple international formats
- Region-based formatting
- Customizable delimiters and patterns
- Error handling for invalid input
- Clean internal storage of digits
- Validation and formatting options
- Responsive design with Tailwind CSS
- Integration with BaseInput component

## Basic Usage

### Using PhoneInput Component

```vue
<script setup lang="ts">
import { PhoneInput } from 'ts-inputs-vue'
import { ref } from 'vue'

const phone = ref('')
</script>

<template>
  <PhoneInput
    v-model="phone"
    region="US"
    placeholder="Enter phone number"
  />
</template>
```

### Using BaseInput Component

```vue
<script setup lang="ts">
import { BaseInput } from 'ts-inputs-vue'
import { ref } from 'vue'

const phone = ref('')
</script>

<template>
  <BaseInput
    v-model="phone"
    type="phone"
    :phone-options="{
      region: 'US',
      delimiter: '-',
      includeCountryCode: false,
      format: 'national',
    }"
    placeholder="Enter phone number"
  />
</template>
```

## Demo

<PhoneInputDemo />

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | `''` | The v-model binding value |
| `region` | `string` | `'US'` | Region code for phone formatting (e.g., 'US', 'GB', 'FR') |
| `delimiter` | `string` | `'-'` | Character used to separate phone number groups |
| `pattern` | `number[]` | - | Array of numbers defining the group sizes (overrides region pattern) |
| `includeCountryCode` | `boolean` | `false` | Whether to include country code in the output |
| `format` | `'national' \| 'international'` | `'national'` | Format style (national or international) |
| `placeholder` | `string` | `''` | Input placeholder text |
| `disabled` | `boolean` | `false` | Whether the input is disabled |
| `readonly` | `boolean` | `false` | Whether the input is readonly |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string` | Emitted when the input value changes |
| `focus` | `Event` | Emitted when the input receives focus |
| `blur` | `Event` | Emitted when the input loses focus |
| `invalidPhone` | - | Emitted when the input value is invalid |

## Examples

### Basic Usage

```vue
<PhoneInput
  v-model="phone"
  region="US"
  placeholder="Enter phone number"
/>
```

### International Format

```vue
<PhoneInput
  v-model="phone"
  region="US"
  include-country-code
  format="international"
  placeholder="Enter phone number"
/>
```

### Custom Delimiter

```vue
<PhoneInput
  v-model="phone"
  region="US"
  delimiter="."
  placeholder="Enter phone number"
/>
```

### Region-based Formats

#### US Format

```vue
<PhoneInput
  v-model="phone"
  region="US"
  placeholder="Enter US phone number"
/>
```

#### UK Format

```vue
<PhoneInput
  v-model="phone"
  region="GB"
  placeholder="Enter UK phone number"
/>
```

#### French Format

```vue
<PhoneInput
  v-model="phone"
  region="FR"
  placeholder="Enter French phone number"
/>
```

#### German Format

```vue
<PhoneInput
  v-model="phone"
  region="DE"
  placeholder="Enter German phone number"
/>
```

### Disabled State

```vue
<PhoneInput
  v-model="phone"
  region="US"
  disabled
  placeholder="Disabled phone input"
/>
```

### Readonly State

```vue
<PhoneInput
  v-model="phone"
  region="US"
  readonly
  placeholder="Readonly phone input"
/>
```

## Advanced Usage

### Dynamic Region Switching

```vue
<script setup lang="ts">
import { PhoneInput } from 'ts-inputs-vue'
import { ref } from 'vue'

const phone = ref('')
const region = ref('US')
</script>

<template>
  <select v-model="region">
    <option value="US">
      United States
    </option>
    <option value="GB">
      United Kingdom
    </option>
    <option value="FR">
      France
    </option>
    <option value="DE">
      Germany
    </option>
  </select>

  <PhoneInput
    v-model="phone"
    :region="region"
    placeholder="Enter phone number"
  />
</template>
```

### Custom Pattern

```vue
<script setup lang="ts">
import { PhoneInput } from 'ts-inputs-vue'
import { ref } from 'vue'

const phone = ref('')
const customPattern = [4, 2, 3, 2] // Custom pattern: XXXX-XX-XXX-XX
</script>

<template>
  <PhoneInput
    v-model="phone"
    :pattern="customPattern"
    placeholder="Enter custom formatted number"
  />
</template>
```

### Using BaseInput with Phone Options

```vue
<script setup lang="ts">
import { BaseInput } from 'ts-inputs-vue'
import { ref } from 'vue'

const phone = ref('')
const phoneOptions = ref({
  region: 'US',
  delimiter: '-',
  includeCountryCode: false,
  format: 'national'
})
</script>

<template>
  <BaseInput
    v-model="phone"
    type="phone"
    :phone-options="phoneOptions"
    placeholder="Enter phone number"
  />
</template>
```

## Notes

- The component automatically formats phone numbers as you type
- Invalid input is handled gracefully with error messages
- The region prop defines the default formatting pattern
- The pattern prop can override the region's default pattern
- The component supports various international phone number formats
- The input is always stored as a clean string of digits internally
- The component is fully responsive and works well on mobile devices
- Error messages are displayed below the input when validation fails
- The component supports both controlled and uncontrolled usage
- All props are reactive and can be changed dynamically

## Best Practices

1. Always provide a meaningful placeholder text
2. Use appropriate region for the target audience
3. Consider using dynamic region selection for international applications
4. Handle validation errors appropriately
5. Use the disabled state for read-only scenarios
6. Consider accessibility when implementing the component
7. Test with various input patterns and edge cases
8. Use BaseInput for consistent styling with other input types
9. Consider using international format for global applications
10. Store phone numbers in unformatted form in your data model
