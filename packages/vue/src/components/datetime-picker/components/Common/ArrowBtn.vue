<script lang="ts" setup>
import type { Ref } from 'vue'
import { onMounted, ref } from 'vue'
import { checkKeyDown } from '../../utils/util'

defineOptions({
  compatConfig: {
    MODE: 3,
  },
})

defineProps<{
  ariaLabel?: string
  elName?: string
  disabled: boolean
}>()

const emit = defineEmits<{
  'activate': []
  'set-ref': [i: Ref<HTMLElement | null>]
}>()

const elRef = ref<HTMLElement | null>(null)

onMounted(() => emit('set-ref', elRef)) // eslint-disable-line vue/no-ref-as-operand
</script>

<template>
  <button
    ref="elRef"
    type="button"
    :data-dp-element="elName"
    class="dp__btn dp--arrow-btn-nav"
    tabindex="0"
    :aria-label="ariaLabel"
    :aria-disabled="disabled || undefined"
    @click="emit('activate')"
    @keydown="checkKeyDown($event, () => emit('activate'), true)"
  >
    <span class="dp__inner_nav" :class="{ dp__inner_nav_disabled: disabled }">
      <slot />
    </span>
  </button>
</template>
