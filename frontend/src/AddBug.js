import React, { useState } from 'react';
import { TextField, Button, Container, Paper, Typography, Snackbar, Alert } from '@mui/material';

function AddBug({ bugName, setBugName, bugDescription, setBugDescription, handleAddBug }) {
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleSubmit = async () => {
        await handleAddBug();
        setOpenSnackbar(true);
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    return (
        <Container maxWidth="md">
            <Paper sx={{ padding: 2 }}>
                <Typography variant="h4" gutterBottom>Add Bug</Typography>
                <form noValidate autoComplete="off" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <TextField label="Bug Name" required fullWidth value={bugName} onChange={(e) => setBugName(e.target.value)} sx={{ marginBottom: 2 }} />
                    <TextField label="Bug Description" required fullWidth value={bugDescription} onChange={(e) => setBugDescription(e.target.value)} sx={{ marginBottom: 2 }} />
                    <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ marginTop: 2 }}>Add Bug</Button>
                </form>
                <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                        Bug added successfully!
                    </Alert>
                </Snackbar>
            </Paper>
        </Container>
    );
}

export default AddBug;
