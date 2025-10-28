const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: "Kojima",
    author: "Jorges Bens",
    url: "http://www.naji.com",
    likes: 2
  },  
  {
    title: "Kojima",
    author: "Jorges Bens",
    url: "http://www.naji.com",
    likes: 7
  },
]

const nonExistingId = async () => {
  const blog = new Blog({ url: "http://www.naji.com" })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb
}