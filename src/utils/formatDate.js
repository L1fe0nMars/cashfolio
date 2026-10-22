// Omits the year because the transaction list is always filtered to a single year
const formatDate = (dateString, dateFormat) => {
    const date = new Date(dateString.replace(/-/g, '/'));
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
        return 'Today';
    }
    else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    }
    else {
        const weekday = date.toLocaleString('en-US', { weekday: 'short' });
        const month = date.toLocaleString('en-US', { month: 'short' });
        return dateFormat === 'dd/mm' ? `${weekday}, ${date.getDate()} ${month}` : `${weekday}, ${month} ${date.getDate()}`;
    }
}

export default formatDate;
