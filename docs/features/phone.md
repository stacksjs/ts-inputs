# Phone Input

The Phone Input component provides international phone number formatting and validation. It supports various phone number formats across different countries and regions.

## Features

- 🌍 International format support
- 🔄 Real-time formatting
- 🎯 Country-specific validation
- 🔍 Number type detection
- 📱 Mobile-friendly input
- 🎨 Customizable formatting
- ♿️ Accessibility support

## Basic Usage

```typescript
import { BaseInput } from 'ts-inputs'

const phoneInput = new BaseInput('#phone-number', {
  phone: true,
  phoneOptions: {
    defaultCountry: 'US',
    format: 'international'
  },
  onPhoneFormatChanged: (formatted) => {
    console.log('Formatted number:', formatted)
  }
})
```

## Advanced Usage

### Complete Contact Form

```typescript
class ContactForm {
  private phoneInput: BaseInput
  private countrySelect: HTMLSelectElement
  private errorElement: HTMLElement

  constructor() {
    this.phoneInput = new BaseInput('#phone', {
      phone: true,
      phoneOptions: {
        format: 'international',
        defaultCountry: 'US',
        preferredCountries: ['US', 'CA', 'GB'],
      },
      onPhoneFormatChanged: this.validatePhone.bind(this)
    })

    this.countrySelect = document.querySelector('#country')
    this.errorElement = document.querySelector('.error-message')

    this.setupCountrySelect()
  }

  private setupCountrySelect() {
    this.countrySelect.addEventListener('change', () => {
      const country = this.countrySelect.value
      this.updatePhoneFormat(country)
    })
  }

  private updatePhoneFormat(country: string) {
    const currentNumber = this.phoneInput.getUnformattedValue()

    // Recreate input with new country format
    this.phoneInput.destroy()
    this.phoneInput = new BaseInput('#phone', {
      phone: true,
      phoneOptions: {
        format: 'international',
        defaultCountry: country
      }
    })

    // Reapply the number if it exists
    if (currentNumber) {
      this.phoneInput.setValue(currentNumber)
    }
  }

  private validatePhone(formatted: string) {
    const isValid = this.isValidPhoneNumber(formatted)
    this.updateValidationUI(isValid)
  }

  private updateValidationUI(isValid: boolean) {
    const input = document.querySelector('#phone')
    input.classList.toggle('valid', isValid)
    input.classList.toggle('invalid', !isValid)

    if (!isValid) {
      this.errorElement.textContent = 'Please enter a valid phone number'
      this.errorElement.classList.remove('hidden')
    }
    else {
      this.errorElement.textContent = ''
      this.errorElement.classList.add('hidden')
    }
  }

  public async submit() {
    const phoneNumber = this.phoneInput.getValue()
    if (!this.isValidPhoneNumber(phoneNumber)) {
      return false
    }

    // Process form...
  }

  public destroy() {
    this.phoneInput.destroy()
  }
}
```

### With Custom Formatting

```typescript
const phoneInput = new BaseInput('#phone', {
  phone: true,
  phoneOptions: {
    format: 'custom',
    pattern: '+X (XXX) XXX-XXXX',
    placeholder: 'X',
  },
  onValueChanged: (formatted, unformatted) => {
    validatePhoneNumber(unformatted)
  }
})
```

## Configuration Options

```typescript
interface PhoneOptions {
  // Formatting
  format?: 'international' | 'national' | 'custom'
  pattern?: string // For custom format
  placeholder?: string // For custom format

  // Country Settings
  defaultCountry?: string // ISO country code
  preferredCountries?: string[] // List of ISO country codes

  // Validation
  validateOnType?: boolean // Default: true
  strictMode?: boolean // Default: false

  // Display
  showCountrySelect?: boolean // Default: false
  showFlags?: boolean // Default: true
}
```

## Supported Formats

| Country | Format | Example |
|---------|--------|---------|
| US | +1 (XXX) XXX-XXXX | +1 (555) 123-4567 |
| UK | +44 XXXX XXXXXX | +44 7911 123456 |
| FR | +33 X XX XX XX XX | +33 6 12 34 56 78 |
| DE | +49 XXX XXXXXXXX | +49 170 1234567 |
| JP | +81 XX-XXXX-XXXX | +81 90-1234-5678 |

## Styling Guide

```css
/* Base input styling */
.phone-input {
  font-family: system-ui;
  padding: 12px;
  padding-left: 52px; /* Space for country flag */
  border: 1px solid #ddd;
  border-radius: 4px;
  transition: all 0.2s;
}

/* Country flag container */
.phone-input-flag {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 16px;
}

/* Validation states */
.phone-input.valid {
  border-color: #28a745;
  background-color: #f8fff8;
}

.phone-input.invalid {
  border-color: #dc3545;
  background-color: #fff8f8;
}

/* Country select dropdown */
.phone-country-select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 8px;
}
```

## Accessibility Features

The phone input component follows WCAG guidelines:

- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- High contrast support

```typescript
const phoneInput = new BaseInput('#phone', {
  phone: true,
  phoneOptions: {
    ariaLabel: 'Phone number',
    errorMessageId: 'phone-error',
    countrySelectLabel: 'Select country'
  }
})
```

## Best Practices

1. **User Experience**
   - Show country flags for visual recognition
   - Provide immediate format feedback
   - Use appropriate mobile keyboard
   - Show example format as placeholder

2. **Validation**
   - Validate numbers in real-time
   - Check for valid country codes
   - Support international formats
   - Handle copy-paste gracefully

3. **Internationalization**
   - Support multiple country formats
   - Handle different number lengths
   - Consider regional preferences
   - Support RTL languages

4. **Performance**
   - Lazy load country data
   - Cache validation results
   - Optimize flag images
   - Minimize reflows

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- IE11 (with polyfills)

## TypeScript Support

```typescript
type PhoneFormat = 'international' | 'national' | 'custom'

type CountryCode = string // ISO 3166-1 alpha-2

interface PhoneValidation {
  isValid: boolean
  countryCode?: CountryCode
  type?: 'mobile' | 'fixed-line' | 'unknown'
  error?: string
}

interface PhoneMetadata {
  country: CountryCode
  dialCode: string
  format: string
  pattern: RegExp
}
```
