module.exports = {
    newTransaction,
    transactionToRequestPayload,
};

function newTransaction() {
    return {
        nonce: null,
        to: '',
        autoNonce: false,
        value: '0',
        gasPrice: '1000',
        gasLimit: '21000',
        isEIP1559: false,
        minerBribe: '',
        feecap: '',
    };
}

function transactionToRequestPayload(tx) {
    const requestPayload = {
        to: tx.to,
        value: tx.value,
        gasLimit: tx.gasLimit,
    };
    if (!tx.autoNonce) {
        requestPayload.nonce = tx.nonce;
    }
    if (tx.isEIP1559) {
        requestPayload.minerBribe = tx.minerBribe;
        requestPayload.feecap = tx.feecap;
    } else {
        requestPayload.gasPrice = tx.gasPrice;
    }
    return requestPayload;
}