import type { Locale } from 'date-fns'
import type {
  FormatCreditCardOptions,
  FormatNumeralOptions,
  FormatTimeOptions,
  NumeralThousandGroupStyles,
} from 'ts-inputs'

import type { TimeZoneConfig } from './components/datetime-picker/interfaces'

export type InputType = 'text' | 'number' | 'email' | 'password' | 'tel' | 'url' | 'search' | 'date' | 'time' | 'datetime-local' | 'month' | 'week' | 'color' | 'range' | 'file' | 'hidden' | 'image' | 'submit' | 'reset' | 'button' | 'credit-card' | 'numeral' | 'phone' | 'places'

export interface TSInputsProps {
  modelValue: string
  type: InputType
  placeholder?: string
  className?: string
  disabled?: boolean
  readonly?: boolean
  // Credit Card specific props
  creditCardOptions?: FormatCreditCardOptions
  // Numeral specific props
  numeralOptions?: {
    delimiter?: string
    thousandGroupStyle?: NumeralThousandGroupStyles
    integerScale?: number
    decimalMark?: string
    decimalScale?: number
    stripLeadingZeroes?: boolean
    positiveOnly?: boolean
    tailPrefix?: boolean
    signBeforePrefix?: boolean
    prefix?: string
  }
  // Time specific props
  timeOptions?: Omit<FormatTimeOptions, 'format' | 'pattern' | 'delimiter'>
  // Date specific props
  dateOptions?: {
    // Basic configuration
    format?: string | ((_date: Date) => string) | undefined
    formatLocale?: Locale
    minDate?: Date | string
    maxDate?: Date | string
    weekStart?: number
    monthNameFormat?: 'long' | 'short'
    autoApply?: boolean
    dark?: boolean
    position?: 'center' | 'left' | 'right' | 'top' | 'bottom'

    // Modes - these are direct props
    range?: boolean
    multiCalendars?: boolean
    monthPicker?: boolean
    timePicker?: boolean
    yearPicker?: boolean
    weekPicker?: boolean
    quarterPicker?: boolean
    multiDates?: boolean
    inline?: boolean
    textInput?: boolean
    vertical?: boolean
    modelAuto?: boolean
    utc?: boolean | 'preserve'
    flow?: ('month' | 'year' | 'calendar' | 'time' | 'minutes' | 'hours' | 'seconds')[]

    // Time picker specific
    enableTimePicker?: boolean
    is24?: boolean
    enableSeconds?: boolean
    enableMinutes?: boolean
    hoursIncrement?: number
    minutesIncrement?: number
    secondsIncrement?: number
    hoursGridIncrement?: number
    minutesGridIncrement?: number
    secondsGridIncrement?: number

    // Validation
    disabledDates?: Date[] | ((_date: Date) => boolean)
    disabledTimes?: { hours: number, minutes: number }[] | ((_date: Date) => boolean)

    // Timezone
    timezone?: string | TimeZoneConfig
  }
  // Google Places specific props
  placesOptions?: {
    apiKey: string
    types?: string[]
    componentRestrictions?: {
      country: string | string[]
    }
  }
  phoneOptions?: PhoneOptions
}

// Keep existing interfaces for backward compatibility
export interface CreditCardInputProps {
  modelValue: string
  delimiter?: string
  className?: string
  placeholder?: string
  options?: FormatCreditCardOptions
}

export interface NumeralInputProps {
  modelValue: string
  delimiter?: string
  thousandGroupStyle?: NumeralThousandGroupStyles
  className?: string
  options?: FormatNumeralOptions
}

export interface PlacesOptions {
  apiKey: string
  types?: string[]
  componentRestrictions?: {
    country: string | string[]
  }
}

export interface PhoneOptions {
  delimiter?: string
  region?: string
  includeCountryCode?: boolean
  format?: 'national' | 'international'
}
