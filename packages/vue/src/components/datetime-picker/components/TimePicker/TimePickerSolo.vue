<script lang="ts" setup>
import { onMounted, ref, useSlots } from 'vue'

import { mapSlots } from '../../composables'

import { PickerBaseProps } from '../../props'
import InstanceWrap from '../Common/InstanceWrap.vue'
import { useTimePicker } from './time-picker'
import TimePicker from './TimePicker.vue'

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
  'time-update',
  'am-pm-change',
  'mount',
  'reset-flow',
  'update-flow-step',
  'overlay-toggle',
])
const slots = useSlots()
const timePickerSlots = mapSlots(slots, 'timePicker')
const tpRef = ref<InstanceType<typeof TimePicker> | null>(null)

const { time, modelValue, disabledTimesConfig, updateTime, validateTime } = useTimePicker(props, emit)

onMounted(() => {
  if (!props.shadow) {
    emit('mount', null)
  }
})

function getSidebarProps() {
  return {
    modelValue,
    time,
    updateTime,
  }
}

function toggleTimePicker(show: boolean, flow = false, childOpen = '') {
  tpRef.value?.toggleTimePicker(show, flow, childOpen)
}

defineExpose({ getSidebarProps, toggleTimePicker })
</script>

<template>
  <InstanceWrap :multi-calendars="0" stretch :is-mobile="isMobile">
    <TimePicker
      ref="tpRef"
      v-bind="$props"
      :hours="time.hours"
      :minutes="time.minutes"
      :seconds="time.seconds"
      :internal-model-value="internalModelValue"
      :disabled-times-config="disabledTimesConfig"
      :validate-time="validateTime"
      @update:hours="updateTime($event)"
      @update:minutes="updateTime($event, false)"
      @update:seconds="updateTime($event, false, true)"
      @am-pm-change="$emit('am-pm-change', $event)"
      @reset-flow="$emit('reset-flow')"
      @overlay-closed="$emit('overlay-toggle', { open: false, overlay: $event })"
      @overlay-opened="$emit('overlay-toggle', { open: true, overlay: $event })"
    >
      <template v-for="(slot, i) in timePickerSlots" #[slot]="args" :key="i">
        <slot :name="slot" v-bind="args" />
      </template>
    </TimePicker>
  </InstanceWrap>
</template>
