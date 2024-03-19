import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './modules/Login';
import Register from './modules/Register';
import Dashbord from './modules/Dashbord';
import Find from './modules/Find';
import Request from './modules/Request';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/find" element={<Find />} />
        <Route path="/request" element={<Request />} />
        <Route path="/" element={<Dashbord />} />
      </Routes>
    </Router>
  );
}

export default App;
