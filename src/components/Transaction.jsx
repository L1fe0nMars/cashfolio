import { useState, useContext } from 'react';
import { SaveDataContext } from '../context/SaveDataContext';
import '../css/Transaction.css';

const formatDate = (dateString, dateFormat) => {
    const date = new Date(dateString.replace(/-/g, '/'));
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
        return 'Today';
    }
    else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    }
    else {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options);
        const [mm, dd, yyyy] = formattedDate.split('/');
        const yy = yyyy.slice(-2);
        
        if (dateFormat === 'mm/dd') {
            return `${mm}/${dd}/${yy}`;
        }
        else {
            return `${dd}/${mm}/${yy}`;
        }
    }
}

const Transaction = ({ transaction }) => {
    const { data, deleteTransaction } = useContext(SaveDataContext);
    const [showDeleteBtn, setShowDeleteBtn] = useState(false);

    return (
        <li className="transaction" onClick={() => setShowDeleteBtn(!showDeleteBtn)}>
            <div className="transaction-entry">
                <div className="transaction-info">
                    <span className="name">{transaction.name}</span>
                    <span className="desc">{transaction.desc}</span>
                </div>
                <div className="transaction-info-right">
                    <span className={`amount ${transaction.type}`}>{data.currency}{transaction.amount.toFixed(2)}</span>
                    <span className="date">{formatDate(transaction.date, data.dateFormat)}</span>
                </div>
            </div>
            {showDeleteBtn && <button className="delete-transaction" onClick={() => deleteTransaction(transaction.id)} aria-label="Delete transaction">
                <svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="24" height="24">
                    <path d="M21,4H17.9A5.009,5.009,0,0,0,13,0H11A5.009,5.009,0,0,0,6.1,4H3A1,1,0,0,0,3,6H4V19a5.006,5.006,0,0,0,5,5h6a5.006,5.006,0,0,0,5-5V6h1a1,1,0,0,0,0-2ZM11,2h2a3.006,3.006,0,0,1,2.829,2H8.171A3.006,3.006,0,0,1,11,2Zm7,17a3,3,0,0,1-3,3H9a3,3,0,0,1-3-3V6H18Z"/>
                    <path d="M10,18a1,1,0,0,0,1-1V11a1,1,0,0,0-2,0v6A1,1,0,0,0,10,18Z"/><path d="M14,18a1,1,0,0,0,1-1V11a1,1,0,0,0-2,0v6A1,1,0,0,0,14,18Z"/>
                </svg>
            </button>}
        </li>
    );
}

export default Transaction;