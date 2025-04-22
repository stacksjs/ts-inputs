<script lang="ts" setup>
import type { PropType } from 'vue'

import type { DynamicClass, InternalModuleValue } from '../interfaces'

import { isAfter } from 'date-fns'
import { computed, nextTick, ref } from 'vue'
import { CalendarIcon, CancelIcon } from '../components/Icons'

import { useDefaults, useValidation } from '../composables'
import { EventKey } from '../constants'
import { AllProps } from '../props'
import { assignDefaultTime, isValidDate, parseFreeInput } from '../utils/date-utils'
import { checkKeyDown, checkStopPropagation } from '../utils/util'

defineOptions({
  compatConfig: {
    MODE: 3,
  },
})

const props = defineProps({
  isMenuOpen: { type: Boolean as PropType<boolean>, default: false },
  inputValue: { type: String as PropType<string>, default: '' },
  ...AllProps,
})

const emit = defineEmits([
  'clear',
  'open',
  'update:input-value',
  'set-input-date',
  'close',
  'select-date',
  'set-empty-date',
  'toggle',
  'focus-prev',
  'focus',
  'blur',
  'real-blur',
  'text-input',
])

const {
  defaultedTextInput,
  defaultedAriaLabels,
  defaultedInline,
  defaultedConfig,
  defaultedRange,
  defaultedMultiDates,
  defaultedUI,
  getDefaultPattern,
  getDefaultStartTime,
} = useDefaults(props)

const { checkMinMaxRange } = useValidation(props)

const parsedDate = ref()
const inputRef = ref<HTMLInputElement | null>(null)
const isFocused = ref(false)
const textPasted = ref(false)

const inputClass = computed(
  (): DynamicClass => ({
    dp__pointer: !props.disabled && !props.readonly && !defaultedTextInput.value.enabled,
    dp__disabled: props.disabled,
    dp__input_readonly: !defaultedTextInput.value.enabled,
    dp__input: true,
    dp__input_icon_pad: !props.hideInputIcon,
    dp__input_valid: typeof props.state === 'boolean' ? props.state : false,
    dp__input_invalid: typeof props.state === 'boolean' ? !props.state : false,
    dp__input_focus: isFocused.value || props.isMenuOpen,
    dp__input_reg: !defaultedTextInput.value.enabled,
    ...(defaultedUI.value.input ?? {}),
  }),
)

function handleOnEmptyInput() {
  emit('set-input-date', null)
  if (props.clearable) {
    if (props.autoApply) {
      emit('set-empty-date')
      parsedDate.value = null
    }
  }
}

function parser(value: string): Date | null {
  const defaultTime = getDefaultStartTime()
  return parseFreeInput(
    value,
    defaultedTextInput.value.format ?? getDefaultPattern(),
    defaultTime ?? assignDefaultTime({}, props.enableSeconds),
    props.inputValue,
    textPasted.value,
    props.formatLocale,
  )
}

function handleRangeTextInput(value: string) {
  const { rangeSeparator } = defaultedTextInput.value
  const [dateOne, dateTwo] = value.split(`${rangeSeparator}`)

  if (dateOne) {
    const parsedDateOne = parser(dateOne.trim())
    const parsedDateTwo = dateTwo ? parser(dateTwo.trim()) : undefined
    if (isAfter(parsedDateOne as Date, parsedDateTwo as Date))
      return

    const parsedArr = parsedDateOne && parsedDateTwo ? [parsedDateOne, parsedDateTwo] : [parsedDateOne]
    if (checkMinMaxRange(parsedDateTwo as Date, parsedArr as InternalModuleValue, 0)) {
      parsedDate.value = parsedDateOne ? parsedArr : null
    }
  }
}

function handlePaste(): void {
  textPasted.value = true
}

function parseInput(value: string) {
  if (defaultedRange.value.enabled) {
    handleRangeTextInput(value)
  }
  else if (defaultedMultiDates.value.enabled) {
    const dates = value.split(`;`)
    parsedDate.value = dates.map(val => parser(val.trim())).filter(val => val)
  }
  else {
    parsedDate.value = parser(value)
  }
}

