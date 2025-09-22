const Blog = require('../models/blog')

const initialBlogs = [
  {
    'title': 'demo title 1',
    'author': 'demo author 1',
    'url': 'demo url 1',
    'likes': 5
  },
  {
    'title': 'demo title 2',
    'author': 'demo author 2',
    'url': 'demo url 2',
    'likes': 10
  },
  {
    'title': 'demo title 3',
    'author': 'demo author 3',
    'url': 'demo url 3',
    'likes': 15
  }
]

const blogsInDb = async () => {
  const blogsReturned = await Blog.find({})
  return blogsReturned.map(b => b.toJSON())
}

module.exports = { blogsInDb, initialBlogs }