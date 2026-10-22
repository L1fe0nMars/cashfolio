import { useState, useContext, useRef } from 'react';
import { SaveDataContext } from '../context/SaveDataContext';
import Settings from './Settings';
import '../css/AppHeader.css';

const isValidTransaction = (transaction) =>
    typeof transaction === 'object'
    && transaction !== null
    && typeof transaction.id === 'string'
    && (transaction.type === 'income' || transaction.type === 'expense')
    && typeof transaction.name === 'string'
    && typeof transaction.desc === 'string'
    && typeof transaction.category === 'string'
    && typeof transaction.date === 'string'
    && /^\d{4}-\d{2}-\d{2}$/.test(transaction.date)
    && Number.isFinite(transaction.amount)
    && transaction.amount > 0;

const isValidBackup = (backup) =>
    typeof backup === 'object'
    && backup !== null
    && Array.isArray(backup.transactions)
    && backup.transactions.every(isValidTransaction)
    && typeof backup.currency === 'string'
    && (backup.dateFormat === 'mm/dd' || backup.dateFormat === 'dd/mm');

const AppHeader = () => {
    const { data, saveData } = useContext(SaveDataContext);
    const fileInput = useRef(null);
    const [showSettings, setShowSettings] = useState(false);

    const exportData = () => {
        const file = new Blob(
            [JSON.stringify(data, null, 2)],
            { type: 'application/json' }
        );
        const url = URL.createObjectURL(file);
        const link = document.createElement('a');

        link.href = url;
        link.download = 'cashfolio-backup.json';
        link.click();
        URL.revokeObjectURL(url);
    };

    const importData = async (event) => {
        const input = event.target;
        const file = input.files?.[0];
        if (!file) return;

        try {
            const importedData = JSON.parse(await file.text());

            if (!isValidBackup(importedData)) {
                throw new Error('Invalid backup');
            }

            if (data.transactions.length === 0 || confirm('Importing will replace all of your current transactions. Continue?')) {
                const { transactions, currency, dateFormat } = importedData;
                saveData({ transactions, currency, dateFormat });
            }
        } catch {
            alert('Please select a valid CashFolio backup file.');
        }

        input.value = '';
    }
    
    return (
        <div className="app-header">
            <h1>CashFolio</h1>
            <div className="data-actions">
                <button onClick={() => fileInput.current?.click()}>
                    Import data
                </button>
                <button onClick={exportData}>Export data</button>
                <input
                    ref={fileInput}
                    type="file"
                    accept=".json,application/json"
                    onChange={importData}
                    hidden
                />
                <button className="settings-btn" onClick={() => setShowSettings(true)} title="Settings" aria-label="Settings">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                        <circle cx="12" cy="12" r="3"/>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                    </svg>
                </button>
            </div>

            {showSettings && <Settings closeSettings={() => setShowSettings(false)} />}
        </div>
    );
}

export default AppHeader;