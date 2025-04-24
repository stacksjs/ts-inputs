<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{ multiCalendars: number, stretch?: boolean, collapse?: boolean, isMobile?: boolean }>()

const instances = computed((): number[] =>
  props.multiCalendars > 0 ? [...new Array(props.multiCalendars).keys()] : [0],
)

const calendarInstanceClassWrapper = computed(() => ({
  dp__instance_calendar: props.multiCalendars > 0,
}))
</script>

<template>
  <div
    :class="{
      'dp__menu_inner': !stretch,
      'dp--menu--inner-stretched': stretch,
      'dp__flex_display': multiCalendars > 0,
      'dp--flex-display-collapsed': collapse,
    }"
    :data-dp-mobile="isMobile"
  >
    <div v-for="(instance, i) in instances" :key="instance" :class="calendarInstanceClassWrapper">
      <slot :instance="instance" :index="i" />
    </div>
  </div>
</template>
