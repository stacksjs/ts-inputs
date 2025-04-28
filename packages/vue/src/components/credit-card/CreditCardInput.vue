<script setup lang="ts">
import type { FormatCreditCardOptions } from 'ts-inputs'
import { CreditCardType } from 'ts-inputs'
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  modelValue?: string
  className?: string
  placeholder?: string
  delimiter?: string
  options?: Omit<FormatCreditCardOptions, 'delimiter'>
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'cardType', type: CreditCardType): void
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const formattedValue = ref(props.modelValue || '')
const cardType = ref<CreditCardType | null>(null)

// Format credit card number
function formatCreditCard(value: string): string {
  const cleanValue = value.replace(/\D/g, '')
  const delimiter = props.delimiter || ' '

  // Determine card type based on first digits
  const firstDigit = cleanValue.charAt(0)
  const firstTwoDigits = cleanValue.slice(0, 2)
  const firstFourDigits = cleanValue.slice(0, 4)

  let newCardType: CreditCardType | null = null

  // Check card type
  if (firstDigit === '4') {
    newCardType = CreditCardType.VISA
  }
  else if (firstTwoDigits === '34' || firstTwoDigits === '37') {
    newCardType = CreditCardType.AMEX
  }
  else if (firstTwoDigits >= '51' && firstTwoDigits <= '55') {
    newCardType = CreditCardType.MASTERCARD
  }
  else if (firstFourDigits === '6011' || firstTwoDigits === '65') {
    newCardType = CreditCardType.DISCOVER
  }
  else if (firstTwoDigits === '36' || firstTwoDigits === '38' || firstTwoDigits === '39') {
    newCardType = CreditCardType.DINERS
  }
  else if (firstTwoDigits === '35') {
    newCardType = CreditCardType.JCB
  }

  // Update card type if changed
  if (newCardType !== cardType.value) {
    cardType.value = newCardType
    if (newCardType) {
      emit('cardType', newCardType)
    }
  }

  // Format based on card type
  let formatted = cleanValue
  if (newCardType === CreditCardType.AMEX) {
    // AMEX: XXXX XXXXXX XXXXX
    formatted = cleanValue.replace(/(\d{4})(\d{6})(\d{5})/, `$1${delimiter}$2${delimiter}$3`)
  }
  else {
    // Other cards: XXXX XXXX XXXX XXXX
    formatted = cleanValue.replace(/(\d{4})/g, `$1${delimiter}`).trim()
  }

  return formatted
}

// Handle input changes
function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  const newValue = formatCreditCard(target.value)
  formattedValue.value = newValue
  emit('update:modelValue', newValue)
}

// Watch for external modelValue changes
watch(() => props.modelValue, (newValue) => {
  if (newValue !== formattedValue.value) {
    formattedValue.value = formatCreditCard(newValue || '')
  }
})

// Get card icon based on type
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
</script>

<template>
  <div class="credit-card-input-wrapper">
    <input
      ref="inputRef"
      v-model="formattedValue"
      type="text"
      class="credit-card-input" :class="[className]"
      :placeholder="placeholder || 'Enter card number'"
      maxlength="19"
      @input="handleInput"
    >
    <img
      v-if="cardIcon"
      :src="cardIcon"
      :alt="cardType?.toString()"
      class="card-icon"
    >
  </div>
</template>

<style scoped>
.credit-card-input-wrapper {
  position: relative;
  display: inline-block;
}

.credit-card-input {
  width: 100%;
  padding: 0.5rem;
  padding-right: 2.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

.credit-card-input:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}

.card-icon {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  object-fit: contain;
}
</style>