function handleInput(event: Event | string): void {
  const value = typeof event === 'string' ? event : (event.target as HTMLInputElement)?.value

  if (value !== '') {
    if (defaultedTextInput.value.openMenu && !props.isMenuOpen) {
      emit('open')
    }
    parseInput(value)

    emit('set-input-date', parsedDate.value)
  }
  else {
    handleOnEmptyInput()
  }
  textPasted.value = false
  emit('update:input-value', value)
  emit('text-input', event, parsedDate.value)
}

function handleEnter(ev: KeyboardEvent): void {
  if (defaultedTextInput.value.enabled) {
    parseInput((ev.target as HTMLInputElement).value)
    if (defaultedTextInput.value.enterSubmit && isValidDate(parsedDate.value) && props.inputValue !== '') {
      emit('set-input-date', parsedDate.value, true)
      parsedDate.value = null
    }
    else if (defaultedTextInput.value.enterSubmit && props.inputValue === '') {
      parsedDate.value = null
      emit('clear')
    }
  }
  else {
    handleOpen(ev)
  }
}

function handleTab(ev: KeyboardEvent, noParse?: boolean): void {
  if (defaultedTextInput.value.enabled && defaultedTextInput.value.tabSubmit && !noParse) {
    parseInput((ev.target as HTMLInputElement).value)
  }

  if (defaultedTextInput.value.tabSubmit && isValidDate(parsedDate.value) && props.inputValue !== '') {
    emit('set-input-date', parsedDate.value, true, true)
    parsedDate.value = null
  }
  else if (defaultedTextInput.value.tabSubmit && props.inputValue === '') {
    parsedDate.value = null
    emit('clear', true)
  }
}

function handleFocus(): void {
  isFocused.value = true
  emit('focus')
  nextTick().then(() => {
    if (defaultedTextInput.value.enabled && defaultedTextInput.value.selectOnFocus) {
      inputRef.value?.select()
    }
  })
}

function handleOpen(ev: KeyboardEvent | MouseEvent) {
  checkStopPropagation(ev, defaultedConfig.value, true)
  if (defaultedTextInput.value.enabled && defaultedTextInput.value.openMenu && !defaultedInline.value.input) {
    if (defaultedTextInput.value.openMenu === 'open' && !props.isMenuOpen)
      return emit('open')
    if (defaultedTextInput.value.openMenu === 'toggle')
      return emit('toggle')
  }
  else if (!defaultedTextInput.value.enabled) {
    emit('toggle')
  }
}

function handleBlur(): void {
  emit('real-blur')
  isFocused.value = false
  if (!props.isMenuOpen || (defaultedInline.value.enabled && defaultedInline.value.input)) {
    emit('blur')
  }
  if (props.autoApply && defaultedTextInput.value.enabled && parsedDate.value && !props.isMenuOpen) {
    emit('set-input-date', parsedDate.value)
    emit('select-date')
    parsedDate.value = null
  }
}

function onClear(ev?: Event) {
  checkStopPropagation(ev, defaultedConfig.value, true)
  emit('clear')
}

function handleEsc() {
  emit('close')
}

function handleKeyPress(ev: KeyboardEvent): void {
  if (ev.key === 'Tab') {
    handleTab(ev)
  }
  if (ev.key === 'Enter') {
    handleEnter(ev)
  }
  if (ev.key === 'Escape' && defaultedTextInput.value.escClose) {
    handleEsc()
  }
  if (!defaultedTextInput.value.enabled) {
    if (ev.code === 'Tab')
      return
    ev.preventDefault()
  }
}

function focusInput() {
  inputRef.value?.focus({ preventScroll: true })
}

function setParsedDate(date: Date | null) {
  parsedDate.value = date
}

function onClearKeydown(event: KeyboardEvent) {
  if (event.key === EventKey.tab) {
    handleTab(event, true)
  }
}

defineExpose({
  focusInput,
  setParsedDate,
})
</script>

