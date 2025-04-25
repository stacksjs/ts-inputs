# Places Autocomplete

A component that provides Google Maps Places Autocomplete functionality for address search using the BaseInput component.

## Usage

```vue
<script setup lang="ts">
import { BaseInput } from 'ts-inputs-vue'

const address = ref('')

function handlePlaceSelected(place) {
  console.log('Selected place:', place)
}
</script>

<template>
  <BaseInput
    v-model="address"
    type="places"
    :places-options="{
      apiKey: 'YOUR_GOOGLE_MAPS_API_KEY',
      types: ['address'],
      componentRestrictions: { country: 'us' },
    }"
    placeholder="Enter an address"
    @place-selected="handlePlaceSelected"
  />
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | `''` | The v-model binding value |
| `type` | `'places'` | `'places'` | Must be set to 'places' for places autocomplete |
| `className` | `string` | - | Additional CSS classes |
| `placeholder` | `string` | - | Input placeholder text |
| `placesOptions` | `object` | - | Places autocomplete configuration options |

### Places Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiKey` | `string` | - | Google Maps API key (required) |
| `types` | `string[]` | `['address']` | Types of places to search for |
| `componentRestrictions` | `object` | `{ country: 'us' }` | Restrict results to specific countries |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string` | Emitted when the input value changes |
| `placeSelected` | `PlaceResult` | Emitted when a place is selected from the autocomplete suggestions |

## PlaceResult Interface

```typescript
interface PlaceResult {
  formatted_address: string
  place_id: string
  geometry: {
    location: {
      lat: () => number
      lng: () => number
    }
  }
  address_components: Array<{
    long_name: string
    short_name: string
    types: string[]
  }>
}
```

## Features

- Address autocomplete with Google Maps Places API
- Full address details including:
  - Formatted address
  - Place ID
  - Latitude and longitude
  - Address components (street, city, state, etc.)
- Customizable styling
- v-model support
- TypeScript support

## Requirements

- Google Maps API key with Places API enabled
- Internet connection for API calls

## Example with Place Details

```vue
<script setup lang="ts">
import { BaseInput } from 'ts-inputs-vue'
import { ref } from 'vue'

const address = ref('')
const selectedPlace = ref(null)

function handlePlaceSelected(place) {
  selectedPlace.value = place
}
</script>

<template>
  <div>
    <BaseInput
      v-model="address"
      type="places"
      :places-options="{
        apiKey: 'YOUR_GOOGLE_MAPS_API_KEY',
        types: ['address'],
        componentRestrictions: { country: 'us' },
      }"
      @place-selected="handlePlaceSelected"
    />

    <div v-if="selectedPlace">
      <h3>Place Details:</h3>
      <p>Address: {{ selectedPlace.formatted_address }}</p>
      <p>Place ID: {{ selectedPlace.place_id }}</p>
      <p>Location: {{ selectedPlace.geometry.location.lat() }}, {{ selectedPlace.geometry.location.lng() }}</p>

      <h4>Address Components:</h4>
      <ul>
        <li v-for="component in selectedPlace.address_components" :key="component.types[0]">
          {{ component.types[0] }}: {{ component.long_name }}
        </li>
      </ul>
    </div>
  </div>
</template>
```
