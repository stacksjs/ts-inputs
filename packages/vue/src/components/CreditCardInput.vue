<script setup lang="ts">
import type { CreditCardType } from 'ts-inputs'
import type { CreditCardInputProps } from '../types'
import { DefaultCreditCardDelimiter, formatCreditCard, getCreditCardType } from 'ts-inputs'
import { computed, watch } from 'vue'
import BaseInput from './common/BaseInput.vue'

const props = withDefaults(defineProps<CreditCardInputProps>(), {
  delimiter: DefaultCreditCardDelimiter,
  className: '',
  options: () => ({}),
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'cardTypeChange', type: CreditCardType): void
}>()

const formattedValue = computed({
  get: () => props.modelValue,
  set: (value: string) => {
    const formatted = formatCreditCard(value, {
      delimiter: props.delimiter,
      ...props.options,
    })
    emit('update:modelValue', formatted)
  },
})

watch(formattedValue, (value) => {
  const cardType = getCreditCardType(value)
  emit('cardTypeChange', cardType)
}, { immediate: true })
</script>

<template>
  <BaseInput
    v-bind="$attrs"
    v-model="formattedValue"
    :placeholder="placeholder"
    :maxlength="19"
    :class="className"
  />
</template>
