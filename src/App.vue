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
            <b-alert dismissible v-model="showSuccessAlert" variant="success">
                {{successAlertMessage}}
            </b-alert>
            <div v-if="showLoadingSpinner">
                <b-spinner label="Loading..."></b-spinner>
            </div>

            <b-card class="mt-3" header="Transaction management" v-if="showTransactionPanel">
                <b-form @reset="onResetTransaction" @submit="onSubmitTransaction">
                    <b-form-group
                            id="input-group-nonce"
                            label="Nonce:"
                            label-for="input-nonce"
                    >
                        <b-form-input
                                id="input-nonce"
                                placeholder="Enter nonce"
                                required
                                v-model="formSubmitTransaction.transaction.nonce"
                        ></b-form-input>
                    </b-form-group>

                    <b-form-group id="input-group-to" label="Recipient:" label-for="input-to">
                        <b-form-input
                                id="input-to"
                                placeholder="Enter recipient address"
                                required
                                v-model="formSubmitTransaction.transaction.to"
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
                config: {
                    apiGwRoot: 'http://eip1559-tx.ops.pegasys.tech:8080/',
                },
                formSubmitTransaction: {
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
                console.log(this.formSubmitTransaction.transaction);
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
                axios.get(`${this.config.apiGwRoot}/basefee/${this.formGetBaseFee.block.number}`)
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
        }
    }

    function newTransaction() {
        return {
            nonce: null,
            to: '',
        };
    }

    function newBlock() {
        return {
            number: 'latest',
        };
    }

</script>