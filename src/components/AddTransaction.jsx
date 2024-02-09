import { useState, useContext } from 'react';
import { SaveDataContext } from '../context/SaveDataContext';
import '../css/AddTransaction.css';

const AddTransaction = (props) => {
    const today = new Date();
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const formattedDate = today.toLocaleDateString('en-US', options);
    const [mm, dd, yyyy] = formattedDate.split('/');
    const todaysDate = `${yyyy}-${mm}-${dd}`;
    
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [category, setCategory] = useState('');
    const [type, setType] = useState('income');
    const [date, setDate] = useState(todaysDate);
    const [amount, setAmount] = useState('');
    const { data, saveData, addTransaction } = useContext(SaveDataContext);

    const onSubmit = (event) => {
        event.preventDefault();

        const newTransaction = {
            id : Math.floor(Math.random() * 100000000),
            type,
            name,
            desc,
            date,
            amount: Number(amount),
            category
        }

        addTransaction(newTransaction);
        props.closeNewTransaction();
    }

    return (
        <div className="new-transaction">
            <h3>Add New Transaction</h3>
            <form id="new-transaction-form" onSubmit={onSubmit}>
                <div className="form-section">
                    <label htmlFor="amount">Amount</label>
                    <input type="number" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0.00" required />
                </div>
                <div className="form-type">
                    
                    <input type="radio" id="radio1" value="income" onChange={(event) => setType(event.target.value)} checked={type === 'income'} />
                    <label htmlFor="radio1">Income</label>
                    <input type="radio" id="radio2" value="expense" onChange={(event) => setType(event.target.value)} checked={type === 'expense'} />
                    <label htmlFor="radio2">Expense</label>
                </div>
                <div className="form-section">
                    <label htmlFor="date">Date</label>
                    <input type="date" value={date} onChange={(event) => setDate(event.target.value)} min="2024-01-01" max={todaysDate} required />
                </div>
                <div className="form-section">
                    <label htmlFor="name">Name</label>
                    <input type="text" value={name} onChange={(event) => setName(event.target.value)} placeholder="Transaction" required />
                </div>
                <div className="form-section">
                    <label htmlFor="desc">Description</label>
                    <textarea id="message" name="desc" rows="2"></textarea>
                </div>
                <div className="form-section">
                    <label htmlFor="category">Category</label>
                    <input type="text" value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Category" />
                </div>
            </form>
            <div className="form-btns">
                <button form="new-transaction-form" className="submit-btn" type="submit">Add Transaction</button>
                <button className="cancel-transaction" onClick={props.closeNewTransaction}>Cancel</button>
            </div>
        </div>
    );
}

export default AddTransaction;