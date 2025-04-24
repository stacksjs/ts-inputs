<script lang="ts" setup>
import type { PropType, Ref } from 'vue'
import type { HeaderSelectionBtn, IDefaultSelect, MaybeElementRef, OverlayGridItem } from '../../interfaces'

import { computed, onMounted, ref } from 'vue'
import { useArrowNavigation, useCommon, useDefaults, useMonthYearPick, useTransitions } from '../../composables'
import { FlowStep, HeaderPicker } from '../../constants'

import { PickerBaseProps } from '../../props'

import {
  checkHighlightMonth,
  checkHighlightYear,
  getMaxMonth,
  getMinMaxYear,
  getMinMonth,
} from '../../utils/date-utils'
import { checkKeyDown, checkMinMaxValue, formatNumber, groupListAndMap, unrefElement } from '../../utils/util'
import ArrowBtn from '../Common/ArrowBtn.vue'
import SelectionOverlay from '../Common/SelectionOverlay.vue'

import {
  CalendarIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
} from '../Icons'

defineOptions({
  compatConfig: {
    MODE: 3,
  },
})
const props = defineProps({
  month: { type: Number as PropType<number>, default: 0 },
  year: { type: Number as PropType<number>, default: 0 },
  instance: { type: Number as PropType<number>, default: 0 },
  years: { type: Array as PropType<IDefaultSelect[]>, default: () => [] },
  months: { type: Array as PropType<IDefaultSelect[]>, default: () => [] },
  ...PickerBaseProps,
})
const emit = defineEmits(['update-month-year', 'mount', 'reset-flow', 'overlay-closed', 'overlay-opened'])
const {
  defaultedTransitions,
  defaultedAriaLabels,
  defaultedMultiCalendars,
  defaultedFilters,
  defaultedConfig,
  defaultedHighlight,
  propDates,
  defaultedUI,
} = useDefaults(props)
const { transitionName, showTransition } = useTransitions(defaultedTransitions)
const { buildMatrix } = useArrowNavigation()
const { handleMonthYearChange, isDisabled, updateMonthYear } = useMonthYearPick(props, emit)
const { showLeftIcon, showRightIcon } = useCommon()

const showMonthPicker = ref(false)
const showYearPicker = ref(false)
const overlayOpen = ref(false)
const elementRefs = ref<Array<HTMLElement | null>>([null, null, null, null])

onMounted(() => {
  emit('mount')
})

function bindOptions(type: HeaderPicker) {
  return {
    get: () => props[type],
    set: (value: number) => {
      const otherType = type === HeaderPicker.month ? HeaderPicker.year : HeaderPicker.month
      emit('update-month-year', { [type]: value, [otherType]: props[otherType] })

      if (type === HeaderPicker.month) {
        toggleMonthPicker(true)
      }
      else {
        toggleYearPicker(true)
      }
    },
  }
}

const monthModelBind = computed(bindOptions(HeaderPicker.month))
const yearModelBind = computed(bindOptions(HeaderPicker.year))

const overlaySlotProps = computed(() => (type: HeaderPicker) => ({
  month: props.month,
  year: props.year,
  items: type === HeaderPicker.month ? props.months : props.years,
  instance: props.instance,
  updateMonthYear,
  toggle: type === HeaderPicker.month ? toggleMonthPicker : toggleYearPicker,
}))

const getMonthDisplayVal = computed((): IDefaultSelect => {
  const month = props.months.find(month => month.value === props.month)
  if (month)
    return month
  return { text: '', value: 0 }
})

const groupedMonths = computed((): OverlayGridItem[][] => {
  return groupListAndMap(props.months, (month: IDefaultSelect) => {
    const active = props.month === month.value
    const disabled
                = checkMinMaxValue(
                  month.value,
                  getMinMonth(props.year, propDates.value.minDate),
                  getMaxMonth(props.year, propDates.value.maxDate),
                ) || defaultedFilters.value.months.includes(month.value)
    const highlighted = checkHighlightMonth(defaultedHighlight.value, month.value, props.year)
    return { active, disabled, highlighted }
  })
})

const groupedYears = computed((): OverlayGridItem[][] => {
  return groupListAndMap(props.years, (year: IDefaultSelect) => {
    const active = props.year === year.value
    const disabled
                = checkMinMaxValue(
                  year.value,
                  getMinMaxYear(propDates.value.minDate),
                  getMinMaxYear(propDates.value.maxDate),
                ) || defaultedFilters.value.years.includes(year.value)
    const highlighted = checkHighlightYear(defaultedHighlight.value, year.value)
    return { active, disabled, highlighted }
  })
})

function toggleWrap(val: Ref<boolean>, type: FlowStep, show?: boolean) {
  if (show !== undefined) {
    val.value = show
  }
  else {
    val.value = !val.value
  }

  if (!val.value) {
    overlayOpen.value = false
    emit('overlay-closed', type)
  }
  else {
    overlayOpen.value = true
    emit('overlay-opened', type)
  }
}

