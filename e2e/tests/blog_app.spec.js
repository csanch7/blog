const { test, describe, expect, beforeEach } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Carl Grimes',
        username: 'carl',
        password: 'grimes'
      }
    })

    await request.post('/api/users', {
      data: {
        name: 'Rick Grimes',
        username: 'rick',
        password: 'grimes'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = page.getByText('login')
    await expect(locator).toBeVisible()
  })

  test('user can log in', async ({ page }) => {
    await loginWith(page, 'carl', 'grimes')
    await expect(page.getByText('Carl Grimes logged in')).toBeVisible()
  })

  test('login fails with wrong password', async ({ page }) => {
    await loginWith(page, 'carl', 'wrong')
    await expect(page.getByText('Carl Grimes logged in')).not.toBeVisible()
  })

  describe('When logged in', () => {
  beforeEach(async ({ page }) => {
    await loginWith(page, 'carl', 'grimes')
    await page.getByRole('button', { name: 'create blog' }).click()
  })

  test('a new blog can be created', async ({ page }) => {
    await createBlog(page, 'my awesome new blog', 'author', 'url')
    await expect(page.getByText('my awesome new blog')).toBeVisible()
  })

  test('a blog can be liked', async ({ page }) => {
    await createBlog(page, 'my awesome new blog', 'author', 'url')
    await page.getByRole('button', { name: 'view' }).click()
    await page.getByRole('button', { name: 'like' }).click()
    await expect(page.getByText('likes: 1')).toBeVisible()
  })

  test('only the blog creator can delete', async ({ page }) => {
  await createBlog(page, 'my awesome new blog', 'author', 'url')
  await page.getByRole('button', { name: 'view' }).click()

  // Override window.confirm to automatically accept the dialog
  page.on('dialog', async dialog => {
    expect(dialog.type()).toBe('confirm')
    expect(dialog.message()).toContain('Are you sure?')
    await dialog.accept()
  })

  // Or, simpler, you can stub window.confirm before clicking:
  await page.evaluate(() => {
    window.confirm = () => true // automatically clicks "OK"
  })

  await page.getByRole('button', { name: 'delete' }).click()

  await expect(page.getByText('my awesome new blog', { exact: true })).not.toBeVisible()
})

test.only('blogs are sorted by number of likes', async ({ page }) => {
  // create blogs properly
  await createBlog(page, 'Blog One', 'author1', 'url1')
  await createBlog(page, 'Blog Two', 'author2', 'url2')



  // expand both
  await page.getByRole('button', { name: 'view' }).nth(0).click()
  await page.getByRole('button', { name: 'view' }).nth(0).click()

  // like Blog Two twice
  await page.getByRole('button', { name: 'like' }).nth(1).click()
  await page.getByRole('button', { name: 'like' }).nth(1).click()
  await page.reload()

  await page.getByText('Blog One', { exact: true }).waitFor();
  await page.getByText('Blog Two', { exact: true }).waitFor();


  

  // verify sorting
  const titles = await page.locator('.blog').allTextContents()
  expect(titles[0]).toContain('Blog Two')
})


  
})
})
/* 
describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('/')
  })

  test('front page can be opened', async ({ page }) => {
    const locator = page.getByText('Notes')
    await expect(locator).toBeVisible()
    await expect(
      page.getByText(
        'Note app, Department of Computer Science, University of Helsinki 2025'
      )
    ).toBeVisible()
  })

  test('user can log in', async ({ page }) => {
    await loginWith(page, 'mluukkai', 'salainen')
    await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
  })

  test('login fails with wrong password', async ({ page }) => {
    await loginWith(page, 'mluukkai', 'wrong')

    const errorDiv = page.locator('.error')
    await expect(errorDiv).toContainText('wrong credentials')
    await expect(errorDiv).toHaveCSS('border-style', 'solid')
    await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

    await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
  })

  describe('when logged in', () => {
  beforeEach(async ({ page }) => {
    await loginWith(page, 'mluukkai', 'salainen')
  })

  test('a new note can be created', async ({ page }) => {
    await createNote(page, 'a note created by playwright', true)
    await expect(page.getByText('a note created by playwright')).toBeVisible()
  })

  describe('and several notes exists', () => {
    beforeEach(async ({ page }) => {
      await createNote(page, 'first note')
      await createNote(page, 'second note')

      await createNote(page, 'third note')
    })

    test('one of those can be made nonimportant', async ({ page }) => {
      await page.pause()
      const otherNoteText = page.getByText('second note')
      const otherNoteElement = otherNoteText.locator('..')
    
      await otherNoteElement.getByRole('button', { name: 'make not important' }).click()
      await expect(otherNoteElement.getByText('make important')).toBeVisible()
    })
  })
}) 
})
 */