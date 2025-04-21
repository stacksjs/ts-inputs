import type { Fn, MaybeElementRef, MaybeRef, OnClickOutsideEvents, OnClickOutsideOptions } from '../interfaces'

// Following code is a port of @vueuse/core clickOutside hook
import { getCurrentScope, onScopeDispose, unref, watch } from 'vue'
import { unrefElement } from '../utils/util'

const defaultWindow = typeof window !== 'undefined' ? window : undefined

function noop() {

}

function tryOnScopeDispose(fn: Fn): boolean {
  if (getCurrentScope()) {
    onScopeDispose(fn)
    return true
  }
  return false
}

function useEventListener(target: MaybeRef<EventTarget> | undefined, event: string, listener: EventListener, options: Record<string, boolean>): (() => void) {
  if (!target)
    return noop

  let cleanup = noop

  const stopWatch = watch(
    () => unref(target),
    (el) => {
      cleanup()
      if (!el)
        return
      el.removeEventListener(event, listener)
      el.addEventListener(event, listener, options)

      cleanup = () => {
        el.removeEventListener(event, listener, options)
        cleanup = noop
      }
    },
    { immediate: true, flush: 'post' },
  )

  const stop = () => {
    stopWatch()
    cleanup()
  }

  tryOnScopeDispose(stop)

  return stop
}

export function onClickOutside<E extends keyof OnClickOutsideEvents = 'pointerdown'>(target: MaybeElementRef, inputRef: MaybeElementRef, handler: (evt: OnClickOutsideEvents[E]) => void, options: OnClickOutsideOptions<E> = {}): (() => void) | undefined {
  const { window = defaultWindow, event = 'pointerdown' } = options

  if (!window)
    return

  const listener = (event: OnClickOutsideEvents[E]) => {
    const el = unrefElement(target)
    const inputEl = unrefElement(inputRef)

    if (!el || !inputEl)
      return

    if (el === event.target || event.composedPath().includes(el) || event.composedPath().includes(inputEl))
      return

    handler(event)
  }

  return useEventListener(window, event, listener as EventListener, { passive: true })
}
