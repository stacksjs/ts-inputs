import type { App, Plugin } from 'vue'
import BaseInputs from './components/BaseInputs.vue'
import DateTimePicker from './components/datetime-picker/DateTimePicker.vue'

const plugin: Plugin = {
  install: (app: App) => {
    app.component('DateTimePicker', DateTimePicker)
    app.component('BaseInputs', BaseInputs)
  },
}

export default plugin

export {
  BaseInputs,
  DateTimePicker,
}
