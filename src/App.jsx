import SaveDataProvider from './context/SaveDataProvider';
import AppHeader from './components/AppHeader';
import TransactionList from './components/TransactionList';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import './css/App.css';

const App = () => {
    return (
        <div className="app">
            <SaveDataProvider>
                <AppHeader />
                <TransactionList />
                <Footer />
                <ScrollToTop />
            </SaveDataProvider>
        </div>
    );
}

export default App;
