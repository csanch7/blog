import { useState, useEffect, use } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Creation from './components/Creation'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import { useDispatch, useSelector } from 'react-redux'
import { initializeBlogs, likeBlog, appendBlog, deleteBlog } from './reducers/blogReducer'
import { addNotification } from './reducers/notificationReducer'
import { loginUser, logoutUser, initializeUser } from './reducers/userReducer'
import userService from './services/users'
import blogService from './services/blogs'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useParams,
  useMatch,
  useNavigate,
} from 'react-router-dom'



const Menu = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)
  const handleLogout = () => {
    dispatch(logoutUser())
  }
  const padding = {
    paddingRight: 5,
    backgroundColor: 'lightgrey',
    padding: 10,
  }
  return (
    <div>
      <Link style={padding} to="/">
        blogs
      </Link>
      <Link style={padding} to="/users">
        users
      </Link>
      {user && (
        <>
          <b style={padding}>{user.name} logged in</b>
          <button style={padding} onClick={handleLogout}>logout</button>
        </>
      )}
    </div>
  )
}

const BlogView = ({ blog }) => {

  const dispatch = useDispatch()
  const blogs = useSelector((state) => state.blogs)
  const blogLike = (id) => {
    const blog = blogs.find((b) => b.id === id)
    dispatch(likeBlog(blog))
  }

  if (!blog) return null
  return (
    <div>
      <h2>{blog.title} by {blog.author}</h2>
      <div><a href={blog.url}>{blog.url}</a></div>
      <div>
        {blog.likes} likes
        <button onClick={() => blogLike(blog.id)}>like</button>
      </div>
      <div>added by {blog.user.name}</div>
    </div>
  )
}

const User = ({ user }) => {
  if (!user) return null

  return (
    <div>
      <h2>{user.username}</h2>
      <h3>Added blogs</h3>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}
const Blogs = () => {
  const style = {
    marginBottom: 10,
    padding: 10,
    border: 'solid',
    borderWidth: 1,
    borderRadius: 5
  }
  const dispatch = useDispatch()
  const blogs = useSelector((state) => state.blogs)
  const blogsCopy = [...blogs]
  const createBlog = (blogObject) => {
    dispatch(appendBlog(blogObject))
    dispatch(
      addNotification(
        `a new blog ${blogObject.title} by ${blogObject.author} added`,
        5
      )
    )
  }

  const blogLike = (id) => {
    const blog = blogs.find((b) => b.id === id)
    dispatch(likeBlog(blog))
  }


  const handleDelete = (id) => {
    const blog = blogs.find((b) => b.id === id)
    const message = `Are you sure you want to delete ${blog.title} by ${blog.author}?`
    if (window.confirm(message)) {
      dispatch(deleteBlog(id))
    }
  }

  const blogForm = () => (
    <Togglable buttonLabel="create blog">
      <BlogForm createBlog={createBlog} />
    </Togglable>
  )
  return (
    <div>
      <Creation blogForm={blogForm()} />
      {[...blogsCopy]
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <p style={style}><Link key={blog.id} to={`/blogs/${blog.id}`}>{blog.title}</Link></p>
        ))}
    </div>
  )
}


const Users = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    async function fetchUsers() {
      setUsers(await userService.getAll())
    }
    fetchUsers()
  }, [])


  return (
    <div>
      <h2>Users</h2>

      <table>
        <thead>
          <tr>
            <th></th>
            <th>Blogs Created</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td><Link to={`/users/${user.id}`}>{user.username}</Link></td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

}

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [users, setUsers] = useState([])
  const [blogs, setBlogs] = useState([])



  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)

  useEffect(() => {
    dispatch(initializeUser())
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    userService.getAll().then(u => setUsers(u))
    blogService.getAll().then(b => setBlogs(b))
  }, [])


  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      dispatch(loginUser(username, password))
      setUsername('')
      setPassword('')
    } catch {
      dispatch(addNotification('wrong username or password', 5))
    }
  }

  const handleLogout = () => {
    dispatch(logoutUser())
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )


  const match = useMatch('/users/:id')
  const selectedUser = match
    ? users.find(u => u.id === match.params.id)
    : null


  const blogMatch = useMatch('/blogs/:id')
  const selectedBlog = blogMatch
    ? blogs.find(b => b.id === blogMatch.params.id)
    : null


  return (
    <div>
      <Notification />
      <Menu />
      <h2>blog app</h2>

      {!user && loginForm()}


      <Routes>
        <Route path="/" element={<Blogs />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<User user={selectedUser} />} />
        <Route path="/blogs/:id" element={<BlogView blog={selectedBlog} />} />
      </Routes>
    </div>
  )
}

export default App
