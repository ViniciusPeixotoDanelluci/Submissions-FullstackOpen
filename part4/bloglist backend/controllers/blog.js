const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

//
// Lembrar de tirar o morgan no final da parte
// se ele realmente não for mais usado
//

blogsRouter.get('/', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
})

blogsRouter.get('/:id', (request, response, next) => {
  Blog.findById(request.params.id)
    .then((blog) => {
      if (blog) {
        response.json(blog)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})

blogsRouter.post('/', (request, response, next) => {
  const body = request.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
  })

  blog.save()
    .then((savedBlog) => {
      response.status(200).json(savedBlog)
    })
    .catch((error) => next(error))
})

blogsRouter.delete('/:id', (request, response, next) => {
  Blog.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

blogsRouter.put('/:id', (request, response, next) => {
  const { title, author, url, likes } = request.body
  const opts = { new: true, runValidators: true }

  Blog.findByIdAndUpdate(request.params.id, { title, author, url, likes }, opts)
    .then(entry => {
      if (!entry) {
        return response.status(404).end()
      }
      response.json(entry)
    })
    .catch(error => next(error))
})

module.exports = blogsRouter