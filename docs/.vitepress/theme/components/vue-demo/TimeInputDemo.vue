<script setup lang="ts">
import { BaseInput } from 'ts-inputs-vue'
import { ref } from 'vue'

const time12h = ref('')
const time24h = ref('')
const timeWithSeconds = ref('')
const timeWithIncrements = ref('')
</script>

<template>
  <div class="demo-container">
    <div class="demo-item">
      <h3>12-hour Format</h3>
      <BaseInput
        v-model="time12h"
        type="date"
        :date-options="{
          timePicker: true,
          is24: false,
          format: 'hh:mm a',
        }"
        placeholder="Select time (12h)"
      />
      <div class="value-display">
        Selected: {{ time12h }}
      </div>
    </div>

    <div class="demo-item">
      <h3>24-hour Format</h3>
      <BaseInput
        v-model="time24h"
        type="date"
        :date-options="{
          timePicker: true,
          is24: true,
          format: 'HH:mm',
        }"
        placeholder="Select time (24h)"
      />
      <div class="value-display">
        Selected: {{ time24h }}
      </div>
    </div>

    <div class="demo-item">
      <h3>With Seconds</h3>
      <BaseInput
        v-model="timeWithSeconds"
        type="date"
        :date-options="{
          timePicker: true,
          is24: true,
          enableSeconds: true,
          format: 'HH:mm:ss',
        }"
        placeholder="Select time with seconds"
      />
      <div class="value-display">
        Selected: {{ timeWithSeconds }}
      </div>
    </div>

    <div class="demo-item">
      <h3>With Custom Increments</h3>
      <BaseInput
        v-model="timeWithIncrements"
        type="date"
        :date-options="{
          timePicker: true,
          is24: true,
          hoursIncrement: 2,
          minutesIncrement: 15,
          secondsIncrement: 30,
          format: 'HH:mm:ss',
        }"
        placeholder="Select time with increments"
      />
      <div class="value-display">
        Selected: {{ timeWithIncrements }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 1rem;
}

.demo-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

h3 {
  margin: 0;
  font-size: 1rem;
  color: var(--vp-c-text-1);
}

.value-display {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  margin-top: 0.5rem;
}
</style>
