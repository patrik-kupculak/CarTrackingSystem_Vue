<template>
    <div ref="map-root"
         style="width: 100%; height: 100%">
    </div>
</template>

<script>
import View from 'ol/View'
import Map from 'ol/Map'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'

import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import GeoJSON from 'ol/format/GeoJSON'

const data = {
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'Point',
    coordinates: [
        [18.73566,
        49.21506],[
        15.83566,
        49.21506]
    ]
  }
}

export default {
  name: 'Map',
  components: {},
  props: {
    location: {
      type: Object,
      required: true
    }
  },
  mounted () {
    // a feature (geospatial object) is created from the GeoJSON
    const feature = new GeoJSON().readFeature(data, {
      // this is required since GeoJSON uses latitude/longitude,
      // but the map is rendered using “Web Mercator”
      featureProjection: 'EPSG:3857'
    })

    // a new vector layer is created with the feature
    const vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: [feature]
      })
    })
    // this is where we create the OpenLayers map
    new Map({
      // the map will be created using the 'map-root' ref
      target: this.$refs['map-root'],
      layers: [
        // adding a background tiled layer
        new TileLayer({
          source: new OSM() // tiles are served by OpenStreetMap
        }),
        vectorLayer
      ],
      // the map view will initially show the whole world
      view: new View({
        zoom: 0,
        center: [18.73566, 49.21506],
        constrainResolution: true
      })
    })
  }
}
</script>
