<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import BaseInput from './common/BaseInput.vue'

interface Props {
  modelValue: string
  apiKey: string
  placeholder?: string
  className?: string
  disabled?: boolean
  error?: boolean
  types?: string[]
  componentRestrictions?: {
    country: string | string[]
  }
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Enter a location',
  className: '',
  disabled: false,
  error: false,
  types: () => ['address'],
  componentRestrictions: () => ({ country: 'us' }),
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'placeChanged', place: google.maps.places.PlaceResult): void
  (e: 'blur', event: Event): void
  (e: 'error', error: Error): void
}>()

const autocomplete = ref<google.maps.places.Autocomplete | null>(null)
const inputComponentRef = ref<InstanceType<typeof BaseInput> | null>(null)

function initAutocomplete() {
  const inputElement = inputComponentRef.value?.inputElement
  if (!inputElement) {
    const error = new Error('GooglePlacesInput: BaseInput or its input element not found.')
    emit('error', error)
    return
  }

  try {
    autocomplete.value = new google.maps.places.Autocomplete(inputElement, {
      types: props.types,
      componentRestrictions: props.componentRestrictions,
    })

    autocomplete.value.addListener('place_changed', () => {
      const place = autocomplete.value?.getPlace()
      if (place) {
        emit('placeChanged', place)
        emit('update:modelValue', place.formatted_address || '')
      }
    })
  }
  catch (error) {
    emit('error', error instanceof Error ? error : new Error('Failed to initialize Google Places Autocomplete'))
  }
}

onMounted(() => {
  // Load Google Maps script
  const script = document.createElement('script')
  script.src = `https://maps.googleapis.com/maps/api/js?key=${props.apiKey}&libraries=places`
  script.async = true
  script.defer = true
  script.onload = initAutocomplete
  script.onerror = (error) => {
    emit('error', new Error('Failed to load Google Maps script'))
  }
  document.head.appendChild(script)
})

onBeforeUnmount(() => {
  if (autocomplete.value) {
    google.maps.event.clearInstanceListeners(autocomplete.value)
  }
})

function onBlur(event: Event) {
  emit('blur', event)
}
</script>

<template>
  <BaseInput
    ref="inputComponentRef"
    v-bind="$attrs"
    :model-value="modelValue"
    :placeholder="placeholder"
    :class="className"
    :disabled="disabled"
    :error="error"
    @update:model-value="value => emit('update:modelValue', value)"
    @blur="onBlur"
  />
</template>
