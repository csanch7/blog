const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
  let blogs = await Blog.find({})
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  const body = request.body

  if (body.title === undefined || body.url === undefined){
    response.status(400).end()
  }
  if (body.likes === undefined){
    body.likes = 0
  }
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  })


  const savedNote = await blog.save()
  response.status(201).json(savedNote)


})

blogRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
  const { likes } = request.body
  const blog = await Blog.findById(request.params.id)
  if (!blog){
    return response.status(404).end()
  }
  blog.likes = likes
  const updatedBlog = await blog.save()
  return response.json(updatedBlog)
})

module.exports = blogRouter