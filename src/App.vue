<template>
    <div id="app">
        <navbar :on-nav-to-block="onNavToBlock" :on-nav-to-transaction="onNavToTransaction"
                :on-nav-to-external-block-explorer="onNavToExternalBlockExplorer"
                :on-nav-to-external-network-status="onNavToExternalNetworkStatus"/>
        <b-jumbotron header="EIP-1559" lead="Fee market change for ETH 1.0 chain">
            <p>
                This EIP introduces a transaction pricing mechanism that includes fixed-per-block network fee that is
                burned and dynamically expands/contracts block sizes to deal with transient congestion.
            </p>
            <div v-if="showLoadingSpinner">
                <b-spinner label="Loading..."></b-spinner>
            </div>

            <b-card class="mt-3" header="Transaction management" v-if="showTransactionPanel">
                <b-form @reset="onResetTransaction" @submit="onSubmitTransaction">
                    <b-form-group
                            id="input-group-private-key"
                            label="Private key:"
                            label-for="input-private-key"
                    >
                        <b-form-input
                                id="input-private-key"
                                placeholder="Enter private key"
                                type="password"
                                required
                                v-model="formSubmitTransaction.privateKey"
                        ></b-form-input>
                    </b-form-group>
                    <b-form-group
                            id="input-group-nonce"
                            label="Nonce:"
                            label-for="input-nonce"
                    >
                        <b-form-input
                                id="input-nonce"
                                placeholder="Enter nonce"
                                :disabled="formSubmitTransaction.transaction.autoNonce"
                                :required="!formSubmitTransaction.transaction.autoNonce"
                                v-model="formSubmitTransaction.transaction.nonce"
                        ></b-form-input>
                        <b-form-checkbox v-model="formSubmitTransaction.transaction.autoNonce" switch size="lg"
                                         @change="onChangeAutoNonce">Auto
                        </b-form-checkbox>
                    </b-form-group>

                    <b-form-group id="input-group-to" label="Recipient:" label-for="input-to">
                        <b-form-input
                                id="input-to"
                                placeholder="Enter recipient address"
                                required
                                v-model="formSubmitTransaction.transaction.to"
                        ></b-form-input>
                    </b-form-group>
                    <b-form-group id="input-group-value" label="Value:" label-for="input-value">
                        <b-form-input
                                id="input-value"
                                required
                                v-model="formSubmitTransaction.transaction.value"
                        ></b-form-input>
                    </b-form-group>
                    <b-form-checkbox v-model="formSubmitTransaction.transaction.isEIP1559" switch size="lg">EIP-1559
                    </b-form-checkbox>
                    <b-form-group label="Gas limit:" label-for="input-gas-limit">
                        <b-form-input
                                id="input-gas-limit"
                                required
                                v-model="formSubmitTransaction.transaction.gasLimit"
                        ></b-form-input>
                    </b-form-group>
                    <b-form-group label="Gas price:" label-for="input-gas-price">
                        <b-form-input
                                id="input-gas-price"
                                :required="!formSubmitTransaction.transaction.isEIP1559"
                                :disabled="formSubmitTransaction.transaction.isEIP1559"
                                v-model="formSubmitTransaction.transaction.gasPrice"
                        ></b-form-input>
                    </b-form-group>
                    <b-form-group label="Miner bribe:" label-for="input-miner-bribe">
                        <b-form-input
                                id="input-miner-bribe"
                                :required="formSubmitTransaction.transaction.isEIP1559"
                                :disabled="!formSubmitTransaction.transaction.isEIP1559"
                                v-model="formSubmitTransaction.transaction.minerBribe"
                        ></b-form-input>
                    </b-form-group>
                    <b-form-group label="Fee cap:" label-for="input-fee-cap">
                        <b-form-input
                                id="input-fee-cap"
                                :required="formSubmitTransaction.transaction.isEIP1559"
                                :disabled="!formSubmitTransaction.transaction.isEIP1559"
                                v-model="formSubmitTransaction.transaction.feecap"
                        ></b-form-input>
                    </b-form-group>

                    <b-button class="mr-2" type="submit" variant="primary">Submit</b-button>

                    <b-button type="reset" variant="danger">Reset</b-button>
                </b-form>
            </b-card>

            <b-card class="mt-3" header="Block management" v-if="showBlockPanel">
                <b-form>
                    <b-form @submit="onSubmitGetBaseFee">
                        <b-form-group
                                id="input-group-block-number"
                                label="Block number:"
                                label-for="input-block-number"
                        >
                            <b-form-input
                                    id="input-block-number"
                                    placeholder="enter block number or one of earliest, latest"
                                    required
                                    v-model="formGetBaseFee.block.number"
                            ></b-form-input>
                        </b-form-group>
                        <b-form-group>
                            <b-button class="mr-2" type="submit" variant="primary">Get base fee</b-button>
                            <h2 v-if="result.getBaseFee.displayBaseFee">
                                <b-badge>{{result.getBaseFee.baseFee}}</b-badge>
                            </h2>
                        </b-form-group>
                    </b-form>
                </b-form>
            </b-card>
            <b-alert dismissible v-model="showSuccessAlert" variant="success">
                {{successAlertMessage}}
            </b-alert>
        </b-jumbotron>
    </div>
