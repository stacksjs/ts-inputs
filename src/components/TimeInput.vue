<script setup lang="ts">
import type { FormatTimeOptions, TimeFormatType, TimePatternType } from '../time/types'
import { computed } from 'vue'
import BaseInput from '../common/BaseInput.vue'
import { DefaultTimeDelimiter, formatTime } from '../time'

interface Props {
  modelValue: string
  format?: TimeFormatType
  pattern?: TimePatternType
  delimiter?: string
  className?: string
  options?: Omit<FormatTimeOptions, 'format' | 'pattern' | 'delimiter'>
}

const props = withDefaults(defineProps<Props>(), {
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
