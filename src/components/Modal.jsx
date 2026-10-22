import { useLayoutEffect, useRef } from 'react';
import '../css/Modal.css';

const Modal = ({ className, onClose, initialFocus, children }) => {
    const dialog = useRef(null);
    const pressedBackdrop = useRef(false);

    // A layout effect so close() runs while the dialog is still in the page, which lets the browser return focus to the button that opened it
    useLayoutEffect(() => {
        const element = dialog.current;
        element.showModal();
        // React's autoFocus fires before showModal(), which then moves focus, so focus the requested field afterwards instead
        initialFocus?.current?.focus();

        return () => element.close();
    }, [initialFocus]);

    // Stop the browser from closing the dialog itself so the parent's state stays the source of truth
    const onCancel = (event) => {
        event.preventDefault();
        onClose();
    }

    // Clicks on the backdrop target the dialog itself. Only close when the click both starts and ends there, so dragging out of an input doesn't discard the form
    const onClickBackdrop = (event) => {
        // React bubbles clicks through the component tree, so without this a modal rendered inside a clickable element (like a transaction row) would trigger it
        event.stopPropagation();

        if (pressedBackdrop.current && event.target === event.currentTarget) {
            onClose();
        }
    }

    return (
        <dialog
            ref={dialog}
            className="modal-dialog"
            onCancel={onCancel}
            onMouseDown={(event) => { pressedBackdrop.current = event.target === event.currentTarget; }}
            onClick={onClickBackdrop}
        >
            <div className={`modal ${className}`}>
                {children}
            </div>
        </dialog>
    );
}

export default Modal;
