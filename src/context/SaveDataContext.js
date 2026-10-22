import { createContext } from 'react';

export const initialData = {
    transactions: [],
    darkMode: false,
    currency: '$',
    dateFormat: 'mm/dd'
}

export const SaveDataContext = createContext(initialData);
