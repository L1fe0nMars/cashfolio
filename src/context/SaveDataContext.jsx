import { createContext, useReducer, useEffect } from 'react';
import SaveDataReducer from './SaveDataReducer';

const initialData = {
    transactions: [],
    darkMode: false,
    currency: '$',
    dateFormat: 'mm/dd'
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