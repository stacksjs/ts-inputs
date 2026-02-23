import type { Duration, Locale } from 'date-fns'
import type {
  DateTimeSetter,
  DateValue,
  Highlight,
  HighlightFn,
  IFormat,
  MaybeDate,
  PossibleDate,
  TimeModel,
  TimeObj,
  TimeType,
  WeekStartNum,
} from '../interfaces'

import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfWeek,
  format,
  getHours,
  getMinutes,
  getMonth,
  getSeconds,
  getYear,
  isAfter,
  isBefore,
  isDate,
  isEqual,
  isValid,
  parse,
  set,
  setHours,
  setMilliseconds,
  setMinutes,
  setMonth,
  setSeconds,
  setYear,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
} from 'date-fns'

import { errors } from './util'

export const padZero = (val: number): string | number => (val < 10 ? `0${val}` : val)

function parseTextToDate(value: string, pattern: string, time: TimeModel, inputVal?: string, onPaste?: boolean, locale?: Locale): Date | null {
  const parsedDate = parse(value, pattern.slice(0, value.length), new Date(), { locale })
  if (isValid(parsedDate) && isDate(parsedDate)) {
    if (inputVal || onPaste)
      return parsedDate
    return set(parsedDate, {
      hours: +time.hours,
      minutes: +time?.minutes,
      seconds: +time?.seconds,
      milliseconds: 0,
    })
  }
  return null
}

export function parseFreeInput(value: string, pattern: string | string[] | ((value: string) => Date | null), time: TimeModel | TimeModel[], inputVal?: string, onPaste?: boolean, locale?: Locale): Date | null {
  const defaultTime = Array.isArray(time) ? time[0] : time
  if (typeof pattern === 'string') {
    return parseTextToDate(value, pattern, defaultTime, inputVal, onPaste, locale)
  }

  if (Array.isArray(pattern)) {
    let parsedDate = null
    for (const textVal of pattern) {
      parsedDate = parseTextToDate(value, textVal, defaultTime, inputVal, onPaste, locale)
      if (parsedDate) {
        break
      }
    }
    return parsedDate
  }

  if (typeof pattern === 'function') {
    return pattern(value)
  }

  return null
}

export const getDate = (value?: PossibleDate): Date => (value ? new Date(value) : new Date())

export function dateToUtc(date: Date, preserve: boolean, _enableSeconds: boolean): string {
  if (preserve) {
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')
    return `${date.getFullYear()}-${month}-${day}T${hours}:${minutes}:${seconds}.000Z`
  }

  const utcDate = new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
    date.getUTCMilliseconds(),
  )
  return utcDate.toISOString()
}

// Reset date time
export function resetDateTime(value: Date | string, beginning?: boolean): Date {
  const dateParse = getDate(JSON.parse(JSON.stringify(value)))
  const timeReset = set(dateParse, { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 })
  return beginning ? startOfMonth(timeReset) : timeReset
}

export function setDateTime(date: Date | null, hours?: DateTimeSetter, minutes?: DateTimeSetter, seconds?: DateTimeSetter): Date {
  let dateCopy = date ? getDate(date) : getDate()
  if (hours || hours === 0) {
    dateCopy = setHours(dateCopy, +hours)
  }
  if (minutes || minutes === 0) {
    dateCopy = setMinutes(dateCopy, +minutes)
  }
  if (seconds || seconds === 0) {
    dateCopy = setSeconds(dateCopy, +seconds)
  }
  return setMilliseconds(dateCopy, 0)
}

export function isDateBefore(date: DateValue, dateToCompare: DateValue): boolean {
  if (!date || !dateToCompare) {
    return false
  }
  return isBefore(resetDateTime(date), resetDateTime(dateToCompare))
}

export function isDateEqual(date: DateValue, dateToCompare: DateValue): boolean {
  if (!date || !dateToCompare) {
    return false
  }
  return isEqual(resetDateTime(date), resetDateTime(dateToCompare))
}

export function isDateAfter(date: DateValue, dateToCompare: DateValue): boolean {
  if (!date || !dateToCompare) {
    return false
  }
  return isAfter(resetDateTime(date), resetDateTime(dateToCompare))
}

export function isDateBetween(range: Date[], hoverDate: Date | null, dateToCheck: Date): boolean {
  if (range?.[0] && range?.[1]) {
    return isDateAfter(dateToCheck, range[0]) && isDateBefore(dateToCheck, range[1])
  }
  if (range?.[0] && hoverDate) {
    return (
      (isDateAfter(dateToCheck, range[0]) && isDateBefore(dateToCheck, hoverDate))
      || (isDateBefore(dateToCheck, range[0]) && isDateAfter(dateToCheck, hoverDate))
    )
  }
  return false
}

export function resetDate(date: Date | string): Date {
  const onFirst = set(new Date(date), { date: 1 })
  return resetDateTime(onFirst)
}

