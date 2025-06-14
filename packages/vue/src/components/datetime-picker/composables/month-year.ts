import type { ComputedRef } from 'vue'
import type { VueEmit } from '../interfaces'
import type { PickerBasePropsType } from '../props'

import { addMonths, addYears, getMonth, getYear, set, setYear, subMonths, subYears } from 'date-fns'
import { computed } from 'vue'

import { getDate, validateMonthYear } from '../utils/date-utils'
import { useDefaults, useValidation } from './index'

interface MonthYearReturn {
  handleMonthYearChange: (isNext: boolean, fromNav?: boolean) => void
  isDisabled: ComputedRef<(next: boolean) => boolean>
  updateMonthYear: (month: number, year: number, fromNav: boolean) => void
}

export function useMonthYearPick(
  props: { month: number, year: number } & PickerBasePropsType,
  emit: VueEmit,
): MonthYearReturn {
  const { defaultedFilters, propDates } = useDefaults(props)
  const { validateMonthYearInRange } = useValidation(props)

  const recursiveMonthAdjust = (date: Date, increment: boolean): Date => {
    let monthDate = date
    if (defaultedFilters.value.months.includes(getMonth(monthDate))) {
      monthDate = increment ? addMonths(date, 1) : subMonths(date, 1)
      return recursiveMonthAdjust(monthDate, increment)
    }
    return monthDate
  }

  const recursiveYearAdjust = (date: Date, increment: boolean): Date => {
    let yearDate = date
    if (defaultedFilters.value.years.includes(getYear(yearDate))) {
      yearDate = increment ? addYears(date, 1) : subYears(date, 1)
      return recursiveYearAdjust(yearDate, increment)
    }
    return yearDate
  }

  const updateMonthYear = (
    month: number,
    year: number,
    fromNav: boolean,
  ): void => {
    emit('updateMonthYear', { month, year, fromNav })
  }

  const handleMonthYearChange = (
    isNext: boolean,
    fromNav = false,
  ): void => {
    const initialDate = set(getDate(), { month: props.month, year: props.year })
    let date = isNext ? addMonths(initialDate, 1) : subMonths(initialDate, 1)
    if (props.disableYearSelect) {
      date = setYear(date, props.year)
    }

    let month = getMonth(date)
    let year = getYear(date)

    if (defaultedFilters.value.months.includes(month)) {
      date = recursiveMonthAdjust(date, isNext)
      month = getMonth(date)
      year = getYear(date)
    }

    if (defaultedFilters.value.years.includes(year)) {
      date = recursiveYearAdjust(date, isNext)
      year = getYear(date)
    }
    if (validateMonthYearInRange(month, year, isNext, props.preventMinMaxNavigation)) {
      updateMonthYear(month, year, fromNav)
    }
  }

  const isDisabled = computed<(next: boolean) => boolean>(() => (next: boolean) => {
    return validateMonthYear(
      set(getDate(), { month: props.month, year: props.year }),
      propDates.value.maxDate,
      propDates.value.minDate,
      props.preventMinMaxNavigation,
      next,
    )
  })

  return {
    handleMonthYearChange,
    isDisabled,
    updateMonthYear,
  }
}
