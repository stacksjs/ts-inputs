import type { Locale } from 'date-fns'
import type {
  FormatCreditCardOptions,
  FormatNumeralOptions,
  FormatTimeOptions,
  NumeralThousandGroupStyles,
  TimeFormatType,
  TimePatternType,
} from 'ts-inputs'

export type InputType = 'text' | 'credit-card' | 'date' | 'numeral' | 'time' | 'google-places'

export interface TSInputsProps {
  modelValue: string
  type: InputType
  placeholder?: string
  className?: string
  // Credit Card specific props
  creditCardOptions?: Omit<FormatCreditCardOptions, 'delimiter'>
  // Date specific props
  dateFormat?: string
  dateLocale?: string | Locale
  enableTimePicker?: boolean
  timePicker?: boolean
  monthPicker?: boolean
  yearPicker?: boolean
  format?: string | ((date: Date) => string)
  // Numeral specific props
  numeralOptions?: Omit<FormatNumeralOptions, 'delimiter' | 'thousandGroupStyle'>
  // Time specific props
  timeOptions?: Omit<FormatTimeOptions, 'format' | 'pattern' | 'delimiter'>
  // Google Places specific props
  placesOptions?: {
    apiKey: string
    types?: string[]
    componentRestrictions?: {
      country: string | string[]
    }
  }
}

// Keep existing interfaces for backward compatibility
export interface CreditCardInputProps {
  modelValue: string
  delimiter?: string
  className?: string
  placeholder?: string
  options?: Omit<FormatCreditCardOptions, 'delimiter'>
}
export interface NumeralInputProps {
  modelValue: string
  delimiter?: string
  thousandGroupStyle?: NumeralThousandGroupStyles
  className?: string
  options?: Omit<FormatNumeralOptions, 'delimiter' | 'thousandGroupStyle'>
}
