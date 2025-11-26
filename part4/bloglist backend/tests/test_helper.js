const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'Kojima',
    author: 'Jorges Bens',
    url: 'http://www.naji.com',
    likes: 2,
    user: '6925f9a706db7d41a2bf89f0'
  },
  {
    title: 'Kouma',
    author: 'Jorges Bens',
    url: 'http://www.naji.com',
    likes: 7,
    user: '6925f9a706db7d41a2bf89f0'
  },
]

const nonExistingId = async () => {
  const blog = new Blog(
    {
      title: 'Perdera',
      author: 'Seu Tonho',
      url: 'http://www.orson.com',
      likes: 9,
      user: '6925f9a706db7d41a2bf89f0'
    }
  )
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find()
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find()
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
}