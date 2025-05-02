<script lang="ts" setup>
import type {
  DatepickerInputRef,
  DatepickerMenuRef,
  DynamicClass,
  MaybeElementRef,
  MenuView,
  ModelValue,
  MonthYearOpt,
} from './interfaces'

import {
  computed,
  getCurrentInstance,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  Teleport as TeleportCmp,
  toRef,
  useSlots,
  watch,
} from 'vue'
import DatepickerInput from './components/DatepickerInput.vue'

import DatepickerMenu from './components/DatepickerMenu.vue'
import {
  mapSlots,
  useArrowNavigation,
  useExternalInternalMapper,
  usePosition,
  useState,
  useTransitions,
  useValidation,
} from './composables'
import { useDefaults } from './composables/defaults'
import { useResponsive } from './composables/responsive'

import { onClickOutside } from './directives/clickOutside'
import { AllProps } from './props'
import { findNextFocusableElement, getNumVal } from './utils/util'

defineOptions({
  compatConfig: {
    MODE: 3,
  },
})

const props = defineProps({
  ...AllProps,
})

const emit = defineEmits([
  'update:model-value',
  'update:model-timezone-value',
  'textSubmit',
  'closed',
  'cleared',
  'open',
  'focus',
  'blur',
  'internalModelChange',
  'recalculatePosition',
  'flowStep',
  'updateMonthYear',
  'invalidSelect',
  'invalidFixedRange',
  'tooltipOpen',
  'tooltipClose',
  'timePickerOpen',
  'timePickerClose',
  'amPmChange',
  'rangeStart',
  'rangeEnd',
  'dateUpdate',
  'invalidDate',
  'overlayToggle',
  'textInput',
])

const slots = useSlots()
const isOpen = ref(false)
const modelValueRef = toRef(props, 'modelValue')
const timezoneRef = toRef(props, 'timezone')
const dpWrapMenuRef = ref<HTMLElement | null>(null)
const dpMenuRef = ref<DatepickerMenuRef | null>(null)
const inputRef = ref<DatepickerInputRef | null>(null)
const isInputFocused = ref(false)
const pickerWrapperRef = ref<HTMLElement | null>(null)
const shouldFocusNext = ref(false)
const shiftKeyActive = ref(false)
const collapse = ref(false)
const isTextInputDate = ref(false)

const { setMenuFocused, setShiftKey } = useState()
const { clearArrowNav } = useArrowNavigation()
const { validateDate, isValidTime } = useValidation(props)
const {
  defaultedTransitions,
  defaultedTextInput,
  defaultedInline,
  defaultedConfig,
  defaultedRange,
  defaultedMultiDates,
} = useDefaults(props)
const { menuTransition, showTransition } = useTransitions(defaultedTransitions)
const { isMobile } = useResponsive(defaultedConfig)

const currentInstance = getCurrentInstance()

const { openOnTop, menuStyle, xCorrect, setMenuPosition, getScrollableParent, shadowRender } = usePosition({
  menuRef: dpWrapMenuRef,
  menuRefInner: dpMenuRef,
  inputRef,
  pickerWrapperRef,
  inline: defaultedInline,
  emit,
  props,
  slots,
})

const {
  inputValue,
  internalModelValue,
  parseExternalModelValue,
  emitModelValue,
  formatInputValue,
  checkBeforeEmit,
} = useExternalInternalMapper(emit, props, isInputFocused)

const wrapperClass = computed(
  (): DynamicClass => ({
    'dp__main': true,
    'dp__theme_dark': props.dark,
    'dp__theme_light': !props.dark,
    'dp__flex_display': defaultedInline.value.enabled,
    'dp--flex-display-collapsed': collapse.value,
    'dp__flex_display_with_input': defaultedInline.value.input,
  }),
)

const theme = computed(() => (props.dark ? 'dp__theme_dark' : 'dp__theme_light'))
const teleportProps = computed(() => {
  return props.teleport
    ? {
        to: typeof props.teleport === 'boolean' ? 'body' : props.teleport,
        disabled: !props.teleport || defaultedInline.value.enabled,
      }
    : {}
})
const menuWrapProps = computed(() => {
  return { class: 'dp__outer_menu_wrap' }
})

