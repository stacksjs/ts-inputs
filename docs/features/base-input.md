# Base Input

The BaseInput class serves as the foundation for all input formatting and validation in ts-inputs. It provides a unified interface for handling various types of inputs including credit cards, phone numbers, numerals, and general formatted inputs.

## Installation

```bash
npm install ts-inputs
# or
yarn add ts-inputs
# or
pnpm add ts-inputs
# or
bun add ts-inputs
```

## Basic Usage

```typescript
import { BaseInput } from 'ts-inputs'

// Create a new input instance
const input = new BaseInput('#my-input', {
  // Choose one input type
  creditCard: true,
  // Optional configuration
  creditCardOptions: {
    delimiter: ' ',
  },
  // Event handlers
  onValueChanged: (formatted, unformatted) => {
    console.log('Formatted:', formatted)
    console.log('Raw value:', unformatted)
  }
})
```

## Input Types

### Credit Card Input

```typescript
const creditCardInput = new BaseInput('#card-input', {
  creditCard: true,
  creditCardOptions: {
    delimiter: ' ',
    delimiterLazyShow: true,
  },
  onCreditCardTypeChanged: (type) => {
    // type can be: 'visa', 'mastercard', 'amex', etc.
    updateCardIcon(type)
  }
})
```

### Phone Input

```typescript
const phoneInput = new BaseInput('#phone-input', {
  phone: true,
  phoneOptions: {
    format: 'international',
    defaultCountry: 'US',
  },
  onPhoneFormatChanged: (formatted) => {
    validatePhoneNumber(formatted)
  }
})
```

### Numeral Input

```typescript
const numeralInput = new BaseInput('#amount-input', {
  numeral: true,
  numeralOptions: {
    thousandsSeparator: ',',
    decimalSeparator: '.',
    precision: 2,
  },
  onNumeralFormatChanged: (formatted) => {
    updateTotal(formatted)
  }
})
```

### General Input

```typescript
const generalInput = new BaseInput('#custom-input', {
  general: true,
  generalOptions: {
    blocks: [3, 3, 3], // Format as XXX-XXX-XXX
    delimiter: '-',
    uppercase: true,
  },
  onGeneralFormatChanged: (formatted) => {
    console.log('Formatted:', formatted)
  }
})
```

## Event Handling

The BaseInput class provides comprehensive event handling:

```typescript
const input = new BaseInput('#my-input', {
  creditCard: true,

  // Value change events
  onValueChanged: (formatted, unformatted) => {
    console.log(`Value changed from ${unformatted} to ${formatted}`)
  },

  // Focus events
  onFocus: (event) => {
    highlightInputContainer(event.target)
  },

  // Blur events
  onBlur: (event) => {
    validateInput(event.target)
  },

  // Type-specific events
  onCreditCardTypeChanged: (type) => {
    updateCardIcon(type)
  }
})
```

## Public Methods

### getValue()

Returns the current formatted value

```typescript
const formatted = input.getValue()
```

### getUnformattedValue()

Returns the raw, unformatted value

```typescript
const raw = input.getUnformattedValue()
```

### setValue(value: string)

Sets a new value and applies formatting

```typescript
input.setValue('4242424242424242')
```

### destroy()

Cleans up the instance and removes event listeners

```typescript
input.destroy()
```

## Real-world Examples

### Payment Form Integration

```typescript
class PaymentForm {
  private cardInput: BaseInput
  private phoneInput: BaseInput

  constructor() {
    this.cardInput = new BaseInput('#card-number', {
      creditCard: true,
      creditCardOptions: {
        delimiter: ' ',
        delimiterLazyShow: true,
      },
      onCreditCardTypeChanged: this.updateCardIcon.bind(this)
    })

    this.phoneInput = new BaseInput('#phone', {
      phone: true,
      phoneOptions: {
        format: 'international',
      }
    })
  }

  private updateCardIcon(type: CreditCardType) {
    const iconElement = document.querySelector('.card-icon')
    iconElement.className = `card-icon ${type}`
  }

  public async submit() {
    const cardNumber = this.cardInput.getUnformattedValue()
    const phone = this.phoneInput.getValue()

    try {
      await processPayment({
        card: cardNumber,
        phone,
      })
    }
    catch (error) {
      this.handleError(error)
    }
  }

  public destroy() {
    this.cardInput.destroy()
    this.phoneInput.destroy()
  }
}
```

### Dynamic Currency Input

```typescript
class CurrencyInput {
  private input: BaseInput

  constructor(selector: string, initialCurrency: string) {
    this.input = new BaseInput(selector, {
      numeral: true,
      numeralOptions: {
        thousandsSeparator: ',',
        decimalSeparator: '.',
        precision: 2,
      },
      onNumeralFormatChanged: (value) => {
        this.updateDisplay(value)
      }
    })

    this.setCurrency(initialCurrency)
  }

  public setCurrency(currency: string) {
    const value = this.input.getUnformattedValue()
    // Reconfigure for new currency format
    this.input.destroy()

    this.input = new BaseInput(selector, {
      numeral: true,
      numeralOptions: {
        // Adjust format based on currency
        thousandsSeparator: currency === 'EUR' ? '.' : ',',
        decimalSeparator: currency === 'EUR' ? ',' : '.',
        precision: currency === 'JPY' ? 0 : 2,
      }
    })

    this.input.setValue(value)
  }
}
```

## TypeScript Support

The library is written in TypeScript and provides comprehensive type definitions:

```typescript
interface BaseInputOptions {
  // Input type flags
  creditCard?: boolean
  phone?: boolean
  numeral?: boolean
  general?: boolean

  // Type-specific options
  creditCardOptions?: FormatCreditCardOptions
  phoneOptions?: FormatPhoneOptions
  numeralOptions?: FormatNumeralOptions
  generalOptions?: FormatGeneralOptions

  // Event callbacks
  onValueChanged?: (formatted: string, unformatted: string) => void
  onFocus?: (event: FocusEvent) => void
  onBlur?: (event: FocusEvent) => void
  onCreditCardTypeChanged?: (type: CreditCardType) => void
  onPhoneFormatChanged?: (formatted: string) => void
  onNumeralFormatChanged?: (formatted: string) => void
  onGeneralFormatChanged?: (formatted: string) => void
}
```

## Best Practices

1. **Single Responsibility**
   - Use one input type per instance
   - Don't mix different formatting types

2. **Memory Management**
   - Always call `destroy()` when removing inputs
   - Clean up references in single-page applications

3. **Error Handling**
   - Wrap initialization in try-catch blocks
   - Validate input values before submission

4. **Performance**
   - Don't create multiple instances for the same input
   - Use lazy loading for large forms

5. **Accessibility**
   - Maintain proper ARIA attributes
   - Ensure keyboard navigation works
   - Provide clear error messages

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- IE11 (with appropriate polyfills)
