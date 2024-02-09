import { useState, useContext } from 'react';
import { SaveDataContext } from '../context/SaveDataContext';
import Transaction from './Transaction';
import AddTransaction from './AddTransaction';
import '../css/TransactionList.css';

const TransactionList = () => {
    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const todaysDate = `${year}-${month}`;
    const monthName = date.toLocaleString('default', { month: 'long' });
    
    const { data } = useContext(SaveDataContext);
    const [dropdownVal, setDropdownVal] = useState('all');
    const [newTransaction, setNewTransaction] = useState(false);

    const toggleNewTransaction = (display) => {
        setNewTransaction(display);
    }

    return (
        <div className="transaction-list">
            {/*
            <div className="date-period">
                <button>
                    <svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="24" height="24">
                        <path d="M10.6,12.71a1,1,0,0,1,0-1.42l4.59-4.58a1,1,0,0,0,0-1.42,1,1,0,0,0-1.41,0L9.19,9.88a3,3,0,0,0,0,4.24l4.59,4.59a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.42Z"/>
                    </svg>
                </button>
                <h3>{monthName}</h3>
                <button>
                    <svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="24" height="24">
                        <path d="M15.4,9.88,10.81,5.29a1,1,0,0,0-1.41,0,1,1,0,0,0,0,1.42L14,11.29a1,1,0,0,1,0,1.42L9.4,17.29a1,1,0,0,0,1.41,1.42l4.59-4.59A3,3,0,0,0,15.4,9.88Z"/>
                    </svg>
                </button>
            </div>
            */}
            
            <div className="transaction-options">
                <form className="dropdown">
                    <select value={dropdownVal} onChange={(event) => setDropdownVal(event.target.value)}>
                        <option value="all">Transactions</option>
                        <option value="income">Income</option>
                        <option value="expense">Expenses</option>
                    </select>
                </form>

                <button className="add-transaction-btn" onClick={() => toggleNewTransaction(true)} aria-label="Add transaction">
                    <svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="24" height="24">
                        <path d="M17,11H13V7a1,1,0,0,0-1-1h0a1,1,0,0,0-1,1v4H7a1,1,0,0,0-1,1H6a1,1,0,0,0,1,1h4v4a1,1,0,0,0,1,1h0a1,1,0,0,0,1-1V13h4a1,1,0,0,0,1-1h0A1,1,0,0,0,17,11Z"/>
                    </svg>
                </button>
            </div>

            {newTransaction && <AddTransaction closeNewTransaction={() => toggleNewTransaction(false)} />}

            {
                data.transactions.length === 0
                ? (
                    <span>No transactions found</span>
                )
                : (
                    <ul>
                        {
                            dropdownVal === 'all'
                            ? 
                                data.transactions
                                    .sort((a, b) => {return new Date(b.date.replace(/-/g, '/')) - new Date(a.date.replace(/-/g, '/'))})
                                    .map(transaction => (<Transaction key={transaction.id} transaction={transaction} />))
                                    
                            :
                                data.transactions
                                    .filter(transaction => transaction.type === dropdownVal)
                                    .sort((a, b) => {return new Date(b.date.replace(/-/g, '/')) - new Date(a.date.replace(/-/g, '/'))})
                                    .map(transaction => (<Transaction key={transaction.id} transaction={transaction} />))
                        }
                    </ul>
                )
            }
            
        </div>
    );
}

export default TransactionList;