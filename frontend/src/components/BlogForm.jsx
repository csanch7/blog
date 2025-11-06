import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl
    })
  }
  return (
    <form onSubmit={addBlog}>
      <label>
                title:
        <input value={newTitle} onChange={event => {
          setNewTitle(event.target.value)
        }} placeholder='Title Here' />
      </label><br />
      <label>
                author:
        <input value={newAuthor} onChange={event => {
          setNewAuthor(event.target.value)
        }} placeholder='Author Here'/>
      </label><br />
      <label>
                url:
        <input value={newUrl} onChange={event => {
          setNewUrl(event.target.value)
        }} placeholder='Url Here'/>
      </label><br />
      <button type="submit">save</button>
    </form>
  )
}

export default BlogForm