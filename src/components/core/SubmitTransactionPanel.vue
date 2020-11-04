<template>
    <div>
        <b-modal id="modal-submit-transaction-status" size="xl" title="Transaction Status">
            <h5> Transaction Hash: {{this.$store.state.formSubmitTransaction.result.transactionHash}} </h5>
            <b-button @click="onSeeBlockExplorer" variant="outline-primary">See in block explorer</b-button>
        </b-modal>
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
                    <b-form-checkbox switch
                                     v-model="customRecipient">Custom
                    </b-form-checkbox>
                    <b-form-input
                            id="input-to"
                            placeholder="Enter recipient address"
                            required
                            v-if="customRecipient"
                            v-model="formSubmitTransaction.transaction.to"
                    ></b-form-input>
                    <b-form-select :options="accounts" class="mt-2" id="input-to" v-if="!customRecipient"
                                   v-model="formSubmitTransaction.transaction.to"></b-form-select>
                </b-form-group>
                <b-form inline>
                    <b-form-group id="input-group-value" label="Value:" label-for="input-value">
                        <b-form-input
                                id="input-value"
                                required
                                v-model="formSubmitTransaction.transaction.value"
                        ></b-form-input>
                        <b-form-select :options="units"
                                       v-model="formSubmitTransaction.transaction.valueUnit"></b-form-select>
                    </b-form-group>
                </b-form>
                <b-form-checkbox size="lg" switch v-model="formSubmitTransaction.transaction.isEIP1559">EIP-1559
                </b-form-checkbox>
                <b-form-group label="Gas limit:" label-for="input-gas-limit">
                    <b-form-input
                            id="input-gas-limit"
                            required
                            v-model="formSubmitTransaction.transaction.gasLimit"
                    ></b-form-input>
                </b-form-group>
                <b-form inline>
                    <b-form-group label="Gas price:">
                        <b-form-input
                                :disabled="formSubmitTransaction.transaction.isEIP1559"
                                :required="!formSubmitTransaction.transaction.isEIP1559"
                                v-model="formSubmitTransaction.transaction.gasPrice"
                        ></b-form-input>
                        <b-form-select :options="units"
                                       v-model="formSubmitTransaction.transaction.gasPriceUnit"></b-form-select>
                    </b-form-group>
                </b-form>
                <b-form class="mt-2" inline>
                    <b-form-group label="Miner bribe:" label-for="input-miner-bribe">
                        <b-form-input
                                :disabled="!formSubmitTransaction.transaction.isEIP1559"
                                :required="formSubmitTransaction.transaction.isEIP1559"
                                class="ml-2"
                                id="input-miner-bribe"
                                v-model="formSubmitTransaction.transaction.minerBribe"
                        ></b-form-input>
                        <b-form-select :options="units"
                                       v-model="formSubmitTransaction.transaction.minerBribeUnit"></b-form-select>
                    </b-form-group>
                    <b-form-group class="ml-2" label="Fee cap:" label-for="input-fee-cap">
                        <b-form-input
                                :disabled="!formSubmitTransaction.transaction.isEIP1559"
                                :required="formSubmitTransaction.transaction.isEIP1559"
                                class="ml-2"
                                id="input-fee-cap"
                                v-model="formSubmitTransaction.transaction.feecap"
                        ></b-form-input>
                        <b-form-select :options="units"
                                       v-model="formSubmitTransaction.transaction.feecapUnit"></b-form-select>
                    </b-form-group>
                </b-form>

                <b-button class="mr-2" type="submit" variant="primary">Submit</b-button>

                <b-button type="reset" variant="danger">Reset</b-button>
            </b-form>
        </b-card>
    </div>
</template>

<script>
    import {mapState} from "vuex";
    import {accountsToSelectAddressOptions} from "../../util/account";

    export default {
        name: "SubmitTransactionPanel",
        data() {
            return {
                customRecipient: false,
                units: [
                    {value: 'wei', text: 'Wei'},
                    {value: 'gwei', text: 'Gwei'},
                    {value: 'ether', text: 'Ether'},
                ],
            }
        },
        async beforeMount() {
            if (this.$store.state.accounts == null) {
                this.$store.state.accounts = await this.$store.state.services.genesis.loadAccounts();
            }
        },
        computed: {
            accounts() {
                return accountsToSelectAddressOptions(this.$store.state.accounts);
            },
            ...mapState([
                'formSubmitTransaction',
            ])
        },
        methods: {
            async onSubmitTransaction(evt) {
                evt.preventDefault();
                const transactionHash = await this.$store.state.services.transaction.submitTransaction(
                    this.formSubmitTransaction.transaction,
                    this.$store.state.userSettings.privateKey
                );
                console.log('transactionHash:', transactionHash);
                this.$store.state.formSubmitTransaction.result.transactionHash = transactionHash;
                this.$bvModal.show('modal-submit-transaction-status');
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
            onSeeBlockExplorer() {
                const txExplorerLink = this.$store.getters.getTransactionExplorerLink(
                    this.$store.state.formSubmitTransaction.result.transactionHash
                );
                window.open(txExplorerLink, "_blank");
            }
        }
    }
</script>