const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')


const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  // Create a test user
  const user = new User({
    username: 'testuser',
    name: 'Test User',
    password: 'testpassword'
  })
  await user.save()

  // Optionally, log in to get a token if your API requires it
  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'testuser', password: 'testpassword' })

  // Store the token for use in the tests
  this.token = loginResponse.body.token

  await Blog.insertMany(helper.initialBlogs)
})


test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

after(async () => {
  await mongoose.connection.close()
})

test('all blog have property id', async () => {
  const response = await api.get('/api/blogs')

  const contents = response.body.map(e => e.id)
  const filteredContents = contents.filter(id => id !== undefined)
  assert.strictEqual(response.body.length, filteredContents.length)
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'wowman',
    author: 'wow yes',
    url: 'www.rickgrimes.com',
    likes: 22,
  }
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${this.token}`) // Include the token in the request
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const contents = blogsAtEnd.map(n => n.title)
  assert(contents.includes('wowman'))
})



test('a blog can be added without likes', async () => {
  const newblog = {
    title: 'wowman',
    author: 'wow yes',
    url: 'www.rickgrimes.com',
  }

  await api
    .post('/api/blogs')
    .send(newblog)
    .expect(201)
    .expect('Content-Type', /application\/json/)


  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)


  const contents = blogsAtEnd.find(n => n.title === 'wowman')
  assert.strictEqual(contents.likes, 0)
})

test('a blog cannot be added without a title or url', async () => {
  const newblog = {
    url: 'www.rickgrimes.com'
  }

  await api
    .post('/api/blogs')
    .send(newblog)
    .expect(400)

})

test('a blog can be updated', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogsToView = blogsAtStart[0]
  const updatedBlog = {
    likes:88
  }

  await api
    .put(`/api/blogs/${blogsToView.id}`)
    .send(updatedBlog)
    .expect(200)

  const blogsAtEnd = await helper.blogsInDb()
  const content = blogsAtEnd.find(n => n.id === blogsToView.id)
  assert.strictEqual(content.likes, 88)
})
