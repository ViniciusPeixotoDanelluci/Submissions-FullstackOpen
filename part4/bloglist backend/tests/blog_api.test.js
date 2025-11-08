const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe('requesting all the blog posts', () => {
  test('all blogs are returned as json', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })
})

describe('requesting a specific blog post', () => {
  test('blog posts have id property instead of _id', async () => {
    const response = await api.get('/api/blogs')

    // The toJSON formatting is in the blog model
    response.body.forEach(blog => {
      assert(blog.id !== undefined)
      assert(blog._id === undefined)
    })
  })
  test('a specific blog can be viewed by its id', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToView = blogsAtStart[0]

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.deepStrictEqual(resultBlog.body, blogToView)
  })
  test('fails with statuscode 404 id is invalid', async () => {
    const invalidId = await helper.nonExistingId()

    await api.get(`/api/blogs/${invalidId}`).expect(404)
  })
})

describe('requesting a new blog post', () => {
  test('a valid blog can be added', async () => {
    const users = await helper.usersInDb()

    const newBlog = {
      title: "Capitães da Areia",
      author: "Jorges Amado",
      url: "http://www.joramado.com.br",
      userId: users[0].id
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const title = blogsAtEnd.map(e => e.title)
    assert(title.includes('Capitães da Areia'))

    assert.deepStrictEqual(blogsAtEnd.map(e => e.title), title)
  })
  test('an invalid blog can not be added', async () => {
    const newBlog = {
      title: "O",
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
  })
})

describe('updating a blog', () => {
  test('succeeds with status 200 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedBlog = {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 1
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const updated = blogsAtEnd.find(b => b.id === blogToUpdate.id)
    assert.strictEqual(updated.likes, blogToUpdate.likes + 1)
  })

  test('fails with status 404 if id is invalid', async () => {
    const invalID = await helper.nonExistingId()
    const updatedBlog = {
      title: "Invalidados: A Serie Divergente",
      author: "Carlos Prestes",
      url: "http://joaquim.com",
      likes: 3
    }

    await api
      .put(`/api/blogs/${invalID}`)
      .send(updatedBlog)
      .expect(404)
  })
})

after(async () => {
  await mongoose.connection.close()
})