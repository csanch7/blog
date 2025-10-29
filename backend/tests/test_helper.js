const Blog = require('../models/blog')

const initialBlogs = [
  {
    'title': 'nice',
    'author': 'wow yes',
    'url': 'www.rickgrimes.com',
    'likes': 0
  },
  {
    'title': 'cool',
    'author': 'sandy',
    'url': 'www.rickgrimes.com',
    'likes': 2
  },
  {
    'title': 'great',
    'author': 'todd',
    'url': 'www.rickgrimes.com',
    'likes': 78
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'nonexsistant', author: 'nonexistant', url:'non existant', likes:22 })
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
