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

<style scoped>
.dp__menu {
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: var(--dp-background-color);
  border: 1px solid var(--dp-border-color);
  border-radius: var(--dp-border-radius);
  box-shadow: var(--dp-menu-box-shadow);
  transition: var(--dp-common-transition);
}

.dp__menu_index {
  z-index: 99999;
}

.dp__relative {
  position: relative;
}

.dp__arrow_top {
  position: absolute;
  top: -6px;
  left: var(--dp-arrow-left);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 6px solid var(--dp-border-color);
}

.dp__arrow_bottom {
  position: absolute;
  bottom: -6px;
  left: var(--dp-arrow-left);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid var(--dp-border-color);
}

.dp__menu_content_wrapper {
  display: flex;
  flex-direction: row;
  width: 100%;
  min-width: 0;
  transition: var(--dp-common-transition);
}

.dp--menu-content-wrapper-collapsed {
  flex-direction: column;
}

.dp__sidebar_left,
.dp__sidebar_right {
  display: flex;
  flex-direction: column;
  padding: var(--dp-sidebar-padding);
  background-color: var(--dp-sidebar-background-color);
  border-right: 1px solid var(--dp-border-color);
}

.dp__sidebar_right {
  border-right: none;
  border-left: 1px solid var(--dp-border-color);
}

.dp__instance_calendar {
  flex: 1;
  min-width: 0;
}

.dp--preset-dates {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: var(--dp-preset-dates-padding);
  background-color: var(--dp-preset-dates-background-color);
  border-right: 1px solid var(--dp-border-color);
}

.dp--preset-dates-collapsed {
  flex-direction: row;
  flex-wrap: wrap;
  border-right: none;
  border-bottom: 1px solid var(--dp-border-color);
}

.dp__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  font-size: var(--dp-font-size);
  color: var(--dp-text-color);
  background-color: transparent;
  border: 1px solid var(--dp-border-color);
  border-radius: var(--dp-border-radius);
  cursor: pointer;
  transition: var(--dp-common-transition);
}

.dp__btn:hover {
  background-color: var(--dp-hover-color);
  border-color: var(--dp-border-color-hover);
}

.dp--preset-range {
  width: 100%;
  text-align: left;
}

.dp--preset-range-collapsed {
  width: auto;
}

.dp__menu_disabled,
.dp__menu_readonly {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--dp-disabled-color);
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
  z-index: 1;
}

.dp--menu-load-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--dp-background-color);
  z-index: 2;
}

.dp--menu-loader {
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid var(--dp-border-color);
  border-top-color: var(--dp-primary-color);
  border-radius: 50%;
  animation: dp-spin 1s linear infinite;
}

.dp--menu-header {
  padding: var(--dp-menu-header-padding);
  background-color: var(--dp-menu-header-background-color);
  border-bottom: 1px solid var(--dp-border-color);
}

.dp__action_extra {
  padding: var(--dp-action-extra-padding);
  background-color: var(--dp-action-extra-background-color);
  border-top: 1px solid var(--dp-border-color);
}

@keyframes dp-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
