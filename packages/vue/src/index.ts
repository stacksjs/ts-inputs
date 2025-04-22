import type { App, Plugin } from 'vue'
import TSInputs from './components/TSInputs.vue'

const plugin: Plugin = {
  install: (app: App) => {
    app.component('TSInputs', TSInputs)
  },
}

export default plugin

export {
  TSInputs,
}
