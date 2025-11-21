import axios from 'axios';
import { JournalEntry, Journal } from '../types/journal';

const API_URL = 'http://localhost:8000/api';

export const journalApi = {
    getJournals: async (): Promise<Journal[]> => {
        try {
            const response = await axios.get(`${API_URL}/journals/`, {
                withCredentials: true
            });
            console.log('API Response:', response);
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    getJournal: async (id: string): Promise<Journal> => {
        const response = await axios.get(`${API_URL}/journals/${id}/`, {
            withCredentials: true
        });
        return response.data;
    },

    createJournal: async (data: { title: string; tags?: { name: string }[] }): Promise<Journal> => {
        const response = await axios.post(`${API_URL}/journals/`, data, {
            withCredentials: true
        });
        return response.data;
    },

    updateJournal: async (id: string, data: { title?: string; tags?: { name: string }[] }): Promise<Journal> => {
        const response = await axios.put(`${API_URL}/journals/${id}/`, data, {
            withCredentials: true
        });
        return response.data;
    },

    getEntries: async (): Promise<JournalEntry[]> => {
        const response = await axios.get(`${API_URL}/entries/`, {
            withCredentials: true
        });
        return response.data;
    },

    createEntry: async (journalId: string, data: { content: string }): Promise<JournalEntry> => {
        console.log('Creating entry with:', { journalId, data });
        const response = await axios.post(
            `${API_URL}/journals/${journalId}/entries/`,
            data,
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
        return response.data;
    },

    updateEntry: async (journalId: string, entryId: number, data: { content: string, rating: number }): Promise<JournalEntry> => {
        const response = await axios.put(
            `${API_URL}/journals/${journalId}/entries/${entryId}/`,
            data,
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
        return response.data;
    },

    deleteJournal: async (id: string): Promise<void> => {
        await axios.delete(`${API_URL}/journals/${id}/`, {
            withCredentials: true
        });
    },

    deleteEntry: async (journalId: string, entryId: number): Promise<void> => {
        await axios.delete(`${API_URL}/journals/${journalId}/entries/${entryId}/`, {
            withCredentials: true
        });
    }
};