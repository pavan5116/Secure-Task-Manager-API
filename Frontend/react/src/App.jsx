import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
 
import Login from './page/Login';
import Register from './page/Register';
import Home from './page/Home';
import ProtectedRoute from './components/ProtectedRoute';
import Logout from './page/Logout';
import Profile from './page/profile';

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/Register" element={<Register/>} />
        <Route path="/Login" element={<Login/>} />
        <Route path="/Logout" element={<ProtectedRoute><Logout/></ProtectedRoute>} />
        <Route path="/Profile" element={<ProtectedRoute><Profile/></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;