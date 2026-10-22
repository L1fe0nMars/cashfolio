import { useContext, useRef } from 'react';
import { SaveDataContext } from '../context/SaveDataContext';
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
    && typeof backup.dateFormat === 'string';

const AppHeader = () => {
    const { data, saveData } = useContext(SaveDataContext);
    const fileInput = useRef(null);

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
            </div>
        </div>
    );
}

export default AppHeader;