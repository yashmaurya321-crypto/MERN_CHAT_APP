import React ,{useEffect, useState}from 'react';
import Nav from './Nav';
import "./req.css"
import axios from 'axios';

function Request() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user:detail')));
  const [data, setdata] = useState([])
useEffect(()=>{
  const fetchData = async () => {
    try {
      // Send POST request to retrieve request array
      const response = await axios.post('http://localhost:5000/requests', { id: user.user._id });

      // Log the request array
  setdata(response.data.requestArray);
    } catch (error) {
      console.log(error);
    }
  };

  // Call the fetchData function
  fetchData();
}, []);


const handel = async(e) => {
  try {
    // Ensure that e is defined
    if (!e) {
      console.error("Receiver ID is undefined");
      return;
    }

    // Make sure user.user._id is available
    const senderId = user?.user?._id;
    if (!senderId) {
      console.error("Sender ID not found in user:", user);
      return;
    }

    // Make the POST request to /conversation
    const response = await axios.post('http://localhost:5000/conversation', {
      senderId: senderId,
      receiverId: e
    });

    // Log the response data
    console.log(response.data);
  } catch (err) {
    // Log any errors
    console.error("Error in handel function:", err);
  }
}
  return (
    <div style={{ backgroundColor: 'black', height: '100vh' }}>
      <Nav />
      <br />
      <h1 style={{ color: 'white' }}>Request</h1>
      <br />
      <div>
        <table className="table table-striped table-dark">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Accept</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
               
                <td>{item.name}</td>
                <td>{item.email}</td>
                
                <td>
                <button onClick={()=>{handel(item._id)}}>
    <span>Accept</span>
</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Request;
