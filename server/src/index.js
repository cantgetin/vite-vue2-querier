const express = require("express");
const cors = require("cors");
const app = express()
const port = 3080
const db = require('./querries/querries2')

app.use(express.json());
app.use(cors());

app.get('/outEcp', db.outEcp)
app.get('/orgTypeNumber', db.orgTypeNumber)
app.get('/orgTypes', db.orgTypes)
app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
  })

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})