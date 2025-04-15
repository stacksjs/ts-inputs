import type { BlocksType } from '../common/types'
import type {
  FormatTimeOptions,
  GetFixedTimeStringProps,
  GetValidatedTimeProps,
  TimeFormatOptions,
  TimeFormatType,
  TimePatternType,
  TimeUnit,
} from './types'
import {
  getFormattedValue,
  getMaxLength,
  headStr,
  stripDelimiters,
  stripNonNumeric,
} from '../common/utils'
import {
  DefaultTimeDelimiter,
  DefaultTimeFormat,
  DefaultTimePattern,
} from './constants'

function getTimeFormatOptions(timeFormat: TimeFormatType): TimeFormatOptions {
  if (timeFormat === '12') {
    return {
      maxHourFirstDigit: 1,
      maxHours: 12,
      maxMinutesFirstDigit: 5,
      maxMinutes: 60,
    }
  }

  return {
    maxHourFirstDigit: 2,
    maxHours: 23,
    maxMinutesFirstDigit: 5,
    maxMinutes: 60,
  }
}

function addLeadingZero(number: number): string {
  return (number < 10 ? '0' : '') + number
}

function getBlocksByTimePattern(timePattern: TimePatternType): BlocksType {
  const blocks: BlocksType = []
  timePattern.forEach(() => {
    blocks.push(2)
  })
  return blocks
}

function getFixedTime(hour: number, minute: number, second: number): number[] {
  second = Math.min(second, 60)
  minute = Math.min(minute, 60)
  hour = Math.min(hour, 60)

  return [hour, minute, second]
}

function getFixedTimeString({
  value,
  timePattern,
}: GetFixedTimeStringProps): string {
  let time: number[] = []
  let secondIndex = 0
  let minuteIndex = 0
  let hourIndex = 0
  let secondStartIndex = 0
  let minuteStartIndex = 0
  let hourStartIndex = 0
  let second
  let minute
  let hour

  if (value.length === 6) {
    timePattern.forEach((type, index) => {
      switch (type) {
        case 's':
          secondIndex = index * 2
          break
        case 'm':
          minuteIndex = index * 2
          break
        case 'h':
          hourIndex = index * 2
          break
      }
    })

    hourStartIndex = hourIndex
    minuteStartIndex = minuteIndex
    secondStartIndex = secondIndex

    second = Number.parseInt(value.slice(secondStartIndex, secondStartIndex + 2), 10)
    minute = Number.parseInt(value.slice(minuteStartIndex, minuteStartIndex + 2), 10)
    hour = Number.parseInt(value.slice(hourStartIndex, hourStartIndex + 2), 10)

    time = getFixedTime(hour, minute, second)
  }

  if (value.length === 4 && !timePattern.includes('s')) {
    timePattern.forEach((type: TimeUnit, index: number) => {
      switch (type) {
        case 'm':
          minuteIndex = index * 2
          break
        case 'h':
          hourIndex = index * 2
          break
      }
    })

    hourStartIndex = hourIndex
    minuteStartIndex = minuteIndex

    second = 0
    minute = Number.parseInt(value.slice(minuteStartIndex, minuteStartIndex + 2), 10)
    hour = Number.parseInt(value.slice(hourStartIndex, hourStartIndex + 2), 10)

    time = getFixedTime(hour, minute, second)
  }

  return time.length === 0
    ? value
    : timePattern.reduce((previous: string, current: TimeUnit): string => {
        switch (current) {
          case 's':
            return previous + addLeadingZero(time[2])
          case 'm':
            return previous + addLeadingZero(time[1])
          case 'h':
            return previous + addLeadingZero(time[0])
        }
        return previous
      }, '')
}

function getValidatedTime({
  value,
  blocks,
  timePattern,
  timeFormat,
}: GetValidatedTimeProps): string {
  let result: string = ''

  const timeFormatOptions: TimeFormatOptions = getTimeFormatOptions(timeFormat)

  blocks.forEach((length: number, index: number) => {
    if (value.length > 0) {
      let sub = value.slice(0, length)
      const sub0 = sub.slice(0, 1)
      const rest = value.slice(length)

      switch (timePattern[index]) {
        case 'h':
          if (Number.parseInt(sub0, 10) > timeFormatOptions.maxHourFirstDigit) {
            sub = `0${sub0}`
          }
          else if (Number.parseInt(sub, 10) > timeFormatOptions.maxHours) {
            sub = `${timeFormatOptions.maxHours}`
          }

          break
        case 'm':
        case 's':
          if (Number.parseInt(sub0, 10) > timeFormatOptions.maxMinutesFirstDigit) {
            sub = `0${sub0}`
          }
          else if (Number.parseInt(sub, 10) > timeFormatOptions.maxMinutes) {
            sub = `${timeFormatOptions.maxMinutes}`
          }
          break
      }

      result += sub

      // update remaining string
      value = rest
    }
  })

  return getFixedTimeString({ value: result, timePattern })
}

export function formatTime(value: string, options?: FormatTimeOptions): string {
  const {
    delimiterLazyShow = false,
    delimiter = DefaultTimeDelimiter,
    timePattern = DefaultTimePattern,
    timeFormat = DefaultTimeFormat,
  } = options ?? {}
  // strip non-numeric characters
  value = stripNonNumeric(value)

  const blocks: BlocksType = getBlocksByTimePattern(timePattern)
  value = getValidatedTime({
    value,
    blocks,
    timePattern,
    timeFormat,
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
