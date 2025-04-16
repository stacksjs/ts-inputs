<script setup lang="ts">
import type { TimeInputProps } from '../types'
import { computed } from 'vue'
import BaseInput from '../common/BaseInput.vue'
import { DefaultTimeDelimiter, formatTime } from '../time'

const props = withDefaults(defineProps<TimeInputProps>(), {
  format: '24',
  pattern: ['h', 'm', 's'],
  delimiter: DefaultTimeDelimiter,
  className: '',
  options: () => ({}),
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const formattedValue = computed({
  get: () => props.modelValue,
  set: (value: string) => {
    const formatted = formatTime(value, {
      format: props.format,
      pattern: props.pattern,
      delimiter: props.delimiter,
      ...props.options,
    })
    emit('update:modelValue', formatted)
  },
})
</script>

<template>
  <BaseInput
    v-bind="$attrs"
    v-model="formattedValue"
    :placeholder="pattern"
    :class="className"
  />
</template>
