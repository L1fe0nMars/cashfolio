import { useState, useContext } from 'react';
import { SaveDataContext } from '../context/SaveDataContext';
import AddTransaction from './AddTransaction';
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
    const [showOptions, setShowOptions] = useState(false);
    const [editTransaction, setEditTransaction] = useState(false);

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
            {
                editTransaction
                ? (
                    <AddTransaction closeNewTransaction={() => toggleEditTransaction(false)} transaction={transaction} update={true} />
                )
                : (
                    <>
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
                        {showOptions && <>
                            <button className="edit-transaction" onClick={() => setEditTransaction(true)} aria-label="Edit transaction">
                                <svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="24" height="24">
                                    <path d="M22.853,1.148a3.626,3.626,0,0,0-5.124,0L1.465,17.412A4.968,4.968,0,0,0,0,20.947V23a1,1,0,0,0,1,1H3.053a4.966,4.966,0,0,0,3.535-1.464L22.853,6.271A3.626,3.626,0,0,0,22.853,1.148ZM5.174,21.122A3.022,3.022,0,0,1,3.053,22H2V20.947a2.98,2.98,0,0,1,.879-2.121L15.222,6.483l2.3,2.3ZM21.438,4.857,18.932,7.364l-2.3-2.295,2.507-2.507a1.623,1.623,0,1,1,2.295,2.3Z"/>
                                </svg>
                            </button>
                            <button className="delete-transaction" onClick={() => deleteTransaction(transaction.id)} aria-label="Delete transaction">
                                <svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="24" height="24">
                                    <path d="M21,4H17.9A5.009,5.009,0,0,0,13,0H11A5.009,5.009,0,0,0,6.1,4H3A1,1,0,0,0,3,6H4V19a5.006,5.006,0,0,0,5,5h6a5.006,5.006,0,0,0,5-5V6h1a1,1,0,0,0,0-2ZM11,2h2a3.006,3.006,0,0,1,2.829,2H8.171A3.006,3.006,0,0,1,11,2Zm7,17a3,3,0,0,1-3,3H9a3,3,0,0,1-3-3V6H18Z"/>
                                    <path d="M10,18a1,1,0,0,0,1-1V11a1,1,0,0,0-2,0v6A1,1,0,0,0,10,18Z"/>
                                    <path d="M14,18a1,1,0,0,0,1-1V11a1,1,0,0,0-2,0v6A1,1,0,0,0,14,18Z"/>
                                </svg>
                            </button>
                        </>}
                    </>
                )
            }
        </li>
    );
}

export default Transaction;