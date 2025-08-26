const Filter = ({ filterPerson, setFilterPerson}) => { 
    const handlePersonSearch = (event) => {
      //setFilterPerson(event.target.value) //it has the asynchronous problem from the part1
      
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

export default Filter