<template id="status-car">
    <div class="container">
        <div class="container-inputs">
            <h1>Car status</h1>
            <form>
                <label for="generateCars">Počet vygenerovaných vozidiel (100-500):</label><br/><br/>
                <input type="text" v-model="totalCarsToGenerate"><br/><br/>
                <input type="button" value="Generovať" v-on:click="getCars">
            </form>
        </div>
        <br>
        <div class="container-summary">
            <h1>Sumarizácia</h1>
            <p>Priemerná rýchlosť: {{ averageCarsSpeed }}</p>
            <div style="display: inline-block"><div style="background-color: green" class="summary-color"></div> {{ totalGreenCars }}</div>
            <div style="display: inline-block"><div style="background-color: yellow" class="summary-color"></div> {{ totalYellowCars }}</div>
            <div style="display: inline-block"><div style="background-color: red" class="summary-color"></div> {{ totalRedCars }}</div>
        </div>
        <br>
        <div class="container-map">
          <Map :location="carsList.location"/>
        </div>
        <br>
        <div class="container-carsTable">
            <table class="carsTable">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Speed</th>
                        <th>Name</th>
                        <th colspan="2">Location (Lon / Lat)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(vehicle, index) in carsList" :key="index">
                        <td>{{ vehicle.id }}</td>
                        <td :style="{
                            'background-color': vehicle.speed < 50 ?
                                'green' : (vehicle.speed < 80 ?
                                'orange' : 'red')
                            }">{{ vehicle.speed }} km/h</td>
                        <td>{{ vehicle.name }}</td>
                        <td>{{ vehicle.loc.lon }}</td>
                        <td>{{ vehicle.loc.lat }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import Map from './Map.vue'

Vue.use(Toast, {
  transition: 'Vue-Toastification__bounce',
  maxToasts: 20,
  newestOnTop: true
})

export default{
  name: 'CarStatus',
  components: {
    Map
  },
  data () {
    return {
      totalCarsToGenerate: 100,
      carsList: [],
      averageCarsSpeed: 0,
      totalGreenCars: 0,
      totalYellowCars: 0,
      totalRedCars: 0
    }
  },
  methods: {
    async getCars () {
      try {
        if (this.totalCarsToGenerate < 100 || this.totalCarsToGenerate > 500) {
          this.createNotification()
        }
        await fetch('http://localhost:8081/getcars?generateCars=' + this.totalCarsToGenerate)
          .then(response => response.json())
          .then(data => (this.carsList = data.message))

        this.averageCarsSpeed = this.getAverageSpeed() / this.carsList.length + ' km/h'

        this.getGreenSpeed()
        this.getYellowSpeed()
        this.getRedSpeed()
      } catch (e) {
        if (this.totalCarsToGenerate < 100 || this.totalCarsToGenerate > 500) console.log('ok')
      }
    },
    getAverageSpeed () {
      return this.carsList.reduce((accumulator, currentValue) => accumulator + currentValue.speed, 0)
    },
    getGreenSpeed () {
      this.totalGreenCars = this.getInRangeSpeed(0, 49)
    },
    getYellowSpeed () {
      this.totalYellowCars = this.getInRangeSpeed(50, 80)
    },
    getRedSpeed () {
      this.totalRedCars = this.getInRangeSpeed(81, 100)
    },
    getInRangeSpeed (begin, end) {
      let tmp = 0
      this.carsList.reduce((_, currentValue) => {
        if (currentValue.speed >= begin && currentValue.speed <= end) {
          tmp += 1
        }
      }, 0)
      return tmp
    },
    startInterval () {
      setInterval(() => {
        this.getCars()
      }, 30000)
    },
    createNotification () {
      this.$toast.info('Počet min-max vozidiel musí byť 100-500', {
        position: 'bottom-left',
        timeout: 5000,
        closeOnClick: true,
        pauseOnFocusLoss: true,
        pauseOnHover: true,
        draggable: true,
        draggablePercent: 0.6,
        showCloseButtonOnHover: false,
        hideProgressBar: true,
        closeButton: 'button',
        icon: true,
        rtl: false
      })
    }
  },
  mounted () {
    this.startInterval()
  }
}
</script>

<style scoped>
/* Container page */
.container {
    background-color: rgb(245, 245, 245);
    min-width: 40em;
    width: 50%;
    margin: auto;
    border: 1px solid black;
    padding: 5px;
}

/* Formular */
.container-inputs {
    border: 1px solid black;
    text-align: center;
    padding: 10px 0
}

/* Summary */
.container-summary {
    border: 1px solid black;
    text-align: center;
    padding: 10px 0
}

.summary-color {
    width: 1em;
    height: 1em;
    display: inline-block;
    border: 1px solid black;
    vertical-align: bottom;
}

/* Map */
.container-map {
    border: 1px solid black;
    text-align: center;
    height: 20em;
}

/* Cars table */
.container-carsTable {
    border: 1px solid black;
}

.carsTable {
    padding: 5px;
}

table {
  border-collapse: collapse;
  width: 100%;
}

th, td {
  text-align: left;
  padding: 8px;
  border: 1px dotted black;
}

tr:nth-child(even) {background-color: #f2f2f2;}
</style>
