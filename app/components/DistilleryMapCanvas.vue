<script setup lang="ts">
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Map as MapLibreMap, Marker, StyleSpecification } from 'maplibre-gl';

const props = defineProps<{ distilleries: DistilleryView[] }>();
const emit = defineEmits<{ unavailable: [] }>();

// Free raster tiles, no API key. Check the OpenStreetMap tile usage policy before serving heavy traffic.
const style: StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      maxzoom: 19,
      attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>-bijdragers',
    },
  },
  layers: [{ id: 'osm', type: 'raster', source: 'osm', paint: { 'raster-saturation': -0.35, 'raster-hue-rotate': -15 } }],
};

const container = useTemplateRef<HTMLElement>('container');
let map: MapLibreMap | undefined;
let markers: Marker[] = [];
let maplibre: typeof import('maplibre-gl') | undefined;

type LocatedDistillery = DistilleryView & { location: Coordinates };

const locatedDistilleries = () => props.distilleries.filter((d): d is LocatedDistillery => d.location !== undefined);

function popupContent(distillery: DistilleryView) {
  const wrapper = document.createElement('div');
  const link = document.createElement('a');
  link.href = `/distilleries/${distillery.slug}`;
  link.textContent = distillery.name;
  link.style.cssText = 'font-weight:600;color:#9a2a2a';
  const meta = document.createElement('div');
  meta.textContent = [distillery.town, distillery.region?.name].filter(Boolean).join(' · ');
  meta.style.cssText = 'font-size:12px;color:#7a6a5c';
  wrapper.append(link, meta);
  return wrapper;
}

function render() {
  if (!map || !maplibre) return;
  const { Marker, Popup, LngLatBounds } = maplibre;
  markers.forEach(marker => marker.remove());
  const located = locatedDistilleries();
  markers = located.map((distillery) => {
    const element = document.createElement('button');
    element.type = 'button';
    element.setAttribute('aria-label', [distillery.name, distillery.town].filter(Boolean).join(', '));
    element.className = 'size-4 cursor-pointer rounded-full border-2 border-white bg-sherry shadow-md';
    return new Marker({ element })
      .setLngLat([distillery.location.lng, distillery.location.lat])
      .setPopup(new Popup({ offset: 12, closeButton: false }).setDOMContent(popupContent(distillery)))
      .addTo(map!);
  });

  if (!located.length) return;
  const bounds = new LngLatBounds();
  located.forEach(d => bounds.extend([d.location.lng, d.location.lat]));
  map.fitBounds(bounds, { padding: 48, maxZoom: 10, duration: 0 });
}

onMounted(async () => {
  maplibre = await import('maplibre-gl');
  if (!container.value) return;
  try {
    map = new maplibre.Map({ container: container.value, style, center: [-4, 56], zoom: 4, cooperativeGestures: true });
  }
  catch {
    emit('unavailable');
    return;
  }
  map.addControl(new maplibre.NavigationControl({ showCompass: false }), 'top-right');
  map.on('load', render);
});

watch(() => props.distilleries, render);
onBeforeUnmount(() => map?.remove());
</script>

<template>
  <div
    ref="container"
    class="size-full"
  />
</template>
