<script setup lang="ts">
import type { TSInputsProps } from '../types'
import { format, parse } from 'date-fns'
import { computed, ref, watch } from 'vue'
import DateTimePicker from './datetime-picker/DateTimePicker.vue'

const props = defineProps<TSInputsProps>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'update:modelTimezoneValue', value: string): void
  (e: 'textSubmit', value: string): void
  (e: 'closed'): void
  (e: 'cleared'): void
  (e: 'open'): void
  (e: 'focus'): void
  (e: 'blur'): void
  (e: 'internalModelChange', value: any): void
  (e: 'recalculatePosition'): void
  (e: 'flowStep', value: string): void
  (e: 'updateMonthYear', value: { month: number, year: number }): void
  (e: 'invalidSelect'): void
  (e: 'invalidFixedRange'): void
  (e: 'tooltipOpen'): void
  (e: 'tooltipClose'): void
  (e: 'timePickerOpen'): void
  (e: 'timePickerClose'): void
  (e: 'amPmChange'): void
  (e: 'rangeStart'): void
  (e: 'rangeEnd'): void
  (e: 'dateUpdate'): void
  (e: 'invalidDate'): void
  (e: 'overlayToggle'): void
  (e: 'textInput'): void
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const formattedValue = ref(props.modelValue)
const showDatePicker = ref(false)

// Computed date format
const dateFormat = computed(() => {
  if (props.dateOptions?.format) {
    return typeof props.dateOptions.format === 'string'
      ? props.dateOptions.format
      : 'yyyy-MM-dd'
  }
  return 'yyyy-MM-dd'
})

// Handle input changes
function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  let newValue = target.value

  // Apply formatting based on type
  switch (props.type) {
    case 'credit-card':
      // Credit card formatting logic
      newValue = newValue.replace(/\D/g, '')
      newValue = newValue.replace(/(\d{4})/g, '$1 ').trim()
      break
    case 'date':
      // Date formatting logic
      try {
        const parsedDate = parse(newValue, dateFormat.value, new Date())
        if (!isNaN(parsedDate.getTime())) {
          newValue = formatDate(parsedDate)
        }
      }
      catch (e) {
        // Invalid date format
        emit('invalidDate')
      }
      break
    case 'numeral':
      // Numeral formatting logic
      // Implement numeral formatting
      break
    case 'time':
      // Time formatting logic
      // Implement time formatting
      break
  }

  formattedValue.value = newValue
  emit('update:modelValue', newValue)
}

// Watch for external modelValue changes
watch(() => props.modelValue, (newValue) => {
  formattedValue.value = newValue
})

// Format date based on props
function formatDate(date: Date): string {
  if (props.dateOptions?.format) {
    const formatFn = typeof props.dateOptions.format === 'function'
      ? props.dateOptions.format
      : (d: Date) => format(d, props.dateOptions?.format as string, {
          locale: props.dateOptions?.formatLocale,
        })
    return formatFn(date)
  }
  return format(date, dateFormat.value, {
    locale: props.dateOptions?.formatLocale,
  })
}

// Handle date picker events
function handleDatePickerEvents(event: string, value?: any) {
  switch (event) {
    case 'update:model-value':
      formattedValue.value = value
      emit('update:modelValue', value)
      break
    case 'closed':
      showDatePicker.value = false
      emit('closed')
      break
    case 'open':
      showDatePicker.value = true
      emit('open')
      break
    case 'focus':
      emit('focus')
      break
    case 'blur':
      emit('blur')
      break
    case 'date-update':
      emit('dateUpdate')
      break
    case 'invalid-date':
      emit('invalidDate')
      break
    case 'range-start':
      emit('rangeStart')
      break
    case 'range-end':
      emit('rangeEnd')
      break
    case 'time-picker-open':
      emit('timePickerOpen')
      break
    case 'time-picker-close':
      emit('timePickerClose')
      break
    case 'am-pm-change':
      emit('amPmChange')
      break
    case 'update:model-timezone-value':
      emit('update:modelTimezoneValue', value)
      break
  }
}
</script>

<template>
  <div class="base-input-wrapper">
    <input
      v-if="type !== 'date'"
      ref="inputRef"
      v-model="formattedValue"
      :type="type === 'text' ? 'text' : 'text'"
      :class="className"
      :placeholder="placeholder"
      @input="handleInput"
      @focus="emit('focus')"
      @blur="emit('blur')"
    >

    <DateTimePicker
      v-if="type === 'date'"
      v-model="formattedValue"
      :class="className"
      :placeholder="placeholder"
      :format="dateOptions?.format"
      :format-locale="dateOptions?.formatLocale"
      :flow="dateOptions?.flow"
      :min-date="dateOptions?.minDate"
      :max-date="dateOptions?.maxDate"
      :enable-time-picker="dateOptions?.enableTimePicker"
      :time-picker="dateOptions?.timePicker"
      :is24="dateOptions?.is24"
      :enable-seconds="dateOptions?.enableSeconds"
      :enable-minutes="dateOptions?.enableMinutes"
      :hours-increment="dateOptions?.hoursIncrement"
      :minutes-increment="dateOptions?.minutesIncrement"
      :seconds-increment="dateOptions?.secondsIncrement"
      :hours-grid-increment="dateOptions?.hoursGridIncrement"
      :minutes-grid-increment="dateOptions?.minutesGridIncrement"
      :seconds-grid-increment="dateOptions?.secondsGridIncrement"
      :disabled-dates="dateOptions?.disabledDates"
      :disabled-times="dateOptions?.disabledTimes"
      :week-start="dateOptions?.weekStart"
      :month-name-format="dateOptions?.monthNameFormat"
      :auto-apply="dateOptions?.autoApply"
      :range="dateOptions?.range"
      :multi-calendars="dateOptions?.multiCalendars"
      :month-picker="dateOptions?.monthPicker"
      :year-picker="dateOptions?.yearPicker"
      :week-picker="dateOptions?.weekPicker"
      :quarter-picker="dateOptions?.quarterPicker"
      :multi-dates="dateOptions?.multiDates"
      :inline="dateOptions?.inline"
      :text-input="dateOptions?.textInput"
      :vertical="dateOptions?.vertical"
      :model-auto="dateOptions?.modelAuto"
      :utc="dateOptions?.utc"
      :timezone="dateOptions?.timezone"
      :dark="dateOptions?.dark"
      :position="dateOptions?.position"
      @update:model-value="(v) => handleDatePickerEvents('update:model-value', v)"
      @closed="handleDatePickerEvents('closed')"
      @open="handleDatePickerEvents('open')"
      @focus="handleDatePickerEvents('focus')"
      @blur="handleDatePickerEvents('blur')"
      @date-update="handleDatePickerEvents('date-update')"
      @invalid-date="handleDatePickerEvents('invalid-date')"
      @range-start="handleDatePickerEvents('range-start')"
      @range-end="handleDatePickerEvents('range-end')"
      @time-picker-open="handleDatePickerEvents('time-picker-open')"
      @time-picker-close="handleDatePickerEvents('time-picker-close')"
      @am-pm-change="handleDatePickerEvents('am-pm-change')"
      @update:model-timezone-value="(v) => handleDatePickerEvents('update:model-timezone-value', v)"
    />
  </div>
</template>

<style scoped>
.base-input-wrapper {
  position: relative;
  display: inline-block;
}
</style>