export function sanitizeTime(time: TimeModel, type?: TimeType, value?: number): Duration {
  if (type && (value || value === 0)) {
    return Object.fromEntries(
      (['hours', 'minutes', 'seconds'] as TimeType[]).map((timeType) => {
        if (timeType === type)
          return [timeType, value]
        return [timeType, !Number.isNaN(+time[timeType]) ? +time[timeType] : undefined]
      }),
    )
  }
  return {
    hours: !Number.isNaN(+time.hours) ? +time.hours : undefined,
    minutes: !Number.isNaN(+time.minutes) ? +time.minutes : undefined,
    seconds: !Number.isNaN(+time.seconds) ? +time.seconds : undefined,
  }
}

export function getTimeObj(date: Date): TimeObj {
  return {
    hours: getHours(date),
    minutes: getMinutes(date),
    seconds: getSeconds(date),
  }
}

export function getMinMonth(year: number, minDate?: PossibleDate): number | undefined {
  if (minDate) {
    const minYear = getYear(getDate(minDate))
    if (minYear > year)
      return 12
    if (minYear === year)
      return getMonth(getDate(minDate))
  }
}

export function getMaxMonth(year: number, maxDate?: PossibleDate): number | undefined {
  if (maxDate) {
    const maxYear = getYear(getDate(maxDate))
    if (maxYear < year)
      return -1
    if (maxYear === year)
      return getMonth(getDate(maxDate))
    return undefined
  }
  return undefined
}

export function getMinMaxYear(minMaxDate: PossibleDate): number | undefined {
  if (minMaxDate)
    return getYear(getDate(minMaxDate))
  return undefined
}

export function getDaysInBetween(dateOne: Date, dateTwo: Date): Date[] {
  // Check if selection is backwards
  const start = isDateAfter(dateOne, dateTwo) ? dateTwo : dateOne
  const end = isDateAfter(dateTwo, dateOne) ? dateTwo : dateOne
  return eachDayOfInterval({ start, end })
}

// Add one month to a given date
export function getNextMonthYear(date: Date): { month: number, year: number } {
  const newDate = addMonths(date, 1)
  return { month: getMonth(newDate), year: getYear(newDate) }
}

export function getWeekFromDate(date: Date, weekStart: string | number): [Date, Date] {
  const start = startOfWeek(date, { weekStartsOn: +weekStart as WeekStartNum })
  const end = endOfWeek(date, { weekStartsOn: +weekStart as WeekStartNum })
  return [start, end]
}

export function assignDefaultTime(obj: TimeModel | Record<string, string | number>, enableSeconds: boolean): TimeModel {
  const defaultTime = {
    hours: getHours(getDate()),
    minutes: getMinutes(getDate()),
    seconds: enableSeconds ? getSeconds(getDate()) : 0,
  }
  return Object.assign(defaultTime, obj)
}

export function getDateForCompare(date: MaybeDate, month: number, year: number): [Date, Date] {
  return [set(getDate(date), { date: 1 }), set(getDate(), { month, year, date: 1 })]
}

export function setDateMonthOrYear(date: DateValue, month?: number | null, year?: number | null): Date {
  let dateCopy = date ? getDate(date) : getDate()
  if (month || month === 0) {
    dateCopy = setMonth(dateCopy, month)
  }
  if (year) {
    dateCopy = setYear(dateCopy, year)
  }
  return dateCopy
}

export function validateMonthYear(
  date: Date,
  maxDate: DateValue,
  minDate: DateValue,
  preventMinMaxNavigation: boolean,
  next: boolean,
): boolean {
  if (!preventMinMaxNavigation)
    return false
  if (next && !maxDate)
    return false
  if (!next && !minDate)
    return false
  const compareDate = next ? addMonths(date, 1) : subMonths(date, 1)
  const monthYear: [number, number] = [getMonth(compareDate), getYear(compareDate)]
  return next ? !validateMaxDate(...monthYear, maxDate as Date) : !validateMinDate(...monthYear, minDate as Date)
}

export function validateMinDate(month: number, year: number, minDate: Date): boolean {
  return (
    isDateBefore(...getDateForCompare(minDate, month, year))
    || isDateEqual(...getDateForCompare(minDate, month, year))
  )
}

export function validateMaxDate(month: number, year: number, maxDate: Date): boolean {
  return (
    isDateAfter(...getDateForCompare(maxDate, month, year))
    || isDateEqual(...getDateForCompare(maxDate, month, year))
  )
}

export function formatDate(
  value: Date | Date[],
  formatProp: IFormat | null,
  formatLocale: Locale | null,
  rangeSeparator: string,
  modelAuto: boolean,
  pattern: string,
  parser?: boolean,
): string {
  if (typeof formatProp === 'function' && !parser)
    return formatProp(value)
  const options = formatLocale ? { locale: formatLocale } : undefined

  if (Array.isArray(value)) {
    return `${format(value[0], pattern, options)}${modelAuto && !value[1] ? '' : rangeSeparator}${
      value[1] ? format(value[1], pattern, options) : ''
    }`
  }

  return format(value, pattern, options)
}

