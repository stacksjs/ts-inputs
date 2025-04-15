<script setup lang="ts">
import type { CursorTrackerDestructor } from '../cursor-tracker'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { registerCursorTracker } from '../cursor-tracker'

interface Props {
  modelValue: string
  className?: string
  placeholder?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  className: '',
  placeholder: '',
  disabled: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'blur', event: Event): void
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const cursorTrackerRef = ref<CursorTrackerDestructor | null>(null)

function setInputRef(el: HTMLInputElement | null) {
  inputRef.value = el
}

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

function onBlur(event: Event) {
  emit('blur', event)
}

onMounted(() => {
  if (inputRef.value) {
    cursorTrackerRef.value = registerCursorTracker({
      input: inputRef.value,
      value: props.modelValue,
      onChange: value => emit('update:modelValue', value),
    })
  }
})

onBeforeUnmount(() => {
  if (cursorTrackerRef.value) {
    cursorTrackerRef.value()
  }
})
</script>

<template>
  <input
    :ref="setInputRef"
    :value="modelValue"
    class="base-input" :class="[className]"
    :placeholder="placeholder"
    :disabled="disabled"
    v-bind="$attrs"
    @input="handleInput"
    @blur="onBlur"
  >
</template>
