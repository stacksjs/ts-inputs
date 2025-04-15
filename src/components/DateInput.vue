<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { formatDate, parseDate, validateDate } from '../utils/date'

export default defineComponent({
  name: 'DateInput',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    format: {
      type: String,
      default: 'YYYY-MM-DD',
    },
    locale: {
      type: String,
      default: 'en-US',
    },
    placeholder: {
      type: String,
      default: 'Enter date',
    },
  },
  emits: ['update:modelValue', 'error'],
  setup(props, { emit }) {
    const formattedValue = ref('')
    const error = ref('')

    const updateFormattedValue = (value: string) => {
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

    const handleInput = (event: Event) => {
      const target = event.target as HTMLInputElement
      formattedValue.value = target.value
    }

    const handleBlur = () => {
      const validation = validateDate(formattedValue.value, props.format, props.locale)
      if (validation.isValid) {
        emit('update:modelValue', formattedValue.value)
        error.value = ''
      }
      else {
        error.value = validation.error || 'Invalid date format'
        emit('error', error.value)
      }
    }

    return {
      formattedValue,
      error,
      handleInput,
      handleBlur,
    }
  },
})
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
