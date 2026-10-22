const formatAmount = (amount, currency, showPlus = false) => {
    // Rounding first keeps float leftovers like -0.0000001 from rendering as "-$0.00"
    const rounded = Math.round(amount * 100) / 100;
    const sign = rounded < 0 ? '-' : (showPlus && rounded > 0 ? '+' : '');
    const formatted = Math.abs(rounded).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return `${sign}${currency}${formatted}`;
}

export default formatAmount;