</template>

<script>
    import Navbar from "./components/navbar";

    const axios = require('axios').default;
    export default {
        components: {Navbar},
        data() {
            return {
                config: configuration(),
                formSubmitTransaction: {
                    privateKey: '',
                    transaction: newTransaction(),
                },
                formGetBaseFee: {
                    block: newBlock(),
                },
                result: {
                    getBaseFee: {
                        displayBaseFee: false,
                        baseFee: 0,
                    }
                },
                showSuccessAlert: false,
                successAlertMessage: '',
                showTransactionPanel: true,
                showBlockPanel: false,
                showLoadingSpinner: false,
            }
        },
        mounted: function () {
            this.onInit();
        },
        methods: {
            onInit() {
                console.log('initializing vue');
            },
            onSubmitTransaction(evt) {
                evt.preventDefault();
                const requestPayload = transactionToRequestPayload(this.formSubmitTransaction.transaction);
                console.log(requestPayload);
                const txEndpoint = this.formSubmitTransaction.transaction.isEIP1559 ? this.config.submitEIP1559TransactionEndpoint : this.config.submitFrontierTransactionEndpoint;
                const currentVue = this;
                axios.post(`${this.config.apiGwRoot}/${txEndpoint}/${this.formSubmitTransaction.privateKey}`, requestPayload)
                    .then(function (response) {
                        currentVue.showSuccessAlert = true;
                        currentVue.successAlertMessage = response.data.transactionHash;
                    })
                    .catch(function (error) {
                        console.log(error);
                    });

            },
            onResetTransaction(evt) {
                evt.preventDefault();
                // Reset our form values
                this.formSubmitTransaction.transaction = newTransaction();
                this.formGetBaseFee.block = newBlock();
                this.showSuccessAlert = false;
                this.successAlertMessage = '';
                // Trick to reset/clear native browser form validation state
                this.showTransactionPanel = false;
                this.$nextTick(() => {
                    this.showTransactionPanel = true;
                })
            },
            onSubmitGetBaseFee(evt) {
                evt.preventDefault();
                //this.showLoadingSpinner = true;
                console.log(this.formGetBaseFee.block.number);
                const currentVue = this;
                axios.get(`${this.config.apiGwRoot}/${this.config.baseFeeEndpoint}/${this.formGetBaseFee.block.number}`)
                    .then(function (response) {
                        // handle success
                        console.log(response.data);
                        currentVue.result.getBaseFee.baseFee = response.data.baseFee;
                        currentVue.result.getBaseFee.displayBaseFee = true;
                        //currentVue.showLoadingSpinner = false;
                    })
                    .catch(function (error) {
                        // handle error
                        console.log(error);
                    });
            },
            onNavToTransaction() {
                this.showTransactionPanel = true;
                this.showBlockPanel = false;
            },
            onNavToBlock() {
                this.showTransactionPanel = false;
                this.showBlockPanel = true;
            },
            onNavToExternalBlockExplorer() {
                window.open("http://eip1559-testnet.ops.pegasys.tech:3000/", "_blank");
            },
            onNavToExternalNetworkStatus() {
                window.open("http://eip1559-testnet.ops.pegasys.tech:3001/", "_blank");
            },
            onChangeAutoNonce(autoNonce) {
                if (autoNonce) {
                    this.formSubmitTransaction.transaction.nonce = '';
                }
            },
        }
    }

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

    function newBlock() {
        return {
            number: 'latest',
        };
    }

    function configuration() {
        return {
            apiGwRoot: 'http://eip1559-tx.ops.pegasys.tech:8080',
            baseFeeEndpoint: 'basefee',
            submitFrontierTransactionEndpoint: 'tx/legacy',
            submitEIP1559TransactionEndpoint: 'tx/eip1559',
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
</script>