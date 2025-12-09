import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notif, setNotif] = useState(null,Boolean)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)

  const hook = () => {
    blogService
      .getAll()
      .then(blogs =>
        setBlogs(blogs)
    )  
  }
  useEffect(hook, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const showNotification = (message, isErr) => {
    setNotif({message, isErr})
    console.log('Notification:', message, notif, isErr)
    setTimeout(() => {
      setNotif(null)
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService
        .login({ 
          username, password 
        })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      ) 
      blogService.setToken(user.token)
      setUser(user) // Token
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotif(exception.response.data.error)
      setTimeout(() => {
        setNotif(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <label>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  )

  const handleLogout = () => {
    window.localStorage.clear()
    setUser(null)
    window.location.reload()
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification notif={notif} />
        {loginForm()}
      </div>
    )
  }
  
  return (
    <div>
      <h2>blogs</h2>
      <Notification notif={notif} />

      <p>{user.username} logged in <button onClick={handleLogout}>logout</button></p>

      <h2>Create New</h2>
      <BlogForm showNotification={showNotification} />
      {console.log('socorro',notif)}

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App