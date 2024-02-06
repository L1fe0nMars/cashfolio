import { useContext } from 'react';
import { SaveDataContext } from '../context/SaveDataContext';
import '../css/Transaction.css';

const Transaction = ({ transaction }) => {
    const { data } = useContext(SaveDataContext);



    return (
        <li className="transaction">
            <div className="transaction-info">
                <span className="name">{transaction.name}</span>
                <span className="desc">{transaction.desc}</span>
                <span className="date">{transaction.date}</span>
            </div>
            <span className={`amount ${transaction.type}`}>{data.currency}{transaction.amount.toFixed(2)}</span>
        </li>
    );
}

export default Transaction;