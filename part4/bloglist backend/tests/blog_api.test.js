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

describe('1', () => {
  test('all blogs are returned as json', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })
})

describe('2', () => {
  test('blog posts have id property instead of _id', async () => {
    const response = await api.get('/api/blogs')
    //console.log('Response body:', response.body)

    // The toJSON formatting is in the blog model
    response.body.forEach(blog => {
      assert(blog.id !== undefined)
      assert(blog._id === undefined)
    })
  })
  /*test('a specific blog can be viewed by its id', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToView = blogsAtStart[0]

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.deepStrictEqual(resultBlog.body, blogToView)
  })*/
})

describe('3', () => {
  test('a valid blog can be added', async () => {
    const newBlog = {
      title: "Capitães da Areia",
      author: "Jorges Amado",
      url: "http://www.joramado.com.br",
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






/*
test('a specific number of likes is within the returned blogs', async () => {
  const response = await api.get('/api/blogs')

  const likes = response.body.map(e => e.likes)
  assert(likes.includes(7), true)
})

test('a valid blog can be added ', async () => {
  const newBlog = {
    title: "Ksdgsda",
    author: "Jorges Bens",
    url: "http://www.naji.com",
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  //const likes = blogsAtEnd.map(r => r.likes)
  //assert(likes.includes(15))
})

test('blog without content is not added', async () => {
  const newBlog = {
    title: "K",
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('a blog can be deleted'), async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]
  console.log('Blog start:', blogsAtStart)
  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  const titles = blogsAtEnd.map(r => r.title)
  assert(!titles.includes(blogToDelete.title))

  console.log('Blog End:', blogsAtEnd)
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
}*/

after(async () => {
  await mongoose.connection.close()
})