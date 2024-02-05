import { useContext } from 'react';
import { SaveDataContext } from '../context/SaveDataContext';
import Transaction from './Transaction';
import '../css/TransactionList.css';

const TransactionList = () => {
    const { data } = useContext(SaveDataContext);

    return (
        <div className="transaction-list">
            <ul>
                {data.transactions.map(transaction => (<Transaction key={transaction.id} transaction={transaction} />))}
            </ul>
        </div>
    );
}

export default TransactionList;