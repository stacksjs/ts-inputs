# Numeral Input

The Numeral Input component provides sophisticated number formatting and validation for currency, percentages, and general numeric values. It handles various number formats, decimal places, and grouping styles.

## Features

- 💰 Currency formatting
- 📊 Percentage handling
- 🔢 Decimal precision control
- 🌍 International number formats
- ➗ Mathematical operations
- 🎨 Customizable styling
- ♿️ Accessibility support

## Basic Usage

```typescript
import { BaseInput } from 'ts-inputs'

const numeralInput = new BaseInput('#amount', {
  numeral: true,
  numeralOptions: {
    thousandsSeparator: ',',
    decimalSeparator: '.',
    precision: 2,
  },
  onNumeralFormatChanged: (formatted) => {
    console.log('Formatted value:', formatted)
  }
})
```

## Advanced Usage

### Currency Input

```typescript
class CurrencyInput {
  private input: BaseInput
  private currencySymbol: string

  constructor(selector: string, currency = 'USD') {
    this.setCurrency(currency)

    this.input = new BaseInput(selector, {
      numeral: true,
      numeralOptions: {
        thousandsSeparator: ',',
        decimalSeparator: '.',
        precision: 2,
        prefix: this.currencySymbol,
        allowNegative: true,
      },
      onNumeralFormatChanged: this.validateAmount.bind(this)
    })
  }

  private setCurrency(currency: string) {
    switch (currency) {
      case 'USD':
        this.currencySymbol = '$'
        break
      case 'EUR':
        this.currencySymbol = '€'
        break
      case 'GBP':
        this.currencySymbol = '£'
        break
      default:
        this.currencySymbol = '$'
    }
  }

  private validateAmount(formatted: string) {
    const value = this.input.getUnformattedValue()
    const numericValue = Number.parseFloat(value)

    if (numericValue < 0) {
      this.showNegativeWarning()
    }
    else if (numericValue > 1000000) {
      this.showLargeAmountWarning()
    }

    this.updateDisplay(formatted)
  }

  private updateDisplay(value: string) {
    const displayElement = document.querySelector('.amount-display')
    displayElement.textContent = value
  }

  public getValue(): number {
    const raw = this.input.getUnformattedValue()
    return Number.parseFloat(raw)
  }

  public setValue(amount: number) {
    this.input.setValue(amount.toString())
  }

  public destroy() {
    this.input.destroy()
  }
}

// Usage
const currencyInput = new CurrencyInput('#price', 'EUR')
```

### Percentage Input

```typescript
const percentageInput = new BaseInput('#percentage', {
  numeral: true,
  numeralOptions: {
    precision: 2,
    suffix: '%',
    max: 100,
    min: 0,
  },
  onValueChanged: (formatted, unformatted) => {
    updateChart(Number.parseFloat(unformatted))
  }
})
```

## Configuration Options

```typescript
interface NumeralOptions {
  // Formatting
  thousandsSeparator?: string // Default: ','
  decimalSeparator?: string // Default: '.'
  precision?: number // Default: 2

  // Display
  prefix?: string // Currency symbol or other prefix
  suffix?: string // Percentage or other suffix

  // Validation
  min?: number // Minimum allowed value
  max?: number // Maximum allowed value
  allowNegative?: boolean // Default: false

  // Behavior
  padZeros?: boolean // Add trailing zeros
  roundingMethod?: 'floor' | 'ceil' | 'round' // Default: 'round'
  allowDecimal?: boolean // Default: true
}
```

## Formatting Examples

| Type | Configuration | Input | Output |
|------|--------------|-------|--------|
| Currency | `precision: 2, prefix: '$'` | 1234.5 | $1,234.50 |
| Percentage | `precision: 1, suffix: '%'` | 12.34 | 12.3% |
| Integer | `precision: 0` | 1234.56 | 1,235 |
| Scientific | `scientific: true` | 1234567 | 1.23e+6 |
| Accounting | `accounting: true` | -1234.5 | ($1,234.50) |

## Styling Guide

```css
/* Base input styling */
.numeral-input {
  font-family: monospace;
  text-align: right;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  transition: all 0.2s;
}

/* Currency specific */
.numeral-input[data-type="currency"] {
  padding-left: 24px; /* Space for currency symbol */
}

/* Percentage specific */
.numeral-input[data-type="percentage"] {
  padding-right: 24px; /* Space for % symbol */
}

/* Validation states */
.numeral-input.valid {
  border-color: #28a745;
  background-color: #f8fff8;
}

.numeral-input.invalid {
  border-color: #dc3545;
  background-color: #fff8f8;
}

/* Size variants */
.numeral-input.small {
  width: 80px;
}

.numeral-input.medium {
  width: 120px;
}

.numeral-input.large {
  width: 160px;
}
```

## Accessibility Features

The numeral input component follows WCAG guidelines:

- Proper ARIA labels
- Screen reader announcements
- Keyboard navigation
- High contrast support

```typescript
const numeralInput = new BaseInput('#amount', {
  numeral: true,
  numeralOptions: {
    ariaLabel: 'Amount in dollars',
    errorMessageId: 'amount-error',
    announceChanges: true,
  }
})
```

## Best Practices

1. **Input Validation**
   - Validate on type and blur
   - Show clear error messages
   - Handle edge cases (min/max)
   - Prevent invalid characters

2. **Formatting**
   - Use appropriate precision
   - Consider locale preferences
   - Handle copy/paste gracefully
   - Maintain cursor position

3. **User Experience**
   - Show formatting in real-time
   - Provide visual feedback
   - Use appropriate keyboard
   - Clear error messages

4. **Performance**
   - Debounce validation
   - Cache parsed values
   - Optimize updates
   - Lazy load features

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- IE11 (with polyfills)

## TypeScript Support

```typescript
type NumeralFormat = 'decimal' | 'currency' | 'percentage' | 'scientific'

interface NumeralValidation {
  isValid: boolean
  value: number
  error?: string
}

interface NumeralMetadata {
  format: NumeralFormat
  precision: number
  isNegative: boolean
  hasDecimal: boolean
}
```
