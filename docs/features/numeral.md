# Numeral Formatting

Format and validate numerical values with support for various formatting options including decimal marks, thousand separators, and custom prefixes.

## Features

- Customizable decimal marks
- Multiple thousand grouping styles (thousand, lakh, wan)
- Decimal scale control
- Integer scale limitation
- Custom prefixes and suffixes
- Positive-only mode
- Leading zero stripping
- Sign position control

## Basic Usage

```typescript
import { formatNumeral, unformatNumeral } from 'ts-inputs'

// Format a number
const formatted = formatNumeral('1234567.89')
// Output: '1,234,567.89'

// Remove formatting
const unformatted = unformatNumeral('1,234,567.89')
// Output: '1234567.89'
```

## Advanced Usage

```typescript
import {
  DefaultNumeralDecimalMark,
  DefaultNumeralDelimiter,
  formatNumeral,
  NumeralThousandGroupStyles
} from 'ts-inputs'

const options = {
  delimiter: DefaultNumeralDelimiter, // defaults to ','
  numeralThousandsGroupStyle: NumeralThousandGroupStyles.THOUSAND,
  numeralIntegerScale: 9, // maximum integer digits
  numeralDecimalMark: DefaultNumeralDecimalMark, // defaults to '.'
  numeralDecimalScale: 2, // decimal places
  stripLeadingZeroes: true,
  numeralPositiveOnly: false,
  tailPrefix: false,
  signBeforePrefix: false,
  prefix: '$'
}

const formatted = formatNumeral('1234567.89', options)
// Output: '$1,234,567.89'
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `delimiter` | string | ',' | Thousand separator character |
| `numeralThousandsGroupStyle` | string | 'thousand' | Grouping style ('thousand', 'lakh', 'wan') |
| `numeralIntegerScale` | number | 0 | Maximum integer digits (0 for unlimited) |
| `numeralDecimalMark` | string | '.' | Decimal mark character |
| `numeralDecimalScale` | number | 2 | Number of decimal places |
| `stripLeadingZeroes` | boolean | true | Remove leading zeros |
| `numeralPositiveOnly` | boolean | false | Allow only positive numbers |
| `tailPrefix` | boolean | false | Place prefix at the end |
| `signBeforePrefix` | boolean | false | Place sign before prefix |
| `prefix` | string | '' | Custom prefix (e.g., '$', '€') |

## Thousand Grouping Styles

1. **Thousand** (1,234,567.89)
   - Groups numbers in sets of three
   - Most common in Western countries

2. **Lakh** (12,34,567.89)
   - Groups numbers in sets of two, then three
   - Common in Indian numbering system

3. **Wan** (123,4567.89)
   - Groups numbers in sets of four
   - Common in Chinese numbering system

## Type Definitions

```typescript
type NumeralThousandGroupStyle = 'thousand' | 'lakh' | 'wan'

interface FormatNumeralOptions {
  delimiter?: string
  numeralThousandsGroupStyle?: NumeralThousandGroupStyle
  numeralIntegerScale?: number
  numeralDecimalMark?: string
  numeralDecimalScale?: number
  stripLeadingZeroes?: boolean
  numeralPositiveOnly?: boolean
  tailPrefix?: boolean
  signBeforePrefix?: boolean
  prefix?: string
}
```

## Demo

Try out the numeral formatter in our interactive demo:

The demo allows you to:

- Enter numbers and see them formatted in real-time
- Choose different thousand grouping styles
- Adjust decimal places
- Add custom prefixes
- Toggle various formatting options
- See the unformatted result
