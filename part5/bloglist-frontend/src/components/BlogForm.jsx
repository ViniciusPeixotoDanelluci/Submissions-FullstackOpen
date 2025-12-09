import { useState } from 'react'
import blogService from '../services/blogs'

const BlogForm = ({ showNotification }) => {
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

    blogService.create(blogObject).then((returnedBlog) => {
      setNewTitle('')
      setNewAuthor('')
      setNewUrl('')
      showNotification(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`, false)
    }).catch((exception) => {
      showNotification(exception.response.data, true)
      console.log(exception.response.data)
    })
  }
  return ( 
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
  )
}

export default BlogForm