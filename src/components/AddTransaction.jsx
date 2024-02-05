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
                
            </form>
            
        </div>
    );
}

export default AddTransaction;