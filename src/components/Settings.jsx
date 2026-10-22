import { useContext } from 'react';
import { SaveDataContext } from '../context/SaveDataContext';
import Modal from './Modal';
import '../css/Settings.css';

const currencies = [
    { symbol: '$', name: 'Dollar' },
    { symbol: '€', name: 'Euro' },
    { symbol: '£', name: 'Pound' },
    { symbol: '¥', name: 'Yen / Yuan' },
    { symbol: '₹', name: 'Rupee' },
    { symbol: '₩', name: 'Won' },
    { symbol: '₽', name: 'Ruble' },
    { symbol: 'R$', name: 'Real' }
];

const dateFormats = [
    { value: 'mm/dd', label: 'Oct 18' },
    { value: 'dd/mm', label: '18 Oct' }
];

const Settings = ({ closeSettings }) => {
    const { data, saveData } = useContext(SaveDataContext);
    const { currency, dateFormat } = data;

    // An imported backup can set a currency that isn't listed, so keep it selectable instead of showing a blank dropdown
    const currencyOptions = currencies.some(option => option.symbol === currency)
        ? currencies
        : [...currencies, { symbol: currency, name: 'Custom' }];

    return (
        <Modal className="settings" onClose={closeSettings}>
            <h3>Settings</h3>
            <div className="settings-section">
                <label htmlFor="currency">Currency</label>
                <select id="currency" value={currency} onChange={(event) => saveData({ currency: event.target.value })}>
                    {currencyOptions.map(option => (
                        <option key={option.symbol} value={option.symbol}>{option.symbol} ({option.name})</option>
                    ))}
                </select>
            </div>
            <div className="settings-section">
                <span id="date-format-label">Date format</span>
                <div className="segmented" role="radiogroup" aria-labelledby="date-format-label">
                    {dateFormats.map(option => (
                        <label key={option.value}>
                            <input type="radio" name="date-format" value={option.value} onChange={(event) => saveData({ dateFormat: event.target.value })} checked={dateFormat === option.value} />
                            <span>{option.label}</span>
                        </label>
                    ))}
                </div>
            </div>
            <button className="close-settings" onClick={closeSettings}>Done</button>
        </Modal>
    );
}

export default Settings;
