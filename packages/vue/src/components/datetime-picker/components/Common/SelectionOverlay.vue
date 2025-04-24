<script lang="ts" setup>
import type { AriaLabels, Config, DynamicClass, Flow, OverlayGridItem, TextInputProp } from '../../interfaces'

import type { PickerBasePropsType } from '../../props'
import { computed, nextTick, onBeforeUpdate, onMounted, onUnmounted, ref, watch } from 'vue'

import { useArrowNavigation, useCommon, useDefaults } from '../../composables'
import { EventKey } from '../../constants'
import {
  checkKeyDown,
  checkStopPropagation,
  convertType,
  findFocusableEl,
  getElWithin,
  unrefElement,
} from '../../utils/util'

const props = defineProps<Props>()

const emit = defineEmits(['selected', 'toggle', 'resetFlow', 'hoverValue'])

const { setSelectionGrid, buildMultiLevelMatrix, setMonthPicker } = useArrowNavigation()

interface Props {
  items: OverlayGridItem[][]
  type: Flow
  isLast: boolean
  arrowNavigation?: boolean
  skipButtonRef?: boolean
  headerRefs?: (HTMLElement | null)[]
  hideNavigation?: Flow[]
  escClose?: boolean
  useRelative?: boolean
  height?: number | string
  textInput?: TextInputProp
  config?: Partial<Config>
  noOverlayFocus?: boolean
  focusValue?: number
  menuWrapRef?: HTMLElement | null
  ariaLabels?: Partial<AriaLabels>
  overlayLabel?: string
}

const { defaultedAriaLabels, defaultedTextInput, defaultedConfig, handleEventPropagation } = useDefaults(
  props as unknown as PickerBasePropsType,
)
const { hideNavigationButtons } = useCommon()

const scrollable = ref(false)
const selectionActiveRef = ref<HTMLElement | null>(null)
const gridWrapRef = ref(null)
const elementRefs = ref<Array<HTMLElement | null>[]>([])
const hoverValue = ref()
const toggleButton = ref<HTMLElement | null>(null)
const containerHeight = ref(0)
const containerRef = ref<HTMLElement | null>(null)

onBeforeUpdate(() => {
  selectionActiveRef.value = null
})

/**
 * On mounted hook, set the scroll position, if any to a selected value when opening overlay
 */
onMounted(() => {
  nextTick().then(() => setContainerHeightAndScroll())
  if (!props.noOverlayFocus) {
    focusGrid()
  }
  handleArrowNav(true)
})

onUnmounted(() => handleArrowNav(false))

function handleArrowNav(value: boolean): void {
  if (props.arrowNavigation) {
    if (props.headerRefs?.length) {
      setMonthPicker(value)
    }
    else {
      setSelectionGrid(value)
    }
  }
}

function focusGrid(): void {
  const elm = unrefElement(gridWrapRef)
  if (elm) {
    if (!defaultedTextInput.value.enabled) {
      if (selectionActiveRef.value) {
        selectionActiveRef.value?.focus({ preventScroll: true })
      }
      else {
        elm.focus({ preventScroll: true })
      }
    }

    scrollable.value = elm.clientHeight < elm.scrollHeight
  }
}

// Dynamic class  for the overlay
const dpOverlayClass = computed(
  (): DynamicClass => ({
    'dp__overlay': true,
    'dp--overlay-absolute': !props.useRelative,
    'dp--overlay-relative': props.useRelative,
  }),
)

const dpOverlayStyle = computed(() =>
  props.useRelative ? { height: `${props.height}px`, width: `var(--dp-menu-min-width)` } : undefined,
)

const cellClassName = computed(() => ({
  dp__overlay_col: true,
}))

/**
 * Dynamic class for action button
 */
const actionButtonClass = computed(
  (): DynamicClass => ({
    dp__btn: true,
    dp__button: true,
    dp__overlay_action: true,
    dp__over_action_scroll: scrollable.value,
    dp__button_bottom: props.isLast,
  }),
)

const containerClass = computed(() => ({
  dp__overlay_container: true,
  dp__container_flex: props.items?.length <= 6,
  dp__container_block: props.items?.length > 6,
}))

