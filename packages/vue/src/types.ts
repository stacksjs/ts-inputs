import type {
  FormatCreditCardOptions,
  FormatNumeralOptions,
  FormatTimeOptions,
  NumeralThousandGroupStyles,
  TimeFormatType,
  TimePatternType,
} from 'ts-inputs'

export interface CreditCardInputProps {
  modelValue: string
  delimiter?: string
  className?: string
  placeholder?: string
  options?: Omit<FormatCreditCardOptions, 'delimiter'>
}

export interface DateInputProps {
  modelValue: string
  format?: string
  locale?: string
  placeholder?: string
}

export interface NumeralInputProps {
  modelValue: string
  delimiter?: string
  thousandGroupStyle?: NumeralThousandGroupStyles
  className?: string
  options?: Omit<FormatNumeralOptions, 'delimiter' | 'thousandGroupStyle'>
}

export interface TimeInputProps {
  modelValue: string
  format?: TimeFormatType
  pattern?: TimePatternType
  delimiter?: string
  className?: string
  options?: Omit<FormatTimeOptions, 'format' | 'pattern' | 'delimiter'>
}
