const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const sumOfBlogLikes = (sum, blog) => sum + blog.likes

  return blogs.length === 0 
    ? 0
    : blogs.reduce(sumOfBlogLikes, 0)
}

module.exports = { dummy, totalLikes }