import type { IDefaultSelect, OverlayGridItem, VueEmit } from '../../interfaces'
import type { PickerBasePropsType } from '../../props'

import { getMonth, getYear } from 'date-fns'
import { computed, nextTick, onMounted, ref } from 'vue'
import { useMonthOrQuarterPicker } from '../../components/shared/month-quarter-picker'
import { useDefaults, useModel, useValidation } from '../../composables'

import {
  checkRangeAutoApply,
  getRangeWithFixedDate,
  handleMultiDatesSelect,
  setMonthOrYearRange,
  setPresetDate,
} from '../../composables/shared'
import {
  checkHighlightMonth,
  getDate,
  getMaxMonth,
  getMinMonth,
  isDateBetween,
  isMonthAllowed,
  isMonthDisabled,
  resetDate,
  setDateMonthOrYear,
} from '../../utils/date-utils'
import { checkMinMaxValue, getMonths, groupListAndMap } from '../../utils/util'

export function useMonthPicker(props: PickerBasePropsType, emit: VueEmit) {
  const {
    defaultedMultiCalendars,
    defaultedAriaLabels,
    defaultedTransitions,
    defaultedConfig,
    defaultedRange,
    defaultedHighlight,
    propDates,
    defaultedTz,
    defaultedFilters,
    defaultedMultiDates,
  } = useDefaults(props)
  const reMap = () => {
    if (props.isTextInputDate)
      onYearSelect(getYear(getDate(props.startDate)), 0)
  }
  const { modelValue, year, month: instanceMonth, calendars } = useModel(props, emit, reMap)
  const months = computed(() => getMonths(props.formatLocale, props.locale, props.monthNameFormat))
  const hoverDate = ref<Date | null>(null)
  const { checkMinMaxRange } = useValidation(props)

  const {
    selectYear: _selectYearFromPicker,
    groupedYears,
    showYearPicker,
    toggleYearPicker,
    handleYearSelect,
    handleYear,
    isDisabled,
  } = useMonthOrQuarterPicker({
    modelValue,
    multiCalendars: defaultedMultiCalendars,
    range: defaultedRange,
    highlight: defaultedHighlight,
    calendars,
    year,
    propDates,
    month: instanceMonth,
    filters: defaultedFilters,
    props,
    emit,
  })

  onMounted(() => {
    if (props.startDate) {
      if ((modelValue.value && props.focusStartDate) || !modelValue.value) {
        onYearSelect(getYear(getDate(props.startDate)), 0)
      }
    }
  })

  const getMonthYear = (date?: Date) => {
    if (date) {
      return { month: getMonth(date), year: getYear(date) }
    }
    return { month: null, year: null }
  }

  const getModelMonthYear = () => {
    if (modelValue.value) {
      if (Array.isArray(modelValue.value)) {
        return modelValue.value.map(val => getMonthYear(val))
      }
      return getMonthYear(modelValue.value)
    }
    return getMonthYear()
  }

  const checkActiveMonth = (instance: number, month: number) => {
    const calendar = calendars.value[instance]
    const activeMonthYear = getModelMonthYear()
    if (Array.isArray(activeMonthYear)) {
      return activeMonthYear.some(value => value.year === calendar?.year && value.month === month)
    }
    return calendar?.year === activeMonthYear.year && month === activeMonthYear.month
  }

  const isSameMonthYear = (month: number, instance: number, i: number) => {
    const currentModel = getModelMonthYear()

    if (Array.isArray(currentModel)) {
      const currentYear = year.value(instance)

      return currentYear === currentModel[i]?.year && month === currentModel[i]?.month
    }
    return false
  }

  const isMonthBetween = (month: number, instance: number) => {
    if (defaultedRange.value.enabled) {
      const currentModel = getModelMonthYear()
      if (Array.isArray(modelValue.value) && Array.isArray(currentModel)) {
        const isModel = isSameMonthYear(month, instance, 0) || isSameMonthYear(month, instance, 1)
        const current = setDateMonthOrYear(resetDate(getDate()), month, year.value(instance))
        return isDateBetween(modelValue.value, hoverDate.value, current) && !isModel
      }
      return false
    }
    return false
  }

  const groupedMonths = computed(() => (instance: number): OverlayGridItem[][] => {
    return groupListAndMap(months.value, (month: IDefaultSelect) => {
      const active = checkActiveMonth(instance, month.value)
      const disabled
                = checkMinMaxValue(
                  month.value,
                  getMinMonth(year.value(instance), propDates.value.minDate),
                  getMaxMonth(year.value(instance), propDates.value.maxDate),
                )
                || isMonthDisabled(propDates.value.disabledDates, year.value(instance), month.value)
                || defaultedFilters.value.months?.includes(month.value)
                || !isMonthAllowed(propDates.value.allowedDates, year.value(instance), month.value)
      const isBetween = isMonthBetween(month.value, instance)
      const highlighted = checkHighlightMonth(defaultedHighlight.value, month.value, year.value(instance))
      return { active, disabled, isBetween, highlighted }
    })
  })

  const monthToDate = (month: number, instance: number) => {
    return setDateMonthOrYear(resetDate(getDate()), month, year.value(instance))
  }

  const selectSingleMonth = (month: number, instance: number) => {
    const date = modelValue.value ? (modelValue.value as Date) : resetDate(new Date())
    modelValue.value = setDateMonthOrYear(date, month, year.value(instance))
    emit('auto-apply')
    emit('update-flow-step')
  }

  const selectRangedMonth = (month: number, instance: number) => {
    const date = monthToDate(month, instance)
    if (defaultedRange.value.fixedEnd || defaultedRange.value.fixedStart) {
      modelValue.value = getRangeWithFixedDate(date, modelValue, emit, defaultedRange)
    }
    else if (!modelValue.value) {
      modelValue.value = [monthToDate(month, instance)]
    }
    else if (checkMinMaxRange(date, modelValue.value)) {
      modelValue.value = setMonthOrYearRange(modelValue, monthToDate(month, instance), emit)
    }
    nextTick().then(() => {
      checkRangeAutoApply(modelValue.value as Date[], emit, props.autoApply, props.modelAuto)
    })
  }

  const selectMultiMonths = (month: number, instance: number) => {
    handleMultiDatesSelect(monthToDate(month, instance), modelValue, defaultedMultiDates.value.limit)
    emit('auto-apply', true)
  }

  const selectMonth = (month: number, instance: number): void => {
    calendars.value[instance].month = month
    emitMonthYearUpdate(instance, calendars.value[instance].year, undefined)
    if (defaultedMultiDates.value.enabled)
      return selectMultiMonths(month, instance)
    if (defaultedRange.value.enabled)
      return selectRangedMonth(month, instance)
    return selectSingleMonth(month, instance)
  }

  const selectYear = (year: number, instance: number): void => {
    onYearSelect(year, instance)
    emitMonthYearUpdate(instance, year, undefined)
  }

  function emitMonthYearUpdate(month: number | null, year: number, fromNav: boolean | undefined = false): void {
    emit('update-month-year', { month, year, fromNav })
  }

  function onYearSelect(year: number, instance: number): void {
    emit('toggle-year-picker', { flow: true })
    emitMonthYearUpdate(instance, year)
  }

  const setHoverDate = (month: number, instance: number): void => {
    hoverDate.value = monthToDate(month, instance)
  }

  const presetDate = (value: Date[] | string[] | Date | string, noTz?: boolean): void => {
    setPresetDate({
      value,
      modelValue,
      range: defaultedRange.value.enabled,
      timezone: noTz ? undefined : defaultedTz.value.timezone,
    })
    emit('auto-apply')
  }

  return {
    groupedMonths,
    groupedYears,
    year,
    isDisabled,
    defaultedMultiCalendars,
    defaultedAriaLabels,
    defaultedTransitions,
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
  }
}
