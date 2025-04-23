<script lang="ts" setup>
import type { PropType } from 'vue'

import type { DisabledTimesArrProp, Flow, TimeInputRef, TimeType } from '../../interfaces'
import { computed, nextTick, onMounted, ref, useSlots } from 'vue'

import { mapSlots, useArrowNavigation, useCommon, useDefaults, useTransitions } from '../../composables'
import { FlowStep } from '../../constants'
import { PickerBaseProps } from '../../props'

import { checkKeyDown, findFocusableEl, isModelAuto, unrefElement } from '../../utils/util'
import { CalendarIcon, ClockIcon } from '../Icons'
import TimeInput from './TimeInput.vue'

defineOptions({
  compatConfig: {
    MODE: 3,
  },
})

const props = defineProps({
  hours: { type: [Number, Array] as PropType<number | number[]>, default: 0 },
  minutes: { type: [Number, Array] as PropType<number | number[]>, default: 0 },
  seconds: { type: [Number, Array] as PropType<number | number[]>, default: 0 },
  disabledTimesConfig: { type: Function as PropType<DisabledTimesArrProp>, default: null },
  validateTime: {
    type: Function as PropType<(type: TimeType, value: number | number[]) => boolean>,
    default: () => false,
  },
  ...PickerBaseProps,
})

const emit = defineEmits([
  'update:hours',
  'update:minutes',
  'update:seconds',
  'mount',
  'reset-flow',
  'overlay-opened',
  'overlay-closed',
  'am-pm-change',
])

const { buildMatrix, setTimePicker } = useArrowNavigation()
const slots = useSlots()

const { defaultedTransitions, defaultedAriaLabels, defaultedTextInput, defaultedConfig, defaultedRange }
        = useDefaults(props)
const { transitionName, showTransition } = useTransitions(defaultedTransitions)
const { hideNavigationButtons } = useCommon()

const openTimePickerBtn = ref(null)
const closeTimePickerBtn = ref(null)
const timeInputRefs = ref<TimeInputRef[]>([])
const overlayRef = ref<HTMLElement | null>(null)
const timePickerOverlayOpen = ref(false)
const navigationFlow: Flow = ref('time')

onMounted(() => {
  emit('mount')
  if (!props.timePicker && props.arrowNavigation) {
    buildMatrix([unrefElement(openTimePickerBtn.value) as HTMLElement], 'time')
  }
  else {
    setTimePicker(true, props.timePicker)
  }
})

const shouldShowRangedInput = computed(() => {
  if (defaultedRange.value.enabled && props.modelAuto)
    return isModelAuto(props.internalModelValue)
  return true
})

const showTimePicker = ref(false)

function getTimeInput(i: number) {
  return {
    hours: Array.isArray(props.hours) ? props.hours[i] : props.hours,
    minutes: Array.isArray(props.minutes) ? props.minutes[i] : props.minutes,
    seconds: Array.isArray(props.seconds) ? props.seconds[i] : props.seconds,
  }
}

const timeInputs = computed((): { hours: number, minutes: number, seconds: number }[] => {
  const arr = []
  if (defaultedRange.value.enabled) {
    for (let i = 0; i < 2; i++) {
      arr.push(getTimeInput(i))
    }
  }
  else {
    arr.push(getTimeInput(0))
  }
  return arr as { hours: number, minutes: number, seconds: number }[]
})

function toggleTimePicker(show: boolean, flow = false, childOpen = ''): void {
  if (!flow) {
    emit('reset-flow')
  }
  showTimePicker.value = show

  emit(show ? 'overlay-opened' : 'overlay-closed', FlowStep.time)

  if (props.arrowNavigation) {
    setTimePicker(show)
  }

  nextTick(() => {
    if (childOpen !== '' && timeInputRefs.value[0]) {
      timeInputRefs.value[0].openChildCmp(childOpen)
    }
  })
}

const toggleButtonClass = computed(() => ({
  dp__btn: true,
  dp__button: true,
  dp__button_bottom: props.autoApply && !defaultedConfig.value.keepActionRow,
}))

const overlayClass = computed(() => ({
  'dp__overlay': !props.timePickerInline,
  'dp--overlay-absolute': !props.timePicker && !props.timePickerInline,
  'dp--overlay-relative': props.timePicker,
}))

const timeInputSlots = mapSlots(slots, 'timePicker')

function getEvent(event: number, index: number, property: 'hours' | 'minutes' | 'seconds') {
  if (!defaultedRange.value.enabled) {
    return event
  }
  if (index === 0) {
    return [event, timeInputs.value[1][property]]
  }
  return [timeInputs.value[0][property], event]
}

function updateHours(hours: number | number[]): void {
  emit('update:hours', hours)
}

function updateMinutes(minutes: number | number[]): void {
  emit('update:minutes', minutes)
}

function updateSeconds(seconds: number | number[]): void {
  emit('update:seconds', seconds)
}

function focusOverlay() {
  if (overlayRef.value && !defaultedTextInput.value.enabled && !props.noOverlayFocus) {
    const el = findFocusableEl(overlayRef.value)
    if (el) {
      el.focus({ preventScroll: true })
    }
  }
}

