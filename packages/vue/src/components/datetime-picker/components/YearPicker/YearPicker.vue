<script lang="ts" setup>
import { useDefaults } from '../../composables'

import { PickerBaseProps } from '../../props'
import SelectionOverlay from '../Common/SelectionOverlay.vue'
import { useYearPicker } from './year-picker'

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
  'range-start',
  'range-end',
  'auto-apply',
  'update-month-year',
])
const { groupedYears, modelValue, focusYear, selectYear, setHoverValue } = useYearPicker(props, emit)
const { defaultedConfig } = useDefaults(props)

function getSidebarProps() {
  return {
    modelValue,
    selectYear,
  }
}

defineExpose({ getSidebarProps })
</script>

<template>
  <div>
    <slot v-if="$slots['top-extra']" name="top-extra" :value="internalModelValue" />
    <template v-if="$slots['month-year']">
      <slot
        name="month-year"
        v-bind="{
          years: groupedYears,
          selectYear,
        }"
      />
    </template>
    <template v-else>
      <SelectionOverlay
        :items="groupedYears"
        :is-last="autoApply && !defaultedConfig.keepActionRow"
        :height="defaultedConfig.modeHeight"
        :config="config"
        :no-overlay-focus="Boolean(noOverlayFocus || textInput)"
        :focus-value="focusYear"
        type="year"
        use-relative
        @selected="selectYear"
        @hover-value="setHoverValue"
      >
        <template v-if="$slots['year-overlay-value']" #item="{ item }">
          <slot name="year-overlay-value" :text="item.text" :value="item.value" />
        </template>
      </SelectionOverlay>
    </template>
  </div>
</template>

<style>
.dp-year-picker-wrap {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 5px;
}

.dp--year-items {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 5px;
  padding: 5px;
}

.dp--year-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border-radius: var(--dp-border-radius);
  cursor: pointer;
  transition: var(--dp-common-transition);
  background: transparent;
  border: none;
  color: var(--dp-text-color);
  font-family: var(--dp-font-family);
  font-size: var(--dp-font-size);
}

.dp--year-btn:hover {
  background-color: var(--dp-hover-color);
  color: var(--dp-hover-text-color);
}

.dp--year-btn:focus {
  background-color: var(--dp-hover-color);
  color: var(--dp-hover-text-color);
  outline: none;
}

.dp--year-btn[aria-disabled="true"] {
  opacity: 0.5;
  cursor: not-allowed;
}

.dp--year-btn-active {
  background-color: var(--dp-primary-color);
  color: var(--dp-primary-text-color);
}

.dp--year-btn-between {
  background-color: var(--dp-hover-color);
  color: var(--dp-hover-text-color);
}

.dp--year-btn-highlighted {
  font-weight: bold;
  color: var(--dp-primary-color);
}
</style>
