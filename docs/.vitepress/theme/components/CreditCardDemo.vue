<script setup lang="ts">
import { BaseInput } from 'ts-inputs-vue'
import { ref } from 'vue'

const cardNumber = ref('')

function handleCardTypeChange(type: UnifiedInputType) {
  console.log('Card type:', type)
}
</script>

<template>
  <BaseInput
    v-model="cardNumber"
    type="credit-card"
    class="block w-full  rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
    placeholder="Enter card number"
    @card-type-change="handleCardTypeChange"
  />
</template>
