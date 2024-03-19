import React, {useState} from 'react'
import './Reg.css'
import axios from 'axios'
import a from '../images/Login-amico.png'
function Register() {
    const [name, setname] = useState('')
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    console.log(name, email, password)
    const handel = async (e)=>{
      e.preventDefault(); // Prevent default form submission

        try {
            const res = await axios.post('http://localhost:5000/register', {
              name,
                email,
                password
            });

            // Assuming a successful login returns some data
            console.log('register successful:', res.data);
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
                <p class="title">Register Form</p>
                <input placeholder="Username" value={name} onChange= {(e)=>setname(e.target.value)}class="username input" type="text"/>
                <input placeholder="Email" onChange= {(e)=>setemail(e.target.value)} value = {email}class="username input" type="text"/>
                <input placeholder="Password" onChange= {(e)=>setpassword(e.target.value)} value = {password} class="password input" type="password"/>
                <button onClick={handel}class="btn" type="submit">Register</button>
                <p style={{color : 'antiquewhite'}}>Already have account? <a href='/login'>Login</a></p>
            </form>
        </div>
    </div>
  )
}

export default Register