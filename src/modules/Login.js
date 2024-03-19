import React,{useState} from 'react'
import './Login.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import a from '../images/Login-amico.png'
function Login() {
    const [email, setemail] = useState('')
   const navigate = useNavigate()
    const [password, setpassword] = useState('')
    console.log( email, password)
    const handel = async (e)=>{
      e.preventDefault(); // Prevent default form submission

        try {
            const res = await axios.post('http://localhost:5000/login', {
                email,
                password
            });

            // Assuming a successful login returns some data
            console.log('Login successful:', res.data);
            localStorage.setItem('user:token',res.data.token )
            localStorage.setItem('user:detail', JSON.stringify(res.data))
            navigate('/')
        } catch (error) {
            // Handle error
            console.error('Error:', error);
        }
    }
  return (
    <div>
       
         <div class="container">
            
        <form class="form" action="">
        <img src = {a} width={200} height={200}/>
            <p class="title">Login Form</p>
           
            <input placeholder="Email" value={email} onChange= {(e)=>setemail(e.target.value)} class="username input" type="text"/>
            <input placeholder="Password" onChange= {(e)=>setpassword(e.target.value)} value = {password}  class="password input" type="password"/>
            <button class="btn" onClick={handel}type="submit">Login</button>
            <p style = {{color : 'white'}}>Dont have account? <a href = '/register'>Register</a></p>
        </form>
    </div>
    </div>
  )
}

export default Login