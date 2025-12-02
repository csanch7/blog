import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'
import blogService from '../services/blogs';


const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    addUser(state, action) {
      return action.payload
    },
    removeUser(state, action) {
      return null
    },
  },
})

export const { addUser, removeUser } = userSlice.actions



export const loginUser = (username, password) => {
  return async (dispatch) => {
    const user = await loginService.login({ username, password })
    window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
    dispatch(addUser(user))
    blogService.setToken(user.token)
  }
}

export const logoutUser = () => {
  return async (dispatch) => {
    window.localStorage.clear()
    dispatch(removeUser())
  }
}

export const initializeUser = () => {
  return (dispatch) => {
    const saved = window.localStorage.getItem('loggedBlogappUser')
    if (saved) {
      const user = JSON.parse(saved)
      blogService.setToken(user.token)
      dispatch(addUser(user))
    }
  }
}




export default userSlice.reducer
