<script lang="ts" setup>
import { onMounted, useSlots } from 'vue'
import { mapSlots } from '../../composables'
import { PickerBaseProps } from '../../props'
import InstanceWrap from '../Common/InstanceWrap.vue'

import SelectionOverlay from '../Common/SelectionOverlay.vue'
import { useMonthPicker } from '../MonthPicker/month-picker'
import YearModePicker from '../shared/YearModePicker.vue'

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
  'overlay-closed',
  'reset-flow',
  'range-start',
  'range-end',
  'auto-apply',
  'update-month-year',
  'update-flow-step',
  'mount',
  'invalid-fixed-range',
  'overlay-toggle',
])

const slots = useSlots()
const yearModeSlots = mapSlots(slots, 'yearMode')

onMounted(() => {
  if (!props.shadow) {
    emit('mount', null)
  }
})

const {
  groupedMonths,
  groupedYears,
  year,
  isDisabled,
  defaultedMultiCalendars,
  defaultedConfig,
  showYearPicker,
  modelValue,
  presetDate,
  setHoverDate,
  selectMonth,
  selectYear,
  toggleYearPicker,
  handleYearSelect,
  handleYear,
  getModelMonthYear,
} = useMonthPicker(props, emit)

function getSidebarProps() {
  return {
    modelValue,
    year,
    getModelMonthYear,
    selectMonth,
    selectYear,
    handleYear,
  }
}

defineExpose({ getSidebarProps, presetDate, toggleYearPicker: (flow: boolean) => toggleYearPicker(0, flow) })
</script>

<template>
  <InstanceWrap
    v-slot="{ instance }"
    :multi-calendars="defaultedMultiCalendars.count"
    :collapse="collapse"
    stretch
    :is-mobile="isMobile"
  >
    <slot v-if="$slots['top-extra']" name="top-extra" :value="internalModelValue" />
    <template v-if="$slots['month-year']">
      <slot
        name="month-year"
        v-bind="{
          year,
          months: groupedMonths(instance),
          years: groupedYears(instance),
          selectMonth,
          selectYear,
          instance,
        }"
      />
    </template>
    <template v-else>
      <SelectionOverlay
        :items="groupedMonths(instance)"
        :arrow-navigation="arrowNavigation"
        :is-last="autoApply && !defaultedConfig.keepActionRow"
        :esc-close="escClose"
        :height="defaultedConfig.modeHeight"
        :config="config"
        :no-overlay-focus="Boolean(noOverlayFocus || textInput)"
        use-relative
        type="month"
        @selected="selectMonth($event, instance)"
        @hover-value="setHoverDate($event, instance)"
      >
        <template #header>
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
        </template>
        <template v-if="$slots[`month-overlay-value`]" #item="{ item }">
          <slot name="month-overlay-value" :text="item.text" :value="item.value" />
        </template>
      </SelectionOverlay>
    </template>
  </InstanceWrap>
</template>

<style>
.dp-month-picker-wrap {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 5px;
}

.dp--month-items {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 5px;
  padding: 5px;
}

.dp--month-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: var(--dp-border-radius);
  cursor: pointer;
  transition: var(--dp-common-transition);
  background: transparent;
  border: none;
  color: var(--dp-text-color);
  font-family: var(--dp-font-family);
  font-size: var(--dp-font-size);
}

.dp--month-btn:hover {
  background-color: var(--dp-hover-color);
  color: var(--dp-hover-text-color);
}

.dp--month-btn:focus {
  background-color: var(--dp-hover-color);
  color: var(--dp-hover-text-color);
  outline: none;
}

.dp--month-btn[aria-disabled="true"] {
  opacity: 0.5;
  cursor: not-allowed;
}

.dp--month-btn-active {
  background-color: var(--dp-primary-color);
  color: var(--dp-primary-text-color);
}

.dp--month-btn-between {
  background-color: var(--dp-hover-color);
  color: var(--dp-hover-text-color);
}

.dp--month-btn-highlighted {
  font-weight: bold;
  color: var(--dp-primary-color);
}
</style>
