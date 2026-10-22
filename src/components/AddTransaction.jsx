import { useContext, useRef } from 'react';
import { SaveDataContext } from '../context/SaveDataContext';
import Modal from './Modal';
import '../css/AddTransaction.css';

const AddTransaction = ({ transaction, template, closeNewTransaction }) => {
    const update = Boolean(transaction);
    // A template prefills a new transaction (used by duplicate), but the id and date stay new
    const defaults = transaction || template;
    const today = new Date();
    const todaysDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const { data, addTransaction, updateTransaction } = useContext(SaveDataContext);
    const amountInput = useRef(null);

    const categories = [...new Set(data.transactions.map(existing => existing.category).filter(Boolean))].sort();

    const submitTransaction = (formData) => {
        const newTransaction = {
            id: transaction?.id || crypto.randomUUID(),
            type: formData.get('type'),
            name: formData.get('name'),
            desc: formData.get('desc'),
            date: formData.get('date'),
            amount: Math.abs(Number(formData.get('amount'))),
            category: formData.get('category')
        }

        update ? updateTransaction(newTransaction) : addTransaction(newTransaction);
        closeNewTransaction();
    }

    return (
        <Modal className="new-transaction" onClose={closeNewTransaction} initialFocus={amountInput}>
            <h3>{update ? 'Update' : (template ? 'Duplicate' : 'Add New')} Transaction</h3>
            <form id="new-transaction-form" action={submitTransaction}>
                <div className="form-section">
                    <label htmlFor="amount">Amount</label>
                    <input ref={amountInput} id="amount" name="amount" type="number" defaultValue={defaults?.amount} min="0.01" step="0.01" placeholder="0.00" required />
                </div>
                <div className="form-type segmented">
                    <label>
                        <input type="radio" name="type" value="income" defaultChecked={defaults?.type === 'income'} />
                        <span>Income</span>
                    </label>
                    <label>
                        <input type="radio" name="type" value="expense" defaultChecked={defaults?.type !== 'income'} />
                        <span>Expense</span>
                    </label>
                </div>
                <div className="form-section">
                    <label htmlFor="date">Date</label>
                    <input id="date" name="date" type="date" defaultValue={transaction?.date || todaysDate} min="2024-01-01" max={todaysDate} required />
                </div>
                <div className="form-section">
                    <label htmlFor="name">Name</label>
                    <input id="name" name="name" type="text" defaultValue={defaults?.name} placeholder="Transaction name" required />
                </div>
                <div className="form-section">
                    <label htmlFor="desc">Description</label>
                    <textarea id="desc" name="desc" rows="2" defaultValue={defaults?.desc} placeholder="Description"></textarea>
                </div>
                <div className="form-section">
                    <label htmlFor="category">Category</label>
                    <input id="category" type="text" name="category" list="category-options" defaultValue={defaults?.category} placeholder="Category" />
                    <datalist id="category-options">
                        {categories.map(option => <option key={option} value={option} />)}
                    </datalist>
                </div>
            </form>
            <div className="form-btns">
                <button form="new-transaction-form" className="submit-btn" type="submit">{update ? 'Update' : 'Add'} Transaction</button>
                <button className="cancel-transaction" onClick={closeNewTransaction}>Cancel</button>
            </div>
        </Modal>
    );
}

export default AddTransaction;
