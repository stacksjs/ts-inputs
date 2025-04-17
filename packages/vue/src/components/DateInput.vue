<script lang="ts" setup>
import type { DateValidationResult } from 'ts-inputs'
import type { DateInputProps } from '../types'
import { formatDate, parseDate, validateDate } from 'ts-inputs'
import { ref, watch } from 'vue'

const props = withDefaults(defineProps<DateInputProps>(), {
  format: 'YYYY-MM-DD',
  locale: 'en-US',
  placeholder: 'Enter date',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'error', error: string): void
}>()

const formattedValue = ref('')
const error = ref('')

function updateFormattedValue(value: string): void {
  if (!value) {
    formattedValue.value = ''
    return
  }

  try {
    const date = parseDate(value, props.format, props.locale)
    formattedValue.value = formatDate(date, props.format, props.locale)
    error.value = ''
  }
  catch (e) {
    error.value = e instanceof Error ? e.message : 'Invalid date format'
    emit('error', error.value)
  }
}

watch(() => props.modelValue, (newValue) => {
  updateFormattedValue(newValue)
}, { immediate: true })

function handleInput(event: Event): void {
  const target = event.target as HTMLInputElement
  formattedValue.value = target.value
}

function handleBlur(): void {
  const validation: DateValidationResult = validateDate(formattedValue.value, props.format, props.locale)
  if (validation.isValid) {
    emit('update:modelValue', formattedValue.value)
    error.value = ''
  }
  else {
    error.value = validation.error || 'Invalid date format'
    emit('error', error.value)
  }
}
</script>

<template>
  <div class="date-input">
    <input
      type="text"
      :value="formattedValue"
      :class="{ error }"
      :placeholder="placeholder"
      @input="handleInput"
      @blur="handleBlur"
    >
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<style scoped>
.date-input {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

input.error {
  border-color: #ff4444;
}

.error-message {
  color: #ff4444;
  font-size: 12px;
}
</style>
