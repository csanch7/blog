import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogForm from './BlogForm'

test('renders content', () => {
  const blog = {
    title: 'hi guys',
    author: 'author',
    url: 'url'
  }

  render(<Blog blog={blog} />)

  expect(screen.getByText('hi guys')).toBeInTheDocument()
  expect(screen.getByText('author')).toBeInTheDocument()

  // toHaveTextContent
  expect(screen.queryByText('url')).not.toBeInTheDocument()
  expect(screen.queryByText('likes: ')).not.toBeInTheDocument()

})

test('clicking the view button shows url and likes', async () => {
  const blog = {
    title: 'hi guys',
    author: 'author',
    url: 'url',
    likes: 5,
    user: {
      name: 'carl grimes'
    }
  }

  render(<Blog blog={blog}  />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)
  const url = screen.getByText('url')
  const likes = screen.getByText('likes: 5')
  expect(url).toHaveTextContent('url')
  expect(likes).toHaveTextContent('likes: 5')
})

test('clicking the like button twice calls event handler twice', async () => {
  const blog = {
    title: 'hi guys',
    author: 'author',
    url: 'url',
    likes: 5,
    user: {
      name: 'carl grimes'
    }
  }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} blogLiked={mockHandler} />)

  const user = userEvent.setup()
  const view = screen.getByText('view')
  await user.click(view)
  const button = screen.getByText('like')
  await user.click(button)
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)
})


test('blog form is created', async () => {

  const mockHandler = vi.fn()

  render(<BlogForm createBlog={mockHandler} />)



  const title = screen.getByPlaceholderText('Title Here')
  const author = screen.getByPlaceholderText('Author Here')
  const url = screen.getByPlaceholderText('Url Here')
  const sendButton = screen.getByText('save')

  await userEvent.type(title, 'title')
  await userEvent.type(author, 'author')
  await userEvent.type(url, 'url')
  await userEvent.click(sendButton)


  expect(mockHandler.mock.calls).toHaveLength(1)
  expect(mockHandler.mock.calls[0][0].title).toBe('title')
  expect(mockHandler.mock.calls[0][0].author).toBe('author')
  expect(mockHandler.mock.calls[0][0].url).toBe('url')

})
