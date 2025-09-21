require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const app = express()
const notesRouter = require('./controllers/blogs')


const mongoUrl = process.env.MONGODB_URI
mongoose.connect(mongoUrl)

app.use(express.json())

app.use('/api/blogs', notesRouter)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})