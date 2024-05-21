import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Paper } from '@mui/material';

function Login({ setToken }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            if (response.ok) {
                setToken(data.token);
                localStorage.setItem('token', data.token); // Stocăm token-ul în localStorage
            } else {
                console.error('Login failed:', data);
                alert('Invalid credentials');
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 2 }}>
                <Typography component="h1" variant="h5">Login</Typography>
                <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: 8 }}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Username"
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ margin: '24px 0 16px' }}
                    >
                        Login
                    </Button>
                </form>
            </Paper>
        </Container>
    );
}

export default Login;
