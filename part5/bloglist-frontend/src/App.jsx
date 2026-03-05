import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notif, setNotif] = useState(null, Boolean)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()

  const hook = () => {
    blogService.getAll().then(blogs => {
      const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)
      setBlogs(sortedBlogs)
    })
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
    setNotif({ message, isErr })
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

      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      showNotification('wrong username or password', true)
    }
  }

  const loginForm = () => (
    <Togglable buttonLabel='login'>
      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}
      />
    </Togglable>
  )

  const blogForm = () => (
    <Togglable buttonLabel="new blog" ref={blogFormRef}>
      <BlogForm
        showNotification={showNotification}
        blogRef={blogFormRef}
        setBlogs={setBlogs}
        currentBlogs={blogs}
        currentUser={user.username}
      />
    </Togglable>
  )

  const handleLogout = () => {
    window.localStorage.clear()
    setUser(null)
    window.location.reload()
  }

  const handleBlogDelete = (id) => {
    setBlogs(blogs.filter(blog => blog.id !== id))
  }

  return (
    <div>
      {user === null ?
        <div>
          <h2>Log in to application</h2>
          <Notification notif={notif} />
          {loginForm()}
        </div> :
        <div>
          <h2>blogs</h2>
          <Notification notif={notif} />

          <p>{user.username} logged in <button onClick={handleLogout}>logout</button></p>

          <h2>Create New</h2>
          {blogForm()}
          {blogs.map(blog =>
            <Blog
              key={blog.id}
              blog={blog}
              user={user}
              onDelete={handleBlogDelete}
            />
          )}
        </div>
      }
    </div>
  )
}

export default App