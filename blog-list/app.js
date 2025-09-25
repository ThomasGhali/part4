require('dotenv').config()
const config = require('./utils/config')
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const notesRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const middleware = require('./utils/middleware')

const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl)

app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/blogs', notesRouter)
app.use('/api/users', usersRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app