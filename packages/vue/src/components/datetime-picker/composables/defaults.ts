import type { TimeModel } from '../interfaces'

import type { AllPropsType, PickerBasePropsType } from '../props'
import { computed } from 'vue'

import { assignDefaultTime } from '../utils/date-utils'
import {
  defaultAriaLabels,
  defaultMultiCalendars,
  defaultPreviewFormat,
  defaultTransitions,
  getDefaultActionRowData,
  getDefaultConfig,
  getDefaultFilters,
  getDefaultHighlight,
  getDefaultInlineOptions,
  getDefaultMultiDates,
  getDefaultRangeOptions,
  getDefaultTextInputOptions,
  getDefaultTimeZone,
  getDefaultUI,
  getDefaultWeekNumbers,
  mapPropDates,
} from '../utils/defaults'

export function useDefaults(props: AllPropsType | PickerBasePropsType) {
  // Shared method for time format
  const getTimeFormat = (): string => {
    const seconds = props.enableSeconds ? ':ss' : ''
    const minutes = props.enableMinutes ? ':mm' : ''
    return props.is24 ? `HH${minutes}${seconds}` : `hh${minutes}${seconds} aa`
  }

  const defaultedWeekNumbers = computed(() => getDefaultWeekNumbers(props.weekNumbers))
  const defaultedRange = computed(() => getDefaultRangeOptions(props.range))

  // Get default format pattern, returns user specified if defined first
  const getDefaultPattern = (): string => {
    if (props.format)
      return props.format as string
    if (props.monthPicker)
      return 'MM/yyyy'
    if (props.timePicker)
      return getTimeFormat()
    if (props.weekPicker)
      return `${defaultedWeekNumbers.value?.type === 'iso' ? 'II' : 'ww'}-RR`
    if (props.yearPicker)
      return 'yyyy'
    if (props.quarterPicker)
      return 'QQQ/yyyy'
    return props.enableTimePicker ? `MM/dd/yyyy, ${getTimeFormat()}` : 'MM/dd/yyyy'
  }
  const assignTime = (date: TimeModel) => assignDefaultTime(date, props.enableSeconds)
  const getDefaultStartTime = (): TimeModel | TimeModel[] | null => {
    if (defaultedRange.value.enabled) {
      if (props.startTime && Array.isArray(props.startTime)) {
        return [assignTime(props.startTime[0]), assignTime(props.startTime[1])]
      }
      return null
    }
    return props.startTime && !Array.isArray(props.startTime) ? assignTime(props.startTime) : null
  }

  const defaultedMultiCalendars = computed(() => defaultMultiCalendars(props.multiCalendars))

  const defaultedStartTime = computed(() => getDefaultStartTime())

  const defaultedAriaLabels = computed(() => defaultAriaLabels(props.ariaLabels))

  const defaultedFilters = computed(() => getDefaultFilters(props.filters))

  const defaultedTransitions = computed(() => defaultTransitions(props.transitions))

  const defaultedActionRow = computed(() => getDefaultActionRowData(props.actionRow))

  const defaultedPreviewFormat = computed(() =>
    defaultPreviewFormat(props.previewFormat, props.format, getDefaultPattern()),
  )

  const defaultedTextInput = computed(() => getDefaultTextInputOptions(props.textInput))

  const defaultedInline = computed(() => getDefaultInlineOptions(props.inline))

  const defaultedConfig = computed(() => getDefaultConfig(props.config))

  const defaultedHighlight = computed(() => getDefaultHighlight(props.highlight))

  const defaultedTz = computed(() => getDefaultTimeZone(props.timezone))

  const defaultedMultiDates = computed(() => getDefaultMultiDates(props.multiDates))

  const propDates = computed(() =>
    mapPropDates({
      minDate: props.minDate,
      maxDate: props.maxDate,
      disabledDates: props.disabledDates,
      allowedDates: props.allowedDates,
      highlight: defaultedHighlight.value,
      markers: props.markers,
      timezone: defaultedTz.value,
      isSpecific: props.monthPicker || props.yearPicker || props.quarterPicker,
      isMonthPicker: props.monthPicker,
      isYearPicker: props.yearPicker,
    }),
  )

  const defaultedUI = computed(() => getDefaultUI(props.ui))

  const handleEventPropagation = (ev: KeyboardEvent): void => {
    if (defaultedConfig.value.allowStopPropagation) {
      ev.stopPropagation()
    }
    if (defaultedConfig.value.allowPreventDefault) {
      ev.preventDefault()
    }
  }

  return {
    defaultedTransitions: defaultedTransitions,
    defaultedMultiCalendars: defaultedMultiCalendars,
    defaultedStartTime: defaultedStartTime,
    defaultedAriaLabels: defaultedAriaLabels,
    defaultedFilters: defaultedFilters,
    defaultedActionRow: defaultedActionRow,
    defaultedPreviewFormat: defaultedPreviewFormat,
    defaultedTextInput: defaultedTextInput,
    defaultedInline: defaultedInline,
    defaultedConfig: defaultedConfig,
    defaultedHighlight: defaultedHighlight,
    defaultedWeekNumbers: defaultedWeekNumbers,
    defaultedRange: defaultedRange,
    propDates: propDates,
    defaultedTz: defaultedTz,
    defaultedMultiDates: defaultedMultiDates,
    defaultedUI: defaultedUI,
    getDefaultPattern: getDefaultPattern,
    getDefaultStartTime: getDefaultStartTime,
    handleEventPropagation: handleEventPropagation,
  }
}
