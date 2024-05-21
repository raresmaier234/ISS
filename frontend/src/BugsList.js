import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, List, ListItem, ListItemText, Button } from '@mui/material';

function BugList({ handleDeleteBug }) {
    const [bugs, setBugs] = useState([]);
    const [error, setError] = useState(null);

    const fetchBugs = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }
            const apiUrl = `${process.env.REACT_APP_API_URL}/api/bugs`;
            const response = await fetch(apiUrl, {
                headers: { 'Authorization': `Bearer ${token}` },
                method: 'GET'
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to fetch bugs');
            }

            const data = await response.json();
            setBugs(data);
        } catch (error) {
            console.error('Error fetching bugs:', error);
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchBugs();
    }, []);

    const handleDelete = async (id) => {
        await handleDeleteBug(id);
        fetchBugs();
    };

    return (
        <Container maxWidth="md">
            <Paper sx={{ padding: 2 }}>
                <Typography variant="h4" gutterBottom>All Bugs</Typography>
                {error && <Typography color="error">{error}</Typography>}
                <List>
                    {bugs.map(bug => (
                        <ListItem key={bug.id} divider>
                            <ListItemText primary={bug.name} secondary={bug.description} />

                            <Button variant="contained" color="secondary" sx={{ margin: 1 }} onClick={() => handleDelete(bug.id)}>Resolved</Button>
                        </ListItem>
                    ))}
                </List>

            </Paper>
        </Container>
    );
}

export default BugList;