function toggleMonthPicker(flow = false, show?: boolean): void {
  checkFlow(flow)
  toggleWrap(showMonthPicker, FlowStep.month, show)
}

function toggleYearPicker(flow = false, show?: boolean): void {
  checkFlow(flow)
  toggleWrap(showYearPicker, FlowStep.year, show)
}

function checkFlow(flow: boolean): void {
  if (!flow) {
    emit('reset-flow')
  }
}

function setElRefs(el: MaybeElementRef, i: number): void {
  if (props.arrowNavigation) {
    elementRefs.value[i] = unrefElement(el)
    buildMatrix(elementRefs.value, 'monthYear')
  }
}

const selectionButtons = computed((): HeaderSelectionBtn[] => [
  {
    type: HeaderPicker.month,
    index: 1,
    toggle: toggleMonthPicker,
    modelValue: monthModelBind.value,
    updateModelValue: (val: number) => (monthModelBind.value = val),
    text: getMonthDisplayVal.value.text,
    showSelectionGrid: showMonthPicker.value,
    items: groupedMonths.value,
    ariaLabel: defaultedAriaLabels.value?.openMonthsOverlay,
    overlayLabel: defaultedAriaLabels.value.monthPicker?.(true) ?? undefined,
  },
  {
    type: HeaderPicker.year,
    index: 2,
    toggle: toggleYearPicker,
    modelValue: yearModelBind.value,
    updateModelValue: (val: number) => (yearModelBind.value = val),
    text: formatNumber(props.year, props.locale),
    showSelectionGrid: showYearPicker.value,
    items: groupedYears.value,
    ariaLabel: defaultedAriaLabels.value?.openYearsOverlay,
    overlayLabel: defaultedAriaLabels.value.yearPicker?.(true) ?? undefined,
  },
])

const selectionButtonsDisplay = computed(() => {
  if (props.disableYearSelect) {
    return [selectionButtons.value[0]]
  }
  else {
    return props.yearFirst ? [...selectionButtons.value].reverse() : selectionButtons.value
  }
})

defineExpose({
  toggleMonthPicker,
  toggleYearPicker,
  handleMonthYearChange,
})
</script>

<template>
  <div class="dp--header-wrap">
    <template v-if="$slots['month-year']">
      <div class="dp__month_year_wrap">
        <slot
          name="month-year"
          v-bind="{
            month,
            year,
            months,
            years,
            updateMonthYear,
            handleMonthYearChange,
            instance,
            isDisabled,
          }"
        />
      </div>
    </template>
    <template v-else>
      <div v-if="$slots['top-extra']">
        <slot name="top-extra" :value="internalModelValue" />
      </div>
      <div class="dp__month_year_wrap">
        <ArrowBtn
          v-if="showLeftIcon(defaultedMultiCalendars, instance) && !vertical"
          :aria-label="defaultedAriaLabels?.prevMonth"
          :disabled="isDisabled(false)"
          :class="defaultedUI?.navBtnPrev"
          el-name="action-prev"
          @activate="handleMonthYearChange(false, true)"
          @set-ref="setElRefs($event, 0)"
        >
          <slot v-if="$slots['arrow-left']" name="arrow-left" />
          <ChevronLeftIcon v-if="!$slots['arrow-left']" />
        </ArrowBtn>
        <div
          class="dp__month_year_wrap"
          :class="{
            dp__year_disable_select: disableYearSelect,
          }"
        >
          <template v-for="(type, i) in selectionButtonsDisplay" :key="type.type">
            <button
              :ref="(el) => setElRefs(el, i + 1)"
              type="button"
              :data-dp-element="`overlay-${type.type}`"
              class="dp__btn dp__month_year_select"
              :class="{ 'dp--hidden-el': overlayOpen }"
              :aria-label="`${type.text}-${type.ariaLabel}`"
              :data-test-id="`${type.type}-toggle-overlay-${instance}`"
              @click="type.toggle"
              @keydown="checkKeyDown($event, () => type.toggle(), true)"
            >
              <slot
                v-if="$slots[type.type]"
                :name="type.type"
                :text="type.text"
                :value="props[type.type]"
              />
              <template v-if="!$slots[type.type]">
                {{ type.text }}
              </template>
            </button>
            <transition :name="transitionName(type.showSelectionGrid)" :css="showTransition">
              <SelectionOverlay
                v-if="type.showSelectionGrid"
                :items="type.items"
                :arrow-navigation="arrowNavigation"
                :hide-navigation="hideNavigation"
                :is-last="autoApply && !defaultedConfig.keepActionRow"
                :skip-button-ref="false"
                :config="config"
                :type="type.type"
                :header-refs="[]"
                :esc-close="escClose"
                :menu-wrap-ref="menuWrapRef"
                :text-input="textInput"
                :aria-labels="ariaLabels"
                :overlay-label="type.overlayLabel"
                @selected="type.updateModelValue"
                @toggle="type.toggle"
              >
                <template #button-icon>
                  <slot v-if="$slots['calendar-icon']" name="calendar-icon" />
                  <CalendarIcon v-if="!$slots['calendar-icon']" />
                </template>
                <template v-if="$slots[`${type.type}-overlay-value`]" #item="{ item }">
                  <slot :name="`${type.type}-overlay-value`" :text="item.text" :value="item.value" />
                </template>
                <template v-if="$slots[`${type.type}-overlay`]" #overlay>
                  <slot :name="`${type.type}-overlay`" v-bind="overlaySlotProps(type.type)" />
                </template>
                <template v-if="$slots[`${type.type}-overlay-header`]" #header>
                  <slot :name="`${type.type}-overlay-header`" :toggle="type.toggle" />
                </template>
              </SelectionOverlay>
            </transition>
          </template>
        </div>
        <ArrowBtn
          v-if="showLeftIcon(defaultedMultiCalendars, instance) && vertical"
          :aria-label="defaultedAriaLabels?.prevMonth"
          el-name="action-prev"
          :disabled="isDisabled(false)"
          :class="defaultedUI?.navBtnPrev"
          @activate="handleMonthYearChange(false, true)"
        >
          <slot v-if="$slots['arrow-up']" name="arrow-up" />
          <ChevronUpIcon v-if="!$slots['arrow-up']" />
        </ArrowBtn>
        <ArrowBtn
          v-if="showRightIcon(defaultedMultiCalendars, instance)"
          ref="rightIcon"
          el-name="action-next"
          :disabled="isDisabled(true)"
          :aria-label="defaultedAriaLabels?.nextMonth"
          :class="defaultedUI?.navBtnNext"
          @activate="handleMonthYearChange(true, true)"
          @set-ref="setElRefs($event, disableYearSelect ? 2 : 3)"
        >
          <slot
            v-if="$slots[vertical ? 'arrow-down' : 'arrow-right']"
            :name="vertical ? 'arrow-down' : 'arrow-right'"
          />
          <component
            :is="vertical ? ChevronDownIcon : ChevronRightIcon"
            v-if="!$slots[vertical ? 'arrow-down' : 'arrow-right']"
          />
        </ArrowBtn>
      </div>
    </template>
  </div>
