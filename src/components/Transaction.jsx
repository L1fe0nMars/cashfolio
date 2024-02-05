import { useContext } from 'react';
import { SaveDataContext } from '../context/SaveDataContext';
import '../css/Transaction.css';

const Transaction = ({ transaction }) => {
    const { data } = useContext(SaveDataContext);



    return (
        <li className="transaction">
            {transaction.name}
            {transaction.desc}
            <span>{data.currency}{transaction.amount.toFixed(2)}</span>
        </li>
    );
}

export default Transaction;