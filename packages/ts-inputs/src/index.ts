import type { CreditCardType } from './credit-card/constants'
import type { FormatCreditCardOptions } from './credit-card/types'

import type {
  CursorTrackerDestructor,
  RegisterCursorTrackerPropsType,
} from './cursor-tracker'

import type {
  DatePatternType,
  DateUnit,
  FormatDateOptions,
} from './date'

import type { FormatGeneralOptions } from './general'

import type { FormatNumeralOptions } from './numeral'
import type {
  FormatTimeOptions,
  TimeFormatType,
  TimePatternType,
  TimeUnit,
} from './time'

import type { DateValidationResult } from './utils/date'

import {
  DefaultCreditCardDelimiter,
  formatCreditCard,
  getCreditCardType,
  unformatCreditCard,
} from './credit-card'

import { registerCursorTracker } from './cursor-tracker'

import {
  DefaultDateDelimiter,
  formatDate,
} from './date'

import {
  formatGeneral,
  unformatGeneral,
} from './general'

import {
  DefaultNumeralDelimiter,
  formatNumeral,
  NumeralThousandGroupStyles,
  unformatNumeral,
} from './numeral'

import { DefaultTimeDelimiter, formatTime } from './time'

import {
  parseDate,
  validateDate,
} from './utils/date'

export type {
  CreditCardType,
  CursorTrackerDestructor,
  DatePatternType,
  DateUnit,
  DateValidationResult,
  FormatCreditCardOptions,
  FormatDateOptions,
  FormatGeneralOptions,
  FormatNumeralOptions,
  FormatTimeOptions,
  RegisterCursorTrackerPropsType,
  TimeFormatType,
  TimePatternType,
  TimeUnit,
}

export {
  DefaultCreditCardDelimiter,
  DefaultDateDelimiter,
  DefaultNumeralDelimiter,
  DefaultTimeDelimiter,
  formatCreditCard,
  formatDate,
  formatGeneral,
  formatNumeral,
  formatTime,
  getCreditCardType,
  NumeralThousandGroupStyles,
  parseDate,
  registerCursorTracker,
  unformatCreditCard,
  unformatGeneral,
  unformatNumeral,
  validateDate,
}
