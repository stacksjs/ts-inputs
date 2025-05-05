# Credit Card Input

The Credit Card input component provides sophisticated credit card number formatting, validation, and type detection. It's designed to enhance the user experience while ensuring data accuracy.

## Features

- 🎯 Automatic card type detection
- 🔄 Real-time formatting
- ✨ Customizable delimiters
- 🔒 Built-in validation
- 🌐 International card support
- 🎨 Type-specific formatting
- ♿️ Accessibility support

## Basic Usage

```typescript
import { BaseInput } from 'ts-inputs'

const cardInput = new BaseInput('#card-number', {
  creditCard: true,
  creditCardOptions: {
    delimiter: ' ',
  },
  onCreditCardTypeChanged: (type) => {
    console.log('Card type:', type)
  }
})
```

## Advanced Usage

### Complete Payment Form

```typescript
class PaymentForm {
  private cardInput: BaseInput
  private cardIcon: HTMLElement
  private errorElement: HTMLElement

  constructor() {
    this.cardInput = new BaseInput('#card-number', {
      creditCard: true,
      creditCardOptions: {
        delimiter: ' ',
        delimiterLazyShow: true,
      },
      onCreditCardTypeChanged: this.updateCardUI.bind(this),
      onValueChanged: this.validateCard.bind(this)
    })

    this.cardIcon = document.querySelector('.card-icon')
    this.errorElement = document.querySelector('.error-message')
  }

  private updateCardUI(type: CreditCardType) {
    // Update card icon
    this.cardIcon.className = `card-icon ${type}`

    // Update input styling
    const input = document.querySelector('#card-number')
    input.dataset.cardType = type

    // Update CVV length requirement
    const cvvInput = document.querySelector('#cvv')
    cvvInput.maxLength = type === 'amex' ? 4 : 3
  }

  private validateCard(formatted: string, unformatted: string) {
    if (!this.isValidCardNumber(unformatted)) {
      this.showError('Invalid card number')
      return false
    }

    this.clearError()
    return true
  }

  private showError(message: string) {
    this.errorElement.textContent = message
    this.errorElement.classList.remove('hidden')
  }

  private clearError() {
    this.errorElement.textContent = ''
    this.errorElement.classList.add('hidden')
  }

  public async submit() {
    const cardNumber = this.cardInput.getUnformattedValue()
    if (!this.validateCard(cardNumber, cardNumber)) {
      return false
    }

    // Process payment...
  }

  public destroy() {
    this.cardInput.destroy()
  }
}
```

### With Custom Validation

```typescript
const cardInput = new BaseInput('#card-number', {
  creditCard: true,
  creditCardOptions: {
    delimiter: ' ',
    delimiterLazyShow: true,
    validateOnType: true,
  },
  onValueChanged: (formatted, unformatted) => {
    const isValid = validateCardNumber(unformatted)
    updateValidationUI(isValid)
  }
})
```

## Supported Card Types

| Card Type | Example Number | Format |
|-----------|---------------|---------|
| Visa | 4111 1111 1111 1111 | 4xxx xxxx xxxx xxxx |
| Mastercard | 5555 5555 5555 4444 | 5xxx xxxx xxxx xxxx |
| American Express | 3714 496353 98431 | 3xxx xxxxxx xxxxx |
| Discover | 6011 1111 1111 1117 | 6xxx xxxx xxxx xxxx |
| Diners Club | 3056 9309 0259 04 | 3xxx xxxx xxxx xx |
| JCB | 3530 1113 3330 0000 | 3xxx xxxx xxxx xxxx |
| UnionPay | 6200 0000 0000 0005 | 6xxx xxxx xxxx xxxx |

## Configuration Options

```typescript
interface CreditCardOptions {
  // Formatting
  delimiter?: string // Default: ' '
  delimiterLazyShow?: boolean // Default: false

  // Validation
  validateOnType?: boolean // Default: true
  strictMode?: boolean // Default: false

  // Customization
  formatLength?: number // Default: 19
  maskNumber?: boolean // Default: false
  maskChar?: string // Default: '•'
}
```

## Styling Guide

```css
/* Base input styling */
.credit-card-input {
  font-family: monospace;
  letter-spacing: 0.5px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  transition: border-color 0.2s;
}

/* Card type specific styling */
.credit-card-input[data-card-type="visa"] {
  border-color: #1A1F71;
}

.credit-card-input[data-card-type="mastercard"] {
  border-color: #EB001B;
}

.credit-card-input[data-card-type="amex"] {
  border-color: #006FCF;
}

/* Validation states */
.credit-card-input.valid {
  border-color: #28a745;
}

.credit-card-input.invalid {
  border-color: #dc3545;
}
```

## Accessibility

The credit card input component follows WCAG guidelines:

- Proper ARIA labels
- Keyboard navigation support
- Clear error messages
- High contrast support

```typescript
const cardInput = new BaseInput('#card-number', {
  creditCard: true,
  creditCardOptions: {
    ariaLabel: 'Credit card number',
    errorMessageId: 'card-error',
  }
})
```

## Best Practices

1. **Security**
   - Never store raw card numbers
   - Use SSL/TLS encryption
   - Follow PCI compliance guidelines

2. **User Experience**
   - Show card type icon
   - Provide immediate feedback
   - Use appropriate keyboard type on mobile

3. **Validation**
   - Validate in real-time
   - Show clear error messages
   - Handle edge cases gracefully

4. **Performance**
   - Lazy load validation
   - Debounce API calls
   - Cache card type detection

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- IE11 (with polyfills)

## TypeScript Support

```typescript
type CreditCardType =
  | 'visa'
  | 'mastercard'
  | 'amex'
  | 'discover'
  | 'jcb'
  | 'diners'
  | 'unionpay'
  | 'unknown'

interface CreditCardValidation {
  isValid: boolean
  type: CreditCardType
  error?: string
}
```
