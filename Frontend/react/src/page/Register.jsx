import React, { useEffect, useState } from 'react'
import axios from "axios"
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [password2, setPassword2] = useState("")
  const [message, setMessage] = useState("")

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage("") 

    try {
      const response = await axios.post("http://127.0.0.1:8000/register/", {
        username: name,
        password: password,
        confirm_password : password2
      })

      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);

      console.log("User registered successfully");

      setName("")
      setPassword("")
      setPassword2("")
      
      
      navigate("/Profile")

    }catch (error) {
  if (error.response && error.response.data) {
    const data = error.response.data;
    
    if (data.error && typeof data.error === 'object') {
        
        const firstKey = Object.keys(data.error)[0];
        setMessage(`${firstKey}: ${data.error[firstKey][0]}`);
    } else {
        setMessage(data.error || "Registration failed");
    }
  } else {
    setMessage("Something went wrong");
  }
  console.error("Registration error:", error.response?.data);
}
  }

  return (
    <div> 
      <h2>Register Page</h2>
    
      <form onSubmit={handleSubmit}>
        <div>
          
          <input 
            type="text" 
            value={name} 
            placeholder="Username" 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>

        <div>
          <input 
            type="password" 
            value={password} 
            placeholder="Password" 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>

        <div>
          <input 
            type="password" 
            value={password2} 
            placeholder="confirm_Password" 
            onChange={(e) => setPassword2(e.target.value)} 
            required 
          />
        </div>
        
        <button type="submit">Register</button>
      </form>


      {message && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          <p>{message}</p> 
        </div>
      )}
        
    </div>
  )
}

export default Register