import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '55-18-998992074', id: 1 },
  ]) 
console.log(persons[0].number)
  const [newPerson, setNewPerson] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newPerson,
      number: newNumber,
      id: persons.length + 1,
    }
  
    //checks if atleast one element in the array is already in the phonebook
    persons.some(person => person.name === newPerson)
      ? alert(`${newPerson} was added already.`)
      : (setPersons(persons.concat(nameObject)), setNewPerson(''))

    persons.some(number => number.name === newNumber)
      ? alert(`${newNumber} was added already.`)
      : (setPersons(persons.concat(nameObject)), setNewNumber(''))
  }

  const handleNameUpdate = (event) => {
    setNewPerson(event.target.value)
  }
  const handleNumberUpdate = (event) => {
    setNewNumber(event.target.value)
  }
  return (
    <div>
      <div>Debug: {newPerson} {newNumber}</div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input 
            value={newPerson}
            onChange={handleNameUpdate}
          />
        </div>
        <div>
          number: <input 
            value={newNumber}
            onChange={handleNumberUpdate}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {persons.map(person => 
          <li key={person.id}>{person.name} {person.number}</li>
        )}
      </ul>
    </div>
  )
}

export default App