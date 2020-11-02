<template>
    <div id="app">
        <navbar
                :on-click-settings="onClickSettings"
                :on-nav-to-block="onNavToBlock"
                :on-nav-to-external-block-explorer="onNavToExternalBlockExplorer"
                :on-nav-to-external-e-i-p-specification="onNavToExternalEIPSpecification"
                :on-nav-to-external-e-i-p-work-updates="onNavToExternalEIPWorkUpdates"
                :on-nav-to-external-network-status="onNavToExternalNetworkStatus"
                :on-nav-to-transaction="onNavToTransaction"/>
        <app-qr-code/>
        <app-settings/>
        <b-jumbotron header="EIP-1559 Toolbox" lead="Fee market change for ETH 1.0 chain">
            <p>
                This EIP introduces a transaction pricing mechanism that includes fixed-per-block network fee that is
                burned and dynamically expands/contracts block sizes to deal with transient congestion.
            </p>
            <div v-if="showLoadingSpinner">
                <b-spinner label="Loading..."></b-spinner>
            </div>

            <b-card class="mt-3" header="Transaction management" v-if="this.$store.state.show.transactionPanel">
                <b-form @reset="onResetTransaction" @submit="onSubmitTransaction">
                    <b-form-group
                            id="input-group-nonce"
                            label="Nonce:"
                            label-for="input-nonce"
                    >
                        <b-form-input
                                :disabled="formSubmitTransaction.transaction.autoNonce"
                                :required="!formSubmitTransaction.transaction.autoNonce"
                                id="input-nonce"
                                placeholder="Enter nonce"
                                v-model="formSubmitTransaction.transaction.nonce"
                        ></b-form-input>
                        <b-form-checkbox @change="onChangeAutoNonce" size="lg" switch
                                         v-model="formSubmitTransaction.transaction.autoNonce">Auto
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
                    <b-form-checkbox size="lg" switch v-model="formSubmitTransaction.transaction.isEIP1559">EIP-1559
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
                                :disabled="formSubmitTransaction.transaction.isEIP1559"
                                :required="!formSubmitTransaction.transaction.isEIP1559"
                                id="input-gas-price"
                                v-model="formSubmitTransaction.transaction.gasPrice"
                        ></b-form-input>
                    </b-form-group>
                    <b-form-group label="Miner bribe:" label-for="input-miner-bribe">
                        <b-form-input
                                :disabled="!formSubmitTransaction.transaction.isEIP1559"
                                :required="formSubmitTransaction.transaction.isEIP1559"
                                id="input-miner-bribe"
                                v-model="formSubmitTransaction.transaction.minerBribe"
                        ></b-form-input>
                    </b-form-group>
                    <b-form-group label="Fee cap:" label-for="input-fee-cap">
                        <b-form-input
                                :disabled="!formSubmitTransaction.transaction.isEIP1559"
                                :required="formSubmitTransaction.transaction.isEIP1559"
                                id="input-fee-cap"
                                v-model="formSubmitTransaction.transaction.feecap"
                        ></b-form-input>
                    </b-form-group>

                    <b-button class="mr-2" type="submit" variant="primary">Submit</b-button>

                    <b-button type="reset" variant="danger">Reset</b-button>
                </b-form>
            </b-card>
            <block-panel/>
            <b-alert dismissible v-model="showSuccessAlert" variant="success">
                {{successAlertMessage}}
            </b-alert>
        </b-jumbotron>
        <app-footer/>
    </div>
</template>

<script>
    import Navbar from "./components/page/Navbar";
    import AppSettings from "./components/page/AppSettings";
    import AppFooter from "./components/page/AppFooter";
    import AppQrCode from "./components/page/AppQrCode";
    import BlockPanel from "./components/core/BlockPanel";

    const axios = require('axios').default;
    export default {
        components: {
            BlockPanel,
            AppQrCode,
            AppFooter,
            AppSettings,
            Navbar,
        },
        data() {
            return {
                formSubmitTransaction: {
                    privateKey: '',
                    transaction: newTransaction(),
                },
                showSuccessAlert: false,
                successAlertMessage: '',
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
                const txEndpoint = this.formSubmitTransaction.transaction.isEIP1559 ? this.$store.state.config.submitEIP1559TransactionEndpoint : this.$store.state.config.submitFrontierTransactionEndpoint;
                const currentVue = this;
                axios.post(`${this.$store.state.config.apiGwRoot}/${txEndpoint}/${this.$store.state.userSettings.privateKey}`, requestPayload)
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
                this.showSuccessAlert = false;
                this.successAlertMessage = '';
                // Trick to reset/clear native browser form validation state
                this.$store.commit('hideTransactionPanel');
                this.$nextTick(() => {
                    this.$store.commit('showTransactionPanel');
                })
            },
            onNavToTransaction() {
                this.$store.commit('showTransactionPanel');
            },
            onNavToBlock() {
                this.$store.commit('showBlockPanel');
            },
            onChangeAutoNonce(autoNonce) {
                if (autoNonce) {
                    this.formSubmitTransaction.transaction.nonce = '';
                }
            },
            onNavToExternalBlockExplorer() {
                window.open("http://eip1559-testnet.ops.pegasys.tech:3000/", "_blank");
            },
            onNavToExternalNetworkStatus() {
                window.open("http://eip1559-testnet.ops.pegasys.tech:3001/", "_blank");
            },
            onNavToExternalEIPSpecification() {
                window.open("https://eips.ethereum.org/EIPS/eip-1559", "_blank");
            },
            onNavToExternalEIPWorkUpdates() {
                window.open("https://hackmd.io/@timbeiko/1559-updates/", "_blank");
            },
            onClickSettings() {
                this.$bvModal.show('modal-settings');
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