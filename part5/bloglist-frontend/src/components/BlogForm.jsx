import { useState } from 'react'
import blogService from '../services/blogs'

///// EU NÃO SOU DESLOGADO DEPOIS QUE O TOKEN ESPIRA, RESOLVER ISSO
///// AINDA NÃO PESQUISEI O QUÃO VULNERAVEL SÃO CROSS XSS ATTACKS, E TENHO QUE LER O ARTIGO DA GOOGLE SOBRE SPAZ
const BlogForm = ({
  showNotification,
  blogRef,
  setBlogs,
  currentBlogs,
  currentUser
}) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()

    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }

    blogRef.current.toggleVisibility()

    blogService.create(blogObject).then((returnedBlog) => {
      const blogWithUser = { ...returnedBlog, user: { username: currentUser } }
      setNewTitle('')
      setNewAuthor('')
      setNewUrl('')
      setBlogs(currentBlogs.concat(blogWithUser))
      showNotification(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`, false)
    }).catch((exception) => {
      showNotification(exception.response.data, true)
      console.log(exception.response.data)
    })
  }
  return (
    <div>
      <h2>create a new blog</h2>
      <form onSubmit={addBlog}>
        <div>
          <label>
            title <input
              value={newTitle}
              onChange={({ target }) => setNewTitle(target.value)}/>
          </label>
        </div>
        <div>
          <label>
            author: <input
              value={newAuthor}
              onChange={({ target }) => setNewAuthor(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            url: <input
              value={newUrl}
              onChange={({ target }) => setNewUrl(target.value)}
            />
          </label>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  )
}

export default BlogForm