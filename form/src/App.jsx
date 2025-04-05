import { useState } from 'react'
import { BrowserRouter,Routes,Route} from 'react-router-dom'
import './App.css'
import Login from './component/Login'
import Register from './component/Register'
import Dash from './component/Dash'
import Home from './component/Home'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
       <BrowserRouter>
       <Routes>
         <Route path='/' element={<Home/>}/>
         <Route path='/login' element={<Login/>}/>
         <Route path='/register' element={<Register/>}/>
         <Route path='/dash' element={<Dash/>}/>
       </Routes>
       </BrowserRouter>

    </>
  )
}

export default App
