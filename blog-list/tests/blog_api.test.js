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

describe('blog is added', () => {
  test('if content is valid', async () => {
    const newBlogObj = {
      'title': 'A visit to Toronto',
      'author': 'Thomas Ghali',
      'url': 'www.demo-url.com',
      'likes': 3
    }

    await api
      .post('/api/blogs')
      .send(newBlogObj)
      .expect(201)

    const endBlogsInDb = await blogsInDb()

    assert(endBlogsInDb.find(b => b.title === 'A visit to Toronto'))
  })

  test('with it\'s "likes" default to 0 if not provided', async () => {
    const newBlogObj = {
      'title': 'A visit to Toronto',
      'author': 'Thomas Ghali',
      'url': 'www.demo-url.com'
    }

    await api
      .post('/api/blogs')
      .send(newBlogObj)
      .expect(201)

    const endBlogsInDb = await blogsInDb()

    const newBlogInDb = endBlogsInDb.find(b => b.title === 'A visit to Toronto')

    assert.strictEqual(newBlogInDb.likes, 0)
  })

  test('unless its title is missing: 400 bad request', async () => {
    const newBlogObj = {
      'author': 'Thomas Ghali',
      'url': 'www.demo-url.com',
      'likes': 3
    }

    await api
      .post('/api/blogs')
      .send(newBlogObj)
      .expect(400)
  })

  test('unless its url is missing: 400 bad request', async () => {
    const newBlogObj = {
      'title': 'A visit to Toronto',
      'author': 'Thomas Ghali',
      'likes': 3
    }

    await api
      .post('/api/blogs')
      .send(newBlogObj)
      .expect(400)
  })
})

after(async () => {
  await mongoose.connection.close()
})