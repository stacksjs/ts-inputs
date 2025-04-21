import type {
  ActionRowData,
  AriaLabels,
  Config,
  DateFilter,
  Highlight,
  HighlightFn,
  HighlightProp,
  IFormat,
  IMarker,
  InlineOptions,
  InlineProp,
  MapPropDatesOpts,
  MultiCalendarsOptions,
  MultiCalendarsProp,
  MultiDatesDefault,
  MultiDatesProp,
  OptionEnabled,
  PropDates,
  RangeConfig,
  RangeProp,
  TextInputOptions,
  TextInputProp,
  TimeZoneConfig,
  TimeZoneProp,
  Transition,
  UIOpts,
  UIParsed,
  WeekNumbersOpts,
  WeekNumbersProp,
} from '../interfaces'
import { MAP_KEY_FORMAT } from '../constants'
import { getDate } from './date-utils'
import { dateToTimezoneSafe, sanitizeDateToLocal } from './timezone'
import { getMapKey, getMapKeyType, shouldMap } from './util'

export function mergeDefaultTransitions(conf: Partial<Transition>): Transition {
  return {
    menuAppearTop: 'dp-menu-appear-top',
    menuAppearBottom: 'dp-menu-appear-bottom',
    open: 'dp-slide-down',
    close: 'dp-slide-up',
    next: 'calendar-next',
    previous: 'calendar-prev',
    vNext: 'dp-slide-up',
    vPrevious: 'dp-slide-down',
    ...(conf ?? {}),
  }
}

export function defaultAriaLabels(labels: Partial<AriaLabels>): AriaLabels {
  return {
    toggleOverlay: 'Toggle overlay',
    menu: 'Datepicker menu',
    input: 'Datepicker input',
    openTimePicker: 'Open time picker',
    closeTimePicker: 'Close time Picker',
    incrementValue: (type: string) => `Increment ${type}`,
    decrementValue: (type: string) => `Decrement ${type}`,
    openTpOverlay: (type: string) => `Open ${type} overlay`,
    amPmButton: 'Switch AM/PM mode',
    openYearsOverlay: 'Open years overlay',
    openMonthsOverlay: 'Open months overlay',
    nextMonth: 'Next month',
    prevMonth: 'Previous month',
    nextYear: 'Next year',
    prevYear: 'Previous year',
    day: undefined,
    weekDay: undefined,
    clearInput: 'Clear value',
    calendarIcon: 'Calendar icon',
    timePicker: 'Time picker',
    monthPicker: (overlay: boolean) => `Month picker${overlay ? ' overlay' : ''}`,
    yearPicker: (overlay: boolean) => `Year picker${overlay ? ' overlay' : ''}`,
    timeOverlay: (type: string) => `${type} overlay`,
    ...(labels ?? {}),
  }
}

function getMultiCalendarsCount(option?: OptionEnabled) {
  if (!option)
    return 0
  if (typeof option === 'boolean')
    return option ? 2 : 0
  return +option >= 2 ? +option : 2
}

export function defaultMultiCalendars(multiCalendars?: MultiCalendarsProp): MultiCalendarsOptions {
  const isConfig = typeof multiCalendars === 'object' && multiCalendars
  const defaultOptions = {
    static: true,
    solo: false,
  }
  if (!multiCalendars)
    return { ...defaultOptions, count: getMultiCalendarsCount(false) }
  const addOptions = isConfig ? multiCalendars : ({} as MultiCalendarsOptions)
  const option = isConfig ? (addOptions.count ?? true) : multiCalendars
  const count = getMultiCalendarsCount(option)

  return Object.assign(defaultOptions, addOptions, { count })
}

export function defaultPreviewFormat(previewFormat: IFormat, format: IFormat, defaultPattern: string | ((val: Date) => string)): IFormat {
  if (!previewFormat) {
    return typeof defaultPattern === 'string' ? defaultPattern : format
  }
  return previewFormat
}

export function defaultTransitions(transitions: boolean | Partial<Transition>): Transition {
  if (typeof transitions === 'boolean') {
    return transitions ? mergeDefaultTransitions({}) : (false as unknown as Transition)
  }
  return mergeDefaultTransitions(transitions)
}

/**
 * Default options to merge with user provided ones
 */
export function getDefaultTextInputOptions(textInput: TextInputProp): TextInputOptions & { enabled: boolean } {
  const defaultOptions = {
    enterSubmit: true,
    tabSubmit: true,
    openMenu: 'open',
    selectOnFocus: false,
    rangeSeparator: ' - ',
    escClose: true,
  }

  if (typeof textInput === 'object') {
    return { ...defaultOptions, ...(textInput ?? {}), enabled: true }
  }
  return { ...defaultOptions, enabled: textInput }
}

/**
 * Default filters to merge with user provided values
 */
export function getDefaultFilters(filters: Partial<DateFilter>): DateFilter {
  return {
    months: [],
    years: [],
    times: { hours: [], minutes: [], seconds: [] },
    ...(filters ?? {}),
  }
}

export function getDefaultActionRowData(actionRow: Partial<ActionRowData>): ActionRowData {
  return {
    showSelect: true,
    showCancel: true,
    showNow: false,
    showPreview: true,
    ...(actionRow ?? {}),
  }
}

export function getDefaultInlineOptions(inline: InlineProp): InlineOptions {
  const defaultOptions = { input: false }
  if (typeof inline === 'object') {
    return { ...defaultOptions, ...(inline ?? {}), enabled: true }
  }
  return {
    enabled: inline,
    ...defaultOptions,
  }
}

