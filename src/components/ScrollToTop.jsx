import { useState, useEffect } from 'react';
import arrowIcon from '../assets/images/arrow-down.svg';
import '../css/ScrollToTop.css';

const ScrollToTop = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => setVisible(window.scrollY > 400);

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <button
            className={`scroll-to-top${visible ? ' visible' : ''}`}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Scroll to top"
        >
            <img src={arrowIcon} alt="" />
        </button>
    );
}

export default ScrollToTop;
