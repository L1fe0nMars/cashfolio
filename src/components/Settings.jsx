import { useContext } from 'react';
import { SaveDataContext } from '../context/SaveDataContext';
import '../css/Settings.css';

const Settings = (props) => {
    const { data, saveData } = useContext(SaveDataContext);

    
    
    return (
        <div className="settings">
            <button className="close" onClick={props.closeSettings}>
                &times;
            </button>

            <h2>Settings</h2>

            <h2>General</h2>
            <form>
                
            </form>
        </div>
    );
}

export default Settings;