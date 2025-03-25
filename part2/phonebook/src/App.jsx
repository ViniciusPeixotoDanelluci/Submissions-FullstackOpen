import { useState } from 'react'

const Filter = ({ filterPerson, setFilterPerson}) => { 
  const handlePersonSearch = (event) => {
    //setFilterPerson(event.target.value) // It has the asynchronous problem from the part1
    
    const attFilterPerson = event.target.value
    setFilterPerson(attFilterPerson)
  }

  return (
    <div>
      filter: <input
        value={filterPerson}
        onChange={handlePersonSearch}
      />
    </div>
  )
}

const PersonForm = ({persons, setPersons}) => {
  const [newPerson, setNewPerson] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    if (newPerson === '' || newNumber === '') {
      alert('Name or number is missing')
      return
    }
  
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
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]) 

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