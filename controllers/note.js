const notesRouter = require('express').Router()
const Note = require('../models/note')

notesRouter.get('/', (req, res) => {
  Note.find({}).then((notes) => {
    res.json(notes)
  })
})

notesRouter.get('/:id', (req, res) => {
  Note.findOne({ _id: req.params.id }).then((note) => {
    if (note) {
      res.json(note)
    } else {
      res.status(404).end()
    }
  })
})

notesRouter.post('/', (req, res, next) => {
  const note = new Note(req.body)
  note
    .save()
    .then((result) => res.json(result))
    .catch((err) => next(err))
})

notesRouter.put('/:id', (req, res, next) => {
  Note.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((note) => res.json(note))
    .catch((err) => next(err))
})

notesRouter.delete('/:id', (req, res, next) => {
  Note.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
    .catch((err) => next(err))
})

module.exports = notesRouter
