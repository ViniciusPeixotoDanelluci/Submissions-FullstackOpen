import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [inputValue, setInputValue] = useState('')
  const [searchedNames, setSearchedNames] = useState({})
  const [name, setName] = useState(null)

  useEffect(() => {
    if (name) {
      axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/${name}/`)
        .then(response => {
          console.log(response.data.searchedNames)
          setSearchedNames(response.data.searchedNames)
        })
    }
  }, [name])

  const handleChange = (event) => {
    const altInputValue = event
    setInputValue(altInputValue)
  }

  const onSearch = (event) => {
    event.preventDefault()
    setName(inputValue)
  }

  return (
    <>
      <div>
        <form onSubmit={onSearch}>
          country name: <input value={inputValue} onChange={e => handleChange(e.target.value)} />
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
