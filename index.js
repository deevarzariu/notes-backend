require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const Note = require('./models/note')

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)

mongoose.connect(url)

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (req, res) => {
  Note.find({}).then((notes) => {
    res.json(notes)
  })
})

app.get('/api/notes/:id', (req, res) => {
  Note.findOne({ _id: req.params.id }).then((note) => {
    if (note) {
      res.json(note)
    } else {
      res.status(404).end()
    }
  })
})

app.post('/api/notes', (req, res, next) => {
  const note = new Note(req.body)
  note
    .save()
    .then((result) => res.json(result))
    .catch((err) => next(err))
})

app.put('/api/notes/:id', (req, res, next) => {
  Note.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((note) => res.json(note))
    .catch((err) => next(err))
})

app.delete('/api/notes/:id', (req, res, next) => {
  Note.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
    .catch((err) => next(err))
})

app.use((req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
})

app.use((error, req, res, next) => {
  console.error(error)

  next(error)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
