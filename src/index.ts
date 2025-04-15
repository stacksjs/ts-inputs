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

// Vue Component Types
import type {
  CreditCardInputProps,
  DateInputProps,
  InputEmits,
  NumeralInputProps,
  TimeInputProps,
} from './vue/types'

// Vue Components
import {
  CreditCardInput,
  DateInput,
  NumeralInput,
  TimeInput,
} from './components/index'

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
  // Vue Component Types
  CreditCardInputProps,

  // credit card
  CreditCardType,
  CursorTrackerDestructor,
  DateInputProps,
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
  InputEmits,
  NumeralInputProps,
  // cursor tracker
  RegisterCursorTrackerPropsType,
  RequireExactlyOne,
  TimeFormatType,
  TimeInputProps,
  TimePatternType,
  // time
  TimeUnit,
}

export {
  // Vue Components
  CreditCardInput,

  DateInput,
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
  NumeralInput,

  NumeralThousandGroupStyles,
  // cursor tracker
  registerCursorTracker,

  TimeInput,
  unformatCreditCard,
  unformatGeneral,
  unformatNumeral,
}
