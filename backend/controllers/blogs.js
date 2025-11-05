const blogRouter = require('express').Router()
const Blog = require('../models/blog')


blogRouter.get('/', async (request, response) => {
  let blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})



blogRouter.post('/', async (request, response) => {
  const body = request.body
  const user = request.user

  if (!user) {
    return response.status(400).json({ error: 'UserId missing or not valid' })
  }
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
    likes: body.likes,
    user: user._id
  })


  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)


})

blogRouter.delete('/:id', async (request, response) => {
  const user = request.user
  const userid = user._id

  if (!user) {
    return response.status(400).json({ error: 'UserId missing or not valid' })
  }
  const blog = await Blog.findById(request.params.id)

  if ( blog.user.toString() === userid.toString() ){
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  }

})

blogRouter.put('/:id', async (request, response) => {
  const user = request.user

  const userid = user._id

  if (!user) {
    return response.status(400).json({ error: 'UserId missing or not valid' })
  }
  const { likes } = request.body

  const blog = await Blog.findById(request.params.id)
  if (!blog){
    return response.status(404).end()
  }

  if ( blog.user.toString() === userid.toString() ){
    blog.likes = likes
    const updatedBlog = await blog.save()
    return response.json(updatedBlog)
  }
})

module.exports = blogRouter