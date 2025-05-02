<script setup lang="ts">
import { formatNumeral, unformatNumeral } from 'ts-inputs'
import { computed, ref } from 'vue'

interface FormatNumeralOptions {
  delimiter?: string
  numeralThousandsGroupStyle?: string
  numeralIntegerScale?: number
  numeralDecimalMark?: string
  numeralDecimalScale?: number
  stripLeadingZeroes?: boolean
  numeralPositiveOnly?: boolean
  tailPrefix?: boolean
  signBeforePrefix?: boolean
  prefix?: string
}

const props = withDefaults(defineProps<{
  modelValue: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  delimiter?: string
  thousandGroupStyle?: string
  integerScale?: number
  decimalMark?: string
  decimalScale?: number
  stripLeadingZeroes?: boolean
  positiveOnly?: boolean
  tailPrefix?: boolean
  signBeforePrefix?: boolean
  prefix?: string
}>(), {
  placeholder: '',
  disabled: false,
  readonly: false,
  delimiter: ',',
  thousandGroupStyle: 'thousand',
  integerScale: 0,
  decimalMark: '.',
  decimalScale: 2,
  stripLeadingZeroes: true,
  positiveOnly: false,
  tailPrefix: false,
  signBeforePrefix: false,
  prefix: '',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'focus'): void
  (e: 'blur'): void
}>()

const input = ref<HTMLInputElement | null>(null)
const error = ref<string>('')

const formatOptions = computed<FormatNumeralOptions>(() => ({
  delimiter: props.delimiter,
  numeralThousandsGroupStyle: props.thousandGroupStyle,
  numeralIntegerScale: props.integerScale,
  numeralDecimalMark: props.decimalMark,
  numeralDecimalScale: props.decimalScale,
  stripLeadingZeroes: props.stripLeadingZeroes,
  numeralPositiveOnly: props.positiveOnly,
  tailPrefix: props.tailPrefix,
  signBeforePrefix: props.signBeforePrefix,
  prefix: props.prefix,
}))

const formattedValue = computed<string>(() => {
  try {
    return formatNumeral(props.modelValue, formatOptions.value)
  }
  catch (err) {
    error.value = err instanceof Error ? err.message : 'Invalid number format'
    return props.modelValue
  }
})

function handleInput(event: Event): void {
  const target = event.target as HTMLInputElement
  const unformatted = unformatNumeral(target.value, {
    numeralDecimalMark: props.decimalMark,
  })
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
  <div class="numeral-input">
    <input
      ref="input"
      :value="formattedValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :class="{ 'is-invalid': error }"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
    >
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<style scoped>
.numeral-input {
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
