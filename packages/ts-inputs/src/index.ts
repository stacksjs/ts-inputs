import type { CreditCardType } from './credit-card/constants'

import type { FormatCreditCardOptions } from './credit-card/types'

import type {
  CursorTrackerDestructor,
  RegisterCursorTrackerPropsType,
} from './cursor-tracker/types'
import type { DatePatternType, DateUnit, FormatDateOptions } from './date/types'

import type { FormatGeneralOptions } from './general/types'
import type { FormatNumeralOptions } from './numeral/types'
import type {
  FormatTimeOptions,
  TimeFormatType,
  TimePatternType,
  TimeUnit,
} from './time/types'

import {
  formatCreditCard,
  getCreditCardType,
  unformatCreditCard,
} from './credit-card'
import { DefaultCreditCardDelimiter } from './credit-card/constants'

import { registerCursorTracker } from './cursor-tracker'
import { formatDate } from './date'
import { DefaultDateDelimiter } from './date/constants'

import { formatGeneral, unformatGeneral } from './general'
import { formatNumeral, unformatNumeral } from './numeral'
import {
  DefaultNumeralDelimiter,
  NumeralThousandGroupStyles,
} from './numeral/constants'
import { formatTime } from './time'

import { DefaultTimeDelimiter } from './time/constants'

export type {
  CreditCardType,
  CursorTrackerDestructor,
  DatePatternType,
  DateUnit,
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
  registerCursorTracker,
  unformatCreditCard,
  unformatGeneral,
  unformatNumeral,
}
