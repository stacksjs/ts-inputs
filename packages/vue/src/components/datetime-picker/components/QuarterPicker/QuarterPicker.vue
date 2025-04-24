<script lang="ts" setup>
import { useSlots } from 'vue'

import { mapSlots } from '../../composables'
import { PickerBaseProps } from '../../props'

import InstanceWrap from '../Common/InstanceWrap.vue'
import YearModePicker from '../shared/YearModePicker.vue'
import { useQuarterPicker } from './quarter-picker'

defineOptions({
  compatConfig: {
    MODE: 3,
  },
})
const props = defineProps({
  ...PickerBaseProps,
})
const emit = defineEmits([
  'update:internal-model-value',
  'reset-flow',
  'overlay-closed',
  'auto-apply',
  'range-start',
  'range-end',
  'overlay-toggle',
  'update-month-year',
])
const slots = useSlots()
const yearModeSlots = mapSlots(slots, 'yearMode')

const {
  defaultedMultiCalendars,
  defaultedConfig,
  groupedYears,
  year,
  isDisabled,
  quarters,
  modelValue,
  showYearPicker,
  setHoverDate,
  selectQuarter,
  toggleYearPicker,
  handleYearSelect,
  handleYear,
} = useQuarterPicker(props, emit)

function getSidebarProps() {
  return {
    modelValue,
    year,
    selectQuarter,
    handleYearSelect,
    handleYear,
  }
}

defineExpose({ getSidebarProps })
</script>

<template>
  <InstanceWrap
    v-slot="{ instance }"
    :multi-calendars="defaultedMultiCalendars.count"
    :collapse="collapse"
    stretch
    :is-mobile="isMobile"
  >
    <div class="dp-quarter-picker-wrap" :style="{ minHeight: `${defaultedConfig.modeHeight}px` }">
      <slot v-if="$slots['top-extra']" name="top-extra" :value="internalModelValue" />
      <div>
        <YearModePicker
          v-bind="$props"
          :items="groupedYears(instance)"
          :instance="instance"
          :show-year-picker="showYearPicker[instance]"
          :year="year(instance)"
          :is-disabled="(next: boolean) => isDisabled(instance, next)"
          @handle-year="handleYear(instance, $event)"
          @year-select="handleYearSelect($event, instance)"
          @toggle-year-picker="toggleYearPicker(instance, $event?.flow, $event?.show)"
        >
          <template v-for="(slot, i) in yearModeSlots" #[slot]="args" :key="i">
            <slot :name="slot" v-bind="args" />
          </template>
        </YearModePicker>
      </div>
      <div class="dp--quarter-items">
        <div v-for="(quarter, i) in quarters(instance)" :key="i">
          <button
            type="button"
            class="dp--qr-btn"
            :class="{
              'dp--qr-btn-active': quarter.active,
              'dp--qr-btn-between': quarter.isBetween,
              'dp--qr-btn-disabled': quarter.disabled,
              'dp--highlighted': quarter.highlighted,
            }"
            :data-test-id="quarter.value"
            :disabled="quarter.disabled"
            @click="selectQuarter(quarter.value, instance, quarter.disabled)"
            @mouseover="setHoverDate(quarter.value)"
          >
            <template v-if="$slots.quarter">
              <slot name="quarter" :value="quarter.value" :text="quarter.text" />
            </template>
            <template v-else>
              {{ quarter.text }}
            </template>
          </button>
        </div>
      </div>
    </div>
  </InstanceWrap>
</template>

<style>
.dp-quarter-picker-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: var(--dp-menu-min-width);
}

.dp--qr-btn-disabled {
  cursor: not-allowed;
  background: var(--dp-disabled-color);
}

.dp--qr-btn-disabled:hover {
  background: var(--dp-disabled-color);
}

.dp--qr-btn {
  border: none;
  font: inherit;
  transition: var(--dp-common-transition);
  line-height: normal;
  width: 100%;
  padding: var(--dp-common-padding);
  background: none;
}

.dp--qr-btn:not(.dp--highlighted):not(.dp--qr-btn-active):not(.dp--qr-btn-disabled):not(.dp--qr-btn-between) {
  background: none;
}

.dp--qr-btn:hover:not(.dp--qr-btn-active):not(.dp--qr-btn-disabled) {
  background: var(--dp-hover-color);
  color: var(--dp-hover-text-color);
  transition: var(--dp-common-transition);
}

.dp--quarter-items {
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  height: 100%;
  justify-content: space-evenly;
}

.dp--qr-btn-active {
  background: var(--dp-primary-color);
  color: var(--dp-primary-text-color);
}

.dp--qr-btn-between {
  background: var(--dp-hover-color);
  color: var(--dp-hover-text-color);
}
</style>
