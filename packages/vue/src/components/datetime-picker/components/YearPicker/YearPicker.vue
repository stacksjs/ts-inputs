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
