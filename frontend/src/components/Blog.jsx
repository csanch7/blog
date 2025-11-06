import { useState } from 'react'

const Blog = ({ blog, blogLiked, deleteBlog }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }


  const toggleVisibility = () => {
    setVisible(!visible)
  }
  return (
    <div style={blogStyle} >
      <div>
        <div>
          {blog.title}
        </div>
        <div>
          {blog.author}
        </div>
        <button onClick={toggleVisibility}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>

      {visible && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes: {blog.likes}
            <button onClick={blogLiked}>like</button>
          </div>
          <div>{blog.user.name}</div>
          <button onClick={deleteBlog}>delete</button>
        </div>
      )}
    </div>
  )
}

export default Blog