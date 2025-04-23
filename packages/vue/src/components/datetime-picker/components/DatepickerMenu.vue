<script lang="ts" setup>
import type { MaybeRefOrGetter, PropType } from 'vue'

import type { DynamicClass, InternalModuleValue, MenuExposedFn, MenuView, MonthModel } from '../interfaces'

import { computed, onMounted, onUnmounted, ref, toValue, useSlots } from 'vue'
import ActionRow from '../components/ActionRow.vue'
import DatePicker from '../components/DatePicker/DatePicker.vue'

import MonthPicker from '../components/MonthPicker/MonthPicker.vue'
import QuarterPicker from '../components/QuarterPicker/QuarterPicker.vue'
import TimePickerSolo from '../components/TimePicker/TimePickerSolo.vue'
import YearPicker from '../components/YearPicker/YearPicker.vue'
import { mapSlots, useArrowNavigation, useDefaults, useFlow, useState } from '../composables'

import { useResponsive } from '../composables/responsive'
import { ArrowDirection, EventKey } from '../constants'
import { AllProps } from '../props'
import { checkKeyDown, checkStopPropagation, getElWithin, unrefElement } from '../utils/util'

defineOptions({
  compatConfig: {
    MODE: 3,
  },
})

const props = defineProps({
  ...AllProps,
  shadow: { type: Boolean as PropType<boolean>, default: false },
  openOnTop: { type: Boolean as PropType<boolean>, default: false },
  internalModelValue: { type: [Date, Array] as PropType<InternalModuleValue>, default: null },
  noOverlayFocus: { type: Boolean as PropType<boolean>, default: false },
  collapse: { type: Boolean as PropType<boolean>, default: false },
  getInputRect: { type: Function as PropType<() => DOMRect>, default: () => ({}) },
  isTextInputDate: { type: Boolean as PropType<boolean>, default: false },
})

const emit = defineEmits([
  'close-picker',
  'select-date',
  'auto-apply',
  'time-update',
  'flow-step',
  'update-month-year',
  'invalid-select',
  'update:internal-model-value',
  'recalculate-position',
  'invalid-fixed-range',
  'tooltip-open',
  'tooltip-close',
  'time-picker-open',
  'time-picker-close',
  'am-pm-change',
  'range-start',
  'range-end',
  'auto-apply-invalid',
  'date-update',
  'invalid-date',
  'overlay-toggle',
  'menu-blur',
])

const dpMenuRef = ref<HTMLElement | null>(null)

const baseProps = computed(() => {
  const { openOnTop: _, ...initProps } = props
  return {
    ...initProps,
    isMobile: isMobile.value,
    flowStep: flowStep.value,
    menuWrapRef: dpMenuRef.value,
  }
})

const { setMenuFocused, setShiftKey, control } = useState()
const slots = useSlots()
const { defaultedTextInput, defaultedInline, defaultedConfig, defaultedUI, handleEventPropagation }
        = useDefaults(props)
const { isMobile } = useResponsive(defaultedConfig, props.shadow)

const calendarWrapperRef = ref(null)
const calendarWidth = ref(0)
const innerMenuRef = ref(null)
const menuMount = ref(false)
const dynCmpRef = ref<any>(null)
const isMenuActive = ref(false)

function stopDefault(event: Event) {
  isMenuActive.value = true
  if (defaultedConfig.value.allowPreventDefault) {
    event.preventDefault()
  }
  checkStopPropagation(event, defaultedConfig.value, true)
}

onMounted(() => {
  if (!props.shadow) {
    menuMount.value = true
    getCalendarWidth()
    window.addEventListener('resize', getCalendarWidth)

    const menu = unrefElement(dpMenuRef)
    if (menu && !defaultedTextInput.value.enabled && !defaultedInline.value.enabled) {
      setMenuFocused(true)
      focusMenu()
    }
    if (menu) {
      menu.addEventListener('pointerdown', stopDefault)
      menu.addEventListener('mousedown', stopDefault)
    }
  }
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('resize', getCalendarWidth)
  document.removeEventListener('mousedown', handleClickOutside)

  const menu = unrefElement(dpMenuRef)

  if (menu) {
    menu.removeEventListener('pointerdown', stopDefault)
    menu.removeEventListener('mousedown', stopDefault)
  }
})

