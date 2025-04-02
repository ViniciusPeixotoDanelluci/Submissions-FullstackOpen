import { useState, useEffect } from 'react'
import fetchPersonData from './services/personData'
import Filter from './components/Filter'
import ErrorNotification from './components/ErrorNotification'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([
  /*{ name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  */]) 
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

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

    const showSuccessNotification = (message) => {
      setSuccessMessage(message)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    }
  
  const handleDelete = (id) => {
    const personToDelete = persons.find(person => person.id === id)
    if (window.confirm(`Delete ${personToDelete.name}?`)) {
      fetchPersonData
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
        .catch((error) => {
          setErrorMessage(
            `'${personToDelete.name}' was already removed from server`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
          setPersons(persons.filter(person => person.id !== id))
        })        
    }}

  return (
    <div>
      <h2>Phonebook</h2>
      {successMessage && <div className='success'>{successMessage}</div>}
     
      <ErrorNotification message={errorMessage} />
      <Filter filterPerson={filterPerson} setFilterPerson={setFilterPerson}/>

      <h2>Add New</h2>
      <PersonForm persons={persons} setPersons={setPersons} showSuccessNotification={showSuccessNotification}/>
      
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} handleDelete={handleDelete}/>
    </div>
  )
}

export default App