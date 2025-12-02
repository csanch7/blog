import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    voteBlog(state, action) {
      const id = action.payload
      const blog = state.find((b) => b.id === id)
      if (blog) {
        blog.likes += 1
      }
    },
    addBlog(state, action) {
      state.push(action.payload)
    },
    setBlogs(state, action) {
      return action.payload
    },
    removeBlog(state, action){
      state = state.filter((blog) => blog.id !== action.payload)
      return state
    }
  },
})

export const { addBlog, setBlogs, voteBlog, removeBlog } = blogSlice.actions

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const appendBlog = (content) => {
  return async (dispatch) => {
    // check if content is an object, create requires an object
    const newBlog = await blogService.create(content)
    dispatch(addBlog(newBlog))
  }
}


export const likeBlog = (blog) => {
  return async (dispatch) => {
    const newBlog = await blogService.update(blog.id, blog)
    dispatch(voteBlog(newBlog.id))
  }
}

export const deleteBlog = (id) => {
  return async (dispatch) => {
    await blogService.remove(id)
    dispatch(removeBlog(id))

  }
}

export default blogSlice.reducer