function getCalendarWidth(): void {
  const el = unrefElement(innerMenuRef)
  if (el) {
    calendarWidth.value = el.getBoundingClientRect().width
  }
}

const { arrowRight, arrowLeft, arrowDown, arrowUp } = useArrowNavigation()
const { flowStep, updateFlowStep, childMount, resetFlow, handleFlow } = useFlow(props, emit, dynCmpRef)

const displayComponent = computed(() => {
  if (props.monthPicker)
    return MonthPicker
  if (props.yearPicker)
    return YearPicker
  if (props.timePicker)
    return TimePickerSolo
  if (props.quarterPicker)
    return QuarterPicker
  return DatePicker
})

const arrowPos = computed(() => {
  if (defaultedConfig.value.arrowLeft)
    return defaultedConfig.value.arrowLeft
  const menuRect = dpMenuRef.value?.getBoundingClientRect()
  const inputRect = props.getInputRect()
  if (inputRect?.width < calendarWidth?.value && inputRect?.left <= (menuRect?.left ?? 0)) {
    return `${inputRect?.width / 2}px`
  }
  else if (inputRect?.right >= (menuRect?.right ?? 0) && inputRect?.width < calendarWidth?.value) {
    return `${calendarWidth?.value - inputRect?.width / 2}px`
  }
  return '50%'
})

function focusMenu(): void {
  const menu = unrefElement(dpMenuRef)
  if (menu) {
    menu.focus({ preventScroll: true })
  }
}

const getSidebarProps = computed(() => dynCmpRef.value?.getSidebarProps() || {})

function recalculatePosition() {
  if (props.openOnTop) {
    emit('recalculate-position')
  }
}

const actionSlots = mapSlots(slots, 'action')

const sharedSlots = computed((): string[] => {
  if (props.monthPicker || props.yearPicker)
    return mapSlots(slots, 'monthYear')
  if (props.timePicker)
    return mapSlots(slots, 'timePicker')
  return mapSlots(slots, 'shared')
})

const arrowClass = computed(() => (!props.openOnTop ? 'dp__arrow_top' : 'dp__arrow_bottom'))

const disabledReadonlyOverlay = computed(() => ({
  'dp__menu_disabled': props.disabled,
  'dp__menu_readonly': props.readonly,
  'dp-menu-loading': props.loading,
}))

const dpMenuClass = computed(
  (): DynamicClass => ({
    dp__menu: true,
    dp__menu_index: !defaultedInline.value.enabled,
    dp__relative: defaultedInline.value.enabled,
    ...(defaultedUI.value.menu ?? {}),
  }),
)

function handleDpMenuClick(ev: Event) {
  checkStopPropagation(ev, defaultedConfig.value, true)
}

function handleEsc(ev: KeyboardEvent): void {
  if (props.escClose) {
    emit('close-picker')
    handleEventPropagation(ev)
  }
}

function handleArrowKey(arrow: ArrowDirection): void {
  if (props.arrowNavigation) {
    if (arrow === ArrowDirection.up)
      return arrowUp()
    if (arrow === ArrowDirection.down)
      return arrowDown()
    if (arrow === ArrowDirection.left)
      return arrowLeft()
    if (arrow === ArrowDirection.right)
      return arrowRight()
  }
  else if (arrow === ArrowDirection.left || arrow === ArrowDirection.up) {
    callChildFn('handleArrow', ArrowDirection.left, 0, arrow === ArrowDirection.up)
  }
  else {
    callChildFn('handleArrow', ArrowDirection.right, 0, arrow === ArrowDirection.down)
  }
}

function checkShiftKey(ev: KeyboardEvent) {
  setShiftKey(ev.shiftKey)
  if (!props.disableMonthYearSelect && ev.code === EventKey.tab) {
    if ((ev.target as HTMLElement).classList.contains('dp__menu') && control.value.shiftKeyInMenu) {
      ev.preventDefault()
      checkStopPropagation(ev, defaultedConfig.value, true)
      emit('close-picker')
    }
  }
}

function onTimePickerClose() {
  focusMenu()
  emit('time-picker-close')
}

function closeOverlays(instance: number) {
  dynCmpRef.value?.toggleTimePicker(false, false)
  dynCmpRef.value?.toggleMonthPicker(false, false, instance)
  dynCmpRef.value?.toggleYearPicker(false, false, instance)
}

