import type { App, Plugin } from 'vue'
import CreditCardInput from './components/CreditCardInput.vue'
import DateInput from './components/DateInput.vue'
import GooglePlacesInput from './components/GooglePlacesInput.vue'
import NumeralInput from './components/NumeralInput.vue'
import TimeInput from './components/TimeInput.vue'
import DateTimePicker from './components/datetime-picker/DateTimePicker.vue'

const plugin: Plugin = {
  install: (app: App) => {
    app.component('CreditCardInput', CreditCardInput)
    app.component('DateInput', DateInput)
    app.component('GooglePlacesInput', GooglePlacesInput)
    app.component('NumeralInput', NumeralInput)
    app.component('TimeInput', TimeInput)
    app.component('DateTimePicker', DateTimePicker)
  },
}

export default plugin

export { CreditCardInput, DateInput, GooglePlacesInput, NumeralInput, TimeInput, DateTimePicker }
