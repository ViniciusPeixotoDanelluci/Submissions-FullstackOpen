import React, { useState } from 'react'
import Togglable from './Togglable'
import blogService from '../services/blogs'

const Blog = ({ blog, user, onDelete }) => {
  const [_likes, setLikes] = useState(blog.likes)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const likeBlog = async () => {
    blog.likes += 1
    await blogService.update(blog.id, blog)
    setLikes(blog.likes)
  }

  const deleteSelf = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      await blogService.deleteBlog(blog.id)
      onDelete(blog.id)
    }
  }
  //// TENHO QUE ARRUMAR A NOTIFICAÇÃO NÃO SENDO VERMELHA SE EU COLOCO O PASSWORD OU USERNAME ERRADO (EXERCICIO 5.4)

  //// o blog ADICIONADO PELO USUARIO NÃO APARECE LOGO DE CARA
  return (
    <div style={blogStyle}>
      <div>
        {blog.title}
        <Togglable buttonLabel="view">
          <div>
            {blog.url}
          </div>
          <div>
            {blog.likes}
            <button onClick={likeBlog}>like</button>
          </div>
          <div>
            {blog.user.username}
          </div>
          {user && user.username === blog.user.username && (
            <button onClick={deleteSelf}>remove</button>
          )}
        </Togglable>
      </div>
    </div>
  )}

export default Blog