function timeInputOverlayClose(mode: TimeType) {
  timePickerOverlayOpen.value = false
  emit('overlay-closed', mode)
}
function timeInputOverlayOpen(mode: TimeType) {
  timePickerOverlayOpen.value = true
  emit('overlay-opened', mode)
}

defineExpose({ toggleTimePicker })
</script>

<template>
  <div class="dp--tp-wrap" :data-dp-mobile="isMobile">
    <button
      v-if="!timePicker && !timePickerInline"
      v-show="!hideNavigationButtons(hideNavigation, navigationFlow)"
      ref="openTimePickerBtn"
      type="button"
      :class="{ ...toggleButtonClass, 'dp--hidden-el': showTimePicker }"
      :aria-label="defaultedAriaLabels?.openTimePicker"
      :tabindex="noOverlayFocus ? undefined : 0"
      data-test-id="open-time-picker-btn"
      @keydown="checkKeyDown($event, () => toggleTimePicker(true))"
      @click="toggleTimePicker(true)"
    >
      <slot v-if="$slots['clock-icon']" name="clock-icon" />
      <ClockIcon v-if="!$slots['clock-icon']" />
    </button>
    <transition :name="transitionName(showTimePicker)" :css="showTransition && !timePickerInline">
      <div
        v-if="showTimePicker || timePicker || timePickerInline"
        ref="overlayRef"
        :role="timePickerInline ? undefined : 'dialog'"
        :class="overlayClass"
        :style="timePicker ? { height: `${defaultedConfig.modeHeight}px` } : undefined"
        :aria-label="defaultedAriaLabels?.timePicker"
        :tabindex="timePickerInline ? undefined : 0"
      >
        <div
          :class="
            !timePickerInline
              ? 'dp__overlay_container dp__container_flex dp__time_picker_overlay_container'
              : 'dp__time_picker_inline_container'
          "
          style="display: flex"
        >
          <slot
            v-if="$slots['time-picker-overlay']"
            name="time-picker-overlay"
            :hours="hours"
            :minutes="minutes"
            :seconds="seconds"
            :set-hours="updateHours"
            :set-minutes="updateMinutes"
            :set-seconds="updateSeconds"
          />
          <template v-if="!$slots['time-picker-overlay']">
            <div :class="timePickerInline ? 'dp__flex' : 'dp__overlay_row dp__flex_row'">
              <TimeInput
                v-for="(tInput, index) in timeInputs"
                v-show="index === 0 ? true : shouldShowRangedInput"
                :key="index"
                v-bind="{
                  ...$props,
                  order: index,
                  hours: tInput.hours,
                  minutes: tInput.minutes,
                  seconds: tInput.seconds,
                  closeTimePickerBtn,
                  disabledTimesConfig,
                  disabled: index === 0 ? defaultedRange.fixedStart : defaultedRange.fixedEnd,
                }"
                ref="timeInputRefs"
                :validate-time="
                  (type: TimeType, value: number) => validateTime(type, getEvent(value, index, type))
                "
                @update:hours="updateHours(getEvent($event, index, 'hours'))"
                @update:minutes="updateMinutes(getEvent($event, index, 'minutes'))"
                @update:seconds="updateSeconds(getEvent($event, index, 'seconds'))"
                @mounted="focusOverlay"
                @overlay-closed="timeInputOverlayClose"
                @overlay-opened="timeInputOverlayOpen"
                @am-pm-change="$emit('am-pm-change', $event)"
              >
                <template v-for="(slot, i) in timeInputSlots" #[slot]="args" :key="i">
                  <slot :name="slot" v-bind="args" />
                </template>
              </TimeInput>
            </div>
          </template>
          <button
            v-if="!timePicker && !timePickerInline"
            v-show="!hideNavigationButtons(hideNavigation, navigationFlow)"
            ref="closeTimePickerBtn"
            type="button"
            :class="{ ...toggleButtonClass, 'dp--hidden-el': timePickerOverlayOpen }"
            :aria-label="defaultedAriaLabels?.closeTimePicker"
            tabindex="0"
            @keydown="checkKeyDown($event, () => toggleTimePicker(false))"
            @click="toggleTimePicker(false)"
          >
            <slot v-if="$slots['calendar-icon']" name="calendar-icon" />
            <CalendarIcon v-if="!$slots['calendar-icon']" />
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<style>
.dp--tp-wrap {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 5px;
}

.dp__overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.dp--overlay-absolute {
  position: absolute;
}

.dp--overlay-relative {
  position: relative;
}

.dp__overlay_container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  background-color: var(--dp-background-color);
  border-radius: var(--dp-border-radius);
  box-shadow: var(--dp-box-shadow);
}

.dp__time_picker_overlay_container {
  max-width: 300px;
  margin: 0 auto;
}

.dp__time_picker_inline_container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.dp__flex {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dp__flex_row {
  flex-direction: row;
}

.dp__btn {
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

.dp__btn:hover {
  background-color: var(--dp-hover-color);
  color: var(--dp-hover-text-color);
}

.dp__btn:focus {
  background-color: var(--dp-hover-color);
  color: var(--dp-hover-text-color);
  outline: none;
}

.dp__button {
  width: 40px;
  height: 40px;
}

.dp__button_bottom {
  margin-top: auto;
}

.dp--hidden-el {
  display: none;
}
</style>
