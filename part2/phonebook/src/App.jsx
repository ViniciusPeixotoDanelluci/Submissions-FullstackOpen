import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', id: 1 },
  ]) 

  const [newPerson, setNewPerson] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newPerson,
      id: persons.length + 1,
    }

    //checks if atleast one element in the array is already in the phonebook
    persons.some(person => person.name === newPerson)
      ? alert(`${newPerson} was added already.`)
      : (setPersons(persons.concat(nameObject)), setNewPerson(''))
  }

  const handleNoteChange = (event) => {
    setNewPerson(event.target.value)
  }

  return (
    <div>
      <div>debug: {newPerson}</div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input 
            value={newPerson}
            onChange={handleNoteChange}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {persons.map(person => 
          <li key={person.id}>{person.name}</li>
        )}
      </ul>
    </div>
  )
}

export default App