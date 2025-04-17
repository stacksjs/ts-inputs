<script setup lang="ts">
import type { CursorTrackerDestructor } from 'ts-inputs'
import { registerCursorTracker } from 'ts-inputs'
import { defineExpose, onBeforeUnmount, onMounted, ref } from 'vue'

interface Props {
  modelValue: string
  className?: string
  placeholder?: string
  disabled?: boolean
  error?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  className: '',
  placeholder: '',
  disabled: false,
  error: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'blur', event: Event): void
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const cursorTrackerRef = ref<CursorTrackerDestructor | null>(null)

defineExpose({ inputElement: inputRef })

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
    class="base-input" :class="[
      {
        'base-input--error': error,
        'base-input--disabled': disabled,
      },
    ]"
    :placeholder="placeholder"
    :disabled="disabled"
    v-bind="$attrs"
    @input="handleInput"
    @blur="onBlur"
  >
</template>

<style>
.base-input {
  display: block;
  width: 100%;
  padding: 0.375rem 0.75rem;
  background-color: white;
  border-radius: 0.375rem;
  font-size: 1rem;
  line-height: 1.5;
  color: rgb(17 24 39);
  outline: 1px solid rgb(209 213 219);
  outline-offset: -1px;
}

.base-input::placeholder {
  color: rgb(156 163 175);
}

.base-input:focus {
  outline: 2px solid rgb(79 70 229);
  outline-offset: -2px;
}

@media (min-width: 640px) {
  .base-input {
    font-size: 0.875rem;
    line-height: 1.5;
  }
}

.base-input--error {
  outline-color: rgb(239 68 68);
}

.base-input--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
