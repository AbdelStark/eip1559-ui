<template>
    <div>
        <b-modal id="modal-submit-transaction-status" size="xl" title="Transaction Status">
            <h5> Transaction Hash: {{this.$store.state.formSubmitTransaction.result.transactionHash}} </h5>
            <b-button @click="onSeeBlockExplorer" variant="outline-primary">See in block explorer</b-button>
        </b-modal>
        <b-button @click="onSeeLatestBlock" variant="warning">
            Base Fee
            <b-badge variant="light">{{currentBaseFee}}</b-badge>
        </b-button>
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
                                class="ml-2"
                                required
                                v-model="formSubmitTransaction.transaction.value"
                        ></b-form-input>
                        <b-form-select :options="units"
                                       class="mr-2"
                                       v-model="formSubmitTransaction.transaction.valueUnit"></b-form-select>
                    </b-form-group>
                    <b-form-group label="Gas limit:" label-for="input-gas-limit">
                        <b-form-input
                                class="ml-2"
                                id="input-gas-limit"
                                required
                                v-model="formSubmitTransaction.transaction.gasLimit"
                        ></b-form-input>
                    </b-form-group>
                </b-form>
                <b-form-checkbox size="lg" switch v-model="formSubmitTransaction.transaction.isEIP1559">EIP-1559
                </b-form-checkbox>
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
                    <b-button :disabled="!formSubmitTransaction.transaction.isEIP1559" @click="onEstimateFees"
                              class="ml-2"
                              variant="info">Estimate
                    </b-button>
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
    import {convert} from "../../util/ether-unit";

    export default {
        name: "SubmitTransactionPanel",
        data() {
            return {
                customRecipient: false,
                currentBaseFee: '0',
                timer: '',
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
                'userSettings',
            ])
        },
        created() {
            this.refreshBaseFee();
            this.timer = setInterval(this.refreshBaseFee, 2000)
        },
        beforeDestroy() {
            clearInterval(this.timer)
        },
        methods: {
            async refreshBaseFee() {
                const baseFeeHex = await this.$store.state.services.baseFee.getLatestBaseFee();
                this.currentBaseFee = parseInt(baseFeeHex, 16);
            },
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
            onSeeLatestBlock() {
                window.open(`${this.$store.state.config.links.blockExplorer}block/latest`, "_blank");
            },
            onSeeBlockExplorer() {
                const txExplorerLink = this.$store.getters.getTransactionExplorerLink(
                    this.$store.state.formSubmitTransaction.result.transactionHash
                );
                window.open(txExplorerLink, "_blank");
            },
            async onEstimateFees() {
                console.log('estimating transaction fees parameters');
                const baseFeeHex = await this.$store.state.services.baseFee.getLatestBaseFee();
                const baseFee = parseInt(baseFeeHex, 16);
                console.log('current baseFee: ', baseFee);
                this.formSubmitTransaction.transaction.minerBribe = this.userSettings.fees.estimate.defaultMinerBribe;
                this.formSubmitTransaction.transaction.minerBribeUnit = this.userSettings.fees.estimate.defaultMinerBribeUnit;
                const convertedBaseFee = convert(baseFee, 'wei', this.formSubmitTransaction.transaction.feecapUnit);
                const convertedMinerBribe = convert(this.formSubmitTransaction.transaction.minerBribe, this.formSubmitTransaction.transaction.minerBribeUnit, this.formSubmitTransaction.transaction.feecapUnit);
                console.log('converted baseFee:', convertedBaseFee);
                const convertedFeeCapMargin = convert(
                    this.userSettings.fees.estimate.defaultFeeCapMargin,
                    this.userSettings.fees.estimate.defaultFeeCapMarginUnit,
                    this.formSubmitTransaction.transaction.feecapUnit
                );
                console.log('converted feeCap margin:', convertedFeeCapMargin);
                const feeCap = convertedBaseFee + convertedMinerBribe + convertedFeeCapMargin;
                console.log('estimated feeCap: ', feeCap);
                this.formSubmitTransaction.transaction.feecap = feeCap;
            },
        }
    }
</script>