const noOverlayFocus = computed(() => {
  return (
    defaultedInline.value.enabled
    && (props.timePicker || props.monthPicker || props.yearPicker || props.quarterPicker)
  )
})

function getInputRect() {
  return inputRef.value?.$el?.getBoundingClientRect() ?? ({ width: 0, left: 0, right: 0 } as DOMRect)
}

/**
 * Event listener for 'scroll'
 * Depending on the props, it can close the menu or set correct position
 */
function onScroll(): void {
  if (isOpen.value) {
    if (defaultedConfig.value.closeOnScroll) {
      closeMenu()
    }
    else {
      setMenuPosition()
    }
  }
}

/**
 * Event listener for 'resize'
 * Since the menu is absolutely positioned, on window resize, correct positioning
 */
function onResize(): void {
  if (isOpen.value) {
    setMenuPosition()
  }
  const width = dpMenuRef.value?.$el.getBoundingClientRect().width ?? 0
  collapse.value = document.body.offsetWidth <= width
}

function onKeyUp(event: KeyboardEvent) {
  if (
    event.key === 'Tab'
    && !defaultedInline.value.enabled
    && !props.teleport
    && defaultedConfig.value.tabOutClosesMenu
  ) {
    if (!pickerWrapperRef.value!.contains(document.activeElement)) {
      closeMenu()
    }
  }

  shiftKeyActive.value = event.shiftKey
}

function onKeyDown(event: KeyboardEvent) {
  shiftKeyActive.value = event.shiftKey
}

function openMenu(): void {
  if (!props.disabled && !props.readonly) {
    shadowRender(currentInstance, DatepickerMenu, props)
    setMenuPosition(false)
    isOpen.value = true

    if (isOpen.value) {
      emit('open')
    }

    if (!isOpen.value) {
      clearInternalValues()
    }

    parseExternalModelValue(props.modelValue)
  }
}

/**
 * When x button is pressed on input, it will call this function that will emit null
 * for the modelValue and clear internally stored data
 */
function clearValue(): void {
  inputValue.value = ''
  clearInternalValues()
  dpMenuRef.value?.onValueCleared()
  inputRef.value?.setParsedDate(null)
  emit('update:model-value', null)
  emit('update:model-timezone-value', null)
  emit('cleared')
  if (defaultedConfig.value.closeOnClearValue) {
    closeMenu()
  }
}

function validateBeforeEmit() {
  const date = internalModelValue.value
  if (!date)
    return true
  if (!Array.isArray(date) && validateDate(date))
    return true
  if (Array.isArray(date)) {
    if (defaultedMultiDates.value.enabled)
      return true

    if (date.length === 2 && validateDate(date[0]) && validateDate(date[1])) {
      return true
    }
    if (defaultedRange.value.partialRange && !props.timePicker)
      return validateDate(date[0])
    return false
  }
  return false
}

/**
 * Called when select button is clicked, emit update for the modelValue
 */
function selectDate(): void {
  if (checkBeforeEmit() && validateBeforeEmit()) {
    emitModelValue()
    closeMenu()
  }
  else {
    emit('invalidSelect', internalModelValue.value)
  }
}

function emitOnAutoApply(ignoreClose: boolean): void {
  updateTextInputWithDateTimeValue()
  emitModelValue()
  if (defaultedConfig.value.closeOnAutoApply && !ignoreClose) {
    closeMenu()
  }
}

function updateTextInputWithDateTimeValue() {
  if (inputRef.value && defaultedTextInput.value.enabled) {
    inputRef.value.setParsedDate(internalModelValue.value)
  }
}

/**
 * When value is selected it will emit an event that will call this function
 * ignoreClose is passed when time is picked or month and year, since they update the value and for
 * the user experience it should not close the menu
 */
function autoApplyValue(ignoreClose = false): void {
  if (props.autoApply) {
    const isTimeValid = isValidTime(internalModelValue.value)

    if (isTimeValid && validateBeforeEmit()) {
      if (defaultedRange.value.enabled && Array.isArray(internalModelValue.value)) {
        if (defaultedRange.value.partialRange || internalModelValue.value.length === 2) {
          emitOnAutoApply(ignoreClose)
        }
      }
      else {
        emitOnAutoApply(ignoreClose)
      }
    }
  }
}

