import type { App, Plugin } from 'vue'
import BaseInput from './components/BaseInput.vue'
import DateTimePicker from './components/datetime-picker/DateTimePicker.vue'

const plugin: Plugin = {
  install: (app: App) => {
    app.component('DateTimePicker', DateTimePicker)
    app.component('BaseInput', BaseInput)
  },
}

export default plugin

export {
  BaseInput,
  DateTimePicker,
}
