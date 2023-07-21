/*Imports and requires*/
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

/* Inits */
const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

/* Functions */
function getRandomInRange(from, to, fixed) {
    return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
}

function generateCars(newCars){
    let tmp = [];
    for (let i = 0; i < newCars; i++) {
        tmp.push(
            {id: i, speed: getRandomInRange(5, 100, 0), name: i + "-vehicle", loc: {lon: getRandomInRange(49.23841, 49.19171, 5), lat: getRandomInRange(18.67861, 18.79271, 5)}}
        );
    }
    return tmp;
}

/* restAPI */
app.get('/getcars', (req, res) => {
    if (req.query.generateCars < 100 || req.query.generateCars > 500) res.send([{message: -1}]); // Condition gen. cars from 100 to 500

    let cars = generateCars(req.query.generateCars);
    res.send({
        message: cars
    })
})

/* Settings */
app.listen(process.env.PORT || 8081)