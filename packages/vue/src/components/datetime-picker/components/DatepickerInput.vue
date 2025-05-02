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
  'setInputDate',
  'close',
  'selectDate',
  'setEmptyDate',
  'toggle',
  'focusPrev',
  'focus',
  'blur',
  'realBlur',
  'textInput',
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
  emit('setInputDate', null)
  if (props.clearable) {
    if (props.autoApply) {
      emit('setEmptyDate')
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

    emit('setInputDate', parsedDate.value)
  }
  else {
    handleOnEmptyInput()
  }
  textPasted.value = false
  emit('update:input-value', value)
  emit('textInput', event, parsedDate.value)
}

function handleEnter(ev: KeyboardEvent): void {
  if (defaultedTextInput.value.enabled) {
    parseInput((ev.target as HTMLInputElement).value)
    if (defaultedTextInput.value.enterSubmit && isValidDate(parsedDate.value) && props.inputValue !== '') {
      emit('setInputDate', parsedDate.value, true)
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
    emit('setInputDate', parsedDate.value, true, true)
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
  emit('realBlur')
  isFocused.value = false
  if (!props.isMenuOpen || (defaultedInline.value.enabled && defaultedInline.value.input)) {
    emit('blur')
  }
  if (props.autoApply && defaultedTextInput.value.enabled && parsedDate.value && !props.isMenuOpen) {
    emit('setInputDate', parsedDate.value)
    emit('selectDate')
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

function addEmit(event: string) {
  return () => $emit(event)
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
        :open-menu="addEmit('open')"
        :close-menu="addEmit('close')"
        :toggle-menu="addEmit('toggle')"
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

<style>
.dp__input_wrap {
  position: relative;
  width: 100%;
  box-sizing: unset;
}

.dp__input_wrap:focus {
  border-color: var(--dp-border-color-hover);
  outline: none;
}

.dp__input_valid {
  box-shadow: 0 0 var(--dp-border-radius) var(--dp-success-color);
  border-color: var(--dp-success-color);
}

.dp__input_valid:hover {
  border-color: var(--dp-success-color);
}

.dp__input_invalid {
  box-shadow: 0 0 var(--dp-border-radius) var(--dp-danger-color);
  border-color: var(--dp-danger-color);
}

.dp__input_invalid:hover {
  border-color: var(--dp-danger-color);
}

.dp__input {
  background-color: var(--dp-background-color);
  border-radius: var(--dp-border-radius);
  font-family: var(--dp-font-family);
  border: 1px solid var(--dp-border-color);
  outline: none;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 100%;
  font-size: var(--dp-font-size);
  line-height: calc(var(--dp-font-size) * 1.5);
  padding: var(--dp-input-padding);
  color: var(--dp-text-color);
  box-sizing: border-box;
}

.dp__input::placeholder {
  opacity: 0.7;
}

.dp__input:hover:not(.dp__input_focus) {
  border-color: var(--dp-border-color-hover);
}

.dp__input_reg {
  caret-color: transparent;
}

.dp__input_focus {
  border-color: var(--dp-border-color-focus);
}

.dp__disabled {
  background: var(--dp-disabled-color);
}

.dp__disabled::placeholder {
  color: var(--dp-disabled-color-text);
}

.dp__input_icons {
  display: inline-block;
  width: var(--dp-font-size);
  height: var(--dp-font-size);
  stroke-width: 0;
  font-size: var(--dp-font-size);
  line-height: calc(var(--dp-font-size) * 1.5);
  padding: 6px 12px;
  color: var(--dp-icon-color);
  box-sizing: content-box;
}

.dp__input_icon {
  cursor: pointer;
  position: absolute;
  top: 50%;
  inset-inline-start: 0;
  transform: translateY(-50%);
  color: var(--dp-icon-color);
}

.dp--clear-btn {
  position: absolute;
  top: 50%;
  inset-inline-end: 0;
  transform: translateY(-50%);
  cursor: pointer;
  color: var(--dp-icon-color);
  background: transparent;
  border: none;
  display: inline-flex;
  align-items: center;
  padding: 0;
  margin: 0;
}

.dp__input_icon_pad {
  padding-inline-start: var(--dp-input-icon-padding);
}
</style>
