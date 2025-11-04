import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Notification from './components/Notification'
import Creation from './components/Creation'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
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
      setBlogs( blogs )
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
    const addBlog = event => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }

    blogService.create(blogObject).then(returnedBlog => {
      setBlogs(blogs.concat(returnedBlog))
      setNewTitle('')
      setNewUrl('')
      setNewAuthor('')
    })

    setMessage(`a new blog: ${blogObject.title} by ${blogObject.author} added`)
    setTimeout(() => {
        setMessage(null)
      }, 5000)
  }

  const handleTitleChange = event => {
    setNewTitle(event.target.value)
  }
  const handleUrlChange = event => {
    setNewUrl(event.target.value)
  }
    const handleAuthorChange = event => {
    setNewAuthor(event.target.value)
  }

    const blogForm = () => (
    <form onSubmit={addBlog}>
      <label>
        title: 
      <input value={newTitle} onChange={handleTitleChange} />
      </label><br />
      <label>
        author:
      <input value={newAuthor} onChange={handleAuthorChange} />
      </label><br />
      <label>
        url:
      <input value={newUrl} onChange={handleUrlChange} />
      </label><br />
      <button type="submit">save</button>
    </form>
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
          {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
        </div>
      )}
      
    </div>
  )
}

export default App