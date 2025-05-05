import type { FormatDateTimeOptions } from './types'

const DEFAULT_OPTIONS: FormatDateTimeOptions = {
  format: 'YYYY-MM-DD HH:mm:ss',
  dateFormat: 'YYYY-MM-DD',
  timeFormat: 'HH:mm:ss',
  separator: ' ',
  dateSeparator: '-',
  timeSeparator: ':',
  is24Hour: true,
  showSeconds: true,
  strictMode: true,
  allowEmpty: true,
  locale: 'en-US',
}

interface DateTimeParts {
  year: string
  month: string
  day: string
  hours: string
  minutes: string
  seconds: string
  ampm?: string
}

export function formatDateTime(value: string, options: Partial<FormatDateTimeOptions> = {}): string {
  const opts = { ...DEFAULT_OPTIONS, ...options }

  if (opts.allowEmpty && !value) {
    return ''
  }

  // Remove all non-numeric characters except AM/PM
  const cleaned = value.replace(/[^\d\sapm]/gi, '')
  const parts = extractDateTimeParts(cleaned, opts)

  if (!parts) {
    return cleaned
  }

  const dateStr = formatDatePart(parts, opts)
  const timeStr = formatTimePart(parts, opts)

  return dateStr && timeStr
    ? `${dateStr}${opts.separator}${timeStr}`
    : dateStr || timeStr || cleaned
}

function extractDateTimeParts(value: string, options: FormatDateTimeOptions): DateTimeParts | null {
  const numbers = value.replace(/\D/g, '')
  const ampmMatch = value.match(/[apm]{2}/i)

  if (!numbers.length) {
    return null
  }

  const parts: DateTimeParts = {
    year: '',
    month: '',
    day: '',
    hours: '',
    minutes: '',
    seconds: '',
  }

  // Extract date parts
  if (numbers.length >= 4) {
    parts.month = numbers.slice(0, 2)
    parts.day = numbers.slice(2, 4)
  }
  if (numbers.length >= 8) {
    parts.year = numbers.slice(4, 8)
  }

  // Extract time parts
  if (numbers.length >= 10) {
    parts.hours = numbers.slice(8, 10)
  }
  if (numbers.length >= 12) {
    parts.minutes = numbers.slice(10, 12)
  }
  if (numbers.length >= 14 && options.showSeconds) {
    parts.seconds = numbers.slice(12, 14)
  }

  // Handle AM/PM
  if (!options.is24Hour && ampmMatch) {
    parts.ampm = ampmMatch[0].toUpperCase()

    // Convert hours to 12-hour format
    if (parts.hours) {
      const hours = Number.parseInt(parts.hours, 10)
      if (hours > 12) {
        parts.hours = String(hours - 12).padStart(2, '0')
        parts.ampm = 'PM'
      }
      else if (hours === 0) {
        parts.hours = '12'
        parts.ampm = 'AM'
      }
    }
  }

  return parts
}

function formatDatePart(parts: DateTimeParts, options: FormatDateTimeOptions): string {
  const { year, month, day } = parts
  const sep = options.dateSeparator

  if (!month && !day && !year) {
    return ''
  }

  if (options.strictMode) {
    // Validate month
    const monthNum = Number.parseInt(month, 10)
    if (monthNum < 1 || monthNum > 12) {
      return month
    }

    // Validate day
    const dayNum = Number.parseInt(day, 10)
    if (dayNum < 1 || dayNum > 31) {
      return `${month}${sep}${day}`
    }

    // Validate year
    const yearNum = Number.parseInt(year, 10)
    const currentYear = new Date().getFullYear()
    if (yearNum < 1900 || yearNum > currentYear + 100) {
      return `${month}${sep}${day}`
    }
  }

  if (year) {
    return `${year}${sep}${month}${sep}${day}`
  }

  return month && day ? `${month}${sep}${day}` : month
}

function formatTimePart(parts: DateTimeParts, options: FormatDateTimeOptions): string {
  const { hours, minutes, seconds, ampm } = parts
  const sep = options.timeSeparator

  if (!hours && !minutes) {
    return ''
  }

  if (options.strictMode) {
    // Validate hours
    const hoursNum = Number.parseInt(hours, 10)
    const maxHours = options.is24Hour ? 23 : 12
    if (hoursNum < 0 || hoursNum > maxHours) {
      return hours
    }

    // Validate minutes
    const minutesNum = Number.parseInt(minutes, 10)
    if (minutesNum < 0 || minutesNum > 59) {
      return `${hours}${sep}${minutes}`
    }

    // Validate seconds
    if (options.showSeconds && seconds) {
      const secondsNum = Number.parseInt(seconds, 10)
      if (secondsNum < 0 || secondsNum > 59) {
        return `${hours}${sep}${minutes}`
      }
    }
  }

  let timeStr = hours && minutes ? `${hours}${sep}${minutes}` : hours

  if (options.showSeconds && seconds) {
    timeStr += `${sep}${seconds}`
  }

  if (!options.is24Hour && ampm) {
    timeStr += ` ${ampm}`
  }

  return timeStr
}

export function unformatDateTime(value: string): string {
  return value.replace(/\D/g, '')
}

export function isValidDateTime(value: string, options: Partial<FormatDateTimeOptions> = {}): boolean {
  const opts = { ...DEFAULT_OPTIONS, ...options }

  if (opts.allowEmpty && !value) {
    return true
  }

  const parts = extractDateTimeParts(value, opts)
  if (!parts) {
    return false
  }

  const { year, month, day, hours, minutes, seconds } = parts

  // Validate date
  const date = new Date(
    Number.parseInt(year, 10),
    Number.parseInt(month, 10) - 1,
    Number.parseInt(day, 10),
    Number.parseInt(hours, 10),
    Number.parseInt(minutes, 10),
    Number.parseInt(seconds, 10),
  )

  if (isNaN(date.getTime())) {
    return false
  }

  // Check min/max dates
  if (opts.minDate) {
    const minDate = typeof opts.minDate === 'string' ? new Date(opts.minDate) : opts.minDate
    if (date < minDate) {
      return false
    }
  }

  if (opts.maxDate) {
    const maxDate = typeof opts.maxDate === 'string' ? new Date(opts.maxDate) : opts.maxDate
    if (date > maxDate) {
      return false
    }
  }

  // Check disabled dates
  if (opts.disabledDates?.length) {
    const isDisabled = opts.disabledDates.some((disabledDate) => {
      const disabled = typeof disabledDate === 'string' ? new Date(disabledDate) : disabledDate
      return date.getTime() === disabled.getTime()
    })
    if (isDisabled) {
      return false
    }
  }

  return true
}
