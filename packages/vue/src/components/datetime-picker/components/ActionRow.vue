<script lang="ts" setup>
import type { PropType } from 'vue'

import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useArrowNavigation, useDefaults, useValidation } from '../composables'
import { PickerBaseProps } from '../props'
import { formatDate } from '../utils/date-utils'

import { checkKeyDown, convertType, unrefElement } from '../utils/util'

defineOptions({
  compatConfig: {
    MODE: 3,
  },
})

const props = defineProps({
  menuMount: { type: Boolean as PropType<boolean>, default: false },
  calendarWidth: { type: Number as PropType<number>, default: 0 },
  ...PickerBaseProps,
})

const emit = defineEmits(['closePicker', 'selectDate', 'selectNow', 'invalidSelect'])

const {
  defaultedActionRow,
  defaultedPreviewFormat,
  defaultedMultiCalendars,
  defaultedTextInput,
  defaultedInline,
  defaultedRange,
  defaultedMultiDates,
} = useDefaults(props)
const { isTimeValid, isMonthValid } = useValidation(props)
const { buildMatrix } = useArrowNavigation()

const cancelButtonRef = ref(null)
const selectButtonRef = ref(null)
const showPreview = ref(false)
const previewStyle = ref<any>({})
const actionBtnContainer = ref<HTMLElement | null>(null)
const actionRowRef = ref<HTMLElement | null>(null)

onMounted(() => {
  if (props.arrowNavigation) {
    buildMatrix([unrefElement(cancelButtonRef), unrefElement(selectButtonRef)] as HTMLElement[], 'actionRow')
  }
  getPreviewAvailableSpace()
  window.addEventListener('resize', getPreviewAvailableSpace)
})

onUnmounted(() => {
  window.removeEventListener('resize', getPreviewAvailableSpace)
})

function getPreviewAvailableSpace() {
  showPreview.value = false
  setTimeout(() => {
    const rect = actionBtnContainer.value?.getBoundingClientRect()
    const rowRect = actionRowRef.value?.getBoundingClientRect()
    if (rect && rowRect) {
      previewStyle.value.maxWidth = `${rowRect.width - rect.width - 20}px`
    }
    showPreview.value = true
  }, 0)
}

const validDateRange = computed(() => {
  return defaultedRange.value.enabled && !defaultedRange.value.partialRange && props.internalModelValue
    ? (props.internalModelValue as Date[]).length === 2
    : true
})

const disabled = computed(
  () =>
    !isTimeValid.value(props.internalModelValue)
    || !isMonthValid.value(props.internalModelValue)
    || !validDateRange.value,
)

function handleCustomPreviewFormat() {
  const formatFn = defaultedPreviewFormat.value as (val: Date | Date[]) => string | string[]

  if (props.timePicker)
    return formatFn(convertType(props.internalModelValue))

  if (props.monthPicker)
    return formatFn(convertType(props.internalModelValue as Date))

  return formatFn(convertType(props.internalModelValue))
}

function formatRangeDate() {
  const dates = props.internalModelValue as Date[]
  if (defaultedMultiCalendars.value.count > 0) {
    return `${formatDatePreview(dates[0])} - ${formatDatePreview(dates[1])}`
  }
  return [formatDatePreview(dates[0]), formatDatePreview(dates[1])]
}

function formatDatePreview(date: Date) {
  return formatDate(
    date,
    defaultedPreviewFormat.value as string,
    props.formatLocale,
    defaultedTextInput.value.rangeSeparator,
    props.modelAuto,
    defaultedPreviewFormat.value as string,
  )
}

const previewValue = computed((): string | string[] => {
  if (!props.internalModelValue || !props.menuMount)
    return ''
  if (typeof defaultedPreviewFormat.value === 'string') {
    if (Array.isArray(props.internalModelValue)) {
      if (props.internalModelValue.length === 2 && props.internalModelValue[1]) {
        return formatRangeDate()
      }
      if (defaultedMultiDates.value.enabled) {
        return props.internalModelValue.map(date => `${formatDatePreview(date)}`)
      }
      if (props.modelAuto) {
        return `${formatDatePreview(props.internalModelValue[0])}`
      }
      return `${formatDatePreview(props.internalModelValue[0])} -`
    }
    return formatDatePreview(props.internalModelValue)
  }
  return handleCustomPreviewFormat()
})

