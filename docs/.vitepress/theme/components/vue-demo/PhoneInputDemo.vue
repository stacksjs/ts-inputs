<script setup lang="ts">
import { PhoneInput } from 'ts-inputs-vue'
import { computed, ref } from 'vue'

const phone = ref('')
const delimiter = ref('-')
const pattern = ref([3, 3, 4]) // Default US pattern: XXX-XXX-XXXX

const options = computed(() => ({
  delimiter: delimiter.value,
  pattern: pattern.value,
}))

const formattedValue = computed(() => {
  if (!phone.value)
    return ''
  return phone.value
})
</script>

<template>
  <div class="demo-container">
    <div class="input-section">
      <div class="input-group">
        <label class="block text-sm font-medium text-gray-700">Phone Input</label>
        <PhoneInput
          v-model="phone"
          v-bind="options"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Enter phone number"
        />
      </div>

      <div class="options-grid">
        <div class="option-group">
          <label class="block text-sm font-medium text-gray-700">Delimiter</label>
          <select
            v-model="delimiter"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="-">
              Hyphen (-)
            </option>
            <option value=" ">
              Space ( )
            </option>
            <option value=".">
              Dot (.)
            </option>
          </select>
        </div>

        <div class="option-group">
          <label class="block text-sm font-medium text-gray-700">Pattern</label>
          <select
            v-model="pattern"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option :value="[3, 3, 4]">
              US (XXX-XXX-XXXX)
            </option>
            <option :value="[4, 3, 3]">
              UK (XXXX-XXX-XXX)
            </option>
            <option :value="[2, 4, 4]">
              France (XX-XXXX-XXXX)
            </option>
            <option :value="[3, 2, 2, 2]">
              Germany (XXX-XX-XX-XX)
            </option>
          </select>
        </div>
      </div>
    </div>

    <div class="result-section">
      <h3 class="text-lg font-medium text-gray-900">
        Result
      </h3>
      <div class="mt-2">
        <div class="text-sm text-gray-500">
          Formatted Value:
        </div>
        <div class="mt-1 font-mono text-lg">
          {{ formattedValue }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo-container {
  @apply max-w-4xl mx-auto p-6 bg-white rounded-lg shadow;
}

.input-section {
  @apply space-y-6;
}

.options-grid {
  @apply grid grid-cols-1 md:grid-cols-2 gap-4;
}

.option-group {
  @apply space-y-1;
}

.result-section {
  @apply mt-6 p-4 bg-gray-50 rounded-lg;
}
</style>
