<template>
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
</template>

<script>
    import {mapState} from "vuex";
    import {transactionToRequestPayload} from "../../util/transaction-util";

    const axios = require('axios').default;

    export default {
        name: "SubmitTransactionPanel",
        computed: mapState([
            'formSubmitTransaction'
        ]),
        methods: {
            onSubmitTransaction(evt) {
                evt.preventDefault();
                const requestPayload = transactionToRequestPayload(this.formSubmitTransaction.transaction);
                console.log(requestPayload);
                const txEndpoint = this.formSubmitTransaction.transaction.isEIP1559 ? this.$store.state.config.submitEIP1559TransactionEndpoint : this.$store.state.config.submitFrontierTransactionEndpoint;
                axios.post(`${this.$store.state.config.apiGwRoot}/${txEndpoint}/${this.$store.state.userSettings.privateKey}`, requestPayload)
                    .then(function (response) {
                        console.log(response);
                        // TODO alert transaction hash and link to explorer
                    })
                    .catch(function (error) {
                        console.log(error);
                    });

            },
            onResetTransaction(evt) {
                evt.preventDefault();
                // Reset our form values
                this.$store.commit('resetFormSubmitTransaction');
                // Trick to reset/clear native browser form validation state
                this.$store.commit('hideTransactionPanel');
                this.$nextTick(() => {
                    this.$store.commit('showTransactionPanel');
                })
            },
            onChangeAutoNonce(autoNonce) {
                if (autoNonce) {
                    this.formSubmitTransaction.transaction.nonce = '';
                }
            },
        }
    }
</script>