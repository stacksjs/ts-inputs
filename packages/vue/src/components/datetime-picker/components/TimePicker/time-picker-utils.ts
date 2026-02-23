import type { ComputedRef, UnwrapNestedRefs, WritableComputedRef } from 'vue'

import type { DisabledTime, InternalModuleValue, Time, TimeModel, TimeType, TimeValuesInv } from '../../interfaces'

import type { PickerBasePropsType } from '../../props'
import { isAfter, isBefore, setMilliseconds, setSeconds } from 'date-fns'

import { computed } from 'vue'
import { useDefaults } from '../../composables'
import { getDate, isDateEqual, setDateTime } from '../../utils/date-utils'

export function useTimePickerUtils(
  props: PickerBasePropsType,
  time: UnwrapNestedRefs<Time>,
  modelValue: WritableComputedRef<InternalModuleValue>,
  updateFlow?: () => void,
): {
    setTime: (property: TimeType, value: number | number[]) => void
    updateHours: (value: number | number[]) => void
    updateMinutes: (value: number | number[]) => void
    updateSeconds: (value: number | number[]) => void
    getSetDateTime: (dateValue: Date | null, i?: number) => Date
    updateTimeValues: (value: number | number[], type: TimeType, handleTimeUpdate: (date: Date | Date[]) => void) => void
    getSecondsValue: (i?: number) => number
    assignStartTime: (startTime: TimeModel | TimeModel[] | null) => void
    validateTime: (type: TimeType, value: number | number[]) => boolean
    disabledTimesConfig: ComputedRef<(ind: number, hoursVal?: number) => TimeValuesInv>
  } {
  const { defaultedRange } = useDefaults(props)
  const getTimeValue = (type: TimeType, i?: number): number => {
    if (Array.isArray(time[type]))
      return time[type][i as number]
    return time[type]
  }
  // Check if seconds are enabled, and return proper value
  const getSecondsValue = (i?: number): number => {
    if (props.enableSeconds) {
      if (Array.isArray(time.seconds)) {
        return time.seconds[i as number]
      }
      return time.seconds
    }
    return 0
  }
  const getSetDateTime = (dateValue: Date | null, i?: number): Date => {
    if (!dateValue)
      return setSeconds(getDate(), getSecondsValue(i))
    if (i !== undefined) {
      return setDateTime(dateValue, getTimeValue('hours', i), getTimeValue('minutes', i), getSecondsValue(i))
    }
    return setDateTime(dateValue, time.hours as number, time.minutes as number, getSecondsValue())
  }
  // Any time modification will go through this function
  const setTime = (property: TimeType, value: number | number[]): void => {
    time[property] = value
  }

  const isRangeCheck = computed(() => {
    if (props.modelAuto && defaultedRange.value.enabled) {
      return Array.isArray(modelValue.value) ? modelValue.value.length > 1 : false
    }
    return defaultedRange.value.enabled
  })

  const validateTime = (type: TimeType, value: number | number[]): boolean => {
    const copies = Object.fromEntries(
      Object.keys(time).map((key) => {
        if (key === type)
          return [key, value]
        return [key, time[key as TimeType]].slice()
      }),
    )

    if (isRangeCheck.value && !defaultedRange.value.disableTimeRangeValidation) {
      const setTime = (_index: number) =>
        !modelValue.value
          ? (null as unknown as Date)
          : setDateTime(
              (modelValue.value as Date[])[_index],
              (copies.hours as number[])[_index],
              (copies.minutes as number[])[_index],
              (copies.seconds as number[])[_index],
            )

      const resetMilliseconds = (index: number) => setMilliseconds((modelValue.value as Date[])[index], 0)
      return !(
        isDateEqual(setTime(0), setTime(1))
        && (isAfter(setTime(0), resetMilliseconds(1)) || isBefore(setTime(1), resetMilliseconds(0)))
      )
    }
    return true
  }

  const updateTime = (type: TimeType, value: number | number[]) => {
    const valid = validateTime(type, value)
    if (valid) {
      setTime(type, value)
      if (updateFlow)
        updateFlow()
    }
  }

  const updateHours = (value: number | number[]): void => {
    updateTime('hours', value)
  }

  const updateMinutes = (value: number | number[]): void => {
    updateTime('minutes', value)
  }

  const updateSeconds = (value: number | number[]): void => {
    updateTime('seconds', value)
  }

  const updateTimeValues = (
    value: number | number[],
    type: TimeType,
    handleTimeUpdate: (date: Date | Date[]) => void,
  ): void => {
    if (type === 'hours')
      updateHours(value)
    else if (type === 'minutes')
      updateMinutes(value)
    else if (type === 'seconds')
      updateSeconds(value)

    if (modelValue.value) {
      handleTimeUpdate(modelValue.value)
    }
  }

  /**
   * If start time is provided, assign data.
   * Note: data is sanitized  parameters since prop value can be provided partially
   */
  const assignStartTime = (startTime: TimeModel | TimeModel[] | null): void => {
    if (startTime) {
      const isMulti = Array.isArray(startTime)
      const hours = isMulti ? [+startTime[0].hours, +startTime[1].hours] : +startTime.hours
      const minutes = isMulti ? [+startTime[0].minutes, +startTime[1].minutes] : +startTime.minutes
      const seconds = isMulti ? [+startTime[0].seconds, +startTime[1].seconds] : +startTime.seconds

      setTime('hours', hours)
      setTime('minutes', minutes)
      if (props.enableSeconds) {
        setTime('seconds', seconds)
      }
    }
  }

  const getDisabledTimesData = (ind: number, hours?: number) => {
    const data: { hours: number, disabledArr: DisabledTime[] } = {
      hours: Array.isArray(time.hours) ? time.hours[ind] : time.hours,
      disabledArr: [],
    }

    if (hours || hours === 0)
      data.hours = hours

    if (Array.isArray(props.disabledTimes)) {
      data.disabledArr = (
        defaultedRange.value.enabled && Array.isArray(props.disabledTimes[ind])
          ? props.disabledTimes[ind]
          : props.disabledTimes
      ) as DisabledTime[]
    }
    return data
  }

  const disabledTimesConfig = computed(() => (ind: number, hoursVal?: number): TimeValuesInv => {
    if (Array.isArray(props.disabledTimes)) {
      const { disabledArr, hours } = getDisabledTimesData(ind, hoursVal)

      const timeFound = disabledArr.filter(time => +time.hours === hours)
      if (timeFound[0]?.minutes === '*')
        return { hours: [hours], minutes: undefined, seconds: undefined }
      return {
        hours: [],
        minutes: timeFound?.map(t => +t.minutes) ?? [],
        seconds: timeFound?.map(t => (t.seconds ? +t.seconds : undefined)) ?? [],
      }
    }
    return { hours: [], minutes: [], seconds: [] }
  })

  return {
    setTime,
    updateHours,
    updateMinutes,
    updateSeconds,
    getSetDateTime,
    updateTimeValues,
    getSecondsValue,
    assignStartTime,
    validateTime,
    disabledTimesConfig,
  }
}
