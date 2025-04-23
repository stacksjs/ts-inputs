<script setup lang="ts">
import type { ICalendarDay } from '../../interfaces'

import { endOfWeek, getMonth, startOfWeek } from 'date-fns'
import { computed, ref, useSlots, watch } from 'vue'
import { mapSlots, useCalendarClass, useDefaults } from '../../composables'
import { CMP, FlowStep } from '../../constants'

import { PickerBaseProps } from '../../props'
import { getCellId } from '../../utils/date-utils'
import { getMonths, getYears } from '../../utils/util'
import InstanceWrap from '../Common/InstanceWrap.vue'
import { useDatePicker } from '../DatePicker/date-picker'

import DpCalendar from '../DatePicker/DpCalendar.vue'
import DpHeader from '../DatePicker/DpHeader.vue'
import TimePicker from '../TimePicker/TimePicker.vue'

const props = defineProps({
  ...PickerBaseProps,
})
const emit = defineEmits([
  'tooltip-open',
  'tooltip-close',
  'mount',
  'update:internal-model-value',
  'update-flow-step',
  'reset-flow',
  'auto-apply',
  'focus-menu',
  'select-date',
  'range-start',
  'range-end',
  'invalid-fixed-range',
  'time-update',
  'am-pm-change',
  'time-picker-open',
  'time-picker-close',
  'recalculate-position',
  'update-month-year',
  'auto-apply-invalid',
  'date-update',
  'invalid-date',
  'overlay-toggle',
])
const {
  calendars,
  month,
  year,
  modelValue,
  time,
  disabledTimesConfig,
  today,
  validateTime,
  getCalendarDays,
  getMarker,
  handleArrow,
  handleScroll,
  handleSwipe,
  selectDate,
  updateMonthYear,
  presetDate,
  selectCurrentDate,
  updateTime,
  assignMonthAndYear,
  setStartTime,
} = useDatePicker(props, emit, triggerCalendarTransition, updateFlowStep)
const slots = useSlots()
const { setHoverDate, getDayClassData, clearHoverDate } = useCalendarClass(modelValue, props)
const { defaultedMultiCalendars } = useDefaults(props)

const headerRefs = ref<InstanceType<typeof DpHeader>[]>([])
const calendarRefs = ref<InstanceType<typeof DpCalendar>[]>([])
const timePickerRef = ref<InstanceType<typeof TimePicker> | null>(null)

const calendarSlots = mapSlots(slots, 'calendar')
const headerSlots = mapSlots(slots, 'monthYear')
const timePickerSlots = mapSlots(slots, 'timePicker')

function componentMounted(cmp: CMP) {
  if (!props.shadow) {
    emit('mount', cmp)
  }
}

watch(
  calendars,
  () => {
    if (!props.shadow) {
      setTimeout(() => {
        emit('recalculate-position')
      }, 0)
    }
  },
  { deep: true },
)

watch(
  defaultedMultiCalendars,
  (newVal, oldVal) => {
    if (newVal.count - oldVal.count > 0) {
      assignMonthAndYear()
    }
  },
  { deep: true },
)

/**
 * Array of the dates from which calendar is built.
 * It also sets classes depending on picker modes, active dates, today, v-model.
 */
const mappedDates = computed(() => (instance: number) => {
  return getCalendarDays(month.value(instance), year.value(instance)).map((date) => {
    return {
      ...date,
      days: date.days.map((calendarDay) => {
        calendarDay.marker = getMarker(calendarDay)
        calendarDay.classData = getDayClassData(calendarDay)
        return calendarDay
      }),
    }
  })
})

function triggerCalendarTransition(instance?: number): void {
  if (instance || instance === 0) {
    calendarRefs.value[instance]?.triggerTransition(month.value(instance), year.value(instance))
  }
  else {
    calendarRefs.value.forEach((refVal, i) => refVal.triggerTransition(month.value(i), year.value(i)))
  }
}