watch(
  () => props.items,
  () => setContainerHeightAndScroll(false),
  { deep: true },
)

function setContainerHeightAndScroll(setScroll = true) {
  nextTick().then(() => {
    const el = unrefElement(selectionActiveRef)
    const parent = unrefElement(gridWrapRef)
    const btn = unrefElement(toggleButton)
    const container = unrefElement(containerRef)
    const toggleBtnHeight = btn ? btn.getBoundingClientRect().height : 0
    if (parent) {
      if (!parent.getBoundingClientRect().height) {
        containerHeight.value = defaultedConfig.value.modeHeight - toggleBtnHeight
      }
      else {
        containerHeight.value = parent.getBoundingClientRect().height - toggleBtnHeight
      }
    }
    if (el && container && setScroll) {
      container.scrollTop
                    = el.offsetTop
                      - container.offsetTop
                      - (containerHeight.value / 2 - el.getBoundingClientRect().height)
                      - toggleBtnHeight
    }
  })
}

/**
 * Handle click on cell, if value is enabled (not in filters), emit value back to parent
 */
function onClick(val: OverlayGridItem): void {
  if (!val.disabled) {
    emit('selected', val.value)
  }
}

function toggle() {
  emit('toggle')
  emit('resetFlow')
}

function handleEsc(ev: KeyboardEvent) {
  if (props.escClose) {
    toggle()
    handleEventPropagation(ev)
  }
}

function assignRef(el: any, col: OverlayGridItem, rowInd: number, colInd: number): void {
  if (el) {
    if (col.active || col.value === props.focusValue) {
      selectionActiveRef.value = el
    }
    if (props.arrowNavigation) {
      if (Array.isArray(elementRefs.value[rowInd])) {
        elementRefs.value[rowInd][colInd] = el
      }
      else {
        elementRefs.value[rowInd] = [el]
      }
      buildMatrix()
    }
  }
}

function buildMatrix() {
  const refs = props.headerRefs?.length
    ? [props.headerRefs].concat(elementRefs.value)
    : elementRefs.value.concat([props.skipButtonRef ? [] : [toggleButton.value]])

  buildMultiLevelMatrix(convertType(refs), props.headerRefs?.length ? 'monthPicker' : 'selectionGrid')
}

function handleArrowKey(ev: KeyboardEvent) {
  if (props.arrowNavigation)
    return
  checkStopPropagation(ev, defaultedConfig.value, true)
}

function setHoverValue(val: number) {
  hoverValue.value = val
  emit('hoverValue', val)
}

function onTab() {
  toggle()
  if (!props.isLast) {
    const actionRow = getElWithin(props.menuWrapRef ?? null, 'action-row')
    if (actionRow) {
      const focusable = findFocusableEl(actionRow)
      focusable?.focus()
    }
  }
}

function onKeyDown(ev: KeyboardEvent) {
  switch (ev.key) {
    case EventKey.esc:
      return handleEsc(ev)
    case EventKey.arrowLeft:
      return handleArrowKey(ev)
    case EventKey.arrowRight:
      return handleArrowKey(ev)
    case EventKey.arrowUp:
      return handleArrowKey(ev)
    case EventKey.arrowDown:
      return handleArrowKey(ev)
    default:
  }
}

function onBtnKeyDown(ev: KeyboardEvent) {
  if (ev.key === EventKey.enter)
    return toggle()
  if (ev.key === EventKey.tab)
    return onTab()
}

defineExpose({ focusGrid })
</script>