/**
 * Clears the internally stored values. This is different from clearValue since it does not emit v-model
 * update, just clears internal data
 */
function clearInternalValues(): void {
  if (!defaultedTextInput.value.enabled) {
    internalModelValue.value = null
  }
}

/**
 * Closes the menu and clears the internal data
 */
function closeMenu(fromClickAway = false): void {
  if (fromClickAway && internalModelValue.value && defaultedConfig.value.setDateOnMenuClose) {
    selectDate()
  }
  if (!defaultedInline.value.enabled) {
    if (isOpen.value) {
      isOpen.value = false
      xCorrect.value = false
      setMenuFocused(false)
      setShiftKey(false)
      clearArrowNav()
      emit('closed')
      if (inputValue.value) {
        parseExternalModelValue(modelValueRef.value)
      }
    }
    clearInternalValues()
    emit('blur')
    dpMenuRef.value?.$el?.remove()
  }
}

function setInputDate(date: Date | Date[] | null, submit?: boolean, tabbed = false): void {
  if (!date) {
    internalModelValue.value = null
    return
  }
  const validDate = Array.isArray(date) ? !date.some(d => !validateDate(d)) : validateDate(date)
  const validTime = isValidTime(date)
  if (validDate && validTime) {
    isTextInputDate.value = true
    internalModelValue.value = date
    if (submit) {
      shouldFocusNext.value = tabbed
      selectDate()
      emit('textSubmit')
    }
    else if (props.autoApply) {
      autoApplyValue()
    }
    nextTick().then(() => {
      isTextInputDate.value = false
    })
  }
  else {
    emit('invalidDate', date)
  }
}

function timeUpdate(): void {
  if (props.autoApply && isValidTime(internalModelValue.value)) {
    emitModelValue()
  }
  updateTextInputWithDateTimeValue()
}

function toggleMenu() {
  if (isOpen.value)
    return closeMenu()
  return openMenu()
}

function updateInternalModelValue(value: Date | Date[]): void {
  internalModelValue.value = value
}

function handleInputFocus() {
  if (defaultedTextInput.value.enabled) {
    isInputFocused.value = true
    formatInputValue()
  }

  emit('focus')
}

function handleBlur() {
  if (defaultedTextInput.value.enabled) {
    isInputFocused.value = false
    parseExternalModelValue(props.modelValue)
    if (shouldFocusNext.value) {
      const el = findNextFocusableElement(pickerWrapperRef.value!, shiftKeyActive.value)
      el?.focus()
    }
  }
  emit('blur')
}

function setMonthYear(value: MonthYearOpt) {
  if (dpMenuRef.value) {
    dpMenuRef.value.updateMonthYear(0, {
      month: getNumVal(value.month) as number,
      year: getNumVal(value.year) as number,
    })
  }
}

function parseModel(value?: ModelValue) {
  parseExternalModelValue(value ?? props.modelValue)
}

function switchView(view: MenuView, instance?: number) {
  dpMenuRef.value?.switchView(view, instance)
}

function clickOutside(validateBeforeEmit: () => boolean, evt: PointerEvent) {
  if (defaultedConfig.value.onClickOutside)
    return defaultedConfig.value.onClickOutside(validateBeforeEmit, evt)
  return closeMenu(true)
}

function handleFlow(skipStep = 0): void {
  dpMenuRef.value?.handleFlow(skipStep)
}

const getDpWrapMenuRef = (): Ref<HTMLElement | null> => dpWrapMenuRef

onClickOutside(dpWrapMenuRef, inputRef as unknown as MaybeElementRef, (evt: PointerEvent) =>
  clickOutside(validateBeforeEmit, evt))

onMounted(() => {
  parseExternalModelValue(props.modelValue)
  nextTick().then(() => {
    if (!defaultedInline.value.enabled) {
      const el = getScrollableParent(pickerWrapperRef.value)
      el?.addEventListener('scroll', onScroll)

      window?.addEventListener('resize', onResize)
    }
  })

  if (defaultedInline.value.enabled) {
    isOpen.value = true
  }

  window?.addEventListener('keyup', onKeyUp)
  window?.addEventListener('keydown', onKeyDown)
})

