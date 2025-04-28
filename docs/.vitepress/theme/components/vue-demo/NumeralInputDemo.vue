<script setup lang="ts">
import { NumeralInput } from 'ts-inputs-vue'
import { ref } from 'vue'

const number = ref('')
</script>

<template>
  <NumeralInput
    v-model="number"
    class="block w-1/3 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
    thousand-group-style="thousand"
    placeholder="Enter number"
  />
</template>
