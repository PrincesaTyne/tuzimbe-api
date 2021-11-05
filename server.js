require('dotenv').config

const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)

app.get('/', (req, res) => {
  res.json({ info: 'Tuzimbe API' })
})

app.listen(port, () => {
  console.log(` Tuzimbe Server running on port ${port}`)
})
