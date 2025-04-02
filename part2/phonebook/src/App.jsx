import { useState, useEffect } from 'react'
import fetchPersonData from './services/personData'
import Filter from './components/Filter'
import axios from 'axios'

const PersonForm = ({persons, setPersons}) => {
  const [newPerson, setNewPerson] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    if (newPerson === '' || newNumber === '') {
      alert('Name or number is missing')
      return
    }
  
    const personObject = {
      name: newPerson,
      number: newNumber,
      id: persons.length + 1,
    }
  
    //checks if atleast one element in the array is already in the phonebook
    persons.some(person => person.name === newPerson || person.number === newNumber)
      ? alert(`name or number was added already.`)
      : fetchPersonData.create(personObject).then((returnedPerson) => {
          setPersons(persons.concat(returnedPerson))
          setNewPerson('')
          setNewNumber('')
      }
    )
  }

  const handleNameUpdate = (event) => {
    setNewPerson(event.target.value)
  }

  const handleNumberUpdate = (event) => {
    setNewNumber(event.target.value)
  }

  return ( 
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
  )
}

const Persons = ({ personsToShow }) => { 
  return (
    <ul>
      {personsToShow.map(person => 
        <li key={person.id}>{person.name} {person.number}</li>
      )}
    </ul>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
  /*{ name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  */]) 

  const hook = () => {
    fetchPersonData
      .getAll()
      .then((initialPersons) => {
        setPersons(initialPersons)
    })
  }
  useEffect(hook, [])

  console.log('render', persons.length, 'persons')
  const [filterPerson, setFilterPerson] = useState('')

  const personsToShow = filterPerson
    ? persons.filter(p => p.name.toLowerCase().includes(filterPerson.toLowerCase()))
    : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filterPerson={filterPerson} setFilterPerson={setFilterPerson}/>

      <h2>Add New</h2>
      <PersonForm persons={persons} setPersons={setPersons}/>
      
      <p>Formulario componentizado:</p>
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} />
    </div>
  )
}

export default App