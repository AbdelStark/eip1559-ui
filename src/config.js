module.exports = {
    GlobalConfiguration,
};

function GlobalConfiguration() {
    return {
        apiGateway: {
            rootEndpoint: 'http://eip1559-tx.ops.pegasys.tech:8080',
            baseFeeEndpoint: 'basefee',
            submitFrontierTransactionEndpoint: 'tx/legacy',
            submitEIP1559TransactionEndpoint: 'tx/eip1559',
        },
        links: {
            blockExplorer: 'http://eip1559-testnet.ops.pegasys.tech:3000/',
            networkStatus: 'http://eip1559-testnet.ops.pegasys.tech:3001/',
            eipSpecification: 'https://eips.ethereum.org/EIPS/eip-1559',
            workUpdates: 'https://hackmd.io/@timbeiko/1559-updates/',
            joinTheTestnet: 'https://wiki.hyperledger.org/display/BESU/EIP-1559+testnet+guide',
        }
    };
}