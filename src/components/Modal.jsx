import { useEffect, useEffectEvent, useRef } from 'react';
import '../css/Modal.css';

const Modal = ({ className, onClose, children }) => {
    const pressedBackground = useRef(false);

    const onEscape = useEffectEvent((event) => {
        if (event.key === 'Escape') {
            onClose();
        }
    });

    useEffect(() => {
        document.addEventListener('keydown', onEscape);
        return () => document.removeEventListener('keydown', onEscape);
    }, []);

    // Only close when the click both starts and ends on the backdrop, so dragging out of an input doesn't discard the form
    const onClickBackground = (event) => {
        if (pressedBackground.current && event.target === event.currentTarget) {
            onClose();
        }
    }

    return (
        <div className="background" onMouseDown={(event) => { pressedBackground.current = event.target === event.currentTarget; }} onClick={onClickBackground}>
            <div className={`modal ${className}`}>
                {children}
            </div>
        </div>
    );
}

export default Modal;
