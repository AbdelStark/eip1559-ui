const axios = require('axios').default;

export default class BaseFeeService{
    constructor(config) {
        this.config = config;
    }

    async getBaseFeeAt(blockNumber){
        try {
            const response = await axios.get(`${this.config.apiGwRoot}/${this.config.baseFeeEndpoint}/${blockNumber}`);
            return response.data.baseFee;
        } catch(error) {
            console.log("error", error);
        }
    }
}