export function checkPartialRangeValue(isPartial: boolean): Date {
  if (isPartial)
    return null as unknown as Date
  throw new Error(errors.prop('partial-range'))
}

// Execute some code depending on the range prop, if not, throw error
export function checkRangeEnabled<T>(fn: () => T, range: boolean): T {
  if (range)
    return fn()
  throw new Error(errors.prop('range'))
}

export function isValidDate(value: Date | Date[] | null | (Date | null)[]): boolean {
  if (Array.isArray(value)) {
    return isValid(value[0]) && (value[1] ? isValid(value[1]) : true)
  }
  return value ? isValid(value) : false
}

export function setDateTimeFromObj(time: TimeModel, date?: Date | null): Date {
  return set(date ?? getDate(), {
    hours: +time.hours || 0,
    minutes: +time.minutes || 0,
    seconds: +time.seconds || 0,
  })
}

/**
 * Depending on the time or full date validation, validate if the selected time is valid
 * Extracted logic from isValidTime fn
 */
export function validateTime(date: Date | null, dateToCompare: Date, compare: 'max' | 'min', full: boolean): boolean {
  if (!date)
    return true
  if (full) {
    const valid = compare === 'max' ? isBefore(date, dateToCompare) : isAfter(date, dateToCompare)
    const setOptions = { seconds: 0, milliseconds: 0 }
    return valid || isEqual(set(date, setOptions), set(dateToCompare, setOptions))
  }
  return compare === 'max' ? date.getTime() <= dateToCompare.getTime() : date.getTime() >= dateToCompare.getTime()
}

function getDateForCompareValidation(minOrMax: TimeModel | null, selected: Date, minOrMaxDate: Date | string | null) {
  return minOrMax ? setDateTimeFromObj(minOrMax, selected) : getDate(minOrMaxDate ?? selected)
}

export function checkTimeMinMax(
  minOrMax: TimeModel | null,
  dateCompare: Date | string | null,
  map: 'min' | 'max',
  selectedDateTime: Date | Date[],
  isValid: boolean,
): boolean {
  if (Array.isArray(selectedDateTime)) {
    const dateOne = getDateForCompareValidation(minOrMax, selectedDateTime[0], dateCompare)
    const dateTwo = getDateForCompareValidation(minOrMax, selectedDateTime[1], dateCompare)
    return (
      validateTime(selectedDateTime[0], dateOne, map, !!dateCompare)
      && validateTime(selectedDateTime[1], dateTwo, map, !!dateCompare)
      && isValid
    )
  }
  const date = getDateForCompareValidation(minOrMax, selectedDateTime, dateCompare)
  return validateTime(selectedDateTime, date, map, !!dateCompare) && isValid
}

// Returns a getDate object with a set of time from a provided date
export const setTimeValue = (date: Date): Date => set(getDate(), getTimeObj(date))

export function isMonthDisabled(
  disabledDates: Map<string, Date | null> | null | ((_date: Date) => boolean),
  year: number,
  month: number,
): boolean {
  if (disabledDates instanceof Map) {
    const key = `${padZero(month + 1)}-${year}`
    return disabledDates.size ? disabledDates.has(key) : false
  }
  if (typeof disabledDates === 'function') {
    return disabledDates(resetDateTime(set(getDate(), { month, year }), true))
  }
  return false
}

export function isMonthAllowed(
  allowedDates: Map<string, Date | null> | null | ((_date: Date) => boolean),
  year: number,
  month: number,
): boolean {
  if (allowedDates instanceof Map) {
    const key = `${padZero(month + 1)}-${year}`
    return allowedDates.size ? allowedDates.has(key) : true
  }
  return true
}

export function checkHighlightMonth(
  defaultedHighlight: Highlight | HighlightFn,
  month: number,
  year: number,
): boolean {
  return typeof defaultedHighlight === 'function'
    ? defaultedHighlight({ month, year })
    : !!defaultedHighlight.months.find(value => value.month === month && value.year === year)
}

export function checkHighlightYear(
  defaultedHighlight: Highlight | HighlightFn,
  year: number,
): boolean {
  return typeof defaultedHighlight === 'function'
    ? defaultedHighlight(year)
    : defaultedHighlight.years.includes(year)
}

export function getCellId(date: Date): string {
  return `dp-${format(date, 'yyyy-MM-dd')}`
}

export function getBeforeAndAfterInRange(range: number, date: Date): { before: Date, after: Date } {
  const before = subDays(resetDateTime(date), range)
  const after = addDays(resetDateTime(date), range)
  return { before, after }
}
