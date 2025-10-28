const dummy = (blogs) => {
  // ...
  return 1
}

const totalLikes = (blogs) =>
{
  const reducer = (sum, item) => {
    return sum + item.likes
  }

  return blogs.length === 0
    ? 0
    : blogs.reduce(reducer, 0)
}
const favoriteBlog = (blogs) =>
{
  var top = blogs[0]
  for (let index = 0; index < blogs.length-1; index++) {
    const element = blogs[index]
    if (element.likes > top.likes){
      top = element
    }
  }
  return top
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}