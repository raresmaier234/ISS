import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

function Register({ setToken }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('programmer'); // Valoare implicită

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, role })
        });
        const data = await response.json();
        if (response.ok) {
            setToken(data.token);
        } else {
            alert('Registration failed');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 2 }}>
                <Typography variant="h4">Register</Typography>
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
                    <FormControl variant="outlined" fullWidth sx={{ margin: '16px 0' }}>
                        <InputLabel id="role-label">Role</InputLabel>
                        <Select
                            labelId="role-label"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            label="Role"
                        >
                            <MenuItem value="programmer">Programmer</MenuItem>
                            <MenuItem value="tester">Tester</MenuItem>
                        </Select>
                    </FormControl>
                    <Button type="submit" variant="contained" color="primary" sx={{ margin: '24px 0 16px' }}>Register</Button>
                </form>
            </Paper>
        </Container>
    );
}

export default Register;
