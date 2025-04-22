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

const emit = defineEmits(['close-picker', 'select-date', 'select-now', 'invalid-select'])

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
    emit('select-date')
  }
  else {
    emit('invalid-select')
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
          selectDate: () => $emit('select-date'),
          closePicker: () => $emit('close-picker'),
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
            @click="$emit('close-picker')"
            @keydown="checkKeyDown($event, () => $emit('close-picker'))"
          >
            {{ cancelText }}
          </button>
          <button
            v-if="defaultedActionRow.showNow"
            type="button"
            class="dp__action_button dp__action_cancel"
            @click="$emit('select-now')"
            @keydown="checkKeyDown($event, () => $emit('select-now'))"
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

<style scoped>
.dp__action_row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--dp-action-row-padding);
  background-color: var(--dp-background-color);
  border-top: 1px solid var(--dp-border-color);
  transition: var(--dp-action-row-transition);
}

.dp__selection_preview {
  flex: 1;
  min-width: 0;
  padding: 0 0.5rem;
  font-size: var(--dp-preview-font-size);
  color: var(--dp-text-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: var(--dp-action-row-transition);
}

.dp__action_buttons {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: var(--dp-action-buttons-padding);
}

.dp__action_button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: var(--dp-action-button-height);
  padding: 0 0.75rem;
  font-size: var(--dp-font-size);
  font-weight: 500;
  color: var(--dp-text-color);
  background-color: transparent;
  border: 1px solid var(--dp-border-color);
  border-radius: var(--dp-border-radius);
  cursor: pointer;
  transition: var(--dp-common-transition);
}

.dp__action_button:hover {
  background-color: var(--dp-hover-color);
  border-color: var(--dp-border-color-hover);
}

.dp__action_button:focus {
  outline: none;
  border-color: var(--dp-border-color-focus);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.dp__action_button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.dp__action_cancel {
  color: var(--dp-secondary-color);
  border-color: var(--dp-border-color);
}

.dp__action_cancel:hover {
  color: var(--dp-text-color);
  background-color: var(--dp-hover-color);
}

.dp__action_select {
  color: var(--dp-primary-text-color);
  background-color: var(--dp-primary-color);
  border-color: var(--dp-primary-color);
}

.dp__action_select:hover {
  background-color: var(--dp-primary-disabled-color);
  border-color: var(--dp-primary-disabled-color);
}

.dp__action_select:disabled {
  background-color: var(--dp-disabled-color);
  border-color: var(--dp-disabled-color);
  color: var(--dp-disabled-color-text);
}
</style>