function updateFlowStep() {
  emit('update-flow-step')
}

function handleSpace(day: ICalendarDay, isNext = false): void {
  selectDate(day, isNext)
  if (props.spaceConfirm) {
    emit('select-date')
  }
}

function toggleMonthPicker(flow: boolean, show?: boolean, instance = 0) {
  headerRefs.value[instance]?.toggleMonthPicker(flow, show)
}

function toggleYearPicker(flow: boolean, show?: boolean, instance = 0) {
  headerRefs.value[instance]?.toggleYearPicker(flow, show)
}

function toggleTimePicker(flow: boolean, show?: boolean, childOpen?: string) {
  timePickerRef.value?.toggleTimePicker(flow, show, childOpen)
}

function selectWeekDate(selectStart: boolean, id: string | null) {
  if (!props.range) {
    const activeDate = modelValue.value ? modelValue.value : today
    const date = id ? new Date(id) : activeDate
    const toSelect = selectStart
      ? startOfWeek(date as Date, { weekStartsOn: 1 })
      : endOfWeek(date as Date, { weekStartsOn: 1 })

    selectDate({
      value: toSelect,
      current: getMonth(date as Date) === month.value(0),
      text: '',
      classData: {},
    })
    document.getElementById(getCellId(toSelect))?.focus()
  }
}

function changeMonth(isNext: boolean) {
  headerRefs.value[0]?.handleMonthYearChange(isNext, true)
}

function changeYear(isNext: boolean) {
  updateMonthYear(0, { month: month.value(0), year: year.value(0) + (isNext ? 1 : -1), fromNav: true })
}

function timePickerOverlayToggle(type: FlowStep, open: boolean) {
  if (type === FlowStep.time) {
    emit(`time-picker-${open ? 'open' : 'close'}`)
  }
  emit('overlay-toggle', { open, overlay: type })
}

function onHeaderOverlayClose(type: FlowStep) {
  emit('overlay-toggle', { open: false, overlay: type })
  emit('focus-menu')
}

function getSidebarProps() {
  return {
    modelValue,
    month,
    year,
    time,
    updateTime,
    updateMonthYear,
    selectDate,
    presetDate,
  }
}

defineExpose({
  clearHoverDate,
  presetDate,
  selectCurrentDate,
  toggleMonthPicker,
  toggleYearPicker,
  toggleTimePicker,
  handleArrow,
  updateMonthYear,
  getSidebarProps,
  changeMonth,
  changeYear,
  selectWeekDate,
  setStartTime,
})
</script>

