const axios = require('axios').default;

export default class BaseFeeService {
    constructor(config) {
        this.config = config;
    }

    async getBaseFeeAt(blockNumber) {
        try {
            const response = await axios.get(`${this.config.apiGateway.rootEndpoint}/${this.config.apiGateway.baseFeeEndpoint}/${blockNumber}`);
            return response.data.baseFee;
        } catch (error) {
            console.log("error", error);
        }
    }

    async getLatestBaseFee() {
        try {
            const response = await axios.get(`${this.config.apiGateway.rootEndpoint}/${this.config.apiGateway.baseFeeEndpoint}/latest`);
            return response.data.baseFee;
        } catch (error) {
            console.log("error", error);
        }
    }
}