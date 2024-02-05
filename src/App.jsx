import { SaveDataProvider } from './context/SaveDataContext';
import AppHeader from './components/AppHeader';
import TransactionHome from './components/TransactionHome';
import './css/App.css';

const App = () => {
    return (
        <div className="app">
            <SaveDataProvider>
                <AppHeader />
                <TransactionHome />
            </SaveDataProvider>
        </div>
    );
}

export default App;
