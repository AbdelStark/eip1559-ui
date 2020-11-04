import {hexStringWithPrefix} from './hex';
import {toWei} from './ether-unit';

const DEFAULT_TO = 'fe3b557e8fb62b89f4916b721be55ceb828dbd73';

export function newTransaction() {
    return {
        nonce: null,
        to: DEFAULT_TO,
        autoNonce: true,
        value: 0,
        valueUnit: 'wei',
        gasPrice: 1000,
        gasLimit: 21000,
        isEIP1559: false,
        minerBribe: 1000,
        feecap: 1000,
        gasPriceUnit: 'wei',
        minerBribeUnit: 'wei',
        feecapUnit: 'wei',
    };
}

export function transactionToRequestPayload(tx) {
    const requestPayload = {
        to: hexStringWithPrefix(tx.to),
        value: toWei(tx.value, tx.valueUnit),
        gasLimit: tx.gasLimit,
    };
    if (!tx.autoNonce) {
        requestPayload.nonce = tx.nonce;
    }
    if (tx.isEIP1559) {
        requestPayload.minerBribe = toWei(tx.minerBribe, tx.minerBribeUnit);
        requestPayload.feecap = toWei(tx.feecap, tx.feecapUnit);
    } else {
        requestPayload.gasPrice = toWei(tx.gasPrice, tx.gasPriceUnit);
    }
    return requestPayload;
}