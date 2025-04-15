import type {
  BlocksType,
  DelimiterType,
  RequireExactlyOne,
} from './common/types'
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
  BlocksType,
  // credit card
  CreditCardType,

  CursorTrackerDestructor,
  DatePatternType,
  // date
  DateUnit,
  // general
  DelimiterType,

  FormatCreditCardOptions,
  FormatDateOptions,

  FormatGeneralOptions,

  // numeral
  FormatNumeralOptions,
  FormatTimeOptions,
  // cursor tracker
  RegisterCursorTrackerPropsType,

  RequireExactlyOne,
  TimeFormatType,
  TimePatternType,
  // time
  TimeUnit,
}

export {
  DefaultCreditCardDelimiter,

  DefaultDateDelimiter,
  DefaultNumeralDelimiter,

  DefaultTimeDelimiter,
  // credit card
  formatCreditCard,
  // date
  formatDate,
  // general
  formatGeneral,

  // numeral
  formatNumeral,
  // time
  formatTime,
  getCreditCardType,
  NumeralThousandGroupStyles,

  // cursor tracker
  registerCursorTracker,
  unformatCreditCard,

  unformatGeneral,
  unformatNumeral,
}
