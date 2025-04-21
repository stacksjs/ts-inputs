import type { ComputedRef } from 'vue'

import type { Transition } from '../interfaces'
import { computed } from 'vue'

export function useTransitions(transitions: ComputedRef<Transition>) {
  const transitionName = computed(() => (isOpen: boolean): string => {
    if (!transitions.value)
      return ''
    return isOpen ? transitions.value.open : transitions.value.close
  })

  const menuTransition = computed(() => (openOnTop: boolean) => {
    if (!transitions.value)
      return ''
    return openOnTop ? transitions.value.menuAppearTop : transitions.value.menuAppearBottom
  })

  return { transitionName, showTransition: !!transitions.value, menuTransition }
}