function switchView(view: MenuView, instance = 0) {
  if (view === 'month')
    return dynCmpRef.value?.toggleMonthPicker(false, true, instance)
  if (view === 'year')
    return dynCmpRef.value?.toggleYearPicker(false, true, instance)
  if (view === 'time')
    return dynCmpRef.value?.toggleTimePicker(true, false)
  return closeOverlays(instance)
}

function callChildFn(fn: MenuExposedFn, ...args: any[]) {
  if (dynCmpRef.value?.[fn]) {
    dynCmpRef.value?.[fn](...args)
  }
}

function selectCurrentDate() {
  callChildFn('selectCurrentDate')
}

function presetDate(value: MaybeRefOrGetter<Date[] | string[] | string | Date>, noTz?: boolean) {
  callChildFn('presetDate', toValue(value), noTz)
}

function clearHoverDate() {
  callChildFn('clearHoverDate')
}

function updateMonthYear(instance: number, value: MonthModel) {
  callChildFn('updateMonthYear', instance, value)
}

function onArrowKey(ev: KeyboardEvent, arrow: ArrowDirection) {
  ev.preventDefault()
  handleArrowKey(arrow)
}

function onKeyDown(ev: KeyboardEvent) {
  checkShiftKey(ev)

  if (ev.key === EventKey.home || ev.key === EventKey.end) {
    return callChildFn(
      'selectWeekDate',
      ev.key === EventKey.home,
      (ev.target as HTMLElement).getAttribute('id'),
    )
  }
  if (ev.key === EventKey.pageUp || ev.key === EventKey.pageDown) {
    if (ev.shiftKey) {
      callChildFn('changeYear', ev.key === EventKey.pageUp)
      getElWithin(dpMenuRef.value, 'overlay-year')?.focus()
    }
    else {
      callChildFn('changeMonth', ev.key === EventKey.pageUp)
      getElWithin(dpMenuRef.value, ev.key === EventKey.pageUp ? 'action-prev' : 'action-next')?.focus()
    }
    if ((ev.target as HTMLElement).getAttribute('id')) {
      dpMenuRef.value?.focus({ preventScroll: true })
    }
  }

  switch (ev.key) {
    case EventKey.esc:
      return handleEsc(ev)
    case EventKey.arrowLeft:
      return onArrowKey(ev, ArrowDirection.left)
    case EventKey.arrowRight:
      return onArrowKey(ev, ArrowDirection.right)
    case EventKey.arrowUp:
      return onArrowKey(ev, ArrowDirection.up)
    case EventKey.arrowDown:
      return onArrowKey(ev, ArrowDirection.down)
    default:
  }
}

function handleClickOutside(event: MouseEvent) {
  if (defaultedInline.value.enabled && !defaultedInline.value.input) {
    const activeClick = dpMenuRef.value?.contains(event.target as HTMLElement)
    if (!activeClick && isMenuActive.value) {
      isMenuActive.value = false
      emit('menu-blur')
    }
  }
}

function onValueCleared() {
  dynCmpRef.value?.setStartTime?.()
}

defineExpose({
  updateMonthYear,
  switchView,
  handleFlow,
  onValueCleared,
})
</script>

