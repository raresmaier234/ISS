import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Container } from '@mui/material';
import AddBug from './AddBug';
import Login from './forms/Login';
import Register from './forms/Register';
import Home from './Home';
import Navbar from './components/Navbar';
import BugList from './BugsList';

const socket = new WebSocket('ws://localhost:8080');

function App() {
  const [bugs, setBugs] = useState([]);
  const [bugName, setBugName] = useState('');
  const [bugDescription, setBugDescription] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'init' || data.type === 'update') {
          setBugs(data.bugs);
        }
      };
    }
  }, [token]);

  const handleAddBug = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/bugs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name: bugName, description: bugDescription })
    });
    if (response.ok) {
      const newBug = await response.json();
      setBugs(prevBugs => [...prevBugs, newBug]);
      socket.send(JSON.stringify({ type: 'addBug', name: bugName, description: bugDescription }));
      setBugName('');
      setBugDescription('');
    }
  };
  const handleDeleteBug = async (id) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/bugs/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.ok) {
      setBugs(bugs.filter(bug => bug.id !== id));
      socket.send(JSON.stringify({ type: 'resolveBug', id }));
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <Router>
      <Navbar token={token} handleLogout={handleLogout} />
      <Container component="main" sx={{ marginTop: 4, padding: 2 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setToken={(token) => { setToken(token); localStorage.setItem('token', token); }} />} />
          <Route path="/register" element={<Register setToken={(token) => { setToken(token); localStorage.setItem('token', token); }} />} />
          {token ? (
            <>
              <Route path="/addbug" element={
                <AddBug
                  bugName={bugName}
                  setBugName={setBugName}
                  bugDescription={bugDescription}
                  setBugDescription={setBugDescription}
                  handleAddBug={handleAddBug}
                />
              } />
              <Route path="/bugs" element={
                <BugList
                  bugs={bugs}
                  handleDeleteBug={handleDeleteBug}
                />
              } />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
