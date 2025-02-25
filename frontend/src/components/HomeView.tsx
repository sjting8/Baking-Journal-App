import React, { useState, useEffect } from 'react';
import { 
    Container, 
    Typography, 
    List, 
    ListItem, 
    ListItemText,
    ListItemButton,
    Button,
    Box
} from '@mui/material';
import { Link } from 'react-router-dom';
import { HomeViewHelper } from '../Helpers/HomeViewHelper';
export const HomeView: React.FC = () => {
    const { journals, loading, error, loadJournals } = HomeViewHelper();

    useEffect(() => {
        loadJournals();
    }, []);

    return (
        <Container maxWidth="md">
            <Box className="content-section">
                <Typography variant="h4" component="h1" gutterBottom>
                    My Recipes
                </Typography>

                <Box sx={{ mb: 4 }}>
                    <Button
                        component={Link}
                        to="/journal/new"
                        variant="contained"
                        color="primary"
                    >
                        Add New Recipe
                    </Button>
                </Box>

                {loading && <Typography>Loading...</Typography>}
                {error && <Typography color="error">{error}</Typography>}
                
                <List>
                    {journals.length === 0 && !loading && (
                        <Typography>No journals found. Add your first recipe!</Typography>
                    )}
                    {journals.map((journal) => (
                        <ListItem key={journal.id} disablePadding>
                        <ListItemButton
                            component={Link}
                            to={`/journal/${journal.id}`}
                        >
                            <ListItemText
                                primary={journal.title}
                                secondary={`Created: ${new Date(journal.created_at).toLocaleDateString()}`}
                            />
                        </ListItemButton>
                    </ListItem>
                    ))}
                </List>
            </Box>
        </Container>
    );
};