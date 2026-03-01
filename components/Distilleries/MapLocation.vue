<script setup>
import { onMounted, ref, watch } from "vue";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const props = defineProps({
  location: {
    type: Object,
    required: true,
  },
});

const mapContainer = ref(null);
let mapInstance = null; // keep reference to map

const initializeMap = (location) => {
  const { Map, Marker, NavigationControl, FullscreenControl } = maplibregl;

  // Avoid re-initializing the map if it already exists
  if (mapInstance) return;

  mapInstance = new Map({
    container: mapContainer.value,
    style:
      "https://api.maptiler.com/maps/streets/style.json?key=acp7rTIlyDfNVWzGbIBS",
    center: [location.lon, location.lat],
    zoom: 12,
  });

  new Marker().setLngLat([location.lon, location.lat]).addTo(mapInstance);

  mapInstance.addControl(new NavigationControl());
  mapInstance.addControl(new FullscreenControl());
};

// Watch for distillery prop changes (handles async data)
watch(
  () => props.location,
  (newLocation) => {
    const loc = newLocation;
    if (loc) {
      initializeMap(loc);
    } else {
      console.error("Distillery location is missing!");
    }
  },
  { immediate: true },
);

onMounted(() => {
  const loc = props.location;
  if (loc) {
    initializeMap(loc);
  }
});
</script>

<template>
  <div ref="mapContainer" class="w-full h-[500px]"></div>
</template>
