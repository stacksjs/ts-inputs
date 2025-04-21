import type { ComputedRef, Ref } from 'vue'
import type { Config } from '../interfaces'
import { computed, onMounted, onUnmounted, ref } from 'vue'

export function useResponsive(config: ComputedRef<Config>, isShadow?: boolean) {
  const windowWidth = ref(0)

  const updateWindowWidth = () => {
    windowWidth.value = window.document.documentElement.clientWidth
  }

  const isMobile = computed(() =>
    windowWidth.value <= config.value.mobileBreakpoint && !isShadow ? true : undefined,
  )

  onMounted(() => {
    updateWindowWidth()
    window.addEventListener('resize', updateWindowWidth, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateWindowWidth)
  })

  return {
    isMobile: isMobile as Ref<boolean | undefined>,
  }
}
