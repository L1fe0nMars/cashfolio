import { useState, useContext, useEffect } from 'react';
import { SaveDataContext } from '../context/SaveDataContext';
import Transaction from './Transaction';
import AddTransaction from './AddTransaction';
import DeleteAllTransactions from './DeleteAllTransactions';
import formatAmount from '../utils/formatAmount';
import '../css/TransactionList.css';

const months = Array.from({ length: 12 }, (_, index) => ({
    value: String(index + 1).padStart(2, '0'),
    name: new Date(2000, index).toLocaleString('en-US', { month: 'long' })
}));

const typeOptions = [
    { value: 'all', label: 'All' },
    { value: 'income', label: 'Income' },
    { value: 'expense', label: 'Expenses' }
];

const TransactionList = () => {
    const currentYear = String(new Date().getFullYear());

    const { data, addTransaction, deleteTransaction } = useContext(SaveDataContext);
    const { transactions, currency } = data;

    const [typeFilter, setTypeFilter] = useState('all');
    const [dropdownMonth, setDropdownMonth] = useState('');
    const [dropdownYear, setDropdownYear] = useState(currentYear);
    const [searchTerm, setSearchTerm] = useState('');
    const [newTransaction, setNewTransaction] = useState(false);
    const [deletedTransaction, setDeletedTransaction] = useState(null);

    useEffect(() => {
        if (!deletedTransaction) return;

        const timeout = setTimeout(() => setDeletedTransaction(null), 5000);
        return () => clearTimeout(timeout);
    }, [deletedTransaction]);

    // The selected year stays listed even if its last transaction is deleted, so the dropdown never shows a value it doesn't have
    const years = [...new Set([currentYear, dropdownYear, ...transactions.map(transaction => transaction.date.split('-')[0])])]
        .sort((a, b) => b - a);

    const search = searchTerm.trim().toLowerCase();
    const periodTransactions = transactions
        .filter(transaction => transaction.date.includes(`${dropdownYear}-${dropdownMonth}`))
        .filter(transaction => [transaction.name, transaction.desc, transaction.category]
            .some(field => (field || '').toLowerCase().includes(search)))
        .sort((a, b) => b.date.localeCompare(a.date));

    const visibleTransactions = typeFilter === 'all'
        ? periodTransactions
        : periodTransactions.filter(transaction => transaction.type === typeFilter);

    const sumOf = (type) => periodTransactions
        .filter(transaction => transaction.type === type)
        .reduce((total, transaction) => total + transaction.amount, 0);

    const incomeTotal = sumOf('income');
    const expenseTotal = sumOf('expense');
    const netTotal = Math.round((incomeTotal - expenseTotal) * 100) / 100;
    const netClass = netTotal > 0 ? 'income' : (netTotal < 0 ? 'expense' : '');

    const removeTransaction = (transaction) => {
        deleteTransaction(transaction.id);
        setDeletedTransaction(transaction);
    }

    const undoDelete = () => {
        addTransaction(deletedTransaction);
        setDeletedTransaction(null);
    }

    return (
        <div className="transaction-home">
            <div className="transaction-header">
                <h2>Total</h2>
                <span className={netClass}>{formatAmount(netTotal, currency, true)}</span>
                <div className="income-expense">
                    <div className="income-total">
                        <h2>Income</h2>
                        <span className="income">{formatAmount(incomeTotal, currency)}</span>
                    </div>
                    <div className="expense-total">
                        <h2>Expenses</h2>
                        <span className="expense">{formatAmount(expenseTotal, currency)}</span>
                    </div>
                </div>
            </div>

            <div className="transaction-list">
                <div className="transaction-options">
                    <div className="segmented" role="radiogroup" aria-label="Transaction type">
                        {typeOptions.map(option => (
                            <label key={option.value}>
                                <input type="radio" name="type-filter" value={option.value} onChange={(event) => setTypeFilter(event.target.value)} checked={typeFilter === option.value} />
                                <span>{option.label}</span>
                            </label>
                        ))}
                    </div>

                    <button className="add-transaction-btn" onClick={() => setNewTransaction(true)} title="Add transaction" aria-label="Add transaction">
                        <svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="24" height="24">
                            <path d="M17,11H13V7a1,1,0,0,0-1-1h0a1,1,0,0,0-1,1v4H7a1,1,0,0,0-1,1H6a1,1,0,0,0,1,1h4v4a1,1,0,0,0,1,1h0a1,1,0,0,0,1-1V13h4a1,1,0,0,0,1-1h0A1,1,0,0,0,17,11Z"/>
                        </svg>
                    </button>
                </div>

                <div className="filter-options">
                    <form className="date-period">
                        <div className='month-dropdown'>
                            <label>Month: </label>
                            <select value={dropdownMonth} onChange={(event) => setDropdownMonth(event.target.value)}>
                                <option value="">Any</option>
                                {months.map(month => (
                                    <option key={month.value} value={month.value}>{month.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className='year-dropdown'>
                            <label>Year: </label>
                            <select value={dropdownYear} onChange={(event) => setDropdownYear(event.target.value)}>
                                {years.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                    </form>

                    <div className="search">
                        <svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="24" height="24">
                            <path d="M23.707,22.293l-5.969-5.969a10.016,10.016,0,1,0-1.414,1.414l5.969,5.969a1,1,0,0,0,1.414-1.414ZM10,18a8,8,0,1,1,8-8A8.009,8.009,0,0,1,10,18Z"/>
                        </svg>
                        <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search name, description, category" aria-label="Search transactions" />
                    </div>
                </div>

                {newTransaction && <AddTransaction closeNewTransaction={() => setNewTransaction(false)} />}

                <ul>
                    {
                        visibleTransactions.length === 0
                        ? <li className="no-transactions">No transactions found</li>
                        : visibleTransactions.map(transaction => (
                            <Transaction key={transaction.id} transaction={transaction} onDelete={() => removeTransaction(transaction)} />
                        ))
                    }
                </ul>

                <DeleteAllTransactions />
            </div>

            {deletedTransaction && (
                <div className="undo-toast" role="status">
                    <span>Deleted &quot;{deletedTransaction.name}&quot;</span>
                    <button onClick={undoDelete}>Undo</button>
                </div>
            )}
        </div>
    );
}

export default TransactionList;
