import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function Navbar({ token, handleLogout }) {
    let role;
    if (token) {
        const decodedToken = jwtDecode(token);
        role = decodedToken.role;
    }

    return (
        <div style={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Bug Tracker
                    </Typography>
                    <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Button color="inherit">Home</Button>
                    </Link>
                    {role === 'programmer' && (
                        <Link to="/bugs" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <Button color="inherit">All Bugs</Button>
                        </Link>
                    )}
                    {role === 'tester' && (
                        <Link to="/addbug" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <Button color="inherit">Add Bug</Button>
                        </Link>
                    )}
                    {token ? (
                        <Button color="inherit" onClick={handleLogout}>Logout</Button>
                    ) : (
                        <>
                            <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
                                <Button color="inherit">Login</Button>
                            </Link>
                            <Link to="/register" style={{ textDecoration: 'none', color: 'inherit' }}>
                                <Button color="inherit">Register</Button>
                            </Link>
                        </>
                    )}
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default Navbar;
