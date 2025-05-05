import type { CreditCardType } from './constants'

import type {
  FormatCreditCardOptions,
  FormatDateTimeOptions,
  FormatGeneralOptions,
  FormatNumeralOptions,
  FormatPhoneOptions,
} from './types'

import {
  formatCreditCard,
  getCreditCardType,
  unformatCreditCard,
} from './credit-card'

import {
  formatDateTime,
  isValidDateTime,
  unformatDateTime,
} from './date-time'

import {
  formatGeneral,
} from './general'

import {
  formatNumeral,
} from './numeral'

import {
  formatPhone,
} from './phone'

export interface BaseInputOptions {
  // Credit Card Options
  creditCard?: boolean
  creditCardOptions?: FormatCreditCardOptions
  onCreditCardTypeChanged?: (type: CreditCardType) => void

  // Phone Options
  phone?: boolean
  phoneOptions?: FormatPhoneOptions
  onPhoneFormatChanged?: (formatted: string) => void

  // Numeral Options
  numeral?: boolean
  numeralOptions?: FormatNumeralOptions
  onNumeralFormatChanged?: (formatted: string) => void

  // General Options
  general?: boolean
  generalOptions?: FormatGeneralOptions
  onGeneralFormatChanged?: (formatted: string) => void

  // DateTime Options
  dateTime?: boolean
  dateTimeOptions?: FormatDateTimeOptions
  onDateTimeFormatChanged?: (formatted: string) => void
  onDateTimeValidityChanged?: (isValid: boolean) => void

  // Common Options
  onValueChanged?: (value: string, unformatted: string) => void
  onFocus?: (event: FocusEvent) => void
  onBlur?: (event: FocusEvent) => void
}

export class BaseInput {
  private element: HTMLInputElement
  private options: BaseInputOptions
  private currentValue: string = ''
  private currentUnformattedValue: string = ''

  constructor(selector: string, options: BaseInputOptions = {}) {
    const element = document.querySelector(selector)
    if (!element || !(element instanceof HTMLInputElement)) {
      throw new Error(`Element not found or not an input: ${selector}`)
    }

    this.element = element
    this.options = options
    this.initialize()
  }

  private initialize(): void {
    // Set up event listeners
    this.element.addEventListener('input', this.handleInput.bind(this) as EventListener)
    this.element.addEventListener('focus', this.handleFocus.bind(this))
    this.element.addEventListener('blur', this.handleBlur.bind(this))

    // Initialize with current value if any
    if (this.element.value) {
      const event = new Event('input') as InputEvent
      Object.defineProperty(event, 'target', { value: this.element })
      this.handleInput(event)
    }
  }

  private handleInput(event: Event): void {
    const input = event.target as HTMLInputElement
    const value = input.value

    // Store unformatted value
    this.currentUnformattedValue = this.stripFormatting(value)

    // Apply formatting based on input type
    if (this.options.creditCard) {
      this.handleCreditCardInput(value)
    }
    else if (this.options.phone) {
      this.handlePhoneInput(value)
    }
    else if (this.options.numeral) {
      this.handleNumeralInput(value)
    }
    else if (this.options.dateTime) {
      this.handleDateTimeInput(value)
    }
    else if (this.options.general) {
      this.handleGeneralInput(value)
    }

    // Call value changed callback
    if (this.options.onValueChanged) {
      this.options.onValueChanged(this.currentValue, this.currentUnformattedValue)
    }
  }

  private handleCreditCardInput(value: string): void {
    const formatted = formatCreditCard(value, this.options.creditCardOptions)
    this.currentValue = formatted
    this.element.value = formatted

    if (this.options.onCreditCardTypeChanged) {
      const type = getCreditCardType(value)
      this.options.onCreditCardTypeChanged(type)
    }
  }

  private handlePhoneInput(value: string): void {
    const formatted = formatPhone(value, this.options.phoneOptions)
    this.currentValue = formatted
    this.element.value = formatted

    if (this.options.onPhoneFormatChanged) {
      this.options.onPhoneFormatChanged(formatted)
    }
  }

  private handleNumeralInput(value: string): void {
    const formatted = formatNumeral(value, this.options.numeralOptions)
    this.currentValue = formatted
    this.element.value = formatted

    if (this.options.onNumeralFormatChanged) {
      this.options.onNumeralFormatChanged(formatted)
    }
  }

  private handleGeneralInput(value: string): void {
    const formatted = formatGeneral(value, this.options.generalOptions ?? { blocks: [] })
    this.currentValue = formatted
    this.element.value = formatted

    if (this.options.onGeneralFormatChanged) {
      this.options.onGeneralFormatChanged(formatted)
    }
  }

  private handleDateTimeInput(value: string): void {
    const formatted = formatDateTime(value, this.options.dateTimeOptions)
    this.currentValue = formatted
    this.element.value = formatted

    if (this.options.onDateTimeFormatChanged) {
      this.options.onDateTimeFormatChanged(formatted)
    }

    if (this.options.onDateTimeValidityChanged) {
      const isValid = isValidDateTime(formatted, this.options.dateTimeOptions)
      this.options.onDateTimeValidityChanged(isValid)
    }
  }

  private handleFocus(event: FocusEvent): void {
    if (this.options.onFocus) {
      this.options.onFocus(event)
    }
  }

  private handleBlur(event: FocusEvent): void {
    if (this.options.onBlur) {
      this.options.onBlur(event)
    }
  }

  private stripFormatting(value: string): string {
    if (this.options.creditCard) {
      return unformatCreditCard(value)
    }
    if (this.options.dateTime) {
      return unformatDateTime(value)
    }
    // Add other unformat methods as needed
    return value.replace(/\D/g, '')
  }

  // Public methods
  public getValue(): string {
    return this.currentValue
  }

  public getUnformattedValue(): string {
    return this.currentUnformattedValue
  }

  public setValue(value: string): void {
    this.element.value = value
    const event = new Event('input') as InputEvent
    Object.defineProperty(event, 'target', { value: this.element })
    this.handleInput(event)
  }

  public destroy(): void {
    this.element.removeEventListener('input', this.handleInput.bind(this) as EventListener)
    this.element.removeEventListener('focus', this.handleFocus.bind(this))
    this.element.removeEventListener('blur', this.handleBlur.bind(this))
  }
}
