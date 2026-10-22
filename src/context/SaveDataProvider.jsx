import { useReducer, useEffect } from 'react';
import { SaveDataContext, initialData } from './SaveDataContext';
import SaveDataReducer from './SaveDataReducer';

const loadData = () => {
    try {
        const savedData = JSON.parse(localStorage.getItem('data'));
        if (!savedData) return initialData;

        return {
            ...savedData,
            // Transactions created before UUIDs have numeric ids, which import rejects, so upgrade them for future exports
            transactions: savedData.transactions.map(transaction =>
                typeof transaction.id === 'string' ? transaction : { ...transaction, id: crypto.randomUUID() }
            )
        };
    } catch {
        return initialData;
    }
}

const SaveDataProvider = ({ children }) => {
    const [data, dispatch] = useReducer(SaveDataReducer, null, loadData);

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
        <SaveDataContext value={{
            data,
            saveData,
            deleteTransaction,
            addTransaction,
            updateTransaction
        }}>
            {children}
        </SaveDataContext>
    );
}

export default SaveDataProvider;
