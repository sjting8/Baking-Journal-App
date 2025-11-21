import React, { useEffect } from 'react';
import {
    Container,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemButton,
    Button,
    Box,
    Chip,
    Stack
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
                                    secondary={
                                        <Box component="span">
                                            <Typography component="span" variant="body2" color="text.secondary" display="block">
                                                Created: {new Date(journal.created_at).toLocaleDateString()}
                                            </Typography>
                                            {journal.tags && journal.tags.length > 0 && (
                                                <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', gap: 0.5 }}>
                                                    {journal.tags.map((tag) => (
                                                        <Chip
                                                            key={tag.id}
                                                            label={tag.name}
                                                            size="small"
                                                            variant="outlined"
                                                        />
                                                    ))}
                                                </Stack>
                                            )}
                                        </Box>
                                    }
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Container>
    );
};