<template>
  <div
    :id="uid ? `dp-menu-${uid}` : undefined"
    ref="dpMenuRef"
    :tabindex="defaultedInline.enabled ? undefined : '0'"
    :role="defaultedInline.enabled ? undefined : 'dialog'"
    :aria-label="ariaLabels?.menu"
    :class="dpMenuClass"
    :style="{ '--dp-arrow-left': arrowPos }"
    @mouseleave="clearHoverDate"
    @click="handleDpMenuClick"
    @keydown="onKeyDown"
  >
    <div v-if="((disabled || readonly) && defaultedInline.enabled) || loading" :class="disabledReadonlyOverlay">
      <div v-if="loading" class="dp--menu-load-container">
        <span class="dp--menu-loader" />
      </div>
    </div>
    <div v-if="$slots['menu-header']" class="dp--menu-header">
      <slot name="menu-header" />
    </div>
    <div v-if="!defaultedInline.enabled && !teleportCenter" :class="arrowClass" />
    <div
      ref="innerMenuRef"
      :class="{
        'dp__menu_content_wrapper': presetDates?.length || !!$slots['left-sidebar'] || !!$slots['right-sidebar'],
        'dp--menu-content-wrapper-collapsed':
          collapse && (presetDates?.length || !!$slots['left-sidebar'] || !!$slots['right-sidebar']),
      }"
      :data-dp-mobile="isMobile"
      :style="{ '--dp-menu-width': `${calendarWidth}px` }"
    >
      <div v-if="$slots['left-sidebar']" class="dp__sidebar_left">
        <slot name="left-sidebar" v-bind="getSidebarProps" />
      </div>
      <div
        v-if="presetDates.length"
        class="dp--preset-dates" :class="{ 'dp--preset-dates-collapsed': collapse }"
        :data-dp-mobile="isMobile"
      >
        <template v-for="(preset, i) in presetDates" :key="i">
          <template v-if="preset.slot">
            <slot
              :name="preset.slot"
              :preset-date="presetDate"
              :label="preset.label"
              :value="preset.value"
            />
          </template>
          <template v-else>
            <button
              type="button"
              :style="preset.style || {}"
              class="dp__btn dp--preset-range"
              :class="{ 'dp--preset-range-collapsed': collapse }"
              :data-test-id="preset.testId ?? undefined"
              :data-dp-mobile="isMobile"
              @click.prevent="presetDate(preset.value, preset.noTz)"
              @keydown="checkKeyDown($event, () => presetDate(preset.value, preset.noTz), true)"
            >
              {{ preset.label }}
            </button>
          </template>
        </template>
      </div>
      <div ref="calendarWrapperRef" class="dp__instance_calendar" role="document">
        <component
          :is="displayComponent"
          ref="dynCmpRef"
          v-bind="baseProps"
          :flow-step="flowStep"
          @mount="childMount"
          @update-flow-step="updateFlowStep"
          @reset-flow="resetFlow"
          @focus-menu="focusMenu"
          @select-date="$emit('select-date')"
          @date-update="$emit('date-update', $event)"
          @tooltip-open="$emit('tooltip-open', $event)"
          @tooltip-close="$emit('tooltip-close', $event)"
          @auto-apply="$emit('auto-apply', $event)"
          @range-start="$emit('range-start', $event)"
          @range-end="$emit('range-end', $event)"
          @invalid-fixed-range="$emit('invalid-fixed-range', $event)"
          @time-update="$emit('time-update')"
          @am-pm-change="$emit('am-pm-change', $event)"
          @time-picker-open="$emit('time-picker-open', $event)"
          @time-picker-close="onTimePickerClose"
          @recalculate-position="recalculatePosition"
          @update-month-year="$emit('update-month-year', $event)"
          @auto-apply-invalid="$emit('auto-apply-invalid', $event)"
          @invalid-date="$emit('invalid-date', $event)"
          @overlay-toggle="$emit('overlay-toggle', $event)"
          @update:internal-model-value="$emit('update:internal-model-value', $event)"
        >
          <template v-for="(slot, i) in sharedSlots" #[slot]="args" :key="i">
            <slot :name="slot" v-bind="{ ...args }" />
          </template>
        </component>
      </div>
      <div v-if="$slots['right-sidebar']" class="dp__sidebar_right">
        <slot name="right-sidebar" v-bind="getSidebarProps" />
      </div>
      <div v-if="$slots['action-extra']" class="dp__action_extra">
        <slot v-if="$slots['action-extra']" name="action-extra" :select-current-date="selectCurrentDate" />
      </div>
    </div>
    <ActionRow
      v-if="!autoApply || defaultedConfig.keepActionRow"
      :menu-mount="menuMount"
      v-bind="baseProps"
      :calendar-width="calendarWidth"
      @close-picker="$emit('close-picker')"
      @select-date="$emit('select-date')"
      @invalid-select="$emit('invalid-select')"
      @select-now="selectCurrentDate"
    >
      <template v-for="(slot, i) in actionSlots" #[slot]="args" :key="i">
        <slot :name="slot" v-bind="{ ...args }" />
      </template>
    </ActionRow>
  </div>
</template>

<style>
.dp__menu {
  background: var(--dp-background-color);
  border-radius: var(--dp-border-radius);
  min-width: var(--dp-menu-min-width);
  font-family: var(--dp-font-family);
  font-size: var(--dp-font-size);
  user-select: none;
  border: 1px solid var(--dp-menu-border-color);
  box-sizing: border-box;
}

