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

<style>
.dp__btn {
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  font-family: var(--dp-font-family);
  font-size: var(--dp-font-size);
  color: var(--dp-text-color);
  transition: var(--dp-common-transition);
}

.dp--arrow-btn-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--dp-border-radius);
}

.dp--arrow-btn-nav:hover {
  background-color: var(--dp-hover-color);
  color: var(--dp-hover-text-color);
}

.dp--arrow-btn-nav:focus {
  background-color: var(--dp-hover-color);
  color: var(--dp-hover-text-color);
  outline: none;
}

.dp__inner_nav {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.dp__inner_nav_disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
