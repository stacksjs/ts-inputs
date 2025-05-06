<script setup lang="ts">
import { CreditCardType } from 'ts-inputs'
import { BaseInput } from 'ts-inputs-vue'
import { computed, ref } from 'vue'

const cardNumber = ref('')
const delimiter = ref(' ')
const cardType = ref<CreditCardType | null>(null)

const creditCardOptions = computed(() => ({
  delimiter: delimiter.value,
}))

function handleCardTypeChange(type: CreditCardType) {
  cardType.value = type
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
    <div class="input-section">
      <div class="input-group">
        <label class="block text-sm font-medium text-gray-700">Credit Card Input</label>
        <BaseInput
          v-model="cardNumber"
          type="credit-card"
          :credit-card-options="creditCardOptions"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Enter card number"
          @card-type="handleCardTypeChange"
        />
      </div>

      <div class="options-grid">
        <div class="option-group">
          <label class="block text-sm font-medium text-gray-700">Delimiter</label>
          <select
            v-model="delimiter"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value=" ">
              Space ( )
            </option>
            <option value="-">
              Hyphen (-)
            </option>
            <option value=".">
              Dot (.)
            </option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="cardType" class="result-section">
      <h3 class="text-lg font-medium text-gray-900">
        Card Information
      </h3>
      <div class="mt-2 flex items-center gap-2">
        <img v-if="cardIcon" :src="cardIcon" :alt="cardTypeName" class="w-6 h-6">
        <span class="text-sm text-gray-500">{{ cardTypeName }}</span>
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
