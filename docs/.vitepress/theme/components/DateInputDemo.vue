<script setup lang="ts">
import { BaseInput } from 'ts-inputs-vue'
import { onMounted, ref } from 'vue'

const date = ref('')
const dateRange = ref('')
const month = ref('')
const year = ref('')
const week = ref('')
const quarter = ref('')
const multiDates = ref('')
const flowDate = ref('')

// For demo purposes
onMounted(() => {
  const today = new Date()
  date.value = today.toISOString().split('T')[0]
  month.value = today.toISOString().split('T')[0]
  year.value = today.toISOString().split('T')[0]
  week.value = today.toISOString().split('T')[0]
  quarter.value = today.toISOString().split('T')[0]
  flowDate.value = today.toISOString().split('T')[0]
})
</script>

<template>
  <div class="demo-container">
    <div class="demo-item">
      <h3>Basic Date Picker</h3>
      <BaseInput
        v-model="date"
        type="date"
        :date-options="{
          format: 'yyyy-MM-dd',
          autoApply: true,
        }"
        placeholder="Select date"
      />
      <div class="value-display">
        Selected: {{ date }}
      </div>
    </div>

    <div class="demo-item">
      <h3>Range Picker</h3>
      <BaseInput
        v-model="dateRange"
        type="date"
        :date-options="{
          range: true,
          format: 'yyyy-MM-dd',
          autoApply: true,
        }"
        placeholder="Select date range"
      />
      <div class="value-display">
        Selected: {{ dateRange }}
      </div>
    </div>

    <div class="demo-item">
      <h3>Month Picker</h3>
      <BaseInput
        v-model="month"
        type="date"
        :date-options="{
          monthPicker: true,
          format: 'MMMM yyyy',
        }"
        placeholder="Select month"
      />
      <div class="value-display">
        Selected: {{ month }}
      </div>
    </div>

    <div class="demo-item">
      <h3>Year Picker</h3>
      <BaseInput
        v-model="year"
        type="date"
        :date-options="{
          yearPicker: true,
          format: 'yyyy',
        }"
        placeholder="Select year"
      />
      <div class="value-display">
        Selected: {{ year }}
      </div>
    </div>

    <div class="demo-item">
      <h3>Week Picker</h3>
      <BaseInput
        v-model="week"
        type="date"
        :date-options="{
          weekPicker: true,
        }"
        placeholder="Select week"
      />
      <div class="value-display">
        Selected: {{ week }}
      </div>
    </div>

    <div class="demo-item">
      <h3>Quarter Picker</h3>
      <BaseInput
        v-model="quarter"
        type="date"
        :date-options="{
          quarterPicker: true,
          format: 'QQQ yyyy',
        }"
        placeholder="Select quarter"
      />
      <div class="value-display">
        Selected: {{ quarter }}
      </div>
    </div>

    <div class="demo-item">
      <h3>Multi Dates</h3>
      <BaseInput
        v-model="multiDates"
        type="date"
        :date-options="{
          multiDates: true,
          format: 'yyyy-MM-dd',
        }"
        placeholder="Select multiple dates"
      />
      <div class="value-display">
        Selected: {{ multiDates }}
      </div>
    </div>

    <div class="demo-item">
      <h3>With Flow Steps</h3>
      <BaseInput
        v-model="flowDate"
        type="date"
        :date-options="{
          flow: ['month', 'year', 'calendar'],
          format: 'yyyy-MM-dd',
        }"
        placeholder="Select date with flow"
      />
      <div class="value-display">
        Selected: {{ flowDate }}
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
