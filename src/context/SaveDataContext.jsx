import { createContext, useReducer, useEffect } from 'react';
import SaveDataReducer from './SaveDataReducer';

const initialData = {
    transactions: [
        {id: 0, type: 'income', name: 'ebay', desc: 'Money from ebay sale', date: '2024-1-26', amount: 13.5, categories: ['Sales']},
        {id: 1, type: 'expense', name: 'Karate', desc: 'Karate payment', date: '2024-2-5', amount: 129, categories: ['Subscription', 'Recurring']},
        {id: 2, type: 'income', name: 'Y', desc: 'Paycheck', date: '2024-1-19', amount: 113.81, categories: ['Paycheck']},
    ],
    darkMode: false,
    currency: '$',
}

export const SaveDataContext = createContext(initialData);

export const SaveDataProvider = ({ children }) => {
    const savedData = JSON.parse(localStorage.getItem('data'));
    const [data, dispatch] = useReducer(SaveDataReducer, savedData || initialData);

    useEffect(() => {
        localStorage.setItem('data', JSON.stringify(data));
    }, [data]);

    const saveData = (newData) => {
        dispatch({
            type: 'SAVE_DATA',
            payload: newData
        });
    }

    const deleteTransaction = (id) => {
        dispatch({
            type: 'DELETE_TRANSACTION',
            payload: id
        });
    }

    const addTransaction = (transaction) => {
        dispatch({
            type: 'ADD_TRANSACTION',
            payload: transaction
        });
    }

    const updateTransaction = (transaction) => {
        dispatch({
            type: 'UPDATE_TRANSACTION',
            payload: transaction
        });
    }

    return (
        <SaveDataContext.Provider value={{ 
            data,
            saveData,
            deleteTransaction,
            addTransaction,
            updateTransaction
        }}>
            {children}
        </SaveDataContext.Provider>
    );
}