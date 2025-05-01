<script setup lang="ts">
import type { TSInputsProps } from '../types'
import { format, parse } from 'date-fns'
import { CreditCardType, formatNumeral } from 'ts-inputs'
import { computed, onMounted, ref, watch } from 'vue'
import DateTimePicker from './datetime-picker/DateTimePicker.vue'
import NumeralInput from './numeral/NumeralInput.vue'

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
  (e: 'placeSelected', place: any): void
  (e: 'cardType', type: CreditCardType): void
  (e: 'invalidNumeral'): void
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const formattedValue = ref(props.modelValue)
const showDatePicker = ref(false)
const autocomplete = ref<google.maps.places.Autocomplete | null>(null)

// Initialize Google Places Autocomplete if type is 'places'
onMounted(() => {
  if (props.type === 'places' && props.placesOptions?.apiKey) {
    if (!window.google) {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${props.placesOptions.apiKey}&libraries=places`
      script.async = true
      script.defer = true
      document.head.appendChild(script)
      script.onload = initAutocomplete
    }
    else {
      initAutocomplete()
    }
  }
})

function initAutocomplete() {
  if (!inputRef.value || !props.placesOptions?.apiKey)
    return

  autocomplete.value = new google.maps.places.Autocomplete(inputRef.value, {
    types: props.placesOptions.types || ['address'],
    componentRestrictions: props.placesOptions.componentRestrictions || { country: 'us' },
  })

  autocomplete.value.addListener('place_changed', () => {
    const place = autocomplete.value?.getPlace()
    if (place && place.formatted_address) {
      formattedValue.value = place.formatted_address
      emit('update:modelValue', place.formatted_address)
      emit('placeSelected', place)
    }
  })
}

// Computed date format
const dateFormat = computed(() => {
  if (props.dateOptions?.format) {
    return typeof props.dateOptions.format === 'string'
      ? props.dateOptions.format
      : 'yyyy-MM-dd'
  }
  return 'yyyy-MM-dd'
})

// Format credit card number
function formatCreditCard(value: string): string {
  const cleanValue = value.replace(/\D/g, '')
  const delimiter = props.creditCardOptions?.delimiter || ' '

  // Determine card type based on first digits
  const firstDigit = cleanValue.charAt(0)
  const firstTwoDigits = cleanValue.slice(0, 2)
  const firstFourDigits = cleanValue.slice(0, 4)

  let cardType: CreditCardType | null = null

  // Check card type
  if (firstDigit === '4') {
    cardType = CreditCardType.VISA
  }
  else if (firstTwoDigits === '34' || firstTwoDigits === '37') {
    cardType = CreditCardType.AMEX
  }
  else if (firstTwoDigits >= '51' && firstTwoDigits <= '55') {
    cardType = CreditCardType.MASTERCARD
  }
  else if (firstFourDigits === '6011' || firstTwoDigits === '65') {
    cardType = CreditCardType.DISCOVER
  }
  else if (firstTwoDigits === '36' || firstTwoDigits === '38' || firstTwoDigits === '39') {
    cardType = CreditCardType.DINERS
  }
  else if (firstTwoDigits === '35') {
    cardType = CreditCardType.JCB
  }

  if (cardType) {
    emit('cardType', cardType)
  }

  // Format based on card type
  let formatted = cleanValue
  if (cardType === CreditCardType.AMEX) {
    // AMEX: XXXX XXXXXX XXXXX
    formatted = cleanValue.replace(/(\d{4})(\d{6})(\d{5})/, `$1${delimiter}$2${delimiter}$3`)
  }
  else {
    // Other cards: XXXX XXXX XXXX XXXX
    formatted = cleanValue.replace(/(\d{4})/g, `$1${delimiter}`).trim()
  }

  return formatted
}

// Handle input changes
function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  let newValue = target.value

  // Apply formatting based on type
  switch (props.type) {
    case 'credit-card':
      newValue = formatCreditCard(newValue)
      break
    case 'date':
      // Date formatting logic
      try {
        const parsedDate = parse(newValue, dateFormat.value, new Date())
        if (!Number.isNaN(parsedDate.getTime())) {
          newValue = formatDate(parsedDate)
        }
      }
      catch {
        // Invalid date format
        emit('invalidDate')
      }
      break
    case 'numeral':
      // Numeral formatting logic
      try {
        const formatOptions = {
          delimiter: props.numeralOptions?.delimiter || ',',
          numeralThousandsGroupStyle: props.numeralOptions?.thousandGroupStyle || 'thousand',
          numeralIntegerScale: props.numeralOptions?.integerScale || 0,
          numeralDecimalMark: props.numeralOptions?.decimalMark || '.',
          numeralDecimalScale: props.numeralOptions?.decimalScale || 2,
          stripLeadingZeroes: props.numeralOptions?.stripLeadingZeroes ?? true,
          numeralPositiveOnly: props.numeralOptions?.positiveOnly ?? false,
          tailPrefix: props.numeralOptions?.tailPrefix ?? false,
          signBeforePrefix: props.numeralOptions?.signBeforePrefix ?? false,
          prefix: props.numeralOptions?.prefix || '',
        }
        newValue = formatNumeral(newValue, formatOptions)
      }
      catch (err) {
        // Invalid number format
        emit('invalidNumeral')
      }
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
    <NumeralInput
      v-if="type === 'numeral'"
      v-model="formattedValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :delimiter="numeralOptions?.delimiter"
      :thousand-group-style="numeralOptions?.thousandGroupStyle"
      :integer-scale="numeralOptions?.integerScale"
      :decimal-mark="numeralOptions?.decimalMark"
      :decimal-scale="numeralOptions?.decimalScale"
      :strip-leading-zeroes="numeralOptions?.stripLeadingZeroes"
      :positive-only="numeralOptions?.positiveOnly"
      :tail-prefix="numeralOptions?.tailPrefix"
      :sign-before-prefix="numeralOptions?.signBeforePrefix"
      :prefix="numeralOptions?.prefix"
      @focus="emit('focus')"
      @blur="emit('blur')"
    />
    <input
      v-else-if="type !== 'date' && type !== 'places'"
      ref="inputRef"
      v-model="formattedValue"
      :type="type === 'text' ? 'text' : 'text'"
      :class="className"
      :placeholder="placeholder"
      :maxlength="type === 'credit-card' ? '19' : undefined"
      @input="handleInput"
      @focus="emit('focus')"
      @blur="emit('blur')"
    >

    <input
      v-if="type === 'places'"
      ref="inputRef"
      v-model="formattedValue"
      type="text"
      :class="className"
      :placeholder="placeholder"
      autocomplete="off"
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
