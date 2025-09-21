const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const sumOfBlogLikes = (sum, blog) => sum + blog.likes

  return blogs.length === 0 
    ? 0
    : blogs.reduce(sumOfBlogLikes, 0)
}

const favouriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  const pickMostLiked = (mostLiked, blog) => {
    return blog.likes > mostLiked.likes
            ? blog
            : mostLiked
  }

  return blogs.reduce(pickMostLiked, blogs[0])
}

module.exports = { dummy, totalLikes, favouriteBlog }