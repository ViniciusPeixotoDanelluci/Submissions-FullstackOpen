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
  
    const existingPerson = persons.find(person => person.name === newPerson)

    if (existingPerson) {
      // Ask for confirmation to update the number
      if (window.confirm(`${newPerson} is already in the phonebook, replace the old number with a new one?`)) {
        const updatedPerson = { ...existingPerson, number: newNumber }
  
        fetchPersonData
          .update(existingPerson.id, updatedPerson)
          .then((returnedPerson) => {
            setPersons(persons.map(person => person.id !== existingPerson.id ? person : returnedPerson))
            setNewPerson('')
            setNewNumber('')
          })
          .catch(error => {
            alert(`The person '${newPerson}' was already deleted from the server.`)
            setPersons(persons.filter(person => person.id !== existingPerson.id))
          })
      }
    } else {

      const personObject = {
        name: newPerson,
        number: newNumber,
        //id: persons.length + 1, 
        //its better to let the backend to create the id 
      }
    
      //checks if atleast one element in the array is already in the phonebook
      persons.some(person => person.name === newPerson || person.number === newNumber)
        ? alert(`name or number was added already.`)
        : fetchPersonData.create(personObject).then((returnedPerson) => {
            setPersons(persons.concat(returnedPerson))
            setNewPerson('')
            setNewNumber('')
        }
      )}
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

const Persons = ({ personsToShow, handleDelete }) => { 
  return (
    <ul>
      {personsToShow.map(person => 
        <li key={person.id}>
          {person.name} {person.number}
          <button onClick={() => handleDelete(person.id)}>delete</button>
        </li>
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

  const handleDelete = (id) => {
    const personToDelete = persons.find(person => person.id === id)
    if (window.confirm(`Delete ${personToDelete.name}?`)) {
      fetchPersonData
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
        .catch(error => {
          console.error(`Error deleting person:`, error)
          alert(`The person '${personToDelete.name}' was already deleted from the server.`)
          setPersons(persons.filter(person => person.id !== id))
        })
    }}

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filterPerson={filterPerson} setFilterPerson={setFilterPerson}/>

      <h2>Add New</h2>
      <PersonForm persons={persons} setPersons={setPersons}/>
      
      <p>Formulario componentizado:</p>
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} handleDelete={handleDelete}/>
    </div>
  )
}

export default App