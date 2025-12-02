const loginWith = async (page, username, password) => {
  //await page.getByRole('button', { name: 'login' }).click()
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  // open the Togglable form


  // fill out fields using placeholders instead of labels
  await page.getByPlaceholder('Title Here').fill(title)
  await page.getByPlaceholder('Author Here').fill(author)
  await page.getByPlaceholder('Url Here').fill(url)

  // submit
  await page.getByRole('button', { name: 'save' }).click()

  // wait until blog appears to ensure it was created
  await page.getByText(title, { exact: true }).waitFor();
  await page.getByText(author, { exact: true }).waitFor();

}

export { loginWith, createBlog }
