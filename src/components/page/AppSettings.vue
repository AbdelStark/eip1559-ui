<template>
    <b-modal id="modal-settings" title="Settings">
        <h2>Toolbox configuration</h2>
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
    </b-modal>
</template>

<script>

    import {mapState} from "vuex";

    export default {
        name: "settings",
        data() {
            return {
                customPrivateKey: false,
            };
        },
        methods: {},
        computed: {
            accounts() {
                const accountOptions = [];
                const accounts = this.$store.state.accounts;
                if (accounts != null) {
                    accounts.forEach(account => {
                        accountOptions.push({
                            value: account.privateKey,
                            text: account.address,
                        });
                    });
                }
                return accountOptions;
            },
            ...mapState([
                'userSettings',
            ])
        },
    }
</script>

<style scoped>

</style>