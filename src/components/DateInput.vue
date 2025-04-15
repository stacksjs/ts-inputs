<script setup lang="ts">
import type { DatePatternType, FormatDateOptions } from '../date'
import { computed } from 'vue'
import BaseInput from '../common/BaseInput.vue'
import { DefaultDateDelimiter, formatDate } from '../date'

interface Props {
  modelValue: string
  pattern?: DatePatternType
  delimiter?: string
  className?: string
  options?: Omit<FormatDateOptions, 'pattern' | 'delimiter'>
}

const props = withDefaults(defineProps<Props>(), {
  pattern: ['d', 'm', 'Y'],
  delimiter: DefaultDateDelimiter,
  className: '',
  options: () => ({}),
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const formattedValue = computed({
  get: () => props.modelValue,
  set: (value: string) => {
    const formatted = formatDate(value, {
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
