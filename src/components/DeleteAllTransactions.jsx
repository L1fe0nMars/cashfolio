import { useState, useContext } from 'react';
import { SaveDataContext } from '../context/SaveDataContext';
import '../css/DeleteAllTransactions.css';

const DeleteAllTransactions = () => {
    const { data, deleteTransaction } = useContext(SaveDataContext);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const { transactions } = data;

    const deleteAll = () => {
        transactions.map(transaction => deleteTransaction(transaction.id));
        setShowConfirmation(false);
    }

    return (
        <div className="delete-all">
            {
                transactions.length > 0
                && !showConfirmation
                && <button className="delete-all-btn" onClick={() => setShowConfirmation(!showConfirmation)}>Delete All Transactions</button>
            }

            {showConfirmation && <div className="delete-confirm">
                <p>Are you sure you want to delete all transactions? This cannot be undone.</p>
                <div className="confirm-btns">
                    <button className="confirm-delete" onClick={deleteAll}>Delete</button>
                    <button className="confirm-cancel" onClick={() => setShowConfirmation(false)}>Cancel</button>
                </div>
            </div>}
        </div>
    );
}

export default DeleteAllTransactions;