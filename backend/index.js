const express = require('express')
const app = express()
const User = require('./model/user')
const Message = require('./model/messege')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const conversation = require('./model/conv')
const secret_key = "this is secreat key"
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const io = require('socket.io')(8000, {
  cors : {
    origin : 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
})
 require('./db/conn')
app.use(express.json())
app.use(cors())
app.get('/', (req, res) => {
  res.send('hello')

});

app.post('/register', async (req, res) => {
  try {
      const { name, email, password } = req.body;

    
      if (!name || !email || !password) {
          return res.status(400).json({ error: "Please fill all the fields" });
      }

   
      const newUser = new User({ name, email, password });

   
      await newUser.save();

      console.log('User registration successful');
      res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
     
      if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
          return res.status(400).json({ error: 'Email is already registered' });
      } else {
          
          console.error('Error during user registration:', error);
          res.status(500).json({ error: 'Internal Server Error' });
      }
  }
});

app.post('/login', async (req, res) => {
  try {
      const { email, password } = req.body;

      if (!email || !password) {
          return res.status(400).json({ error: "Please provide both email and password" });
      }

     
      const user = await User.findOne({ email });

   
      if (!user) {
          return res.status(400).json({ error: "Invalid email or password" });
      }

     
      
      if (password != user.password){
        return res.status(400).json({ error: "Invalid email or password" });
      }

     

      const token = jwt.sign({ id: user._id, email: user.email }, secret_key, { expiresIn: "1h" });

   
      user.token = token;
      await user.save();

      // Return success response with user data and token
      res.status(200).json({ message: "Login successful", user, token });
  } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post('/conversation', async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    
    
    console.log('ReceiverId:', receiverId);

    
    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ error: 'Invalid receiverId' });
    }

   
    const newConv = await new conversation({ members: [senderId, receiverId] });
    await newConv.save();

    const updatedUser = await User.findByIdAndUpdate(
      senderId,
      { $pull: { request: { _id: mongoose.Types.ObjectId.createFromHexString(receiverId) } } },
      { new: true }
    );

    res.status(200).json(updatedUser); // Return updated user document in the response
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});




app.post('/requests', async (req, res) => {
  try {
    const {id} = req.body

    
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

   
    const requestArray = user.request;

    
    res.status(200).json({ requestArray });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.post('/request', async (req, res) => {
  try {
    const { email, userId } = req.body;

    
    const userByEmail = await User.findOne({ email });

    if (!userByEmail) {
      return res.status(404).json({ message: "User not found by email" });
    }

    // Find user by userId
    const userById = await User.findById(userId);

    if (!userById) {
      return res.status(404).json({ message: "User not found by userId" });
    }

    
    userByEmail.request.push(userById);
    await userByEmail.save();

  
    res.status(200).json({ message: "Request added successfully", userRequest: userByEmail.request });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});



app.get('/conversation/:senderId', async (req, res) => {
  try {
    const senderId = req.params.senderId;

    
    const conversations = await conversation.find({ members: senderId });
    if (!conversations || conversations.length === 0) {
      return res.status(404).json({ error: "Conversations not found for the sender" });
    }


    const receiverDetails = conversations.map(conv => {
      const receiverId = conv.members.find(memberId => memberId.toString() !== senderId.toString());
      return {
        conversationId: conv._id,
        receiverId: receiverId
      };
    });
    if (!receiverDetails || receiverDetails.length === 0) {
      return res.status(404).json({ error: "Receivers not found for the sender's conversations" });
    }

  
    const receiverPromises = receiverDetails.map(receiver => User.findById(receiver.receiverId));
    const receivers = await Promise.all(receiverPromises);
    if (!receivers || receivers.length === 0) {
      return res.status(404).json({ error: "Receivers not found in User collection" });
    }
    res.status(200).json({ receivers: receivers, conversations: receiverDetails });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/messege', async (req, res) => {
  try {
    const { conversationID, sender, messege, receiver } = req.body;
       
    if (!conversationID) {
      // If conversationID is not provided, create a new conversation and message
      const newConversation = new conversation({ members: [sender, receiver] });
      const savedConversation = await newConversation.save(); // await the save() call
    console.log( savedConversation)
      const newMessage = new Message({
        conversationID: savedConversation._id,
        sender,
        messege
      });

      await newMessage.save();

      return res.status(200).send("Message sent successfully");
    }

  
    const newMessage = new Message({
      conversationID,
      sender,
      messege
    });

    await newMessage.save();
    res.status(200).send("Message sent successfully");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get('/messege/:id', async (req, res) => {
  try {
    const conversationID = req.params.id;

    const messages = await Message.find({ conversationID });
   
    const user_data = await Promise.all(messages.map(async (msg) => {
      const users = await User.findById(msg.sender);
    return  { user: { email: users.email, name: users.name }, mess:msg.messege };
    }));

    res.status(200).json( user_data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/users', async(req,res)=>{
  try{
     const users = await User.find()
     
     res.send(users)
  }catch(err){
    res.send(err)
  }
})
let users = []
io.on('connect', (socket) => {
  console.log('user connected ', socket.id);
   
 
  socket.on('adduser', (userID) => {
    const user = { userID, socketId: socket.id };
    users.push(user);
  
    console.log(users)
    io.emit('user_connected', user);
    

    io.emit('getuser', users);
  });


 
  socket.on('send', ({ sender,  receiver ,message}) => {
    console.log("Received message via socket:", {  sender,  receiver ,message });
    io.to()
   
  });

  socket.on('disconnect', () => {
    console.log('User disconnected : ', socket.id);
  
    users = users.filter((user) => user.socketId !== socket.id);
    io.emit('getuser', users);
  });
});


app.listen(5000, () => {
  console.log('App listening on port 5000!');
});
