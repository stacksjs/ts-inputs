import type { BlocksType } from '../common/types'
import type {
  DateCalculateOptions,
  DatePatternType,
  DateUnit,
  FormatDateOptions,
  InitDateRangeResults,
} from './types'
import {
  getFormattedValue,
  getMaxLength,
  headStr,
  stripDelimiters,
  stripNonNumeric,
} from '../common/utils'
import { DefaultDateDelimiter, DefaultDatePattern } from './constants'

function getBlocksByDatePattern(datePattern: DatePatternType): BlocksType {
  const blocks: BlocksType = []
  datePattern.forEach((value: DateUnit) => {
    if (value === 'Y') {
      blocks.push(4)
    }
    else {
      blocks.push(2)
    }
  })
  return blocks
}

function getDateRange({
  dateMin,
  dateMax,
}: {
  dateMin: string
  dateMax: string
}): InitDateRangeResults {
  const min: number[] = dateMin
    .split('-')
    .reverse()
    .map((x: string) => Number.parseInt(x, 10))
  if (min.length === 2)
    min.unshift(0)

  const max: number[] = dateMax
    .split('-')
    .reverse()
    .map((x: string) => Number.parseInt(x, 10))
  if (max.length === 2)
    max.unshift(0)

  return { min, max }
}

function addLeadingZeroForYear(number: number, fullYearMode: boolean): string {
  if (fullYearMode) {
    return (
      (number < 10 ? '000' : number < 100 ? '00' : number < 1000 ? '0' : '')
      + number
    )
  }

  return (number < 10 ? '0' : '') + number
}

function addLeadingZero(number: number): string {
  return (number < 10 ? '0' : '') + number
}

function getValidatedDate({
  value = '',
  blocks = [],
  datePattern,
  min,
  max,
}: DateCalculateOptions): string {
  let result = ''

  blocks.forEach((length: number, index: number) => {
    if (value.length > 0) {
      let sub = value.slice(0, length)
      const sub0 = sub.slice(0, 1)
      const rest = value.slice(length)

      switch (datePattern[index]) {
        case 'd':
          if (sub === '00') {
            sub = '01'
          }
          else if (Number.parseInt(sub0, 10) > 3) {
            sub = `0${sub0}`
          }
          else if (Number.parseInt(sub, 10) > 31) {
            sub = '31'
          }

          break

        case 'm':
          if (sub === '00') {
            sub = '01'
          }
          else if (Number.parseInt(sub0, 10) > 1) {
            sub = `0${sub0}`
          }
          else if (Number.parseInt(sub, 10) > 12) {
            sub = '12'
          }

          break
      }

      result += sub

      // update remaining string
      value = rest
    }
  })

  return getFixedDateString({ value: result, datePattern, min, max })
}

