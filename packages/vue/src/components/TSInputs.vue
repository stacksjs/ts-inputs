<script setup lang="ts">
import type { TSInputsProps } from '../types'
import { format } from 'date-fns'
import { ref, watch } from 'vue'
import DpCalendar from './datetime-picker/components/DatePicker/DpCalendar.vue'
import DpHeader from './datetime-picker/components/DatePicker/DpHeader.vue'
import TimePicker from './datetime-picker/components/TimePicker/TimePicker.vue'

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
const showDatePicker = ref(true)

// Date picker state
const month = ref(new Date().getMonth())
const year = ref(new Date().getFullYear())
const time = ref({ hours: 0, minutes: 0, seconds: 0 })

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
      showDatePicker.value = true
      break
    case 'numeral':
      // Numeral formatting logic
      // Implement numeral formatting
      break
    case 'time':
      // Time formatting logic
      // Implement time formatting
      break
    // Add other cases as needed
  }

  formattedValue.value = newValue
  emit('update:modelValue', newValue)
}

// Watch for external modelValue changes
watch(() => props.modelValue, (newValue) => {
  formattedValue.value = newValue
})

// Handle date selection
function handleDateSelect(date: Date) {
  formattedValue.value = formatDate(date)
  showDatePicker.value = false
  emit('update:modelValue', formattedValue.value)
  emit('dateUpdate')
}

// Format date based on props
function formatDate(date: Date): string {
  if (props.dateFormat) {
    const locale = typeof props.dateLocale === 'string' ? undefined : props.dateLocale
    return format(date, props.dateFormat, { locale })
  }
  return date.toISOString()
}

// Update month and year
function handleMonthYearUpdate(value: { month: number, year: number }) {
  month.value = value.month
  year.value = value.year
  emit('updateMonthYear', value)
}

// Update time
function handleTimeUpdate(value: { hours: number, minutes: number, seconds: number }) {
  time.value = value
  emit('update:modelValue', formatDate(new Date(year.value, month.value, 1, value.hours, value.minutes, value.seconds)))
}
</script>

<template>
  <div class="ts-inputs-wrapper">
    <input
      ref="inputRef"
      v-model="formattedValue"
      :type="type === 'text' ? 'text' : 'text'"
      :class="className"
      :placeholder="placeholder"
      @input="handleInput"
      @focus="emit('focus')"
      @blur="emit('blur')"
    >

    <!-- Date Picker -->
    <div v-if="type === 'date' && showDatePicker" class="date-picker-container">
      <DpHeader
        :month="month"
        :year="year"
        @update-month-year="handleMonthYearUpdate"
      />
      <DpCalendar
        :days="[]"
        :month="month"
        :year="year"
        @select-date="handleDateSelect"
      />
      <TimePicker
        v-if="props.enableTimePicker"
        :time="time"
        @update-time="handleTimeUpdate"
      />
    </div>
  </div>
</template>

<style>
.dp__calendar {
  display: flex;
  flex-direction: column;
  background-color: red;
}

.ts-inputs-wrapper {
  position: relative;
  display: inline-block;
}

.date-picker-container {
  position: absolute;
  z-index: 1000;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
</style>
