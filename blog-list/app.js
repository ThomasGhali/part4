const mongoose = require('mongoose')
const config = require('./utils/config')
const express = require('express')
const app = express()
const blogsRouter = require('./controllers/blogs')

mongoose.connect(config.MONGODB_URI)

app.use(express.json())

module.exports = app