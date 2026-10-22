import { useState, useContext, useEffect, useRef } from 'react';
import { SaveDataContext } from '../context/SaveDataContext';
import Transaction from './Transaction';
import AddTransaction from './AddTransaction';
import DeleteAllTransactions from './DeleteAllTransactions';
import formatAmount from '../utils/formatAmount';
import formatDate from '../utils/formatDate';
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

const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'highest', label: 'Highest amount' },
    { value: 'lowest', label: 'Lowest amount' }
];

const sortComparators = {
    newest: (a, b) => b.date.localeCompare(a.date),
    oldest: (a, b) => a.date.localeCompare(b.date),
    highest: (a, b) => b.amount - a.amount || b.date.localeCompare(a.date),
    lowest: (a, b) => a.amount - b.amount || b.date.localeCompare(a.date)
};

const roundCents = (amount) => Math.round(amount * 100) / 100;

const netOf = (transactions) => roundCents(transactions.reduce((total, transaction) => {
    return transaction.type === 'income' ? total + transaction.amount : total - transaction.amount;
}, 0));

const amountClass = (amount) => amount > 0 ? 'income' : (amount < 0 ? 'expense' : '');

const TransactionList = () => {
    const currentYear = String(new Date().getFullYear());

    const { data, addTransaction, deleteTransaction } = useContext(SaveDataContext);
    const { transactions, currency, dateFormat } = data;

    const [typeFilter, setTypeFilter] = useState('all');
    const [sortOrder, setSortOrder] = useState('newest');
    const [dropdownMonth, setDropdownMonth] = useState('');
    const [dropdownYear, setDropdownYear] = useState(currentYear);
    const [searchTerm, setSearchTerm] = useState('');
    const [newTransaction, setNewTransaction] = useState(false);
    const [deletedTransaction, setDeletedTransaction] = useState(null);
    const searchInput = useRef(null);

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
        .filter(transaction => transaction.date.startsWith(`${dropdownYear}-${dropdownMonth}`))
        .filter(transaction => [transaction.name, transaction.desc, transaction.category]
            .some(field => (field || '').toLowerCase().includes(search)));

    const visibleTransactions = periodTransactions
        .filter(transaction => typeFilter === 'all' || transaction.type === typeFilter)
        .sort(sortComparators[sortOrder]);

    let incomeTotal = 0;
    let expenseTotal = 0;
    for (const transaction of periodTransactions) {
        if (transaction.type === 'income') {
            incomeTotal += transaction.amount;
        }
        else {
            expenseTotal += transaction.amount;
        }
    }
    const netTotal = roundCents(incomeTotal - expenseTotal);

    // Amount sorts can't keep days together, so they show a flat list with the date on each row instead
    const groupByDate = sortOrder === 'newest' || sortOrder === 'oldest';

    // With a date sort, each day's transactions are already adjacent
    const dateGroups = [];
    if (groupByDate) {
        for (const transaction of visibleTransactions) {
            const lastGroup = dateGroups[dateGroups.length - 1];

            if (lastGroup?.date === transaction.date) {
                lastGroup.transactions.push(transaction);
            }
            else {
                dateGroups.push({ date: transaction.date, transactions: [transaction] });
            }
        }
    }

    const period = dropdownMonth
        ? `${months.find(month => month.value === dropdownMonth).name} ${dropdownYear}`
        : dropdownYear;
    const periodLabel = search ? `${period} · Matching "${searchTerm.trim()}"` : period;

    const removeTransaction = (transaction) => {
        deleteTransaction(transaction.id);
        setDeletedTransaction(transaction);
    }

    const clearSearch = () => {
        setSearchTerm('');
        searchInput.current.focus();
    }

    const undoDelete = () => {
        addTransaction(deletedTransaction);
        setDeletedTransaction(null);
    }

    return (
        <div className="transaction-home">
            <div className="transaction-header">
                <h2>Total</h2>
                <p className="period-label">{periodLabel}</p>
                <span className={amountClass(netTotal)}>{formatAmount(netTotal, currency, true)}</span>
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
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                            <path d="M17,11H13V7a1,1,0,0,0-1-1h0a1,1,0,0,0-1,1v4H7a1,1,0,0,0-1,1H6a1,1,0,0,0,1,1h4v4a1,1,0,0,0,1,1h0a1,1,0,0,0,1-1V13h4a1,1,0,0,0,1-1h0A1,1,0,0,0,17,11Z"/>
                        </svg>
                    </button>
                </div>

                <div className="filter-options">
                    <form className="date-period">
                        <div className='month-dropdown'>
                            <label htmlFor="month-filter">Month</label>
                            <select id="month-filter" value={dropdownMonth} onChange={(event) => setDropdownMonth(event.target.value)}>
                                <option value="">Any</option>
                                {months.map(month => (
                                    <option key={month.value} value={month.value}>{month.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className='year-dropdown'>
                            <label htmlFor="year-filter">Year</label>
                            <select id="year-filter" value={dropdownYear} onChange={(event) => setDropdownYear(event.target.value)}>
                                {years.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                        <div className='sort-dropdown'>
                            <label htmlFor="sort-order">Sort</label>
                            <select id="sort-order" value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}>
                                {sortOptions.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>
                    </form>

                    <div className="search">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                            <path d="M23.707,22.293l-5.969-5.969a10.016,10.016,0,1,0-1.414,1.414l5.969,5.969a1,1,0,0,0,1.414-1.414ZM10,18a8,8,0,1,1,8-8A8.009,8.009,0,0,1,10,18Z"/>
                        </svg>
                        <div className="search-field">
                            <input ref={searchInput} value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search name, description, category" aria-label="Search transactions" />
                            {searchTerm && (
                                <button type="button" className="clear-search" onClick={clearSearch} aria-label="Clear search">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
                                        <path d="M18.71,5.29a1,1,0,0,0-1.42,0L12,10.59,6.71,5.29A1,1,0,0,0,5.29,6.71L10.59,12,5.29,17.29a1,1,0,1,0,1.42,1.42L12,13.41l5.29,5.3a1,1,0,0,0,1.42-1.42L13.41,12l5.3-5.29A1,1,0,0,0,18.71,5.29Z"/>
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {newTransaction && <AddTransaction closeNewTransaction={() => setNewTransaction(false)} />}

                <ul>
                    {
                        visibleTransactions.length === 0
                        ? <li className="no-transactions">No transactions found</li>
                        : !groupByDate
                        ? visibleTransactions.map(transaction => (
                            <Transaction key={transaction.id} transaction={transaction} onDelete={() => removeTransaction(transaction)} showDate />
                        ))
                        : dateGroups.map(group => {
                            const dayNet = netOf(group.transactions);

                            return (
                                <li key={group.date} className="date-group">
                                    <div className="date-header">
                                        <span>{formatDate(group.date, dateFormat)}</span>
                                        <span className={amountClass(dayNet)}>{formatAmount(dayNet, currency, true)}</span>
                                    </div>
                                    <ul>
                                        {group.transactions.map(transaction => (
                                            <Transaction key={transaction.id} transaction={transaction} onDelete={() => removeTransaction(transaction)} />
                                        ))}
                                    </ul>
                                </li>
                            );
                        })
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
