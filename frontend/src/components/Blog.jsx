import { useState } from "react";
import { Link } from "react-router-dom";

const Blog = ({ blog }) => {
  console.log(blog);
  
  if (!blog) {
    return null;
  }
  const [visible, setVisible] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const toggleVisibility = () => {
    setVisible(!visible);
  };
  return (
    <div className="blog" style={blogStyle}>
      <div>
        <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
        <div>{blog.author}</div>
        <button onClick={toggleVisibility}>{visible ? "hide" : "view"}</button>
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
  );
};

export default Blog;