<template>
  <div
    ref="gridWrapRef"
    :class="dpOverlayClass"
    :style="dpOverlayStyle"
    :role="useRelative ? undefined : 'dialog'"
    :aria-label="overlayLabel"
    :tabindex="useRelative ? undefined : '0'"
    @keydown="onKeyDown"
    @click.prevent
  >
    <div
      ref="containerRef"
      :class="containerClass"
      :style="{ '--dp-overlay-height': `${containerHeight}px` }"
      role="grid"
    >
      <div class="dp__selection_grid_header">
        <slot name="header" />
      </div>
      <template v-if="$slots.overlay">
        <slot name="overlay" />
      </template>
      <template v-else>
        <div
          v-for="(row, i) in items"
          :key="i"
          class="dp__overlay_row"
          role="row"
          :class="{ dp__flex_row: items.length >= 3 }"
        >
          <div
            v-for="(col, ind) in row"
            :key="col.value"
            :ref="(el) => assignRef(el, col, i, ind)"
            role="gridcell"
            :class="cellClassName"
            :aria-selected="col.active || undefined"
            :aria-disabled="col.disabled || undefined"
            tabindex="0"
            :data-test-id="col.text"
            @click.prevent="onClick(col)"
            @keydown="checkKeyDown($event, () => onClick(col), true)"
            @mouseover="setHoverValue(col.value)"
          >
            <div :class="col.className">
              <slot v-if="$slots.item" name="item" :item="col" />
              <template v-if="!$slots.item">
                {{ col.text }}
              </template>
            </div>
          </div>
        </div>
      </template>
    </div>
    <button
      v-if="$slots['button-icon']"
      v-show="!hideNavigationButtons(hideNavigation, type)"
      ref="toggleButton"
      type="button"
      :aria-label="defaultedAriaLabels?.toggleOverlay"
      :class="actionButtonClass"
      tabindex="0"
      @click="toggle"
      @keydown="onBtnKeyDown"
    >
      <slot name="button-icon" />
    </button>
  </div>
</template>

<style>
.dp__overlay {
  width: 100%;
  background: var(--dp-background-color);
  transition: opacity 1s ease-out;
  z-index: 99999;
  font-family: var(--dp-font-family);
  color: var(--dp-text-color);
  box-sizing: border-box;
}

.dp--overlay-absolute {
  position: absolute;
  height: 100%;
  top: 0;
  left: 0;
}

.dp--overlay-relative {
  position: relative;
}

.dp__overlay_container::-webkit-scrollbar-track {
  box-shadow: var(--dp-scroll-bar-background);
  background-color: var(--dp-scroll-bar-background);
}

.dp__overlay_container::-webkit-scrollbar {
  width: 5px;
  background-color: var(--dp-scroll-bar-background);
}

.dp__overlay_container::-webkit-scrollbar-thumb {
  background-color: var(--dp-scroll-bar-color);
  border-radius: 10px;
}

.dp__overlay:focus {
  border: none;
  outline: none;
}

.dp__container_flex {
  display: flex;
}

.dp__container_block {
  display: block;
}

.dp__overlay_container {
  flex-direction: column;
  overflow-y: auto;
  height: var(--dp-overlay-height);
}

.dp__time_picker_overlay_container {
  height: 100%;
}

.dp__overlay_row {
  padding: 0;
  box-sizing: border-box;
  display: flex;
  margin-inline: auto;
  flex-wrap: wrap;
  max-width: 100%;
  width: 100%;
  align-items: center;
}

.dp__flex_row {
  flex: 1;
}

.dp__overlay_col {
  box-sizing: border-box;
  width: 33%;
  padding: var(--dp-overlay-col-padding);
  white-space: nowrap;
}

.dp__overlay_cell_pad {
  padding: var(--dp-common-padding) 0;
}

.dp__overlay_cell_active {
  cursor: pointer;
  border-radius: var(--dp-border-radius);
  text-align: center;
  background: var(--dp-primary-color);
  color: var(--dp-primary-text-color);
}

.dp__overlay_cell {
  cursor: pointer;
  border-radius: var(--dp-border-radius);
  text-align: center;
  transition: var(--dp-common-transition);
}

.dp__overlay_cell:hover {
  background: var(--dp-hover-color);
  color: var(--dp-hover-text-color);
}

.dp__cell_in_between {
  background: var(--dp-hover-color);
  color: var(--dp-hover-text-color);
}

.dp__over_action_scroll {
  right: 5px;
  box-sizing: border-box;
}

.dp__overlay_cell_disabled {
  cursor: not-allowed;
  background: var(--dp-disabled-color);
}

.dp__overlay_cell_disabled:hover {
  background: var(--dp-disabled-color);
}

.dp__overlay_cell_active_disabled {
  cursor: not-allowed;
  background: var(--dp-primary-disabled-color);
}

.dp__overlay_cell_active_disabled:hover {
  background: var(--dp-primary-disabled-color);
}
</style>
