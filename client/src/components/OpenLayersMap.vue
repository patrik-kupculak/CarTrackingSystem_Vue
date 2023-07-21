<template>
  <div ref="mapContainer" class="map-container"></div>
</template>

<script>
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Circle as CircleStyle, Fill, Style } from 'ol/style';

export default {
  name: 'OpenLayersMap',
  mounted () {
    this.initMap()
  },
  methods: {
    initMap () {
      // Create a new map instance and specify the target container
      const map = new Map({
        target: this.$refs.mapContainer,
        layers: [
            new TileLayer({
            source: new OSM() // Use OpenStreetMap as the TileLayer source
          })
        ],
        view: new View({
          center: [49.21506, 18.73566], // Set the initial center of the map (e.g., [longitude, latitude])
          zoom: 5 // Set the initial zoom level
        })
      })
      // Create a vector source to hold the circle features
      const vectorSource = new VectorSource();

      // Add a circle feature to the vector source (example coordinates: [longitude, latitude])
      const circleFeature = new Feature(new Circle([0, 0], 500000)); // Circle with center at [0, 0] and a radius of 500 km
      vectorSource.addFeature(circleFeature);

      // Create a vector layer to render the circles
      const vectorLayer = new VectorLayer({
        source: vectorSource,
        style: new Style({
          fill: new Fill({
            color: 'rgba(255, 0, 0, 0.2)', // Circle fill color (red with 20% opacity)
          }),
          stroke: new Stroke({
            color: 'red', // Circle stroke color
            width: 2, // Circle stroke width in pixels
          }),
        }),
      });

      // Add the vector layer to the map
      map.addLayer(vectorLayer);
    }
  }
}
</script>

<style>
.map-container {
  width: 100%;
  height: 400px; /* Adjust the height as needed */
}
</style>
