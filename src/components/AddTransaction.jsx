import { useState, useContext } from 'react';
import { SaveDataContext } from '../context/SaveDataContext';
import '../css/AddTransaction.css';

const AddTransaction = () => {
    const dateObj = new Date();
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    const year = dateObj.getFullYear();
    const todaysDate = `${year}-${month}-${day}`;

    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [date, setDate] = useState(todaysDate);
    const [amount, setAmount] = useState(0);
    const { data, saveData, addTransaction } = useContext(SaveDataContext);

    const onSubmit = (event) => {
        event.preventDefault();

        const newTransaction = {
            id : Math.floor(Math.random() * 100000000),
            type: '',
            name,
            desc,
            date,
            amount,
            categories: []
        }

        addTransaction(newTransaction);
    }

    return (
        <div className="new-transaction">
            <h3>Add New Transaction</h3>
            <form onSubmit={onSubmit}>
                <div className="form-name">
                    <label htmlFor="name">Name</label>
                    <input type="text" value={name} onChange={(event) => setName(event.target.value)} placeholder="Transaction" required />
                </div>
                <div className="form-desc">
                    <label htmlFor="desc">Description</label>
                    <input type="text" value={desc} onChange={(event) => setDesc(event.target.value)} placeholder="Enter description..." />
                </div>
                <div className="form-date">
                    <label htmlFor="date">Date</label>
                    <input type="date" value={date} onChange={(event) => setDate(event.target.value)} min="2024-1-1" max={todaysDate} required />
                </div>
                <div className="form-amount">
                    <label htmlFor="amount">Amount</label>
                    <input type="number" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="Enter amount..." required />
                </div>
                
            </form>
            
        </div>
    );
}

export default AddTransaction;