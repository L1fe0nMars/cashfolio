const SaveDataReducer = (state, action) => {
    switch(action.type) {
        case 'DELETE_TRANSACTION':
            return {
                ...state,
                transactions: state.transactions.filter(transaction => transaction.id !== action.payload)
            }
        case 'UPDATE_TRANSACTION':
            return {
                ...state,
                transactions: state.transactions.map((transaction) =>
                    transaction.id === action.payload.id ? { ...transaction, ...action.payload } : transaction
                ),
            }
        case 'ADD_TRANSACTION':
            return {
                ...state,
                transactions: [action.payload, ...state.transactions]
            }
        case 'SAVE_DATA':
            return {
               ...state,
               ...action.payload
            }
        default:
            return state;
    }
}

export default SaveDataReducer;