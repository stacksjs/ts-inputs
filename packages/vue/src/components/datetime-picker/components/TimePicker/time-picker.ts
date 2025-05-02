import type { TimeModel, VueEmit } from '../../interfaces'
import type { PickerBasePropsType } from '../../props'

import { set } from 'date-fns'
import { onMounted } from 'vue'
import { useDefaults, useModel } from '../../composables'

import { getDate, getTimeObj } from '../../utils/date-utils'
import { localToTz } from '../../utils/timezone'
import { useTimePickerUtils } from './time-picker-utils'

export function useTimePicker(props: PickerBasePropsType, emit: VueEmit) {
  const reMap = () => {
    if (props.isTextInputDate)
      setTimeFromModel()
  }
  const { modelValue, time } = useModel(props, emit, reMap)
  const { defaultedStartTime, defaultedRange, defaultedTz } = useDefaults(props)
  const { updateTimeValues, getSetDateTime, setTime, assignStartTime, disabledTimesConfig, validateTime }
        = useTimePickerUtils(props, time, modelValue, updateFlowStep)

  function updateFlowStep() {
    emit('update-flow-step')
  }

  const parseStartTime = (startTime: TimeModel) => {
    const { hours, minutes, seconds } = startTime
    return { hours: +hours, minutes: +minutes, seconds: seconds ? +seconds : 0 }
  }

  const getDateFromStartTime = () => {
    if (props.startTime) {
      if (Array.isArray(props.startTime)) {
        const parsedFirst = parseStartTime(props.startTime[0])
        const parsedSecond = parseStartTime(props.startTime[1])
        return [set(getDate(), parsedFirst), set(getDate(), parsedSecond)]
      }
      const parsed = parseStartTime(props.startTime)
      return set(getDate(), parsed)
    }
    return defaultedRange.value.enabled ? [null, null] : null
  }

  const assignEmptyModel = () => {
    if (defaultedRange.value.enabled) {
      const [firstStartTime, secondStartTime] = getDateFromStartTime() as Date[]
      modelValue.value = [
        localToTz(getSetDateTime(firstStartTime, 0), defaultedTz.value.timezone),
        localToTz(getSetDateTime(secondStartTime, 1), defaultedTz.value.timezone),
      ]
    }
    else {
      modelValue.value = localToTz(getSetDateTime(getDateFromStartTime() as Date), defaultedTz.value.timezone)
    }
  }

  const _getTimeValue = (value: Date | Date[] | null): { hours: number, minutes: number, seconds: number }[] => {
    if (Array.isArray(value)) {
      return [getTimeObj(getDate(value[0])), getTimeObj(getDate(value[1]))]
    }
    return [getTimeObj(value ?? getDate())]
  }

  const _assignTime = (hours: number | number[], minutes: number | number[], seconds: number | number[]): void => {
    setTime('hours', hours)
    setTime('minutes', minutes)
    setTime('seconds', props.enableSeconds ? seconds : 0)
  }

  function setTimeFromModel(): void {
    if (modelValue.value) {
      const date = Array.isArray(modelValue.value) ? modelValue.value[0] : modelValue.value
      if (date) {
        setTime('hours', getHours(date))
        setTime('minutes', getMinutes(date))
        setTime('seconds', getSeconds(date))
      }
    }
  }

  onMounted(() => {
    if (!props.shadow) {
      assignStartTime(defaultedStartTime.value)
      if (!modelValue.value)
        return assignEmptyModel()
      return setTimeFromModel()
    }
  })

  const handleTimeUpdate = () => {
    if (Array.isArray(modelValue.value)) {
      modelValue.value = modelValue.value.map((date, i) => {
        if (date)
          return getSetDateTime(date, i)
        return date
      })
    }
    else {
      modelValue.value = getSetDateTime(modelValue.value)
    }
    emit('time-update')
  }

  const updateTime = (value: number | number[], isHours = true, isSeconds = false) => {
    updateTimeValues(value, isHours, isSeconds, handleTimeUpdate)
  }

  return {
    modelValue,
    time,
    disabledTimesConfig,
    updateTime,
    validateTime,
  }
}
