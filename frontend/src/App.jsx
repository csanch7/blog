import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Notification from './components/Notification'
import Creation from './components/Creation'
import loginService from './services/login'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState('')


  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])


  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      setUser(user)
      blogService.setToken(user.token)
      setUsername('')
      setPassword('')
    } catch {
      setMessage('wrong username or password')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const createBlog = blogObject => {
    blogService.create(blogObject).then(returnedBlog => {
      setBlogs(blogs.concat(returnedBlog))
    })

    setMessage(`a new blog: ${blogObject.title} by ${blogObject.author} added`)
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const blogLike = id => {
    const blog = blogs.find(blog => blog.id === id)
    const updatedBlog = { ...blog, likes: blog.likes + 1, user: user }
    blogService.update(id, updatedBlog).then(() => {
      setBlogs(blogs.map(blogg => (blogg.id === id ? updatedBlog : blogg)))


    })
    setMessage(null)


  }
  const handleDelete = (id) => {
    const blog = blogs.find(b => b.id === id)
    const message = `Are you sure you want to delete ${blog.title} by ${blog.author}?`
    if (window.confirm(message)){
      blogService.remove(id)
        .then(response => {
          console.log(response, 'promise fulfilled')
          setBlogs(blogs.filter(blog => blog.id !== id))
        })}
  }

  const blogForm = () => (
    <Togglable buttonLabel="create blog">
      <BlogForm
        createBlog={createBlog}

      />

    </Togglable>
  )
  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <label>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  )

  const handleLogout = () => {
    window.localStorage.clear()
    setUser(null)
  }

  if (user === null) {
    return (
      <div>
        <Notification message={message} />
        <h2>Log in to application</h2>

        {!user && loginForm()}

      </div>
    )
  }
  return (
    <div>
      <Notification message={message} />
      <h2>blogs</h2>
      {!user && loginForm()}
      {user && (
        <div>

          <p>{user.name} logged in</p><button onClick={handleLogout}>logout</button>
          <Creation blogForm={blogForm()} />
          {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
            <Blog key={blog.id} blog={blog} blogLiked={() => blogLike(blog.id)} deleteBlog={() => handleDelete(blog.id)}/>
          )}
        </div>
      )}

    </div>
  )
}

export default App