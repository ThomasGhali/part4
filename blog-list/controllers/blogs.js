const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})

  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)

  if (blog.title === undefined || blog.url === undefined) {
    return response.status(400).json({ error: 'title & url required' })
  }

  if (blog.likes === undefined) {
    blog.likes = 0
  }

  const result = await blog.save()
  response.status(201).json(result)
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