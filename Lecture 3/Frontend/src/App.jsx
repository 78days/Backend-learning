import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import axios from 'axios'

function App() {
  const [jokes, setjokes] = useState([{id :1,content:44,title:0}])
  useEffect(() => {
    axios.get('/jokes')
      .then((res) => {
        setjokes(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])
  

  return (
 <> 
      <h1>ali faisal</h1>
      <p>jokes {jokes.length}</p>

      {
  jokes.map((joke) => (
    <div key={joke.id}>
      <h1>{joke.title}</h1>
      <h1>{joke.content}</h1>
    </div>
  ))
}

 </>
  )
}

export default App
