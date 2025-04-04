import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [inputValue, setInputValue] = useState('')
  const [searchedNames, setSearchedNames] = useState({})
  const [name, setName] = useState(null)

  useEffect(() => {
    if (name) {
      axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/${name}`)
        .then(response => {
          setSearchedNames(response.data.searchedNames)
        })
    }
  }, [name])

  const handleChange = (e) => {
    const altInputValue = e.target.value
    setInputValue(altInputValue)
  }

  const onSearch = (e) => {
    e.preventDefault()
    setName(inputValue)
  }

  return (
    <>
      <div>
        <form onSubmit={onSearch}>
          country name: <input value={inputValue} onChange={(e) => handleChange(e)} />
          <button type="submit">search: </button>
        </form>
        <pre>
          {JSON.stringify(searchedNames, null, 2)}
        </pre>
      </div>
    </>
  )
}

export default App