<template>
  <div @click="handleOpen">
    <slot v-if="$slots.trigger && !$slots['dp-input'] && !defaultedInline.enabled" name="trigger" />
    <div v-if="!$slots.trigger && (!defaultedInline.enabled || defaultedInline.input)" class="dp__input_wrap">
      <slot
        v-if="
          $slots['dp-input']
            && !$slots.trigger
            && (!defaultedInline.enabled || (defaultedInline.enabled && defaultedInline.input))
        "
        name="dp-input"
        :value="inputValue"
        :is-menu-open="isMenuOpen"
        :on-input="handleInput"
        :on-enter="handleEnter"
        :on-tab="handleTab"
        :on-clear="onClear"
        :on-blur="handleBlur"
        :on-keypress="handleKeyPress"
        :on-paste="handlePaste"
        :on-focus="handleFocus"
        :open-menu="() => $emit('open')"
        :close-menu="() => $emit('close')"
        :toggle-menu="() => $emit('toggle')"
      />
      <input
        v-if="!$slots['dp-input']"
        :id="uid ? `dp-input-${uid}` : undefined"
        ref="inputRef"
        data-test-id="dp-input"
        :name="name"
        :class="inputClass"
        :inputmode="defaultedTextInput.enabled ? 'text' : 'none'"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :value="inputValue"
        :autocomplete="autocomplete"
        :aria-label="defaultedAriaLabels?.input"
        :aria-disabled="disabled || undefined"
        :aria-invalid="state === false ? true : undefined"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
        @keypress="handleKeyPress"
        @keydown="handleKeyPress($event)"
        @paste="handlePaste"
      >
      <div @click="emit('toggle')">
        <span v-if="$slots['input-icon'] && !hideInputIcon" class="dp__input_icon" @click="emit('toggle')"><slot name="input-icon" /></span>
        <CalendarIcon
          v-if="!$slots['input-icon'] && !hideInputIcon && !$slots['dp-input']"
          :aria-label="defaultedAriaLabels?.calendarIcon"
          class="dp__input_icon dp__input_icons"
          @click="emit('toggle')"
        />
      </div>
      <span
        v-if="$slots['clear-icon'] && (alwaysClearable || (inputValue && clearable && !disabled && !readonly))"
        class="dp--clear-btn"
      ><slot name="clear-icon" :clear="onClear" /></span>
      <button
        v-if="!$slots['clear-icon'] && (alwaysClearable || (clearable && inputValue && !disabled && !readonly))"
        :aria-label="defaultedAriaLabels?.clearInput"
        class="dp--clear-btn"
        type="button"
        @keydown="checkKeyDown($event, () => onClear($event), true, onClearKeydown)"
        @click.prevent="onClear($event)"
      >
        <CancelIcon class="dp__input_icons" data-test-id="clear-icon" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.dp__input_wrap {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;
  background-color: var(--dp-input-bg);
  border: 1px solid var(--dp-input-border);
  border-radius: var(--dp-border-radius);
  transition: var(--dp-common-transition);
}

.dp__input_wrap:hover {
  border-color: var(--dp-input-border-hover);
}

.dp__input_wrap:focus-within {
  border-color: var(--dp-input-border-focus);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.dp__input {
  width: 100%;
  padding: var(--dp-input-padding);
  font-size: var(--dp-font-size);
  color: var(--dp-text-color);
  background-color: transparent;
  border: none;
  outline: none;
  transition: var(--dp-common-transition);
}

.dp__input::placeholder {
  color: var(--dp-placeholder-color);
}

.dp__input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.dp__input_readonly {
  cursor: default;
}

.dp__input_icon {
  position: absolute;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--dp-input-icon-size);
  height: 100%;
  padding: 0 0.5rem;
  color: var(--dp-icon-color);
  cursor: pointer;
  transition: var(--dp-common-transition);
}

.dp__input_icon:hover {
  color: var(--dp-hover-icon-color);
}

.dp__input_icon_pad {
  padding-right: var(--dp-input-icon-size);
}

.dp__input_valid {
  border-color: var(--dp-success-color);
}

.dp__input_invalid {
  border-color: var(--dp-danger-color);
}

.dp__input_focus {
  border-color: var(--dp-input-border-focus);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.dp__input_reg {
  cursor: pointer;
}

.dp__pointer {
  cursor: pointer;
}

.dp__disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.dp--clear-btn {
  position: absolute;
  right: var(--dp-input-icon-size);
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--dp-input-icon-size);
  height: 100%;
  padding: 0 0.5rem;
  color: var(--dp-icon-color);
  cursor: pointer;
  transition: var(--dp-common-transition);
}

.dp--clear-btn:hover {
  color: var(--dp-hover-icon-color);
}

.dp__input_icons {
  width: var(--dp-input-icon-size);
  height: var(--dp-input-icon-size);
}
</style>
