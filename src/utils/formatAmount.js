const numberFormat = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const formatAmount = (amount, currency, showPlus = false) => {
    // Rounding first keeps float leftovers like -0.0000001 from rendering as "-$0.00"
    const rounded = Math.round(amount * 100) / 100;
    const sign = rounded < 0 ? '-' : (showPlus && rounded > 0 ? '+' : '');
    const formatted = numberFormat.format(Math.abs(rounded));

    return `${sign}${currency}${formatted}`;
}

export default formatAmount;
