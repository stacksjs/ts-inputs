<script setup lang="ts">
import { formatPhone, unformatPhone } from 'ts-inputs'
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  delimiter?: string
  pattern?: number[]
  region?: string
  includeCountryCode?: boolean
  format?: 'national' | 'international'
}>(), {
  placeholder: '',
  disabled: false,
  readonly: false,
  delimiter: '-',
  pattern: undefined,
  region: 'US',
  includeCountryCode: false,
  format: 'national',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'focus'): void
  (e: 'blur'): void
}>()

const input = ref<HTMLInputElement | null>(null)
const error = ref<string>('')

const formatOptions = computed(() => ({
  delimiter: props.delimiter,
  pattern: props.pattern,
  region: props.region,
  includeCountryCode: props.includeCountryCode,
  format: props.format,
}))

const formattedValue = computed(() => {
  try {
    return formatPhone(props.modelValue, formatOptions.value)
  }
  catch {
    return props.modelValue
  }
})

const errorMessage = computed(() => {
  try {
    formatPhone(props.modelValue, formatOptions.value)
    return ''
  }
  catch (err) {
    return err instanceof Error ? err.message : 'Invalid phone format'
  }
})

function handleInput(event: Event): void {
  const target = event.target as HTMLInputElement
  const unformatted = unformatPhone(target.value)
  emit('update:modelValue', unformatted)
  error.value = ''
}

function handleFocus(): void {
  emit('focus')
}

function handleBlur(): void {
  emit('blur')
}

// Expose methods
defineExpose({
  focus: (): void => input.value?.focus(),
  blur: (): void => input.value?.blur(),
})
</script>

<template>
  <div class="phone-input">
    <input
      ref="input"
      :value="formattedValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :class="{ 'is-invalid': errorMessage }"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
    >
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
  </div>
</template>

<style scoped>
.phone-input {
  position: relative;
  width: 100%;
}

input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
}

input:focus {
  outline: none;
  border-color: #007bff;
}

input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

input.is-invalid {
  border-color: #dc3545;
}

.error-message {
  color: #dc3545;
  font-size: 12px;
  margin-top: 4px;
}
</style>
