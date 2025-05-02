import type { Ref } from 'vue'

import type { Flow, VueEmit } from '../interfaces'

import type { AllPropsType } from '../props'
import { computed, nextTick, reactive, ref } from 'vue'
import { CMP, FlowStep } from '../constants'

export function useFlow(props: AllPropsType, emit: VueEmit, dynCmpRef: Ref<any>) {
  const flowStep = ref(0)

  const childrenMounted = reactive({
    [CMP.timePicker]: !props.enableTimePicker || props.timePicker || props.monthPicker,
    [CMP.calendar]: false,
    [CMP.header]: false,
  })

  const specificMode = computed(() => props.monthPicker || props.timePicker)

  const resetFlow = (): void => {
    flowStep.value = -1
  }

  const handleFlowStep = (step: Flow, fn: string, ...args: Array<boolean | string>) => {
    if (props.flow[flowStep.value] === step) {
      if (dynCmpRef.value) {
        dynCmpRef.value[fn]?.(...args)
      }
    }
  }

  const handleFlow = (skipStep = 0): void => {
    if (skipStep) {
      flowStep.value += skipStep
    }
    handleFlowStep(FlowStep.month, 'toggleMonthPicker', true)
    handleFlowStep(FlowStep.year, 'toggleYearPicker', true)
    handleFlowStep(FlowStep.calendar, 'toggleTimePicker', false, true)
    handleFlowStep(FlowStep.time, 'toggleTimePicker', true, true)

    const flowValue = props.flow[flowStep.value]
    if (flowValue === FlowStep.hours || flowValue === FlowStep.minutes || flowValue === FlowStep.seconds) {
      handleFlowStep(flowValue, 'toggleTimePicker', true, true, flowValue)
    }
  }

  const updateFlowStep = (): void => {
    if (props.flow?.length && flowStep.value !== -1) {
      flowStep.value += 1
      emit('flow-step', flowStep.value)
      handleFlow()
    }
    if (props.flow?.length === flowStep.value) {
      nextTick().then(() => resetFlow())
    }
  }

  const childMount = (cmp: unknown): void => {
    if (props.flow?.length) {
      if (!cmp && specificMode.value)
        return handleFlow()
      childrenMounted[cmp as CMP] = true

      if (!Object
        .keys(childrenMounted)
        .filter(key => !childrenMounted[key as CMP])
        .length) {
        handleFlow()
      }
    }
  }

  return {
    childMount,
    updateFlowStep,
    resetFlow,
    handleFlow,
    flowStep,
  }
}
