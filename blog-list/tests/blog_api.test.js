const { test, after, describe, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const { initialBlogs, blogsInDb } = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = initialBlogs
    .map(blog => new Blog(blog).save())

  await Promise.all(blogObjects)
})

describe.only('blogs are returned', () => {
  test('as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('with right amount', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, 3)
  })

  test('with "id" keys not "_id"', async () => {
    const blogs = await blogsInDb()

    assert(blogs[0].id)
    assert(!blogs[0]._id)
  })
})

after(async () => {
  await mongoose.connection.close()
})