import './App.css';
import Menu from './components/Menu'
import Quiz from './components/Quiz';
import { useEffect, useState } from 'react'
import { GameStateContext} from './helpers/Contexts'
import data from './data/Questions.json'
import results from './data/Results.json'


// ['menu', 'playing', 'finished']
function App() {

  const [gameState, setGameState] = useState('menu')
  const [userName, setUserName] = useState('')
  const [questions, setQuestions] = useState({})
  const [getResults, setResults] = useState({})
  const [error, setError] = useState(null)

  useEffect(() => {
    setQuestions(data)
    setResults(results)
  },[])

  return (
    <div className="App">
      <div className="QuizTitle">
        <h1>{questions.title}</h1>
      </div>
      <GameStateContext.Provider value={{ gameState, setGameState, userName, setUserName, questions, setQuestions, getResults, setResults}}>
        {gameState === "menu" && <Menu id="Menu" />}
        {gameState === "playing" && <Quiz id ="Quiz"/>}
      </GameStateContext.Provider>
    </div>
  );
}

export default App;
