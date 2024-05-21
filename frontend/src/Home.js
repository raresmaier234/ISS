import React from 'react';
import { Container, Typography, Paper } from '@mui/material';

function Home() {
    return (
        <Container maxWidth="md">
            <Paper sx={{ padding: 2, marginTop: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Welcome to Bug Tracker
                </Typography>
                <Typography variant="body1">
                    This is a platform where you can track bugs, report new issues, and manage the resolution process efficiently.
                    Whether you are a developer looking to fix bugs or a tester reporting them, this tool will help you stay organized
                    and up-to-date.
                </Typography>
            </Paper>
        </Container>
    );
}

export default Home;
