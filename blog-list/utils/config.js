require('dotenv').config()

const PORT = process.env.PORT


const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

const SECRET = '1234'

module.exports = {
  MONGODB_URI,
  PORT,
  SECRET
}