</template>

<style>
.dp__month_year_row {
  display: flex;
  align-items: center;
  height: var(--dp-month-year-row-height);
  color: var(--dp-text-color);
  box-sizing: border-box;
}

.dp__inner_nav {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  height: var(--dp-month-year-row-button-size);
  width: var(--dp-month-year-row-button-size);
  color: var(--dp-icon-color);
  text-align: center;
  border-radius: 50%;
}

.dp__inner_nav svg {
  height: var(--dp-button-icon-height);
  width: var(--dp-button-icon-height);
}

.dp__inner_nav:hover {
  background: var(--dp-hover-color);
  color: var(--dp-hover-icon-color);
}

[dir="rtl"] .dp__inner_nav {
  transform: rotate(180deg);
}

.dp__inner_nav_disabled {
  background: var(--dp-disabled-color);
  color: var(--dp-disabled-color-text);
  cursor: not-allowed;
}

.dp__inner_nav_disabled:hover {
  background: var(--dp-disabled-color);
  color: var(--dp-disabled-color-text);
  cursor: not-allowed;
}

.dp--month-year-select-base {
  text-align: center;
  cursor: pointer;
  height: var(--dp-month-year-row-height);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--dp-border-radius);
  box-sizing: border-box;
  color: var(--dp-text-color);
}

.dp--month-year-select-base:hover {
  background: var(--dp-hover-color);
  color: var(--dp-hover-text-color);
  transition: var(--dp-common-transition);
}

.dp__month_year_select {
  width: 50%;
  text-align: center;
  cursor: pointer;
  height: var(--dp-month-year-row-height);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--dp-border-radius);
  box-sizing: border-box;
  color: var(--dp-text-color);
}

.dp__month_year_select:hover {
  background: var(--dp-hover-color);
  color: var(--dp-hover-text-color);
  transition: var(--dp-common-transition);
}

.dp--year-select {
  width: 100%;
  text-align: center;
  cursor: pointer;
  height: var(--dp-month-year-row-height);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--dp-border-radius);
  box-sizing: border-box;
  color: var(--dp-text-color);
}

.dp--year-select:hover {
  background: var(--dp-hover-color);
  color: var(--dp-hover-text-color);
  transition: var(--dp-common-transition);
}

.dp__month_year_wrap {
  display: flex;
  flex-direction: row;
  width: 100%;
}

.dp__year_disable_select {
  justify-content: space-around;
}

.dp--header-wrap {
  display: flex;
  width: 100%;
  flex-direction: column;
}
</style>
