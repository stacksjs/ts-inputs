<script setup lang="ts">
import { NumeralInput } from 'ts-inputs-vue'
import { computed, ref } from 'vue'

const number = ref('')
const thousandGroupStyle = ref('thousand')
const delimiter = ref(',')
const decimalMark = ref('.')
const decimalScale = ref(2)
const prefix = ref('')
const stripLeadingZeroes = ref(true)
const positiveOnly = ref(false)
const tailPrefix = ref(false)
const signBeforePrefix = ref(false)

const options = computed(() => ({
  thousandGroupStyle: thousandGroupStyle.value,
  delimiter: delimiter.value,
  decimalMark: decimalMark.value,
  decimalScale: decimalScale.value,
  prefix: prefix.value,
  stripLeadingZeroes: stripLeadingZeroes.value,
  positiveOnly: positiveOnly.value,
  tailPrefix: tailPrefix.value,
  signBeforePrefix: signBeforePrefix.value,
}))

const formattedValue = computed(() => {
  if (!number.value)
    return ''
  return number.value
})
</script>

<template>
  <div class="demo-container">
    <div class="input-section">
      <div class="input-group">
        <label class="block text-sm font-medium text-gray-700">Number Input</label>
        <NumeralInput
          v-model="number"
          v-bind="options"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Enter a number"
        />
      </div>

      <div class="options-grid">
        <div class="option-group">
          <label class="block text-sm font-medium text-gray-700">Thousand Group Style</label>
          <select
            v-model="thousandGroupStyle"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="thousand">
              Thousand (1,234,567.89)
            </option>
            <option value="lakh">
              Lakh (12,34,567.89)
            </option>
            <option value="wan">
              Wan (123,4567.89)
            </option>
          </select>
        </div>

        <div class="option-group">
          <label class="block text-sm font-medium text-gray-700">Delimiter</label>
          <select
            v-model="delimiter"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value=",">
              Comma (,)
            </option>
            <option value=".">
              Dot (.)
            </option>
            <option value=" ">
              Space ( )
            </option>
          </select>
        </div>

        <div class="option-group">
          <label class="block text-sm font-medium text-gray-700">Decimal Mark</label>
          <select
            v-model="decimalMark"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value=".">
              Dot (.)
            </option>
            <option value=",">
              Comma (,)
            </option>
          </select>
        </div>

        <div class="option-group">
          <label class="block text-sm font-medium text-gray-700">Decimal Scale</label>
          <select
            v-model="decimalScale"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="0">
              0
            </option>
            <option value="1">
              1
            </option>
            <option value="2">
              2
            </option>
            <option value="3">
              3
            </option>
            <option value="4">
              4
            </option>
          </select>
        </div>

        <div class="option-group">
          <label class="block text-sm font-medium text-gray-700">Prefix</label>
          <input
            v-model="prefix"
            type="text"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="e.g., $, €"
          >
        </div>

        <div class="option-group">
          <label class="block text-sm font-medium text-gray-700">Strip Leading Zeroes</label>
          <select
            v-model="stripLeadingZeroes"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option :value="true">
              Yes
            </option>
            <option :value="false">
              No
            </option>
          </select>
        </div>

        <div class="option-group">
          <label class="block text-sm font-medium text-gray-700">Positive Only</label>
          <select
            v-model="positiveOnly"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option :value="false">
              No
            </option>
            <option :value="true">
              Yes
            </option>
          </select>
        </div>

        <div class="option-group">
          <label class="block text-sm font-medium text-gray-700">Tail Prefix</label>
          <select
            v-model="tailPrefix"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option :value="false">
              No
            </option>
            <option :value="true">
              Yes
            </option>
          </select>
        </div>

        <div class="option-group">
          <label class="block text-sm font-medium text-gray-700">Sign Before Prefix</label>
          <select
            v-model="signBeforePrefix"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option :value="false">
              No
            </option>
            <option :value="true">
              Yes
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
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4;
}

.option-group {
  @apply space-y-1;
}

.result-section {
  @apply mt-6 p-4 bg-gray-50 rounded-lg;
}
</style>
