const blogsRouter = require('express').Router()
const config = require('../utils/config')
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1, id: 1 })

  // await Blog.deleteMany({})
  // await User.deleteMany({})

  response.json(blogs)
})

const extractToken = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const token = extractToken(request)
  const decodedToken = jwt.verify(token, config.SECRET)

  if (!decodedToken.id) return response.status(401).json({ error: 'invalid token' })

  const user = await User.findById(decodedToken.id)

  if (!user) {
    return response.status(400).json({ error: 'no users found in database' })
  }

  if (body.title === undefined || body.url === undefined) {
    return response.status(400).json({ error: 'title & url required' })
  }

  if (body.likes === undefined) {
    body.likes = 0
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const blogId = request.params.id

  await Blog.findByIdAndDelete(blogId)
  response.status(204).end()
})

blogsRouter.put('/:id', async (req, res) => {
  const blogId = req.params.id
  const updatedBlog = await Blog.findByIdAndUpdate(
    blogId,
    req.body,
    { new: true, runValidators: true, context: 'query' }
  )

  if (!updatedBlog) return res.status(404).end()

  res.json(updatedBlog)
})

module.exports = blogsRouter