import { useState, useEffect } from 'react';
import { Journal } from '../types/journal';
import { journalApi } from '../services/api';

export const HomeViewHelper = () => {
    const [journals, setJournals] = useState<Journal[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadJournals = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await journalApi.getJournals();
            console.log('Fetched journals:', data);
            setJournals(data);
        } catch (error) {
            console.error('Error loading journals:', error);
            setError('Failed to load journals');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadJournals();
    }, []);

    return {
        journals,
        loading,
        error,
        loadJournals
    };
};