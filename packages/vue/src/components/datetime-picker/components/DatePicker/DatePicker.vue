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
.dp__calendar {
  display: flex;
  flex-direction: column;
  background-color: var(--dp-background-color);
  border-radius: var(--dp-border-radius);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.dp__calendar_next {
  margin-left: var(--dp-multi-calendars-spacing);
}

.dp__flex_display {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.dp__flex_display_with_input {
  flex-direction: column;
  align-items: flex-start;
}

.dp__flex_display_collapsed {
  flex-direction: row;
  flex-wrap: wrap;
  gap: var(--dp-multi-calendars-spacing);
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
}
</style>
