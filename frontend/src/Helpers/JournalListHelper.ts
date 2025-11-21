import { useState } from 'react';
import { Journal, JournalEntry, CreateEntryData } from '../types/journal';
import { journalApi } from '../services/api';
import { useNavigate } from 'react-router-dom';

export const JournalListHelper = (id?: string) => {
    const navigate = useNavigate();
    const [journal, setJournal] = useState<Journal | null>(null);
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [title, setTitle] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [rating, setRating] = useState<number>(5);
    const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
    const [editIngredients, setEditIngredients] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editRating, setEditRating] = useState(5);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteJournalDialogOpen, setDeleteJournalDialogOpen] = useState(false);
    const [deleteEntryId, setDeleteEntryId] = useState<number | null>(null);

    const [tags, setTags] = useState<string[]>([]);
    const [availableTags, setAvailableTags] = useState<string[]>(['Gluten Free', 'Mixer', 'Healthy', 'Nuts']);

    const isNewJournal = !id || id === 'new';

    const loadJournal = async () => {
        if (!id) return;
        try {
            const data = await journalApi.getJournal(id);
            setJournal(data);
            if (data.tags) {
                setTags(data.tags.map(t => t.name));
            }
            if (data.entries) {
                setEntries(data.entries);
            }
        } catch (error) {
            console.error('Error loading journal:', error);
            setError('Failed to load journal');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError(null);

            if (isNewJournal) {
                if (!title.trim()) {
                    setError('Recipe title cannot be empty');
                    return;
                }
                const newJournal = await journalApi.createJournal({
                    title,
                    tags: tags.map(name => ({ name }))
                });
                navigate(`/journal/${newJournal.id}`);
            } else if (id) {
                if (ingredients.trim() && description.trim()) {
                    const content = `Ingredients:\n${ingredients}\n\nDescription:\n${description}`;
                    const entryData: CreateEntryData = {
                        content,
                        rating
                    };
                    const newEntry = await journalApi.createEntry(id, entryData);
                    setEntries(prevEntries => [newEntry, ...prevEntries]);
                    setIngredients('');
                    setDescription('');
                    setRating(5);
                }

                if (journal) {
                    await journalApi.updateJournal(id, {
                        tags: tags.map(name => ({ name }))
                    });
                }
            }
        } catch (error: any) {
            console.error('Error:', error);
            setError(error.response?.data?.detail || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleStartEdit = (entry: JournalEntry) => {
        const content = entry.content;
        const ingredientsPart = content.split('Description:')[0].replace('Ingredients:', '').trim();
        const descriptionPart = content.split('Description:')[1]?.trim() || '';

        setEditingEntry(entry);
        setEditIngredients(ingredientsPart);
        setEditDescription(descriptionPart);
        setEditRating(entry.rating);
    };

    const handleSaveEdit = async () => {
        if (!editingEntry || !id) return;

        try {
            setLoading(true);
            setError(null);

            const content = `Ingredients:\n${editIngredients}\n\nDescription:\n${editDescription}`;
            const updatedEntry = await journalApi.updateEntry(id, editingEntry.id, {
                content,
                rating: editRating
            });

            setEntries(entries.map(entry =>
                entry.id === editingEntry.id ? updatedEntry : entry
            ));

            setEditingEntry(null);
            setEditIngredients('');
            setEditDescription('');
            setEditRating(5);
        } catch (error: any) {
            console.error('Error updating entry:', error);
            setError(error.response?.data?.detail || 'Failed to update entry');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteJournal = async () => {
        if (!id) return;
        try {
            setLoading(true);
            await journalApi.deleteJournal(id);
            setDeleteJournalDialogOpen(false);
            navigate('/');
        } catch (error) {
            console.error('Error deleting journal:', error);
            setError('Failed to delete recipe');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteEntry = async (entryId: number) => {
        if (!id) return;
        try {
            setLoading(true);
            await journalApi.deleteEntry(id, entryId);
            setEntries(entries.filter(entry => entry.id !== entryId));
            setDeleteDialogOpen(false);
            setDeleteEntryId(null);
        } catch (error) {
            console.error('Error deleting entry:', error);
            setError('Failed to delete entry');
        } finally {
            setLoading(false);
        }
    };

    return {
        journal,
        entries,
        title,
        setTitle,
        ingredients,
        setIngredients,
        description,
        setDescription,
        error,
        setError,
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
    };
};