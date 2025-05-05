import type { FormatPhoneOptions } from './types'
import { DefaultPhoneDelimiter, DefaultPhonePattern, DefaultPhoneRegion } from './constants'

type HandleFormatOptions = {
  value: string
} & FormatPhoneOptions

// Phone number patterns by region
const PHONE_PATTERNS: Record<string, number[]> = {
  US: [3, 3, 4], // (123) 456-7890
  GB: [4, 3, 3], // 0123 456 7890
  FR: [2, 2, 2, 2, 2], // 01 23 45 67 89
  DE: [3, 2, 2, 2], // 012 34 56 78
  JP: [3, 4, 4], // 012-3456-7890
  CN: [3, 4, 4], // 012 3456 7890
  IN: [4, 3, 3], // 0123 456 7890
  BR: [2, 4, 4], // (01) 2345-6789
  AU: [4, 3, 3], // 0123 456 789
  CA: [3, 3, 4], // (123) 456-7890
}

// Country codes by region
const COUNTRY_CODES: Record<string, string> = {
  US: '+1',
  GB: '+44',
  FR: '+33',
  DE: '+49',
  JP: '+81',
  CN: '+86',
  IN: '+91',
  BR: '+55',
  AU: '+61',
  CA: '+1',
}

function handleFormat({
  value,
  delimiter,
  pattern,
  region,
  includeCountryCode,
  format,
}: HandleFormatOptions): string {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '')

  let result = ''

  if (pattern) {
    let digitIndex = 0

    for (let i = 0; i < pattern.length; i++) {
      const groupSize = pattern[i]
      const group = digits.slice(digitIndex, digitIndex + groupSize)

      if (group) {
        if (result) {
          result += delimiter
        }
        result += group
        digitIndex += groupSize
      }
    }
  }

  if (region) {
    // Add country code if needed
    if (includeCountryCode && format === 'international' && COUNTRY_CODES[region]) {
      result = `${COUNTRY_CODES[region]} ${result}`
    }
  }

  return result
}

export function formatPhone(value: string, options?: FormatPhoneOptions): string {
  const {
    delimiter = DefaultPhoneDelimiter,
    pattern,
    region = DefaultPhoneRegion,
    includeCountryCode = false,
    format = 'national',
  } = options ?? {}

  // Use region pattern if no custom pattern provided
  const selectedPattern = pattern ?? PHONE_PATTERNS[region] ?? DefaultPhonePattern

  return handleFormat({
    value,
    delimiter,
    pattern: selectedPattern,
    region,
    includeCountryCode,
    format,
  })
}

export function unformatPhone(value: string): string {
  return value.replace(/\D/g, '')
}
