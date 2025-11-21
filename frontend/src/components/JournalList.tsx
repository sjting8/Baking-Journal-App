import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { JournalListHelper } from '../Helpers/JournalListHelper';
import {
    Container,
    Typography,
    Button,
    TextField,
    Box,
    Alert,
    Paper,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Chip,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { JournalEntry } from '../types/journal';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import EditIcon from '@mui/icons-material/Edit';
import { StyledRating } from './style/StyledRating';

export const JournalList: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const {
        journal,
        entries,
        title,
        setTitle,
        ingredients,
        setIngredients,
        description,
        setDescription,
        error,
        loading,
        rating,
        setRating,
        editingEntry,
        setEditingEntry,
        editIngredients,
        setEditIngredients,
        editDescription,
        setEditDescription,
        editRating,
        setEditRating,
        deleteDialogOpen,
        setDeleteDialogOpen,
        deleteJournalDialogOpen,
        setDeleteJournalDialogOpen,
        deleteEntryId,
        setDeleteEntryId,
        isNewJournal,
        loadJournal,
        handleSubmit,
        handleStartEdit,
        handleSaveEdit,
        handleDeleteJournal,
        handleDeleteEntry,
        tags,
        setTags,
        availableTags,
    } = JournalListHelper(id);

    useEffect(() => {
        if (!isNewJournal) {
            loadJournal();
        }
    }, [id, isNewJournal, loadJournal]);

    const renderEntry = (entry: JournalEntry) => {
        const isEditing = editingEntry?.id === entry.id;
        const content = entry.content;
        const ingredientsPart = content.split('Description:')[0].replace('Ingredients:', '').trim();
        const descriptionPart = content.split('Description:')[1]?.trim() || '';

        if (isEditing) {
            return (
                <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ mr: 2 }}>Rating:</Typography>
                        <StyledRating
                            value={editRating}
                            onChange={(_, newValue) => {
                                setEditRating(newValue || 5);
                            }}
                            precision={1}
                            max={10}
                            icon={<StarIcon fontSize="inherit" />}
                            emptyIcon={<StarIcon fontSize="inherit" />}
                        />
                        <Typography sx={{ ml: 1, color: 'text.primary' }}>
                            ({editRating}/10)
                        </Typography>
                    </Box>

                    <TextField
                        fullWidth
                        label="Ingredients"
                        value={editIngredients}
                        onChange={(e) => setEditIngredients(e.target.value)}
                        multiline
                        rows={4}
                        sx={{
                            mb: 2,
                            '& .MuiInputBase-input': {
                                color: 'text.primary',
                            },
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        multiline
                        rows={4}
                        sx={{
                            mb: 2,
                            '& .MuiInputBase-input': {
                                color: 'text.primary',
                            },
                        }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Button onClick={() => setEditingEntry(null)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSaveEdit}
                            variant="contained"
                            disabled={loading}
                        >
                            Save Changes
                        </Button>
                    </Box>
                </Paper>
            );
        }

        return (
            <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" sx={{ mr: 2 }}>Rating:</Typography>
                            <StyledRating
                                value={entry.rating || 0}
                                readOnly
                                precision={1}
                                max={10}
                                icon={<StarIcon fontSize="inherit" />}
                                emptyIcon={<StarIcon fontSize="inherit" />}
                            />
                            <Typography sx={{ ml: 1, color: 'text.primary' }}>
                                ({entry.rating}/10)
                            </Typography>
                        </Box>

                        <Typography variant="h6" gutterBottom color="primary">
                            Ingredients:
                        </Typography>
                        <Typography
                            component="pre"
                            sx={{
                                whiteSpace: 'pre-wrap',
                                mb: 2,
                                fontFamily: 'inherit',
                                color: 'text.primary'
                            }}
                        >
                            {ingredientsPart}
                        </Typography>

                        <Typography variant="h6" gutterBottom color="primary">
                            Description:
                        </Typography>
                        <Typography
                            component="pre"
                            sx={{
                                whiteSpace: 'pre-wrap',
                                fontFamily: 'inherit',
                                color: 'text.primary'
                            }}
                        >
                            {descriptionPart}
                        </Typography>
                    </Box>
                    <Box>
                        <IconButton
                            onClick={() => handleStartEdit(entry)}
                            sx={{ mr: 1 }}
                        >
                            <EditIcon />
                        </IconButton>
                        <IconButton
                            onClick={() => {
                                setDeleteEntryId(entry.id);
                                setDeleteDialogOpen(true);
                            }}
                            color="error"
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                </Box>

                <Typography
                    variant="caption"
                    sx={{
                        display: 'block',
                        mt: 2,
                        color: 'text.secondary'
                    }}
                >
                    Added on {new Date(entry.created_at).toLocaleDateString()}
                </Typography>
            </Paper>
        );
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <IconButton
                    component={Link}
                    to="/"
                    sx={{ mr: 2 }}
                    aria-label="Back to home"
                >
                    <ArrowBackIcon />
                </IconButton>
            </Box>
            <Typography variant="h4" component="h1" gutterBottom className="header-container">
                {isNewJournal ? 'Create New Recipe' : journal?.title || 'Loading...'}
                {!isNewJournal && (
                    <IconButton
                        onClick={() => setDeleteJournalDialogOpen(true)}
                        color="error"
                        aria-label="Delete recipe"
                    >
                        <DeleteIcon />
                    </IconButton>
                )}
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }} className="content-section">
                {isNewJournal ? (
                    <>
                        <TextField
                            fullWidth
                            required
                            label="Recipe Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            margin="normal"
                            disabled={loading}
                        />
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle1" gutterBottom>Tags:</Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                {availableTags.map(tag => (
                                    <Chip
                                        key={tag}
                                        label={tag}
                                        onClick={() => {
                                            if (tags.includes(tag)) {
                                                setTags(tags.filter(t => t !== tag));
                                            } else {
                                                setTags([...tags, tag]);
                                            }
                                        }}
                                        color={tags.includes(tag) ? "primary" : "default"}
                                        variant={tags.includes(tag) ? "filled" : "outlined"}
                                        clickable
                                    />
                                ))}
                            </Box>
                        </Box>
                    </>
                ) : (
                    <>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle1" gutterBottom>Tags:</Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                {availableTags.map(tag => (
                                    <Chip
                                        key={tag}
                                        label={tag}
                                        onClick={() => {
                                            if (tags.includes(tag)) {
                                                setTags(tags.filter(t => t !== tag));
                                            } else {
                                                setTags([...tags, tag]);
                                            }
                                        }}
                                        color={tags.includes(tag) ? "primary" : "default"}
                                        variant={tags.includes(tag) ? "filled" : "outlined"}
                                        clickable
                                    />
                                ))}
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" sx={{ mr: 2 }}>Rating:</Typography>
                            <StyledRating
                                value={rating}
                                onChange={(_, newValue) => {
                                    setRating(newValue || 5);
                                }}
                                precision={1}
                                max={10}
                                icon={<StarIcon fontSize="inherit" />}
                                emptyIcon={<StarIcon fontSize="inherit" />}
                            />
                            <Typography sx={{ ml: 1 }}>
                                ({rating}/10)
                            </Typography>
                        </Box>

                        <TextField
                            fullWidth
                            label="Ingredients (one per line)"
                            value={ingredients}
                            onChange={(e) => setIngredients(e.target.value)}
                            margin="normal"
                            multiline
                            rows={4}
                            disabled={loading}
                        />
                        <TextField
                            fullWidth
                            label="Recipe Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            margin="normal"
                            multiline
                            rows={4}
                            disabled={loading}
                        />
                    </>
                )}
                <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 2 }}
                    disabled={loading}
                >
                    {loading ? 'Saving...' : (isNewJournal ? 'Create Recipe' : 'Save Details')}
                </Button>
            </Box>

            {!isNewJournal && entries.length > 0 && (
                <Box>
                    <Typography variant="h5" gutterBottom>Recipe Versions:</Typography>
                    {entries.map((entry) => (
                        <Box key={entry.id}>
                            {renderEntry(entry)}
                        </Box>
                    ))}
                </Box>
            )}

            {!isNewJournal && entries.length === 0 && (
                <Typography color="textSecondary">
                    No recipe details yet. Add your first version above!
                </Typography>
            )}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => {
                    setDeleteDialogOpen(false);
                    setDeleteEntryId(null);
                }}
            >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this recipe version?
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setDeleteDialogOpen(false);
                            setDeleteEntryId(null);
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => deleteEntryId && handleDeleteEntry(deleteEntryId)}
                        color="error"
                        variant="contained"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={deleteJournalDialogOpen}
                onClose={() => setDeleteJournalDialogOpen(false)}
            >
                <DialogTitle>Confirm Delete Recipe</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this entire recipe? This action cannot be undone.
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setDeleteJournalDialogOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteJournal}
                        color="error"
                        variant="contained"
                    >
                        Delete Recipe
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};