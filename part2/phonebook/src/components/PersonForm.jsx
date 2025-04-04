import React, { useState } from 'react'
import fetchPersonData from '../services/personData'
import ErrorNotification from './ErrorNotification'

const PersonForm = ({persons, setPersons, showSuccessNotification}) => {
  const [errorMessage, setErrorMessage] = useState(null)
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
            showSuccessNotification(`Updated ${newPerson}'s number`)
          })
          .catch(error => {
            setErrorMessage(
              `The person '${newPerson}' was already deleted from the server.`
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
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
      persons.some(person => person.name === newPerson)
        ? alert(`name or number was added already.`)
        : fetchPersonData.create(personObject).then((returnedPerson) => {
            setPersons(persons.concat(returnedPerson))
            setNewPerson('')
            setNewNumber('')
            showSuccessNotification(`Added ${newPerson}`)
    })}
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

export default PersonForm