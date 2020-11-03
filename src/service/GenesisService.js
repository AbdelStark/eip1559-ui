const axios = require('axios').default;

export default class GenesisService {
    constructor(genesisFileURL) {
        this.genesisFileURL = genesisFileURL;
    }

    async loadAccounts() {
        try {
            console.log('loading genesis accounts from: ', this.genesisFileURL);
            const response = await axios.get(this.genesisFileURL);
            const genesisJSON = response.data;
            const accounts = [];
            for (const k in genesisJSON.alloc) {
                accounts.push({
                    address: k,
                    privateKey: genesisJSON.alloc[k].privateKey,
                });
            }
            return accounts;
        } catch (error) {
            console.log("error", error);
        }
    }
}