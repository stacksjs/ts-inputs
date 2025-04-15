<script setup lang="ts">
import { CreditCardInput } from 'ts-inputs'
import { ref } from 'vue'

const cardNumber = ref('')
const expiryDate = ref('')
const cvv = ref('')
</script>

<template>
  <div>
    <CreditCardInput v-model="cardNumber" />
  </div>
</template>