function getFixedDateString({
  value = '',
  datePattern,
  min,
  max,
}: DateCalculateOptions): string {
  let date: number[] = []
  let dayIndex = 0
  let monthIndex = 0
  let yearIndex = 0
  let dayStartIndex = 0
  let monthStartIndex = 0
  let yearStartIndex = 0
  let day
  let month
  let year
  let fullYearDone = false

  // mm-dd || dd-mm
  if (
    value.length === 4
    && datePattern[0].toLowerCase() !== 'y'
    && datePattern[1].toLowerCase() !== 'y'
  ) {
    dayStartIndex = datePattern[0] === 'd' ? 0 : 2
    monthStartIndex = 2 - dayStartIndex
    day = Number.parseInt(value.slice(dayStartIndex, dayStartIndex + 2), 10)
    month = Number.parseInt(value.slice(monthStartIndex, monthStartIndex + 2), 10)

    date = getFixedDate(day, month, 0)
  }

  // yyyy-mm-dd || yyyy-dd-mm || mm-dd-yyyy || dd-mm-yyyy || dd-yyyy-mm || mm-yyyy-dd
  if (value.length === 8) {
    datePattern.forEach((type: DateUnit, index: number) => {
      switch (type) {
        case 'd':
          dayIndex = index
          break
        case 'm':
          monthIndex = index
          break
        default:
          yearIndex = index
          break
      }
    })

    yearStartIndex = yearIndex * 2
    dayStartIndex = dayIndex <= yearIndex ? dayIndex * 2 : dayIndex * 2 + 2
    monthStartIndex
      = monthIndex <= yearIndex ? monthIndex * 2 : monthIndex * 2 + 2

    day = Number.parseInt(value.slice(dayStartIndex, dayStartIndex + 2), 10)
    month = Number.parseInt(value.slice(monthStartIndex, monthStartIndex + 2), 10)
    year = Number.parseInt(value.slice(yearStartIndex, yearStartIndex + 4), 10)

    fullYearDone = value.slice(yearStartIndex, yearStartIndex + 4).length === 4

    date = getFixedDate(day, month, year)
  }

  // mm-yy || yy-mm
  if (
    value.length === 4
    && (datePattern[0] === 'y' || datePattern[1] === 'y')
  ) {
    monthStartIndex = datePattern[0] === 'm' ? 0 : 2
    yearStartIndex = 2 - monthStartIndex
    month = Number.parseInt(value.slice(monthStartIndex, monthStartIndex + 2), 10)
    year = Number.parseInt(value.slice(yearStartIndex, yearStartIndex + 2), 10)

    fullYearDone = value.slice(yearStartIndex, yearStartIndex + 2).length === 2

    date = [0, month, year]
  }

  // mm-yyyy || yyyy-mm
  if (
    value.length === 6
    && (datePattern[0] === 'Y' || datePattern[1] === 'Y')
  ) {
    monthStartIndex = datePattern[0] === 'm' ? 0 : 4
    yearStartIndex = 2 - 0.5 * monthStartIndex
    month = Number.parseInt(value.slice(monthStartIndex, monthStartIndex + 2), 10)
    year = Number.parseInt(value.slice(yearStartIndex, yearStartIndex + 4), 10)

    fullYearDone = value.slice(yearStartIndex, yearStartIndex + 4).length === 4

    date = [0, month, year]
  }

  date = getRangeFixedDate({ date, datePattern, min, max })

  const result: string
    = date.length === 0
      ? value
      : datePattern.reduce((previous: string, current: DateUnit) => {
          switch (current) {
            case 'd':
              return previous + (date[0] === 0 ? '' : addLeadingZero(date[0]))
            case 'm':
              return previous + (date[1] === 0 ? '' : addLeadingZero(date[1]))
            case 'y':
              return (
                previous
                + (fullYearDone ? addLeadingZeroForYear(date[2], false) : '')
              )
            case 'Y':
              return (
                previous
                + (fullYearDone ? addLeadingZeroForYear(date[2], true) : '')
              )
          }
          return previous
        }, '')

  return result
}

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

function getFixedDate(day: number, month: number, year: number): number[] {
  day = Math.min(day, 31)
  month = Math.min(month, 12)
  year = year ?? 0

  if ((month < 7 && month % 2 === 0) || (month > 8 && month % 2 === 1)) {
    day = Math.min(day, month === 2 ? (isLeapYear(year) ? 29 : 28) : 30)
  }

  return [day, month, year]
}

function getRangeFixedDate({
  date = [],
  min,
  max,
  datePattern,
}: DateCalculateOptions): number[] {
  if (date.length === 0 || (min.length < 3 && max.length < 3))
    return date

  const hasYearInPattern: boolean
    = datePattern.filter((x: DateUnit) => x.toLowerCase() === 'y').length > 0
  if (hasYearInPattern && date[2] === 0) {
    return date
  }

  if (
    max.length > 0
    && (max[2] < date[2]
      || (max[2] === date[2]
        && (max[1] < date[1] || (max[1] === date[1] && max[0] < date[0]))))
  ) {
    return max
  }

  if (
    min.length > 0
    && (min[2] > date[2]
      || (min[2] === date[2]
        && (min[1] > date[1] || (min[1] === date[1] && min[0] > date[0]))))
  ) {
    return min
  }

  return date
}

export function formatDate(value: string, options?: FormatDateOptions): string {
  const {
    delimiterLazyShow = false,
    delimiter = DefaultDateDelimiter,
    datePattern = DefaultDatePattern,
    dateMax = '',
    dateMin = '',
  } = options ?? {}
  // strip non-numeric characters
  value = stripNonNumeric(value)

  const blocks: BlocksType = getBlocksByDatePattern(datePattern)
  const { min, max } = getDateRange({
    dateMax,
    dateMin,
  })

  value = getValidatedDate({
    value,
    blocks,
    datePattern,
    min,
    max,
  })

  // strip delimiters
  value = stripDelimiters({
    value,
    delimiters: [delimiter],
  })

  // max length
  const maxLength = getMaxLength(blocks)
  value = headStr(value, maxLength)

  // calculate
  value = getFormattedValue({
    value,
    blocks,
    delimiter,
    delimiterLazyShow,
  })

  return value
}

export * from './constants'
export * from './types'