onUnmounted(() => {
  if (!defaultedInline.value.enabled) {
    const el = getScrollableParent(pickerWrapperRef.value)
    el?.removeEventListener('scroll', onScroll)
    window?.removeEventListener('resize', onResize)
  }
  window?.removeEventListener('keyup', onKeyUp)
  window?.removeEventListener('keydown', onKeyDown)
})

const slotList = mapSlots(slots, 'all', props.presetDates)
const inputSlots = mapSlots(slots, 'input')

watch(
  [modelValueRef, timezoneRef],
  () => {
    parseExternalModelValue(modelValueRef.value)
  },
  { deep: true },
)

defineExpose({
  closeMenu,
  selectDate,
  clearValue,
  openMenu,
  onScroll,
  formatInputValue, // exposed for testing purposes
  updateInternalModelValue, // modify internal modelValue
  setMonthYear,
  parseModel,
  switchView,
  toggleMenu,
  handleFlow,
  getDpWrapMenuRef,
})
</script>

<template>
  <div ref="pickerWrapperRef" :class="wrapperClass" data-datepicker-instance :data-dp-mobile="isMobile">
    <DatepickerInput
      ref="inputRef"
      v-model:input-value="inputValue"
      :is-menu-open="isOpen"
      v-bind="$props"
      @clear="clearValue"
      @open="openMenu"
      @set-input-date="setInputDate"
      @set-empty-date="emitModelValue"
      @select-date="selectDate"
      @toggle="toggleMenu"
      @close="closeMenu"
      @focus="handleInputFocus"
      @blur="handleBlur"
      @real-blur="isInputFocused = false"
      @text-input="$emit('textInput', $event)"
    >
      <template v-for="(slot, i) in inputSlots" #[slot]="args" :key="i">
        <slot :name="slot" v-bind="args" />
      </template>
    </DatepickerInput>
    <component :is="teleport ? TeleportCmp : 'div'" v-bind="teleportProps">
      <transition :name="menuTransition(openOnTop)" :css="showTransition && !defaultedInline.enabled">
        <div
          v-if="isOpen"
          ref="dpWrapMenuRef"
          v-bind="menuWrapProps"
          :class="{ 'dp--menu-wrapper': !defaultedInline.enabled }"
          :style="!defaultedInline.enabled ? menuStyle : undefined"
        >
          <DatepickerMenu
            ref="dpMenuRef"
            v-bind="$props"
            v-model:internal-model-value="internalModelValue"
            :class="{ [theme]: true, 'dp--menu-wrapper': teleport }"
            :open-on-top="openOnTop"
            :no-overlay-focus="noOverlayFocus"
            :collapse="collapse"
            :get-input-rect="getInputRect"
            :is-text-input-date="isTextInputDate"
            @close-picker="closeMenu"
            @select-date="selectDate"
            @auto-apply="autoApplyValue"
            @time-update="timeUpdate"
            @flow-step="$emit('flowStep', $event)"
            @update-month-year="$emit('updateMonthYear', $event)"
            @invalid-select="$emit('invalidSelect', internalModelValue)"
            @auto-apply-invalid="$emit('invalidSelect', $event)"
            @invalid-fixed-range="$emit('invalidFixedRange', $event)"
            @recalculate-position="setMenuPosition"
            @tooltip-open="$emit('tooltipOpen', $event)"
            @tooltip-close="$emit('tooltipClose', $event)"
            @time-picker-open="$emit('timePickerOpen', $event)"
            @time-picker-close="$emit('timePickerClose', $event)"
            @am-pm-change="$emit('amPmChange', $event)"
            @range-start="$emit('rangeStart', $event)"
            @range-end="$emit('rangeEnd', $event)"
            @date-update="$emit('dateUpdate', $event)"
            @invalid-date="$emit('invalidDate', $event)"
            @overlay-toggle="$emit('overlayToggle', $event)"
            @menu-blur="$emit('blur')"
          >
            <template v-for="(slot, i) in slotList" #[slot]="args" :key="i">
              <slot :name="slot" v-bind="{ ...args }" />
            </template>
          </DatepickerMenu>
        </div>
      </transition>
    </component>
  </div>
