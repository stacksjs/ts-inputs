# Google Places Autocomplete

A Vue component that provides Google Places Autocomplete functionality with a clean and customizable interface.

## Usage

```vue
<script setup lang="ts">
import { GooglePlacesInput } from 'ts-inputs-vue'
import { ref } from 'vue'

const location = ref('')

function handlePlaceChanged(place: google.maps.places.PlaceResult) {
  console.log('Selected place:', place)
  // Access place.geometry.location for coordinates
  // Access place.formatted_address for the full address
}
</script>

<template>
  <GooglePlacesInput
    v-model="location"
    api-key="YOUR_GOOGLE_MAPS_API_KEY"
    placeholder="Enter a location"
    @place-changed="handlePlaceChanged"
  />
</template>
```

## Demo

<GooglePlacesInputDemo />

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | `''` | The v-model binding value |
| `apiKey` | `string` | - | Your Google Maps API key (required) |
| `placeholder` | `string` | `'Enter a location'` | Input placeholder text |
| `disabled` | `boolean` | `false` | Whether the input is disabled |
| `error` | `boolean` | `false` | Whether to show error state |
| `types` | `string[]` | `['address']` | Array of place types to search for |
| `componentRestrictions` | `{ country: string \| string[] }` | `{ country: 'us' }` | Country restrictions for search results |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string` | Emitted when the input value changes |
| `placeChanged` | `google.maps.places.PlaceResult` | Emitted when a place is selected, returns the full place details |
| `blur` | `Event` | Emitted when the input loses focus |

## Place Types

You can specify different types of places to search for using the `types` prop. Common types include:

- `'address'` - Addresses only
- `'establishment'` - Business locations
- `'geocode'` - Geocoded locations
- `'(regions)'` - Cities, states, countries
- `'(cities)'` - Cities only

Example with multiple types:

```vue
<GooglePlacesInputDemo
  :types="['address', 'establishment']"
  api-key="YOUR_API_KEY"
/>
```

## Country Restrictions

You can restrict results to specific countries using the `componentRestrictions` prop:

```vue
<GooglePlacesInputDemo
  :component-restrictions="{ country: ['us', 'ca'] }"
  api-key="YOUR_API_KEY"
/>
```

## Styling

The component comes with default styling but can be customized using CSS. The following classes are available:

- `.google-places-autocomplete` - The main container
- `.suggestions` - The dropdown container
- `.suggestion-item` - Individual suggestion items
- `.suggestion-item--active` - Active/hovered suggestion item

Example custom styling:

```css
.google-places-autocomplete {
  /* Custom styles */
}

.suggestions {
  /* Custom dropdown styles */
}

.suggestion-item {
  /* Custom suggestion item styles */
}
```

## Google Maps API Setup

1. Get a Google Maps API key from the [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the Places API for your project
3. Add the API key to your component

## Error Handling

The component includes basic error handling for API requests. You can listen for errors in the console or implement your own error handling:

```vue
<script setup lang="ts">
function handleError(error: Error) {
  // Handle the error
  console.error('Google Places error:', error)
}
</script>

<template>
  <GooglePlacesInput
    api-key="YOUR_API_KEY"
    @error="handleError"
  />
</template>
```

## TypeScript Support

The component is fully typed with TypeScript. You can import the types from the package:

```typescript
import type { AutocompletePrediction } from '@types/google.maps'
```
