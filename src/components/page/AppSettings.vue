<template>
    <b-modal id="modal-settings" size="xl" title="Settings">
        <b-form-group
                id="input-group-private-key"
                label="Private key:"
                label-for="input-private-key"
        >
            <b-form-checkbox switch
                             v-model="customPrivateKey">Custom
            </b-form-checkbox>
            <b-form-input
                    id="input-private-key"
                    placeholder="Enter private key"
                    required
                    type="password"
                    v-if="customPrivateKey"
                    v-model="userSettings.privateKey"
            ></b-form-input>
            <b-form-select :options="accounts" class="mt-2" v-if="!customPrivateKey"
                           v-model="userSettings.privateKey"></b-form-select>
        </b-form-group>
        <b-input-group class="mt-3" prepend="Miner bribe">
            <b-form-input
                    class="ml-2"
                    required
                    v-model="userSettings.fees.estimate.defaultMinerBribe"
            ></b-form-input>
            <b-input-group-append>
                <b-form-select :options="units"
                               class="ml-2"
                               v-model="userSettings.fees.estimate.defaultMinerBribeUnit"></b-form-select>
            </b-input-group-append>
        </b-input-group>
        <b-input-group class="mt-3" prepend="Fee cap margin">
            <b-form-input
                    class="ml-2"
                    required
                    v-model="userSettings.fees.estimate.defaultFeeCapMargin"
            ></b-form-input>
            <b-input-group-append>
                <b-form-select :options="units"
                               class="ml-2"
                               v-model="userSettings.fees.estimate.defaultMinerBribeUnit"></b-form-select>
            </b-input-group-append>
        </b-input-group>
        <b-form-group
                id="input-group-tx-api-gw-endpoint"
                label="Transaction API Gateway:"
                label-for="input-tx-api-gw-endpoint"
        >
            <b-form-input
                    id="input-tx-api-gw-endpoint"
                    placeholder="Enter url"
                    required
                    type="url"
                    v-model="config.apiGateway.rootEndpoint"
            ></b-form-input>
        </b-form-group>
    </b-modal>
</template>

<script>

    import {mapState} from "vuex";
    import {accountsToSelectPrivateKeyOptions} from "../../util/account";

    export default {
        name: "settings",
        data() {
            return {
                units: [
                    {value: 'wei', text: 'Wei'},
                    {value: 'gwei', text: 'Gwei'},
                    {value: 'ether', text: 'Ether'},
                ],
                customPrivateKey: false,
            };
        },
        methods: {},
        computed: {
            accounts() {
                return accountsToSelectPrivateKeyOptions(this.$store.state.accounts);
            },
            ...mapState([
                'userSettings',
                'config',
            ])
        },
    }
</script>

<style scoped>

</style>