</template>

<style>
:root {
  --dp-common-transition: all 0.1s ease-in;
  --dp-menu-padding: 6px 8px;
  --dp-animation-duration: 0.1s;
  --dp-menu-appear-transition-timing: cubic-bezier(.4, 0, 1, 1);
  --dp-transition-timing: ease-out;
  --dp-action-row-transition: all 0.2s ease-in;
  --dp-font-family: -apple-system, blinkmacsystemfont, "Segoe UI", roboto, oxygen, ubuntu, cantarell, "Open Sans",
  "Helvetica Neue", sans-serif;
  --dp-border-radius: 4px;
  --dp-cell-border-radius: 4px;
  --dp-transition-length: 22px;
  --dp-transition-timing-general: 0.1s;
  --dp-button-height: 35px;
  --dp-month-year-row-height: 35px;
  --dp-month-year-row-button-size: 25px;
  --dp-button-icon-height: 20px;
  --dp-calendar-wrap-padding: 0 5px;
  --dp-cell-size: 35px;
  --dp-cell-padding: 5px;
  --dp-common-padding: 10px;
  --dp-input-icon-padding: 35px;
  --dp-input-padding: 6px 30px 6px 12px;
  --dp-menu-min-width: 260px;
  --dp-action-buttons-padding: 1px 6px;
  --dp-row-margin: 5px 0;
  --dp-calendar-header-cell-padding: 0.5rem;
  --dp-multi-calendars-spacing: 10px;
  --dp-overlay-col-padding: 3px;
  --dp-time-inc-dec-button-size: 32px;
  --dp-font-size: 1rem;
  --dp-preview-font-size: 0.8rem;
  --dp-time-font-size: 2rem;
  --dp-action-button-height: 22px;
  --dp-action-row-padding: 8px;
  --dp-direction: ltr;
}

