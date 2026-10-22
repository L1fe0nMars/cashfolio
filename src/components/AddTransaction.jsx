import { useState, useContext, useEffect, useEffectEvent, useRef } from 'react';
import { SaveDataContext } from '../context/SaveDataContext';
import '../css/AddTransaction.css';

const AddTransaction = ({ transaction, update, closeNewTransaction }) => {
    const today = new Date();
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const formattedDate = today.toLocaleDateString('en-US', options);
    const [mm, dd, yyyy] = formattedDate.split('/');
    const todaysDate = `${yyyy}-${mm}-${dd}`;

    const [name, setName] = useState(transaction?.name || '');
    const [desc, setDesc] = useState(transaction?.desc || '');
    const [category, setCategory] = useState(transaction?.category || '');
    const [type, setType] = useState(transaction?.type || 'expense');
    const [date, setDate] = useState(transaction?.date || todaysDate);
    const [amount, setAmount] = useState(transaction?.amount || '');
    const { data, addTransaction, updateTransaction } = useContext(SaveDataContext);
    const pressedBackground = useRef(false);

    const categories = [...new Set(data.transactions.map(existing => existing.category).filter(Boolean))].sort();

    const onEscape = useEffectEvent((event) => {
        if (event.key === 'Escape') {
            closeNewTransaction();
        }
    });

    useEffect(() => {
        document.addEventListener('keydown', onEscape);
        return () => document.removeEventListener('keydown', onEscape);
    }, []);

    // Only close when the click both starts and ends on the backdrop, so dragging out of an input doesn't discard the form
    const onClickBackground = (event) => {
        if (pressedBackground.current && event.target === event.currentTarget) {
            closeNewTransaction();
        }
    }

    const onSubmit = (event) => {
        event.preventDefault();

        const newTransaction = {
            id: transaction?.id || crypto.randomUUID(),
            type,
            name,
            desc,
            date,
            amount: Math.abs(Number(amount)),
            category
        }

        update ? updateTransaction(newTransaction) : addTransaction(newTransaction);
        closeNewTransaction();
    }

    return (
        <div className="background" onMouseDown={(event) => { pressedBackground.current = event.target === event.currentTarget; }} onClick={onClickBackground}>
            <div className="new-transaction">
                <h3>{update ? 'Update' : 'Add New'} Transaction</h3>
                <form id="new-transaction-form" onSubmit={onSubmit}>
                    <div className="form-section">
                        <label htmlFor="amount">Amount</label>
                        <input id="amount" type="number" value={amount} onChange={(event) => setAmount(event.target.value)} min="0.01" step="0.01" placeholder="0.00" required autoFocus />
                    </div>
                    <div className="form-type segmented">
                        <label>
                            <input type="radio" name="type" value="income" onChange={(event) => setType(event.target.value)} checked={type === 'income'} />
                            <span>Income</span>
                        </label>
                        <label>
                            <input type="radio" name="type" value="expense" onChange={(event) => setType(event.target.value)} checked={type === 'expense'} />
                            <span>Expense</span>
                        </label>
                    </div>
                    <div className="form-section">
                        <label htmlFor="date">Date</label>
                        <input id="date" type="date" value={date} onChange={(event) => setDate(event.target.value)} min="2024-01-01" max={todaysDate} required />
                    </div>
                    <div className="form-section">
                        <label htmlFor="name">Name</label>
                        <input id="name" type="text" value={name} onChange={(event) => setName(event.target.value)} placeholder="Transaction name" required />
                    </div>
                    <div className="form-section">
                        <label htmlFor="desc">Description</label>
                        <textarea id="desc" name="desc" rows="2" value={desc} onChange={(event) => setDesc(event.target.value)} placeholder="Description"></textarea>
                    </div>
                    <div className="form-section">
                        <label htmlFor="category">Category</label>
                        <input id="category" type="text" list="category-options" value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Category" />
                        <datalist id="category-options">
                            {categories.map(option => <option key={option} value={option} />)}
                        </datalist>
                    </div>
                </form>
                <div className="form-btns">
                    <button form="new-transaction-form" className="submit-btn" type="submit">{update ? 'Update' : 'Add'} Transaction</button>
                    <button className="cancel-transaction" onClick={closeNewTransaction}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default AddTransaction;
