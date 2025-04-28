import type { CreditCardType, NumeralThousandGroupStyles } from './constants'

export type RequireExactlyOne<T, Keys extends keyof T = keyof T> = {
  [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
}[Keys]

export type DelimiterType = string
export type BlocksType = number[]

export interface StripDelimitersProps {
  value: string
  delimiters: DelimiterType[]
}

export interface GetFormattedValueProps {
  value: string
  blocks: BlocksType
  delimiter?: DelimiterType
  delimiters?: DelimiterType[]
  delimiterLazyShow?: boolean
}

export type CursorTrackerDestructor = () => void

export type RegisterCursorTrackerPropsType = {
  input: HTMLInputElement
  prefix?: string
} & RequireExactlyOne<
  {
    delimiter: DelimiterType
    delimiters: DelimiterType[]
  },
  'delimiter' | 'delimiters'
>

interface CommonCalculateCursorIndexProps {
  value: string
  delimiters: DelimiterType[]
}

export interface CalculeteDirtyCursorIndexProps
  extends CommonCalculateCursorIndexProps {
  cleanCursorIndex: number
}

export interface CalculeteCleanCursorIndexProps
  extends CommonCalculateCursorIndexProps {
  dirtyCursorIndex: number
}

// Manipulate DOM Element to add this props, so prefix is required.
export interface CursorTrackerInputElement extends HTMLInputElement {
  CLEAVE_ZEN_cleanCursorIndex?: number
  CLEAVE_ZEN_cursor_tracker?: any
}

export type CreditCardBlocksType = Record<CreditCardType, BlocksType>
export type CreditCardRegexType = Record<
  CreditCardExcludeGeneralType<CreditCardType>,
  RegExp
>

export type CreditCardExcludeGeneralType<T> = T extends CreditCardType.GENERAL
  ? never
  : T

export interface GetCreditCardInfoProps {
  value: string
  strictMode?: boolean
}
export interface CreditCardInfoProps {
  type: CreditCardType
  blocks: BlocksType
}

export interface FormatCreditCardOptions {
  delimiter?: string
  strictMode?: boolean
  delimiterLazyShow?: boolean
}

export interface FormatGeneralOptions {
  blocks: BlocksType
  delimiterLazyShow?: boolean
  delimiter?: DelimiterType
  delimiters?: DelimiterType[]
  prefix?: string
  numericOnly?: boolean
  uppercase?: boolean
  lowercase?: boolean
}

export interface GetPrefixStrippedValueProps {
  value: string
  prefix: string
  tailPrefix: boolean
}

export interface FormatNumeralOptions {
  delimiter?: DelimiterType
  numeralThousandsGroupStyle?: NumeralThousandGroupStyles
  numeralIntegerScale?: number
  numeralDecimalMark?: string
  numeralDecimalScale?: number
  numeralPositiveOnly?: boolean
  tailPrefix?: boolean
  stripLeadingZeroes?: boolean
  signBeforePrefix?: boolean
  prefix?: string
}

export interface FormatNumeralRequiredProps {
  value: string
  delimiter: DelimiterType
  numeralThousandsGroupStyle: NumeralThousandGroupStyles
  numeralIntegerScale: number
  numeralDecimalMark: string
  numeralDecimalScale: number
  numeralPositiveOnly: boolean
  tailPrefix: boolean
  stripLeadingZeroes: boolean
  signBeforePrefix: boolean
  prefix: string
}

export type TimeUnit = 'h' | 'm' | 's'
export type TimePatternType = TimeUnit[]
export type TimeFormatType = '12' | '24'

export interface FormatTimeOptions {
  delimiterLazyShow?: boolean
  delimiter?: DelimiterType
  timePattern?: TimePatternType
  timeFormat?: TimeFormatType
}

export interface TimeFormatOptions {
  maxHourFirstDigit: number
  maxHours: number
  maxMinutesFirstDigit: number
  maxMinutes: number
}

export interface GetValidatedTimeProps {
  value: string
  blocks: BlocksType
  timePattern: TimePatternType
  timeFormat: TimeFormatType
}

export interface GetFixedTimeStringProps {
  value: string
  timePattern: TimePatternType
}
