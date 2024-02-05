import TransactionHeader from './TransactionHeader';
import TransactionList from './TransactionList';
import '../css/TransactionHeader.css';

const TransactionHome = () => {
    return (
        <div className="transaction-home">
            <TransactionHeader />
            <TransactionList />
        </div>
    );
}

export default TransactionHome;