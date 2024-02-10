import { SaveDataProvider } from './context/SaveDataContext';
import AppHeader from './components/AppHeader';
import TransactionList from './components/TransactionList';
import Footer from './components/Footer';
import './css/App.css';

const App = () => {
    return (
        <div className="app">
            <SaveDataProvider>
                <AppHeader />
                <TransactionList />
                <Footer />
            </SaveDataProvider>
        </div>
    );
}

export default App;
