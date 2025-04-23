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

<style>
.dp--tp-solo-wrap {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 5px;
}

.dp--tp-solo-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  background-color: var(--dp-background-color);
  border-radius: var(--dp-border-radius);
  box-shadow: var(--dp-box-shadow);
}

.dp--tp-solo-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
}

.dp--tp-solo-title {
  font-size: var(--dp-font-size);
  font-weight: bold;
  color: var(--dp-text-color);
}

.dp--tp-solo-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: var(--dp-border-radius);
  cursor: pointer;
  transition: var(--dp-common-transition);
  background: transparent;
  border: none;
  color: var(--dp-text-color);
}

.dp--tp-solo-close:hover {
  background-color: var(--dp-hover-color);
  color: var(--dp-hover-text-color);
}

.dp--tp-solo-close:focus {
  background-color: var(--dp-hover-color);
  color: var(--dp-hover-text-color);
  outline: none;
}

.dp--tp-solo-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 5px;
}

.dp--tp-solo-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  padding: 5px;
  margin-top: auto;
}

.dp--tp-solo-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border-radius: var(--dp-border-radius);
  cursor: pointer;
  transition: var(--dp-common-transition);
  background: transparent;
  border: none;
  color: var(--dp-text-color);
  font-family: var(--dp-font-family);
  font-size: var(--dp-font-size);
}

.dp--tp-solo-btn:hover {
  background-color: var(--dp-hover-color);
  color: var(--dp-hover-text-color);
}

.dp--tp-solo-btn:focus {
  background-color: var(--dp-hover-color);
  color: var(--dp-hover-text-color);
  outline: none;
}

.dp--tp-solo-btn-primary {
  background-color: var(--dp-primary-color);
  color: var(--dp-primary-text-color);
}

.dp--tp-solo-btn-primary:hover {
  background-color: var(--dp-primary-hover-color);
  color: var(--dp-primary-text-color);
}

.dp--tp-solo-btn-primary:focus {
  background-color: var(--dp-primary-hover-color);
  color: var(--dp-primary-text-color);
  outline: none;
}
</style>