<template>
  <InstanceWrap
    v-slot="{ instance, index }"
    :multi-calendars="defaultedMultiCalendars.count"
    :collapse="collapse"
    :is-mobile="isMobile"
  >
    <DpHeader
      v-if="!disableMonthYearSelect"
      :ref="
        (el: any) => {
          if (el) headerRefs[index] = el;
        }
      "
      :months="getMonths(formatLocale, locale, monthNameFormat)"
      :years="getYears(yearRange, locale, reverseYears)"
      :month="month(instance)"
      :year="year(instance)"
      :instance="instance"
      v-bind="$props"
      @mount="componentMounted(CMP.header)"
      @reset-flow="$emit('reset-flow')"
      @update-month-year="updateMonthYear(instance, $event)"
      @overlay-closed="onHeaderOverlayClose"
      @overlay-opened="$emit('overlay-toggle', { open: true, overlay: $event })"
    >
      <template v-for="(slot, j) in headerSlots" #[slot]="args" :key="j">
        <slot :name="slot" v-bind="args" />
      </template>
    </DpHeader>
    <DpCalendar
      :ref="
        (el: any) => {
          if (el) calendarRefs[index] = el;
        }
      "
      :mapped-dates="mappedDates(instance)"
      :month="month(instance)"
      :year="year(instance)"
      :instance="instance"
      v-bind="$props"
      @select-date="selectDate($event, instance !== 1)"
      @handle-space="handleSpace($event, instance !== 1)"
      @set-hover-date="setHoverDate($event)"
      @handle-scroll="handleScroll($event, instance)"
      @handle-swipe="handleSwipe($event, instance)"
      @mount="componentMounted(CMP.calendar)"
      @reset-flow="$emit('reset-flow')"
      @tooltip-open="$emit('tooltip-open', $event)"
      @tooltip-close="$emit('tooltip-close', $event)"
    >
      <template v-for="(slot, j) in calendarSlots" #[slot]="args" :key="j">
        <slot :name="slot" v-bind="{ ...args }" />
      </template>
    </DpCalendar>
  </InstanceWrap>
  <div v-if="enableTimePicker">
    <template v-if="$slots['time-picker']">
      <slot name="time-picker" v-bind="{ time, updateTime }" />
    </template>
    <TimePicker
      v-else
      ref="timePickerRef"
      v-bind="$props"
      :hours="time.hours"
      :minutes="time.minutes"
      :seconds="time.seconds"
      :internal-model-value="internalModelValue"
      :disabled-times-config="disabledTimesConfig"
      :validate-time="validateTime"
      @mount="componentMounted(CMP.timePicker)"
      @update:hours="updateTime($event)"
      @update:minutes="updateTime($event, false)"
      @update:seconds="updateTime($event, false, true)"
      @reset-flow="$emit('reset-flow')"
      @overlay-closed="timePickerOverlayToggle($event, false)"
      @overlay-opened="timePickerOverlayToggle($event, true)"
      @am-pm-change="$emit('am-pm-change', $event)"
    >
      <template v-for="(slot, i) in timePickerSlots" #[slot]="args" :key="i">
        <slot :name="slot" v-bind="args" />
      </template>
    </TimePicker>
  </div>
</template>

<style>
.dp__date_picker {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.dp__time_picker {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--dp-border-color);
}

.dp__calendar_wrap {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.dp__calendar_header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
}

.dp__calendar_header_item {
  flex: 1;
  text-align: center;
  font-weight: bold;
  color: var(--dp-text-color);
}

.dp__calendar_header_separator {
  height: 1px;
  background-color: var(--dp-border-color);
  margin: 5px 0;
}

.dp__calendar {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.dp__calendar_row {
  display: flex;
  justify-content: space-between;
  gap: 5px;
}

.dp__calendar_item {
  flex: 1;
  text-align: center;
  padding: 5px;
  cursor: pointer;
  border-radius: var(--dp-border-radius);
  transition: var(--dp-common-transition);
}

.dp__calendar_item:hover {
  background-color: var(--dp-hover-color);
  color: var(--dp-hover-text-color);
}

.dp__calendar_item:focus {
  background-color: var(--dp-hover-color);
  color: var(--dp-hover-text-color);
  outline: none;
}

.dp__calendar_item[aria-disabled="true"] {
  opacity: 0.5;
  cursor: not-allowed;
}

.dp__calendar_item[aria-selected="true"] {
  background-color: var(--dp-primary-color);
  color: var(--dp-primary-text-color);
}

.dp__cell_inner {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  position: relative;
}

.dp__week_num {
  font-weight: bold;
  color: var(--dp-text-color);
}

.dp__marker_dot {
  position: absolute;
  bottom: 2px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: var(--dp-primary-color);
}

.dp__marker_line {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 2px;
  background-color: var(--dp-primary-color);
}

.dp__marker_tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--dp-background-color);
  border: 1px solid var(--dp-border-color);
  border-radius: var(--dp-border-radius);
  padding: 5px;
  z-index: 99999;
  box-shadow: var(--dp-box-shadow);
}

.dp__tooltip_content {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.dp__tooltip_text {
  display: flex;
  align-items: center;
  gap: 5px;
}

.dp__tooltip_mark {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.dp__arrow_bottom_tp {
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid var(--dp-border-color);
}
</style>
