import type {
  BlocksType,
  DelimiterType,
  GetFormattedValueProps,
  StripDelimitersProps,
} from './types'

// const test = (): string => {
//   return 'test-eslint'
// }

export function isString(value: unknown): value is string {
  return typeof value === 'string'
}

export function stripNonNumeric(value: string): string {
  return value.replace(/\D/g, '')
}

export function getMaxLength(blocks: BlocksType): number {
  return blocks.reduce((previous: number, current: number) => previous + current, 0)
}

export function headStr(str: string, length: number): string {
  return str.slice(0, length)
}

export function getDelimiterRegexByDelimiter(delimiter: string): RegExp {
  return new RegExp(delimiter.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1'), 'g')
}

export function stripDelimiters({
  value,
  delimiters,
}: StripDelimitersProps): string {
  delimiters.forEach((current: DelimiterType) => {
    current.split('').forEach((letter) => {
      value = value.replace(getDelimiterRegexByDelimiter(letter), '')
    })
  })

  return value
}

export function getFormattedValue(props: GetFormattedValueProps): string {
  const { value, blocks, delimiter = '', delimiters = [], delimiterLazyShow = false } = props
  let result = ''
  let valueRemaining = value
  let currentDelimiter = ''

  blocks.forEach((length: number, index: number) => {
    if (valueRemaining.length > 0) {
      const sub = valueRemaining.slice(0, length)
      const rest = valueRemaining.slice(length)

      if (delimiters.length > 0) {
        currentDelimiter
          = delimiters[delimiterLazyShow ? index - 1 : index] ?? currentDelimiter
      }
      else {
        currentDelimiter = delimiter
      }

      if (delimiterLazyShow) {
        if (index > 0) {
          result += currentDelimiter
        }

        result += sub
      }
      else {
        result += sub

        if (sub.length === length && index < blocks.length - 1) {
          result += currentDelimiter
        }
      }

      // update remaining string
      valueRemaining = rest
    }
  })

  return result
}
