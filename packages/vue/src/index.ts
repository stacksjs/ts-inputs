import type { App, Plugin } from 'vue'
import CreditCardInput from './components/CreditCardInput.vue'
import DateInput from './components/DateInput.vue'
import NumeralInput from './components/NumeralInput.vue'
import TimeInput from './components/TimeInput.vue'

export const TsInputsVue: Plugin = {
  install: (app: App) => {
    app.component('CreditCardInput', CreditCardInput)
    app.component('DateInput', DateInput)
    app.component('NumeralInput', NumeralInput)
    app.component('TimeInput', TimeInput)
  },
}

export { CreditCardInput, DateInput, NumeralInput, TimeInput }
