export interface DateValidationResult {
  isValid: boolean
  error?: string
}

export function formatDate(date: Date, format: string, locale: string = 'en-US'): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }

  const formatter = new Intl.DateTimeFormat(locale, options)
  const parts = formatter.formatToParts(date)

  const year = parts.find(p => p.type === 'year')?.value || ''
  const month = parts.find(p => p.type === 'month')?.value || ''
  const day = parts.find(p => p.type === 'day')?.value || ''

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
}

export function parseDate(dateStr: string, format: string, _locale: string = 'en-US'): Date {
  const formatRegex = /(YYYY|MM|DD)/g
  const formatParts = format.match(formatRegex) || []
  const dateParts = dateStr.split(/[-/]/)

  if (formatParts.length !== dateParts.length) {
    throw new Error('Invalid date format')
  }

  const dateMap: Record<string, number> = {}
  formatParts.forEach((part, index) => {
    dateMap[part] = Number.parseInt(dateParts[index], 10)
  })

  const year = dateMap.YYYY
  const month = dateMap.MM - 1 // JavaScript months are 0-based
  const day = dateMap.DD

  if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
    throw new TypeError('Invalid date values')
  }

  const date = new Date(year, month, day)
  if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
    throw new Error('Invalid date')
  }

  return date
}

export function validateDate(dateStr: string, format: string, locale: string = 'en-US'): DateValidationResult {
  try {
    parseDate(dateStr, format, locale)
    return { isValid: true }
  }
  catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Invalid date',
    }
  }
}
