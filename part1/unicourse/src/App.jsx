/*import { useState } from 'react'

const Botao = ({ onClick, texto }) => <button onClick={onClick}>{texto}</button>

const Exibir = ({ contador }) => <div>{contador}</div>
const Hello = ({nome, idade}) => {
  const anoDeNascimento = () => {
    const anoDeHoje = new Date().getFullYear()
    return anoDeHoje - idade
  }

  return (
    <div>
      <p>
        Olá {nome}, você tem {idade} anos.
      </p>

      <p>Então, você nasceu provavelmente em {anoDeNascimento()}.</p>
    </div>
  )
}

const App = () => {
  const [cliques, setCliques] = useState({ 
    esquerda: 0, direita: 0
  })

  const handleCliqueEsquerda = () => {
    const novosCliques = { 
      esquerda: cliques.esquerda + 1, 
      direita: cliques.direita 
    }
    setCliques(novosCliques)
  }

  const handleCliqueDireita = () => {
    const novosCliques = { 
      esquerda: cliques.esquerda, 
      direita: cliques.direita + 1 
    }
    setCliques(novosCliques)
  }

  return (
    <div>
      {cliques.esquerda}
      <button onClick={handleCliqueEsquerda}>Esquerda</button>
      <button onClick={handleCliqueDireita}>Direita</button>
      {cliques.direita}
    </div>
  )
}

const nome = 'Peter'
  const idade = 10

  const [ contador, setContador ] = useState(0)

  setTimeout(
    () => setContador(contador + 1),
    1000
  )
  console.log('renderizando...', contador)

  return (
    <div>
      <h1>Olá a todos!</h1>
      <Hello nome="Maya" idade={26 + 10} />
      <Hello nome={nome} idade={contador} />
    </div>
  )
}*/

  /*const [esquerda, setEsquerda] = useState(0)
  const [direita, setDireita] = useState(0)
  const [todosOsCliques, setTodos] = useState([])

  const handleCliqueEsquerda = () => {
    todosOsCliques.push('E')
    setTodos(todosOsCliques)
    setEsquerda(esquerda + 1)
  }
  const handleCliqueDireita = () => {
    setDireita(direita + 1)
  }

  const arto = {
    nome: 'Arto Hellas',
    idade: 35,
    educacao: 'PhD',
    cumprimentar: function() {
      console.log('olá, meu nome é ' + this.nome)
    },
  
    fazerAdicao: function(a, b) { // *fazerAdição
      console.log(a + b)
    },
    
  }
  
  arto.fazerAdicao(1, 4)        // 5 é impresso
  
  const referenciaParaAdicao = arto.fazerAdicao
  referenciaParaAdicao(10, 15)   // 25 é impresso

  return (
    <div>
      {esquerda}
      <button onClick={handleCliqueEsquerda}>Esquerda</button>
      <button onClick={handleCliqueDireita}>Direita</button>
      <p>{todosOsCliques.join(' ')}</p>
    </div>
  )
}*/
import { useState } from 'react'

const Average = ({props, all}) => {
  /*if (all === 0) {
    return <p>No feedback given yet</p>;
  }*/

  const sum = props.reduce((partialSum, a) => partialSum + a, 0);
  const average = (sum / all) * 100;
/* 
  console.log(props)
  console.log(sum)
  console.log(all)
*/

  return (
    <p>      
      average {average} %
    </p>
  )
}

const Statistics = ({ good, neutral, bad, all}) => {
  return (
    <div>
      <h1>statistics</h1>

      <p>good {good}</p>
      <p>neutral {neutral}</p>
      <p>bad {bad}</p>
      <p>all {all}</p>

      <Average props={[good,0,-bad]} all={all}/>

      <p>positive {(good / all) * 100} %</p>

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

