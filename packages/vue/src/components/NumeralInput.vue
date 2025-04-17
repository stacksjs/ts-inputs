<script setup lang="ts">
import type { NumeralInputProps } from '../types'
import { DefaultNumeralDelimiter, formatNumeral, NumeralThousandGroupStyles } from 'ts-inputs'
import { computed } from 'vue'
import BaseInput from './common/BaseInput.vue'

const props = withDefaults(defineProps<NumeralInputProps>(), {
  delimiter: DefaultNumeralDelimiter,
  thousandGroupStyle: NumeralThousandGroupStyles.THOUSAND,
  className: '',
  options: () => ({}),
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const formattedValue = computed({
  get: () => props.modelValue,
  set: (value: string) => {
    const formatted = formatNumeral(value, {
      delimiter: props.delimiter,
      thousandGroupStyle: props.thousandGroupStyle,
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
    placeholder="1,234,567.89"
    :class="className"
  />
</template>
