<script setup lang="ts">
import type { CreditCardType } from 'ts-inputs-vue'
import { CreditCardInput } from 'ts-inputs-vue'
import { ref } from 'vue'

const cardNumber = ref('')

function handleCardTypeChange(type: CreditCardType) {
  console.log('Card type:', type)
}
</script>

<template>
  <CreditCardInput
    v-model="cardNumber"
    placeholder="Enter card number"
    @card-type-change="handleCardTypeChange"
  />
</template>
