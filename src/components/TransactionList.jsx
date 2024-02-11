import { useState, useContext } from 'react';
import { SaveDataContext } from '../context/SaveDataContext';
import Transaction from './Transaction';
import AddTransaction from './AddTransaction';
import DeleteAllTransactions from './DeleteAllTransactions';
import '../css/TransactionList.css';

const TransactionList = () => {
    const date = new Date();
    const year = date.getFullYear();
    
    const { data } = useContext(SaveDataContext);
    const [dropdownVal, setDropdownVal] = useState('all');
    const [dropdownMonth, setDropdownMonth] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [newTransaction, setNewTransaction] = useState(false);

    const total = (type = '') => data.transactions
        .filter(transaction => transaction.type.includes(type))
        .filter(transaction => transaction.name.toLowerCase().includes(searchTerm) || transaction.desc.toLowerCase().includes(searchTerm))
        .filter(transaction => transaction.date.includes(`2024-${dropdownMonth}`))
        .reduce((total, transaction) => {
            return transaction.type === 'income' ? total + transaction.amount : total - transaction.amount;
        }, 0);

    const sign = total() < 0 ? '-' : '';

    const toggleNewTransaction = (display) => {
        setNewTransaction(display);
    }

    return (
        <div className="transaction-home">
            <div className="transaction-header">
                <h2>Total</h2>
                <span className={total() > 0 ? 'income' : 'expense'}>
                    {`${sign}${data.currency}${Math.abs(total()).toFixed(2)}`}
                </span>
                <div className="income-expense">
                    <div className="income-total">
                        <h2>Income</h2>
                        <span className="income">{`${data.currency}${total('income')}`}</span>
                    </div>
                    <div className="expense-total">
                        <h2>Expenses</h2>
                        <span className="expense">{`${data.currency}${Math.abs(total('expense'))}`}</span>
                    </div>
                </div>
            </div>

            <div className="transaction-list">
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

                <div className="filter-options">
                    {
                        <form className="date-period">
                            <label>Month: </label>
                            <select value={dropdownMonth} onChange={(event) => setDropdownMonth(event.target.value)}>
                                <option value="">Any</option>
                                {
                                    Array.from({ length: 12 }, (_, index) => {
                                        const month = String(index).padStart(2, '0');
                                        const monthName = new Date(`${year}-${month}-12`).toLocaleString('en-US', { month: 'long' });
                                        const hasTransactions = data.transactions.filter(transaction => transaction.date.includes(`${year}-${month}`)).length > 0;
                                        
                                        return hasTransactions && <option key={month} value={month}>{monthName}</option>;
                                    })
                                }
                            </select>
                        </form>
                    }

                    <div className="search">
                        <svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="24" height="24">
                            <path d="M23.707,22.293l-5.969-5.969a10.016,10.016,0,1,0-1.414,1.414l5.969,5.969a1,1,0,0,0,1.414-1.414ZM10,18a8,8,0,1,1,8-8A8.009,8.009,0,0,1,10,18Z"/>
                        </svg>
                        <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value.toLowerCase())} placeholder="Search" />
                    </div>
                </div>

                {newTransaction && <AddTransaction closeNewTransaction={() => toggleNewTransaction(false)} />}

                {
                    data.transactions.length === 0
                    || data.transactions.filter(transaction => transaction.name.toLowerCase().includes(searchTerm) || transaction.desc.toLowerCase().includes(searchTerm)).length === 0
                    ? (
                        <p className="no-transactions">No transactions found</p>
                    )
                    : (
                        <ul>
                            {
                                dropdownVal === 'all'
                                ? 
                                    data.transactions
                                        .sort((a, b) => {return new Date(b.date.replace(/-/g, '/')) - new Date(a.date.replace(/-/g, '/'))})
                                        .filter(transaction => transaction.name.toLowerCase().includes(searchTerm) || transaction.desc.toLowerCase().includes(searchTerm))
                                        .filter(transaction => transaction.date.includes(`2024-${dropdownMonth}`))
                                        .map(transaction => (<Transaction key={transaction.id} transaction={transaction} />))
                                        
                                :
                                    data.transactions.filter(transaction => transaction.type === dropdownVal).length === 0
                                    ? (
                                        <li className="no-transactions">No transactions found</li>
                                    )
                                    :
                                        data.transactions
                                            .filter(transaction => transaction.type === dropdownVal)
                                            .filter(transaction => transaction.name.toLowerCase().includes(searchTerm) || transaction.desc.toLowerCase().includes(searchTerm))
                                            .filter(transaction => transaction.date.includes(`2024-${dropdownMonth}`))
                                            .sort((a, b) => {return new Date(b.date.replace(/-/g, '/')) - new Date(a.date.replace(/-/g, '/'))})
                                            .map(transaction => (<Transaction key={transaction.id} transaction={transaction} />))
                            }
                        </ul>
                    )
                }

                <DeleteAllTransactions />
            </div>
        </div>
    );
}

export default TransactionList;