.dp__theme_dark {
  --dp-background-color: #212121;
  --dp-text-color: #fff;
  --dp-hover-color: #484848;
  --dp-hover-text-color: #fff;
  --dp-hover-icon-color: #959595;
  --dp-primary-color: #005cb2;
  --dp-primary-disabled-color: #61a8ea;
  --dp-primary-text-color: #fff;
  --dp-secondary-color: #a9a9a9;
  --dp-border-color: #2d2d2d;
  --dp-menu-border-color: #2d2d2d;
  --dp-border-color-hover: #aaaeb7;
  --dp-border-color-focus: #aaaeb7;
  --dp-disabled-color: #737373;
  --dp-disabled-color-text: #d0d0d0;
  --dp-scroll-bar-background: #212121;
  --dp-scroll-bar-color: #484848;
  --dp-success-color: #00701a;
  --dp-success-color-disabled: #428f59;
  --dp-icon-color: #959595;
  --dp-danger-color: #e53935;
  --dp-marker-color: #e53935;
  --dp-tooltip-color: #3e3e3e;
  --dp-highlight-color: rgb(0 92 178 / 20%);
  --dp-range-between-dates-background-color: var(--dp-hover-color, #484848);
  --dp-range-between-dates-text-color: var(--dp-hover-text-color, #fff);
  --dp-range-between-border-color: var(--dp-hover-color, #fff);
  --dp-loader: 5px solid #005cb2;
}

.dp__theme_light {
  --dp-background-color: #fff;
  --dp-text-color: #212121;
  --dp-hover-color: #f3f3f3;
  --dp-hover-text-color: #212121;
  --dp-hover-icon-color: #959595;
  --dp-primary-color: #1976d2;
  --dp-primary-disabled-color: #6bacea;
  --dp-primary-text-color: #fff;
  --dp-secondary-color: #c0c4cc;
  --dp-border-color: #ddd;
  --dp-menu-border-color: #ddd;
  --dp-border-color-hover: #aaaeb7;
  --dp-border-color-focus: #aaaeb7;
  --dp-disabled-color: #f6f6f6;
  --dp-scroll-bar-background: #f3f3f3;
  --dp-scroll-bar-color: #959595;
  --dp-success-color: #76d275;
  --dp-success-color-disabled: #a3d9b1;
  --dp-icon-color: #959595;
  --dp-danger-color: #ff6f60;
  --dp-marker-color: #ff6f60;
  --dp-tooltip-color: #fafafa;
  --dp-disabled-color-text: #8e8e8e;
  --dp-highlight-color: rgb(25 118 210 / 10%);
  --dp-range-between-dates-background-color: var(--dp-hover-color, #f3f3f3);
  --dp-range-between-dates-text-color: var(--dp-hover-text-color, #212121);
  --dp-range-between-border-color: var(--dp-hover-color, #f3f3f3);
  --dp-loader: 5px solid #1976d2;
}

.dp__flex {
  display: flex;
  align-items: center;
}

.dp__btn {
  background: none;
  cursor: pointer;
  border: none;
  padding: 0; /* Remove padding */
  font-family: var(--dp-font-family);
  color: var(--dp-text-color);
  transition: var(--dp-common-transition);
}

.dp__main {
  font-family: var(--dp-font-family);
  user-select: none;
  box-sizing: border-box;
  position: relative;
  width: 100%;
}

.dp__main * {
  direction: var(--dp-direction, ltr);
}

.dp__pointer {
  cursor: pointer;
}

.dp__icon {
  stroke: currentcolor;
  fill: currentcolor;
}

.dp__button {
  width: 100%;
  text-align: center;
  color: var(--dp-icon-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  place-content: center center;
  padding: var(--dp-common-padding);
  box-sizing: border-box;
  height: var(--dp-button-height);
}

.dp__button.dp__overlay_action {
  position: absolute;
  bottom: 0;
}

.dp__button:hover {
  background: var(--dp-hover-color);
  color: var(--dp-hover-icon-color);
}

.dp__button svg {
  height: var(--dp-button-icon-height);
  width: auto;
}

.dp__button_bottom {
  border-bottom-left-radius: var(--dp-border-radius);
  border-bottom-right-radius: var(--dp-border-radius);
}

.dp__flex_display {
  display: flex;
}

.dp__flex_display_with_input {
  flex-direction: column;
  align-items: flex-start;
}

.dp__relative {
  position: relative;
}

.calendar-next-enter-active,
.calendar-next-leave-active,
.calendar-prev-enter-active,
.calendar-prev-leave-active {
  transition: all var(--dp-transition-timing-general) ease-out;
}

.calendar-next-enter-from {
  opacity: 0;
  transform: translateX(var(--dp-transition-length));
}

.calendar-next-leave-to {
  opacity: 0;
  transform: translateX(calc(var(--dp-transition-length) * -1));
}

.calendar-prev-enter-from {
  opacity: 0;
  transform: translateX(calc(var(--dp-transition-length) * -1));
}

.calendar-prev-leave-to {
  opacity: 0;
  transform: translateX(var(--dp-transition-length));
}

.dp-menu-appear-bottom-enter-active,
.dp-menu-appear-bottom-leave-active,
.dp-menu-appear-top-enter-active,
.dp-menu-appear-top-leave-active,
.dp-slide-up-enter-active,
.dp-slide-up-leave-active,
.dp-slide-down-enter-active,
.dp-slide-down-leave-active {
  transition: all var(--dp-animation-duration) var(--dp-transition-timing);
}

.dp-menu-appear-top-enter-from,
.dp-menu-appear-top-leave-to,
.dp-slide-down-leave-to,
.dp-slide-up-enter-from {
  opacity: 0;
  transform: translateY(var(--dp-transition-length));
}

.dp-menu-appear-bottom-enter-from,
.dp-menu-appear-bottom-leave-to,
.dp-slide-down-enter-from,
.dp-slide-up-leave-to {
  opacity: 0;
  transform: translateY(calc(var(--dp-transition-length) * -1));
}

.dp--arrow-btn-nav {
  transition: var(--dp-common-transition);
}

.dp--highlighted {
  background-color: var(--dp-highlight-color);
}

.dp--hidden-el {
  visibility: hidden;
}
</style>
