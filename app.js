const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const logger = require('./utils/logger')

const noteRouter = require('./controllers/note')
const { MONGODB_URI } = require('./utils/config')
const {
  errorHandler,
  unknownEndpoint,
  requestLogger,
} = require('./utils/middleware')

const app = express()

mongoose.set('strictQuery', false)

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))
app.use(requestLogger)

app.use('/api/notes', noteRouter)

app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app
