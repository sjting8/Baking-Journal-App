export interface JournalEntry {
    id: number;
    title: string;
    content: string;
    rating: number;
    created_at: string;
    updated_at: string;
}

export interface Journal {
    id: number;
    title: string;
    created_at: string;
    updated_at: string;
    entries: JournalEntry[];
}

export interface CreateEntryData {
    content: string;
    rating: number;
}