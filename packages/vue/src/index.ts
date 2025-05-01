import type { App, Plugin } from 'vue'
import BaseInput from './components/BaseInput.vue'
import CreditCardInput from './components/credit-card/CreditCardInput.vue'
import DateTimePicker from './components/datetime-picker/DateTimePicker.vue'
import NumeralInput from './components/numeral/NumeralInput.vue'

const plugin: Plugin = {
  install: (app: App) => {
    app.component('DateTimePicker', DateTimePicker)
    app.component('BaseInput', BaseInput)
    app.component('CreditCardInput', CreditCardInput)
    app.component('NumeralInput', NumeralInput)
  },
}

export default plugin

export {
  BaseInput,
  CreditCardInput,
  DateTimePicker,
  NumeralInput,
}
