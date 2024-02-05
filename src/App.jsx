import { SaveDataProvider } from './context/SaveDataContext';
import Header from './components/Header';
import TransactionList from './components/TransactionList';
import './css/App.css';

const App = () => {
    return (
        <div className="app">
            <SaveDataProvider>
                <Header />
                <TransactionList />
            </SaveDataProvider>
        </div>
    );
}

export default App;
