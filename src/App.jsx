import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './index.css';
import ChipAutoComplete from './Components/ChipAutoComplete'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ChipAutoComplete/>
    </>
  )
}

export default App
