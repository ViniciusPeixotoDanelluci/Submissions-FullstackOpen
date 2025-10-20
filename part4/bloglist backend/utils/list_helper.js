const dummy = (blogs) => {
  return blogs.length
}

const totalLikes = (blogs) => {
  if (Array.isArray(blogs)) {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
  } 
  //return blogs.likes
}

module.exports = {
  dummy,
  totalLikes,
}