export function getDefaultConfig(config?: Partial<Config>): Config {
  const defaultConfig = {
    allowStopPropagation: true,
    closeOnScroll: false,
    modeHeight: 255,
    allowPreventDefault: false,
    closeOnClearValue: true,
    closeOnAutoApply: true,
    noSwipe: false,
    keepActionRow: false,
    onClickOutside: undefined,
    tabOutClosesMenu: true,
    arrowLeft: undefined,
    keepViewOnOffsetClick: false,
    timeArrowHoldThreshold: 0,
    shadowDom: false,
    mobileBreakpoint: 600,
    setDateOnMenuClose: false,
  }
  return { ...defaultConfig, ...(config ?? {}) }
}

export function getDefaultHighlight(highlight: HighlightProp): Highlight | HighlightFn {
  const defaultOptions = {
    dates: Array.isArray(highlight) ? highlight.map(date => getDate(date)) : [],
    years: [],
    months: [],
    quarters: [],
    weeks: [],
    weekdays: [],
    options: { highlightDisabled: false },
  }

  if (typeof highlight === 'function')
    return highlight
  return { ...defaultOptions, ...(highlight ?? {}) }
}

export function getDefaultWeekNumbers(weekNumbers: WeekNumbersProp): WeekNumbersOpts {
  if (typeof weekNumbers === 'object') {
    return {
      type: weekNumbers?.type ?? 'local',
      hideOnOffsetDates: weekNumbers?.hideOnOffsetDates ?? false,
    }
  }
  return {
    type: weekNumbers,
    hideOnOffsetDates: false,
  }
}

export function getDefaultRangeOptions(config: RangeProp): RangeConfig {
  const defaultOptions = {
    noDisabledRange: false,
    showLastInRange: true,
    minMaxRawRange: false,
    partialRange: true,
    disableTimeRangeValidation: false,
    maxRange: undefined,
    minRange: undefined,
    autoRange: undefined,
    fixedStart: false,
    fixedEnd: false,
  }
  if (typeof config === 'object') {
    return { enabled: true, ...defaultOptions, ...config }
  }
  return {
    enabled: config,
    ...defaultOptions,
  }
}

export function getDefaultTimeZone(timeZone: TimeZoneProp) {
  if (!timeZone)
    return { timezone: undefined, exactMatch: false, emitTimezone: undefined }
  if (typeof timeZone === 'string') {
    return {
      timezone: timeZone,
      exactMatch: false,
      dateInTz: undefined,
      emitTimezone: undefined,
      convertModel: true,
    }
  }
  return {
    timezone: timeZone.timezone,
    exactMatch: timeZone.exactMatch ?? false,
    dateInTz: timeZone.dateInTz ?? undefined,
    emitTimezone: timeZone.emitTimezone ?? undefined,
    convertModel: timeZone.convertModel ?? true,
  }
}

function datesArrToMap(datesArr: (Date | string | number)[], timezone: TimeZoneConfig | undefined, format: MAP_KEY_FORMAT, reset?: boolean): Map<string, Date | null> {
  return new Map(
    datesArr.map((date) => {
      const d = dateToTimezoneSafe(date, timezone, reset)
      return [getMapKey(d, format), d]
    }),
  )
}

function mapMarkers(markers: IMarker[], timezone: TimeZoneConfig | undefined) {
  if (markers.length) {
    return new Map(
      markers.map((marker) => {
        const date = dateToTimezoneSafe(marker.date, timezone)
        return [getMapKey(date, MAP_KEY_FORMAT.DATE), marker]
      }),
    )
  }
  return null
}

/**
 * Sync all props that rely on the date value to be in the same timezone
 * All validation that is done from these props will now be in sync with provided timezone config
 */
export function mapPropDates(opts: MapPropDatesOpts): PropDates {
  const format = getMapKeyType(opts.isMonthPicker, opts.isYearPicker)
  return {
    minDate: sanitizeDateToLocal(opts.minDate, opts.timezone, opts.isSpecific),
    maxDate: sanitizeDateToLocal(opts.maxDate, opts.timezone, opts.isSpecific),
    disabledDates: shouldMap(opts.disabledDates)
      ? datesArrToMap(opts.disabledDates, opts.timezone, format, opts.isSpecific)
      : opts.disabledDates,
    allowedDates: shouldMap(opts.allowedDates)
      ? datesArrToMap(opts.allowedDates, opts.timezone, format, opts.isSpecific)
      : null,
    highlight:
            typeof opts.highlight === 'object' && shouldMap(opts.highlight?.dates)
              ? datesArrToMap(opts.highlight.dates, opts.timezone, format)
              : (opts.highlight as HighlightFn),
    markers: mapMarkers(opts.markers, opts.timezone),
  }
}

export function getDefaultMultiDates(multiDates: MultiDatesProp): MultiDatesDefault {
  if (typeof multiDates === 'boolean') {
    return { enabled: multiDates, dragSelect: true, limit: null }
  }
  return {
    enabled: !!multiDates,
    limit: multiDates.limit ? +multiDates.limit : null,
    dragSelect: multiDates.dragSelect ?? true,
  }
}

export function getDefaultUI(ui: Partial<UIOpts>): UIParsed {
  const defaulted = {
    ...Object.fromEntries(
      Object.keys(ui).map((item) => {
        const key = item as keyof UIOpts
        const value = ui[key]
        const val = (
          typeof ui[key] === 'string'
            ? { [value as string]: true }
            : Object.fromEntries((value as string[]).map(k => [k, true]))
        ) as Record<string, boolean>
        return [item, val]
      }),
    ),
  }

  return defaulted as UIParsed
}
