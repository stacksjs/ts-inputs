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
  'tooltipOpen',
  'tooltipClose',
  'mount',
  'update:internal-model-value',
  'updateFlowStep',
  'resetFlow',
  'autoApply',
  'focusMenu',
  'selectDate',
  'rangeStart',
  'rangeEnd',
  'invalidFixedRange',
  'timeUpdate',
  'amPmChange',
  'timePickerOpen',
  'timePickerClose',
  'recalculatePosition',
  'updateMonthYear',
  'autoApplyInvalid',
  'dateUpdate',
  'invalidDate',
  'overlayToggle',
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
        emit('recalculatePosition')
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
  emit('updateFlowStep')
}

function handleSpace(day: ICalendarDay, isNext = false): void {
  selectDate(day, isNext)
  if (props.spaceConfirm) {
    emit('selectDate')
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
    emit(open ? 'timePickerOpen' : 'timePickerClose')
  }
  emit('overlayToggle', { open, overlay: type })
}

function onHeaderOverlayClose(type: FlowStep) {
  emit('overlayToggle', { open: false, overlay: type })
  emit('focusMenu')
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
      @reset-flow="$emit('resetFlow')"
      @update-month-year="updateMonthYear(instance, $event)"
      @overlay-closed="onHeaderOverlayClose"
      @overlay-opened="$emit('overlayToggle', { open: true, overlay: $event })"
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
      @reset-flow="$emit('resetFlow')"
      @tooltip-open="$emit('tooltipOpen', $event)"
      @tooltip-close="$emit('tooltipClose', $event)"
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
      @reset-flow="$emit('resetFlow')"
      @overlay-closed="timePickerOverlayToggle($event, false)"
      @overlay-opened="timePickerOverlayToggle($event, true)"
      @am-pm-change="$emit('amPmChange', $event)"
    >
      <template v-for="(slot, i) in timePickerSlots" #[slot]="args" :key="i">
        <slot :name="slot" v-bind="args" />
      </template>
    </TimePicker>
  </div>
</template>
