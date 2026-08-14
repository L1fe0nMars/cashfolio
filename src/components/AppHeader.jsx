import { useContext, useRef } from 'react';
import { SaveDataContext } from '../context/SaveDataContext';
import '../css/AppHeader.css';

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

    const importData = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            try {
                const importedData = JSON.parse(reader.result);

                if (!Array.isArray(importedData.transactions)) {
                    throw new Error('Invalid backup');
                }

                saveData(importedData);
            } catch {
                alert('Please select a valid CashFolio backup file.');
            }

            event.target.value = '';
        };

        reader.readAsText(file);
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