<script setup lang="ts">
import { CreditCardType } from 'ts-inputs'
import { BaseInput, CreditCardInput } from 'ts-inputs-vue'
import { computed, ref } from 'vue'

const baseInputCardNumber = ref('')
const creditCardInputNumber = ref('')
const cardType = ref<CreditCardType | null>(null)

function handleCardTypeChange(type: CreditCardType) {
  cardType.value = type
  console.log('Card type:', type)
}

const cardIcon = computed(() => {
  if (!cardType.value)
    return null

  const icons: Record<CreditCardType, string> = {
    [CreditCardType.VISA]: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/visa/visa-original.svg',
    [CreditCardType.MASTERCARD]: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mastercard/mastercard-original.svg',
    [CreditCardType.AMEX]: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/americanexpress/americanexpress-original.svg',
    [CreditCardType.DISCOVER]: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/discover/discover-original.svg',
    [CreditCardType.DINERS]: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dinersclub/dinersclub-original.svg',
    [CreditCardType.JCB]: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jcb/jcb-original.svg',
    [CreditCardType.UATP]: '',
    [CreditCardType.DANKORT]: '',
    [CreditCardType.INSTAPAYMENT]: '',
    [CreditCardType.JCB15]: '',
    [CreditCardType.MAESTRO]: '',
    [CreditCardType.MIR]: '',
    [CreditCardType.UNIONPAY]: '',
    [CreditCardType.GENERAL]: '',
  }

  return icons[cardType.value] || null
})

const cardTypeName = computed(() => {
  if (!cardType.value)
    return ''

  return cardType.value.charAt(0).toUpperCase() + cardType.value.slice(1)
})
</script>

<template>
  <div class="demo-container">
    <div class="demo-section">
      <h3>Using BaseInput</h3>
      <div class="input-wrapper">
        <BaseInput
          v-model="baseInputCardNumber"
          type="credit-card"
          class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          placeholder="Enter card number"
          @card-type="handleCardTypeChange"
        />
      </div>
    </div>

    <div class="demo-section">
      <h3>Using CreditCardInput</h3>
      <div class="input-wrapper">
        <CreditCardInput
          v-model="creditCardInputNumber"
          class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          placeholder="Enter card number"
          @card-type="handleCardTypeChange"
        />
      </div>
    </div>

    <div v-if="cardType" class="card-info">
      <img v-if="cardIcon" :src="cardIcon" :alt="cardTypeName" class="card-icon">
      <span class="card-type">{{ cardTypeName }}</span>
    </div>
  </div>
</template>

<style scoped>
.demo-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem;
  max-width: 600px;
  margin: 0 auto;
}

.demo-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.demo-section h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
}

.input-wrapper {
  position: relative;
}

.card-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background-color: #f3f4f6;
  border-radius: 0.375rem;
  margin-top: 1rem;
}

.card-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.card-type {
  font-size: 0.875rem;
  color: #4b5563;
  font-weight: 500;
}
</style>
