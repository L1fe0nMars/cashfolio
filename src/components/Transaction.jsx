import { useState, useContext } from 'react';
import { SaveDataContext } from '../context/SaveDataContext';
import AddTransaction from './AddTransaction';
import formatAmount from '../utils/formatAmount';
import '../css/Transaction.css';

const Transaction = ({ transaction, onDelete }) => {
    const { data } = useContext(SaveDataContext);
    const [showOptions, setShowOptions] = useState(false);
    const [editTransaction, setEditTransaction] = useState(false);
    const { currency } = data;

    const toggleEditTransaction = (display) => {
        setEditTransaction(display);
    }

    const onClickTransaction = () => {
        if (!editTransaction) {
            setShowOptions(!showOptions);
        }
    }

    return (
        <li className="transaction" onClick={onClickTransaction}>
            {editTransaction && <AddTransaction closeNewTransaction={() => toggleEditTransaction(false)} transaction={transaction} update={true} />}

            <div className="transaction-entry">
                <div className="transaction-info">
                    <span className="name">{transaction.name}</span>
                    <span className="desc">{transaction.desc}</span>
                    {transaction.category && (
                        <span className="category">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
                                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                                <line x1="7" y1="7" x2="7.01" y2="7"/>
                            </svg>
                            {transaction.category}
                        </span>
                    )}
                </div>
                <div className="transaction-info-right">
                    <span className={`amount ${transaction.type}`}>
                        {formatAmount(transaction.type === 'expense' ? -transaction.amount : transaction.amount, currency, true)}
                    </span>                </div>
            </div>
            {showOptions && <>
                <button className="edit-transaction" onClick={() => setEditTransaction(true)} title="Edit transaction" aria-label="Edit transaction">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                        <path d="M22.853,1.148a3.626,3.626,0,0,0-5.124,0L1.465,17.412A4.968,4.968,0,0,0,0,20.947V23a1,1,0,0,0,1,1H3.053a4.966,4.966,0,0,0,3.535-1.464L22.853,6.271A3.626,3.626,0,0,0,22.853,1.148ZM5.174,21.122A3.022,3.022,0,0,1,3.053,22H2V20.947a2.98,2.98,0,0,1,.879-2.121L15.222,6.483l2.3,2.3ZM21.438,4.857,18.932,7.364l-2.3-2.295,2.507-2.507a1.623,1.623,0,1,1,2.295,2.3Z"/>
                    </svg>
                </button>
                <button className="delete-transaction" onClick={onDelete} title="Delete transaction" aria-label="Delete transaction">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                        <path d="M21,4H17.9A5.009,5.009,0,0,0,13,0H11A5.009,5.009,0,0,0,6.1,4H3A1,1,0,0,0,3,6H4V19a5.006,5.006,0,0,0,5,5h6a5.006,5.006,0,0,0,5-5V6h1a1,1,0,0,0,0-2ZM11,2h2a3.006,3.006,0,0,1,2.829,2H8.171A3.006,3.006,0,0,1,11,2Zm7,17a3,3,0,0,1-3,3H9a3,3,0,0,1-3-3V6H18Z"/>
                        <path d="M10,18a1,1,0,0,0,1-1V11a1,1,0,0,0-2,0v6A1,1,0,0,0,10,18Z"/>
                        <path d="M14,18a1,1,0,0,0,1-1V11a1,1,0,0,0-2,0v6A1,1,0,0,0,14,18Z"/>
                    </svg>
                </button>
            </>}
        </li>
    );
}

export default Transaction;