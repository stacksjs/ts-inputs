import type { ComputedRef, Ref, WritableComputedRef } from 'vue'
import type {
  DateFilter,
  Highlight,
  HighlightFn,
  ICalendarData,
  IDefaultSelect,
  InternalModuleValue,
  MultiCalendarsOptions,
  OverlayGridItem,
  PropDates,
  RangeConfig,
  VueEmit,
} from '../../interfaces'

import type { PickerBasePropsType } from '../../props'
import { addYears, differenceInYears, endOfYear, getMonth, getYear, set, startOfYear, subYears } from 'date-fns'

import { computed, onMounted, ref, watch } from 'vue'
import { FlowStep } from '../../constants'
import { checkHighlightYear, getDate, getMinMaxYear, resetDate, validateMonthYear } from '../../utils/date-utils'
import { checkMinMaxValue, getYears, groupListAndMap } from '../../utils/util'

interface Opts {
  multiCalendars: ComputedRef<MultiCalendarsOptions>
  calendars: Ref<ICalendarData[]>
  modelValue: WritableComputedRef<InternalModuleValue>
  props: PickerBasePropsType
  year: ComputedRef<(instance: number) => number>
  month: ComputedRef<(instance: number) => number>
  highlight: ComputedRef<Highlight | HighlightFn>
  propDates: ComputedRef<PropDates>
  filters: ComputedRef<DateFilter>
  range: ComputedRef<RangeConfig>
  emit: VueEmit
}

/**
 * Both modes shared logic
 */
export function useMonthOrQuarterPicker({
  multiCalendars,
  range,
  highlight,
  propDates,
  calendars,
  modelValue,
  props,
  filters,
  year,
  month,
  emit,
}: Opts) {
  const years = computed(() => getYears(props.yearRange, props.locale, props.reverseYears))
  const showYearPicker = ref([false])

  const isDisabled = computed(() => (instance: number, next: boolean) => {
    const currentDate = set(resetDate(new Date()), {
      month: month.value(instance),
      year: year.value(instance),
    })
    const date = next ? endOfYear(currentDate) : startOfYear(currentDate)
    return validateMonthYear(
      date,
      propDates.value.maxDate,
      propDates.value.minDate,
      props.preventMinMaxNavigation,
      next,
    )
  })

  const isSoloMultiInRange = () => {
    return Array.isArray(modelValue.value) && multiCalendars.value.solo && modelValue.value[1]
  }

  const assignMultiCalendars = () => {
    for (let i = 0; i < multiCalendars.value.count; i++) {
      if (i === 0) {
        calendars.value[i] = calendars.value[0]
      }
      else if (i === multiCalendars.value.count - 1 && isSoloMultiInRange()) {
        calendars.value[i] = {
          month: getMonth((modelValue.value as Date[])[1]),
          year: getYear((modelValue.value as Date[])[1]),
        }
      }
      else {
        const prevDate = set(getDate(), calendars.value[i - 1])
        calendars.value[i] = { month: getMonth(prevDate), year: getYear(addYears(prevDate, 1)) }
      }
    }
  }

  const updateMultiCalendars = (instance: number) => {
    if (!instance)
      return assignMultiCalendars()
    const date = set(getDate(), calendars.value[instance])
    calendars.value[0].year = getYear(subYears(date, multiCalendars.value.count - 1))
    return assignMultiCalendars()
  }

  const getDateToFocus = (dateOne: Date, dateTwo: Date) => {
    const diff = differenceInYears(dateTwo, dateOne)
    return range.value.showLastInRange && diff > 1 ? dateTwo : dateOne
  }

  const getRangedValueDate = (dates: Date[]) => {
    if (props.focusStartDate)
      return dates[0]
    if (multiCalendars.value.solo)
      return dates[0]
    return dates[1] ? getDateToFocus(dates[0], dates[1]) : dates[0]
  }

  const checkModelValue = () => {
    if (modelValue.value) {
      const firstDate = Array.isArray(modelValue.value) ? getRangedValueDate(modelValue.value) : modelValue.value
      calendars.value[0] = { month: getMonth(firstDate), year: getYear(firstDate) }
    }
  }

  const assign = () => {
    checkModelValue()
    if (multiCalendars.value.count) {
      assignMultiCalendars()
    }
  }

  watch(modelValue, (newVal, oldVal) => {
    if (props.isTextInputDate) {
      if (JSON.stringify(newVal ?? {}) !== JSON.stringify(oldVal ?? {})) {
        assign()
      }
    }
  })

  onMounted(() => {
    assign()
  })

  const selectYear = (year: number, instance: number) => {
    calendars.value[instance].year = year
    emit('update-month-year', { instance, year, month: calendars.value[instance].month })
    if (multiCalendars.value.count && !multiCalendars.value.solo) {
      updateMultiCalendars(instance)
    }
  }

  const groupedYears = computed(() => (instance: number): OverlayGridItem[][] => {
    return groupListAndMap(years.value, (y: IDefaultSelect) => {
      const active = year.value(instance) === y.value
      const disabled
                = checkMinMaxValue(
                  y.value,
                  getMinMaxYear(propDates.value.minDate),
                  getMinMaxYear(propDates.value.maxDate),
                ) || filters.value.years?.includes(year.value(instance))
      const highlighted = checkHighlightYear(highlight.value, y.value)

      return { active, disabled, highlighted }
    })
  })

  const handleYearSelect = (year: number, instance: number) => {
    selectYear(year, instance)
    toggleYearPicker(instance)
  }

  const handleYear = (instance: number, increment = false): void => {
    if (!isDisabled.value(instance, increment)) {
      const yearToSelect = increment ? year.value(instance) + 1 : year.value(instance) - 1
      selectYear(yearToSelect, instance)
    }
  }

  const toggleYearPicker = (instance: number, flow = false, show?: boolean): void => {
    if (!flow) {
      emit('reset-flow')
    }

    if (show !== undefined) {
      showYearPicker.value[instance] = show
    }
    else {
      showYearPicker.value[instance] = !showYearPicker.value[instance]
    }

    if (!showYearPicker.value[instance]) {
      emit('overlay-closed')
      emit('overlay-toggle', { open: false, overlay: FlowStep.year })
    }
    else {
      emit('overlay-toggle', { open: true, overlay: FlowStep.year })
    }
  }

  return {
    isDisabled,
    groupedYears,
    showYearPicker,
    selectYear,
    toggleYearPicker,
    handleYearSelect,
    handleYear,
  }
}
