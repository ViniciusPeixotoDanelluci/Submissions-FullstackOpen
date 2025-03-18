import { useState } from 'react'

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ({ good, neutral, bad, all}) => {
  const positive = ((good / all) * 100).toFixed(2) + "%"
  const average = ((good - bad) / all).toFixed(1)
  if (all === 0) {
    return <p>No feedback given yet</p>
  }
  return (
    <div>
      <h1>statistics</h1>

      <StatisticLine text="good" value ={good} />
      <StatisticLine text="neutral" value ={neutral} />
      <StatisticLine text="bad" value ={bad} />
      <StatisticLine text="all" value ={all} />
      <StatisticLine text="average" value ={average} />
      <StatisticLine text="positive" value ={positive} />
    </div>
  )
}

const Button = ({ onClick, text }) => (
  <button onClick={onClick}>
    {text}
  </button>
)

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAllFeedbacks] = useState(0)

  // Could use a function with Switch
  // case here instead of 3 functions
  const handleGoodClicks = () => { 
    setGood(good + 1)
    const attGood = good + 1
    setAllFeedbacks(attGood + bad + neutral)
  }
  const handleNeutralClicks = () => {
    setNeutral(neutral + 1)
    const attneutral = neutral + 1
    setAllFeedbacks(good + attneutral + bad)
  }
  const handleBadClicks = () => {
    setBad(bad + 1)
    const attbad = bad + 1
    setAllFeedbacks(good + neutral + attbad)
  }

  return (
    <div>
      <h1>give feedback</h1>
      
      <Button onClick={handleGoodClicks} text='good' />
      <Button onClick={handleNeutralClicks} text='neutral' /> 
      <Button onClick={handleBadClicks} text='bad' />

      <Statistics good={good} neutral={neutral} bad={bad} all={all} />
    </div>
  )
}

      /*<AllFeedbacks good={good} neutral={neutral} bad={bad} />*/
export default App