.dp__menu::after {
  box-sizing: border-box;
}

.dp__menu::before {
  box-sizing: border-box;
}

.dp__menu:focus {
  border: 1px solid var(--dp-menu-border-color);
  outline: none;
}

.dp--menu-wrapper {
  position: absolute;
  z-index: 99999;
}

.dp__menu_inner {
  padding: var(--dp-menu-padding);
}

.dp--menu--inner-stretched {
  padding: 6px 0;
}

.dp__menu_index {
  z-index: 99999;
}

.dp__menu_disabled {
  position: absolute;
  inset: 0;
  z-index: 999999;
  background: rgb(255 255 255 / 50%);
  cursor: not-allowed;
}

.dp__menu_readonly {
  position: absolute;
  inset: 0;
  z-index: 999999;
  background: transparent;
  cursor: default;
}

.dp-menu-loading {
  position: absolute;
  inset: 0;
  z-index: 999999;
  background: rgb(255 255 255 / 50%);
  cursor: default;
}

.dp--menu-load-container {
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
}

.dp--menu-loader {
  width: 48px;
  height: 48px;
  border: var(--dp-loader);
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: dp-load-rotation 1s linear infinite;
  position: absolute;
}

@keyframes dp-load-rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.dp__arrow_top {
  left: var(--dp-arrow-left);
  top: 0;
  height: 12px;
  width: 12px;
  background-color: var(--dp-background-color);
  position: absolute;
  border-inline-end: 1px solid var(--dp-menu-border-color);
  border-top: 1px solid var(--dp-menu-border-color);
  transform: translate(-50%, -50%) rotate(-45deg);
}

.dp__arrow_bottom {
  left: var(--dp-arrow-left);
  bottom: 0;
  height: 12px;
  width: 12px;
  background-color: var(--dp-background-color);
  position: absolute;
  border-inline-end: 1px solid var(--dp-menu-border-color);
  border-bottom: 1px solid var(--dp-menu-border-color);
  transform: translate(-50%, 50%) rotate(45deg);
}

.dp__action_extra {
  text-align: center;
  padding: 2px 0;
}

.dp--preset-dates {
  padding: 5px;
  border-inline-end: 1px solid var(--dp-border-color);
}

.dp--preset-dates[data-dp-mobile] {
  display: flex;
  align-self: center;
  border: none;
  overflow-x: auto;
  max-width: calc(var(--dp-menu-width) - var(--dp-action-row-padding) * 2);
}

.dp--preset-dates-collapsed {
  display: flex;
  align-self: center;
  border: none;
  overflow-x: auto;
  max-width: calc(var(--dp-menu-width) - var(--dp-action-row-padding) * 2);
}

.dp__sidebar_left {
  padding: 5px;
  border-inline-end: 1px solid var(--dp-border-color);
}

.dp__sidebar_right {
  padding: 5px;
  margin-inline-end: 1px solid var(--dp-border-color);
}

.dp--preset-range {
  display: block;
  width: 100%;
  padding: 5px;
  text-align: left;
  white-space: nowrap;
  color: var(--dp-text-color);
  border-radius: var(--dp-border-radius);
  transition: var(--dp-common-transition);
}

.dp--preset-range:hover {
  background-color: var(--dp-hover-color);
  color: var(--dp-hover-text-color);
  cursor: pointer;
}

.dp--preset-range[data-dp-mobile] {
  border: 1px solid var(--dp-border-color);
  margin: 0 3px;
}

.dp--preset-range[data-dp-mobile]:first-child {
  margin-left: 0;
}

.dp--preset-range[data-dp-mobile]:last-child {
  margin-right: 0;
}

.dp--preset-range-collapsed {
  border: 1px solid var(--dp-border-color);
  margin: 0 3px;
}

.dp--preset-range-collapsed:first-child {
  margin-left: 0;
}

.dp--preset-range-collapsed:last-child {
  margin-right: 0;
}

.dp__menu_content_wrapper {
  display: flex;
}

.dp__menu_content_wrapper[data-dp-mobile] {
  flex-direction: column-reverse;
}

.dp--menu-content-wrapper-collapsed {
  flex-direction: column-reverse;
}
</style>
