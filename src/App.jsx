import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import Addroute from './routes/Addroute'
import { BrowserRouter } from 'react-router-dom'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <div className="app-container">

      <BrowserRouter>
        <Addroute />
      </BrowserRouter>

    </div>
  )
}

export default App