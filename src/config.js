module.exports = {
    GlobalConfiguration,
};

function GlobalConfiguration() {
    return {
        apiGateway: {
            rootEndpoint: 'http://eip1559-tx.ops.pegasys.tech:8081',
            baseFeeEndpoint: 'basefee',
            submitFrontierTransactionEndpoint: 'tx/legacy',
            submitEIP1559TransactionEndpoint: 'tx/eip1559',
        },
        links: {
            blockExplorer: 'http://3.21.227.120:3000/',
            networkStatus: 'http://3.21.227.120:3001/',
            eipSpecification: 'https://eips.ethereum.org/EIPS/eip-1559',
            workUpdates: 'https://hackmd.io/@timbeiko/1559-updates/',
            joinTheTestnet: 'https://wiki.hyperledger.org/display/BESU/EIP-1559+testnet+guide',
            resources: {
                genesis: {
                    besu: 'https://raw.githubusercontent.com/ConsenSys/eip1559-rhodes/main/besu/genesis.json',
                    geth: '',
                    nethermind: '',
                }
            }
        }
    };
}
