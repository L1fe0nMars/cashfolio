import { useContext } from 'react';
import { SaveDataContext } from '../context/SaveDataContext';
import '../css/TransactionHeader.css';

const TransactionHeader = () => {
    const { data } = useContext(SaveDataContext);

    const total = data.transactions.reduce((total, transaction) => {
        return transaction.type === 'income' ? total + transaction.amount : total - transaction.amount;
    }, 0);

    const incomeTotal = data.transactions
        .filter(transaction => transaction.type === 'income')
        .reduce((total, transaction) => {
        return transaction.type === 'income' ? total + transaction.amount : total - transaction.amount;
    }, 0).toFixed(2);

    const expenseTotal = data.transactions
        .filter(transaction => transaction.type === 'expense')
        .reduce((total, transaction) => {
        return transaction.type === 'expense' ? total + transaction.amount : total - transaction.amount;
    }, 0).toFixed(2);

    const sign = total < 0 ? '-' : '';
    
    return (
        <div className="transaction-header">
            <h2>Total</h2>
            <span className={total > 0 ? 'income' : 'expense'}>
                {`${sign}${data.currency}${Math.abs(total).toFixed(2)}`}
            </span>
            <div className="income-expense">
                <div className="income-total">
                    <h2>Income</h2>
                    <span className='income'>{`${data.currency}${incomeTotal}`}</span>
                </div>
                <div className="expense-total">
                    <h2>Expenses</h2>
                    <span className='expense'>{`${data.currency}${expenseTotal}`}</span>
                </div>
            </div>
        </div>
    );
}

export default TransactionHeader;