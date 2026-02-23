import { computed, reactive } from 'vue'

const state = reactive({
  menuFocused: false,
  shiftKeyInMenu: false,
})

export function useState() {
  const setMenuFocused = (value: boolean): void => {
    state.menuFocused = value
  }

  const setShiftKey = (value: boolean): void => {
    if (state.shiftKeyInMenu === value)
      return
    state.shiftKeyInMenu = value
  }

  const control = computed(() => ({ shiftKeyInMenu: state.shiftKeyInMenu, menuFocused: state.menuFocused }))

  return {
    control: control,
    setMenuFocused: setMenuFocused,
    setShiftKey: setShiftKey,
  }
}
