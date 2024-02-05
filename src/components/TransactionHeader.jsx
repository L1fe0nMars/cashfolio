import { useContext } from 'react';
import { SaveDataContext } from '../context/SaveDataContext';
import '../css/TransactionHeader.css';

const TransactionHeader = () => {
    const { data } = useContext(SaveDataContext);
    
    return (
        <div className="transaction-header">
            <h2>Total</h2>
            <span>{`${data.currency}0.00`}</span>
        </div>
    );
}

export default TransactionHeader;