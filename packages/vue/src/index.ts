import type { App, Plugin } from 'vue'
import CreditCardInput from './components/CreditCardInput.vue'
import DateInput from './components/DateInput.vue'
import GooglePlacesInput from './components/GooglePlacesInput.vue'
import NumeralInput from './components/NumeralInput.vue'
import TimeInput from './components/TimeInput.vue'

const plugin: Plugin = {
  install: (app: App) => {
    app.component('CreditCardInput', CreditCardInput)
    app.component('DateInput', DateInput)
    app.component('NumeralInput', NumeralInput)
    app.component('TimeInput', TimeInput)
    app.component('GooglePlacesInput', GooglePlacesInput)
  },
}

export default plugin

export { CreditCardInput, DateInput, GooglePlacesInput, NumeralInput, TimeInput }
