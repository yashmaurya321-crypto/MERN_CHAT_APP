import React, { useEffect, useState } from 'react';
import axios from 'axios';
import a from '../images/men.jpg';
import img1 from '../images/1.jpg';
import img2 from '../images/2.jpg';
import img3 from '../images/3.jpg';
import img4 from '../images/4.jpg';
import img5 from '../images/5.jpg';
import img6 from '../images/6.jpg';
import './D.css';
import {io} from 'socket.io-client'
import Nav from './Nav';
const socket = io('http://localhost:8000'); 
function Dashbord() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user:detail')));
    const [conversation, setConv] = useState([]);
     const [messege, setmessage] = useState([])
     const [newmessage, setMessage] = useState('')
     const [newconvId, setnewconvid] = useState('')
     const [selectedReceiver, setSelectedReceiver] = useState('');
     const [activeuser, setactive] = useState([])
const [selectsocketid, setselectsocketid] = useState('')
     useEffect(() => {
        console.log('Socket connected:', socket.connected);
        socket.on('receive_message', (data) => {
            setmessage((prevMessages) => [...prevMessages, data]);
        });
        socket.emit('adduser', { socketId: socket?.id, userId: user.user._id });
        socket.on('user_connected', (e)=>{
              setactive(e) 
             console.log(activeuser + 'USERSSSSS')
        })
        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        const fetchConvo = async () => {
            try {
                if (user && user.user && user.user._id) {
                    const res = await axios.get(`http://localhost:5000/conversation/${user.user._id}`);
                    setConv(res.data);
                    console.log('Conversation data:',res.data);
                } else {
                    console.error('User or user ID not found');
                }
            } catch (error) {
                console.error('Error fetching conversation:', error);
            }
        };

        fetchConvo();
    }, [user]);
    useEffect(() => {
        console.log('Conversation data    :', conversation);
    }, [conversation]);
    // People array
    const people = [
        { name: 'Rahul', image: img1 },
        { name: 'Pratemesh', image: img2 },
        { name: 'Maruti', image: img3 },
        { name: 'Survesh', image: img4 },
        { name: 'Alex', image: img5 },
        { name: 'Speed', image: img6 }
    ];
    const findUserSocketId = (userId) => {
        const user = activeuser?.find(user => user.userId === userId);
        if (user) {
            return user.socketId;
        } else {
            return null; // User not found
        }
    };
    
    const findSocketIdByUserId = (userId) => {
        const newuser = activeuser.find(user => user.userID === userId);
        return newuser ? newuser.socketId : null;
    };
    // Usage example:
    const handleSelectReceiver = (userId) => {
       
    };
    
   const fetchmess = async (conversationID ) =>{
      try{
          const res = await axios.get(`http://localhost:5000/messege/${conversationID }`)
          console.log(res.data )
          setmessage(res.data)
      }catch(err){
        console.log(err)
      }
   }
   
   const handleReceiverClick = (e) => {
    setSelectedReceiver(e);
    
}
const handelsendmesage = async (messageText) => {
    // Create the message object with user information
    const newMessage = {
        mess: messageText,
        user: {
            email: user.user.email, // Assuming user state contains email
            name: user.user.name // Assuming user state contains name
        }
    };

    // Update the message state with the new message
    setmessage([...messege, newMessage]);
    socket.emit('send', {
        sender: user.user._id,
        receiver: selectsocketid,
        message: messageText
    });

    try {
        // Send the message to the backend
        const response = await axios.post("http://localhost:5000/messege", {
            conversationID: newconvId, // Assuming newconvId is defined elsewhere
            sender: user.user._id,
            messege: newMessage.mess,
            receiver: selectedReceiver
        });

        // Handle the response from the backend if needed
       
        setMessage('');
        console.log(response.data);
    } catch (err) {
        console.log(err);
    }
}

    return (
        <div style = {{height : '100vh', position : 'relative', width : '100vh', backgroundColor : 'black'}}>
            <Nav/>
            
        <div style={{ color: 'wheat', display: 'flex', fontFamily: 'cursive', height: '100vh', width: '100vw' }}>
            <div className='info' style={{ flex: '3', background:  'linear-gradient( #481ebb, black)', display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                <div className='profile-info' style={{ padding: 8, display: 'flex', alignItems: 'center', flexDirection: 'column', position: 'relative', top: 0 }}>
                    <div className='images' style={{ borderRadius: '50%', width: '100px', height: '100px', display: 'flex', justifyContent: 'center',paddingBottom : 9 }}>
                        <img src={a} alt="Profile" style={{ width: 110, height:110 , borderRadius: '50%' , }} />
                    </div>
                    <div className='name' style={{ fontFamily: 'cursive', marginTop: '1px', fontSize : 20, fontWeight : 'bold' }}>{user.user.name}</div>
                </div>
                <div style={{ height: '2px', width: '100%', background: 'white', left: '50%', top: '0' }}></div>
                <div className='people' style={{ marginTop: '20px', overflow : 'scroll', height : 689 }}>
                    <p style={{position : 'relative', left : 19, fontSize : 20, color : 'cyan'}}>Messages</p>
                
{/* {conversation && conversation.receivers && conversation.receivers.map((receiver, index) => {
    const conversationId = conversation.conversations[index]?.conversationId;
    return (
        <div key={index} onClick={() => { console.log('hello from ' + receiver.name + ' with conversationID: ' + conversationId);   fetchmess(conversationId)}} style={{ display: 'flex', alignItems: 'center', margin: '10px', borderBottom: '1px solid #000', paddingBottom: '5px', cursor: 'pointer' }}>
            <img src={img2} alt="Profile" style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }} />
            <div>{receiver.name}</div>
        </div>
    );
})} */}
 {conversation && conversation.receivers && conversation.receivers.map((receiver, index) => {
                        const conversationId = conversation.conversations[index]?.conversationId;
                        
                        return (
                            <div key={index} onClick={() => {setnewconvid(conversationId);console.log(conversationId);fetchmess(conversationId);handleReceiverClick(receiver.name); handleSelectReceiver(receiver._id)}} style={{ display: 'flex', alignItems: 'center', margin: '10px', borderBottom: '1px solid #000', paddingBottom: '5px', cursor: 'pointer' }}>
                                <img src={img2} alt="Profile" style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }} />
                                <div>{receiver.name}</div>
                            </div>
                        );
                    })}

                </div>
            </div>
            <div className='chat' style={{ flex: '7', background: 'black', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
    {/* Content for chat component */}
    <div className='person-info' >
        <img src={img2} alt="Profile" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
        <p style={{ marginLeft: '20px', fontSize: '1.5rem' }}>{selectedReceiver}</p>

    </div>
    <div className='chatboxes' style = {{overflowY: 'scroll', scrollbarWidth: 'none', '-ms-overflow-style': 'none' , height : 450}}>
   
    
    {/* {messege.map((message, index) => (
    <div key={index} className={index % 2 === 0 ? 'receive-message' : 'send-message'} style={{ textAlign: index % 2 === 0 ? 'left' : 'right', marginBottom: '10px' }}>
        <div className={index % 2 === 0 ? 'message-bubble receive-bubble' : 'message-bubble send-bubble'}>
            <p>{message.user.name}: {message.mess}</p>
        </div>
    </div>
))} */}
  <div className='chatboxes' style={{ overflowY: 'scroll', scrollbarWidth: 'none', '-ms-overflow-style': 'none', height: 450 }}>
    {messege.map((message, index) => (
        <div key={index}>
            {message.user.name === selectedReceiver ? (
                 <div className='receive-message' style={{ textAlign: 'left', marginBottom: '10px' }}>
                    <div className='message-bubble receive-bubble'>{message.mess}</div>
                </div>
            ) : (
               
                <div className='send-message' style={{ textAlign: 'right', marginBottom: '10px' }}>
                <div className='message-bubble send-bubble'>{message.mess}</div>
               
            </div>
            )}
        </div>
    ))}
</div>


</div>

<div className='input-values' style={{ position: 'fixed', bottom: 5, width: '100%' }}>
    <div className="input-group">
        <input onChange={(e) => setMessage(e.target.value)} placeholder="Enter new item here" type="text" id="input-field" />
        <button onClick={() => handelsendmesage(newmessage)} className="submit-button"><span>Send</span></button>
    </div>
</div>
</div>

        </div></div>
    );
}

export default Dashbord;



