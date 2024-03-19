import React, { useEffect, useState } from 'react'
import Nav from './Nav';
import './req.css'
import axios from 'axios'
function Find() {
  const [data, setData] = useState([])
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user:detail')));
 console.log(user)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/users');
        setData(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);
 const handel = async(email)=>{
try{
const data = await axios.post('http://localhost:5000/request', {
  email, userId:  user.user._id
})
console.log(data.data)
}catch(err){

}
 }
  return (
    <div style={{ backgroundColor: 'black', height: '100vh' }}>
      <Nav />
      <br />
      <h1 style={{ color: 'white' }}>Find</h1>
      <br />
      <div>
        <table className="table table-striped table-dark">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Send</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{item.name}</td>
                <td>{item.email}</td>
                
                <td>
                <button onClick={()=>{handel(item.email)}}>
    <span>Send</span>
</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Find;