const dateSeparator = () => (defaultedMultiDates.value.enabled ? '; ' : ' - ')

const formatValue = computed(() =>
  !Array.isArray(previewValue.value) ? previewValue.value : previewValue.value.join(dateSeparator()),
)

function selectDate(): void {
  if (
    isTimeValid.value(props.internalModelValue)
    && isMonthValid.value(props.internalModelValue)
    && validDateRange.value
  ) {
    emit('selectDate')
  }
  else {
    emit('invalidSelect')
  }
}
</script>

<template>
  <div ref="actionRowRef" class="dp__action_row">
    <template v-if="$slots['action-row']">
      <slot
        name="action-row"
        v-bind="{
          internalModelValue,
          disabled,
          selectDate: (): void => $emit('selectDate'),
          closePicker: (): void => $emit('closePicker'),
        }"
      />
    </template>
    <template v-else>
      <div
        v-if="defaultedActionRow.showPreview"
        class="dp__selection_preview"
        :title="formatValue"
        :style="previewStyle"
      >
        <slot
          v-if="$slots['action-preview'] && showPreview"
          name="action-preview"
          :value="internalModelValue"
        />
        <template v-if="!$slots['action-preview'] && showPreview">
          {{ formatValue }}
        </template>
      </div>
      <div ref="actionBtnContainer" class="dp__action_buttons" data-dp-element="action-row">
        <slot v-if="$slots['action-buttons']" name="action-buttons" :value="internalModelValue" />
        <template v-if="!$slots['action-buttons']">
          <button
            v-if="!defaultedInline.enabled && defaultedActionRow.showCancel"
            ref="cancelButtonRef"
            type="button"
            class="dp__action_button dp__action_cancel"
            @click="$emit('closePicker')"
            @keydown="(e: KeyboardEvent): void => checkKeyDown(e, () => $emit('closePicker'))"
          >
            {{ cancelText }}
          </button>
          <button
            v-if="defaultedActionRow.showNow"
            type="button"
            class="dp__action_button dp__action_cancel"
            @click="$emit('selectNow')"
            @keydown="(e: KeyboardEvent): void => checkKeyDown(e, () => $emit('selectNow'))"
          >
            {{ nowButtonLabel }}
          </button>
          <button
            v-if="defaultedActionRow.showSelect"
            ref="selectButtonRef"
            type="button"
            class="dp__action_button dp__action_select"
            :disabled="disabled"
            data-test-id="select-button"
            @keydown="checkKeyDown($event, () => selectDate())"
            @click="selectDate"
          >
            {{ selectText }}
          </button>
        </template>
      </div>
    </template>
  </div>
</template>

<style>
.dp__action_row {
  display: flex;
  align-items: center;
  width: 100%;
  padding: var(--dp-action-row-padding);
  box-sizing: border-box;
  color: var(--dp-text-color);
  flex-flow: row nowrap;
}

.dp__action_row svg {
  height: var(--dp-button-icon-height);
  width: auto;
}

.dp__selection_preview {
  display: block;
  color: var(--dp-text-color);
  font-size: var(--dp-preview-font-size);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.dp__action_buttons {
  display: flex;
  flex: 0;
  white-space: nowrap;
  align-items: center;
  justify-content: flex-end;
  margin-inline-start: auto;
}

.dp__action_button {
  display: inline-flex;
  align-items: center;
  background: transparent;
  border: 1px solid transparent;
  padding: var(--dp-action-buttons-padding);
  line-height: var(--dp-action-button-height);
  margin-inline-start: 3px;
  height: var(--dp-action-button-height);
  cursor: pointer;
  border-radius: var(--dp-border-radius);
  font-size: var(--dp-preview-font-size);
  font-family: var(--dp-font-family);
}

.dp__action_cancel {
  color: var(--dp-text-color);
  border: 1px solid var(--dp-border-color);
}

.dp__action_cancel:hover {
  border-color: var(--dp-primary-color);
  transition: var(--dp-action-row-transition);
}

.dp__action_buttons .dp__action_select {
  background: var(--dp-primary-color);
  color: var(--dp-primary-text-color);
}

.dp__action_buttons .dp__action_select:hover {
  background: var(--dp-primary-color);
  transition: var(--dp-action-row-transition);
}

.dp__action_buttons .dp__action_select:disabled {
  background: var(--dp-primary-disabled-color);
  cursor: not-allowed;
}
</style>
