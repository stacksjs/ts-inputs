<script setup lang="ts">
import type { PropType } from 'vue'
import type { OverlayGridItem } from '../../interfaces'
import { ref } from 'vue'

import { useCommon, useDefaults, useTransitions } from '../../composables'
import { PickerBaseProps } from '../../props'

import ArrowBtn from '../Common/ArrowBtn.vue'
import SelectionOverlay from '../Common/SelectionOverlay.vue'
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from '../Icons'

const props = defineProps({
  ...PickerBaseProps,
  showYearPicker: { type: Boolean as PropType<boolean>, default: false },
  items: { type: Array as PropType<OverlayGridItem[][]>, default: () => [] },
  instance: { type: Number as PropType<number>, default: 0 },
  year: { type: Number as PropType<number>, default: 0 },
  isDisabled: { type: Function as PropType<(isNext: boolean) => boolean>, default: () => false },
})
const emit = defineEmits(['toggleYearPicker', 'yearSelect', 'handleYear'])
const { showRightIcon, showLeftIcon } = useCommon()
const { defaultedConfig, defaultedMultiCalendars, defaultedAriaLabels, defaultedTransitions, defaultedUI }
        = useDefaults(props)
const { showTransition, transitionName } = useTransitions(defaultedTransitions)

const overlayOpen = ref(false)

function toggleYearPicker(flow = false, show?: boolean) {
  overlayOpen.value = !overlayOpen.value
  emit('toggleYearPicker', { flow, show })
}

function handleYearSelect(year: number) {
  overlayOpen.value = false
  emit('yearSelect', year)
}

function handleYear(increment = false): void {
  emit('handleYear', increment)
}
</script>

<template>
  <div class="dp--year-mode-picker" :class="{ 'dp--hidden-el': overlayOpen }">
    <ArrowBtn
      v-if="showLeftIcon(defaultedMultiCalendars, instance)"
      :aria-label="defaultedAriaLabels?.prevYear"
      :disabled="isDisabled(false)"
      :class="defaultedUI?.navBtnPrev"
      @activate="handleYear(false)"
    >
      <slot v-if="$slots['arrow-left']" name="arrow-left" />
      <ChevronLeftIcon v-if="!$slots['arrow-left']" />
    </ArrowBtn>
    <button
      class="dp__btn dp--year-select"
      type="button"
      :aria-label="`${year}-${defaultedAriaLabels?.openYearsOverlay}`"
      :data-test-id="`year-mode-btn-${instance}`"
      @click="() => toggleYearPicker(false)"
      @keydown.enter="() => toggleYearPicker(false)"
    >
      <slot v-if="$slots.year" name="year" :year="year" />
      <template v-if="!$slots.year">
        {{ year }}
      </template>
    </button>
    <ArrowBtn
      v-if="showRightIcon(defaultedMultiCalendars, instance)"
      :aria-label="defaultedAriaLabels?.nextYear"
      :disabled="isDisabled(true)"
      :class="defaultedUI?.navBtnNext"
      @activate="handleYear(true)"
    >
      <slot v-if="$slots['arrow-right']" name="arrow-right" />
      <ChevronRightIcon v-if="!$slots['arrow-right']" />
    </ArrowBtn>
  </div>
  <transition :name="transitionName(showYearPicker)" :css="showTransition">
    <SelectionOverlay
      v-if="showYearPicker"
      :items="items"
      :text-input="textInput"
      :esc-close="escClose"
      :config="config"
      :is-last="autoApply && !defaultedConfig.keepActionRow"
      :hide-navigation="hideNavigation"
      :aria-labels="ariaLabels"
      :overlay-label="defaultedAriaLabels?.yearPicker?.(true)"
      type="year"
      @toggle="toggleYearPicker"
      @selected="handleYearSelect($event)"
    >
      <template #button-icon>
        <slot v-if="$slots['calendar-icon']" name="calendar-icon" />
        <CalendarIcon v-if="!$slots['calendar-icon']" />
      </template>
      <template v-if="$slots['year-overlay-value']" #item="{ item }">
        <slot name="year-overlay-value" :text="item.text" :value="item.value" />
      </template>
    </SelectionOverlay>
  </transition>
</template>

<style>
.dp--year-mode-picker {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  height: var(--dp-cell-size);
}
</style>
