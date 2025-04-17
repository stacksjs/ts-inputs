<script setup lang="ts">
import { GooglePlacesInput } from 'ts-inputs-vue'
import { ref } from 'vue'

const location = ref('')
const apiKey = 'AIzaSyCtD4sE0Pvyy6Ey1GSAneSFQIVJA0aBjxE'

function handlePlaceSelected(place: google.maps.places.PlaceResult) {
  console.log('Selected place:', place)
  // Access place.geometry.location for coordinates
  // Access place.formatted_address for the full address
}
</script>

<template>
  <GooglePlacesInput
    v-model="location"
    class="block w-1/3 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 "
    :api-key="apiKey"
    @place-selected="handlePlaceSelected"
  />
</template>
