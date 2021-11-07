require('dotenv').config
const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const port = process.env.PORT || 3000

const contractorRoutes = require('./routes/contractors')
const materialRoutes = require('./routes/materials')
const attendanceRoutes = require('./routes/attendances')
const roleRoutes = require('./routes/roles')
const checkoutRoutes = require('./routes/checkouts')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// app.get('/', (req, res) => {
//   res.json({ info: 'Tuzimbe API' })
// })

app.use((req, res, next)=>{
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Acccess-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  if (req.method === 'OPTIONS'){
      res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, PATCH, DELETE')
      return res.status(200).json({})
  }
  next()
})

app.use('/contractors', contractorRoutes)
app.use('/materials', materialRoutes)
app.use('/attendances', attendanceRoutes)
app.use('/roles', roleRoutes)
app.use('/checkouts', checkoutRoutes)

app.use((req, res, next)=>{
  const error = new Error('Not found')
  error.status= 404
  next(error)
})

app.use((error, req, res, next)=>{
  res.status(error.status || 500)
  res.json({
      message: error.message,
      error
  })
})

app.listen(port, () => {
  console.log(` Tuzimbe Server running on port ${port}`)
})
