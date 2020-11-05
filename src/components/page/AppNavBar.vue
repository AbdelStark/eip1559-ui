<template>
    <b-navbar class="ml-auto" toggleable="lg" type="dark" variant="info">
        <b-navbar-brand href="#">
            <b-button @click="onClickSettings" variant="light">
                <b-icon aria-hidden="true" icon="gear-fill"></b-icon>
            </b-button>
        </b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav>
                <b-nav-item @click="onNavToTransaction" href="#">Transaction</b-nav-item>
                <b-nav-item @click="onNavToBlock" href="#">Block</b-nav-item>
                <b-form-checkbox button button-variant="light"
                                 v-model="formSubmitTransaction.transaction.isEIP1559">
                    Switch to {{!formSubmitTransaction.transaction.isEIP1559 ? '1559' : 'legacy'}}
                </b-form-checkbox>
                <b-button @click="onSeeLatestBlock" class="ml-2" variant="dark">
                    Base Fee
                    <b-badge variant="light">{{currentBaseFee}}</b-badge>
                </b-button>
            </b-navbar-nav>

            <!-- Right aligned nav items -->
            <b-navbar-nav class="ml-auto">
                <b-nav-form>
                    <b-nav-item @click="onNavToExternalEIPSpecification" href="#">Specification</b-nav-item>
                    <b-nav-item @click="onNavToExternalEIPWorkUpdates" href="#">Work Updates</b-nav-item>
                    <b-nav-item @click="onNavToExternalBlockExplorer" href="#">Block Explorer</b-nav-item>
                    <b-nav-item @click="onNavToExternalNetworkStatus" href="#">Network Status</b-nav-item>
                    <b-nav-item @click="onNavToExternalJoinTheTestnet" href="#">Join the Testnet</b-nav-item>
                    <b-nav-item-dropdown right>
                        <template #button-content>
                            <em>Resources</em>
                        </template>
                        <b-dropdown-item @click="onNavToExternalResourcesBesuGenesis" href="#">Besu genesis file
                        </b-dropdown-item>
                        <b-dropdown-item @click="onNavToExternalResourcesGethGenesis" href="#">Geth genesis file
                        </b-dropdown-item>
                        <b-dropdown-item @click="onNavToExternalResourcesNethermindGenesis" href="#">Nethermind genesis
                            file
                        </b-dropdown-item>
                    </b-nav-item-dropdown>
                    <b-button @click="$bvToast.show('qrcode-toast')" class="mb-2" variant="light">
                        QR code
                    </b-button>
                </b-nav-form>
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
</template>

<script>
    import {mapState} from "vuex";

    export default {
        name: "navbar",
        data() {
            return {
                currentBaseFee: '0',
                timer: '',
            }
        },
        computed: {
            ...mapState([
                'formSubmitTransaction',
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
            onNavToTransaction() {
                this.$store.commit('showTransactionPanel');
            },
            onNavToBlock() {
                this.$store.commit('showBlockPanel');
            },
            onNavToExternalBlockExplorer() {
                window.open(this.$store.state.config.links.blockExplorer, "_blank");
            },
            onNavToExternalNetworkStatus() {
                window.open(this.$store.state.config.links.networkStatus, "_blank");
            },
            onNavToExternalEIPSpecification() {
                window.open(this.$store.state.config.links.eipSpecification, "_blank");
            },
            onNavToExternalEIPWorkUpdates() {
                window.open(this.$store.state.config.links.workUpdates, "_blank");
            },
            onNavToExternalJoinTheTestnet() {
                window.open(this.$store.state.config.links.joinTheTestnet, "_blank");
            },
            onNavToExternalResourcesBesuGenesis() {
                window.open(this.$store.state.config.links.resources.genesis.besu, "_blank");
            },
            onNavToExternalResourcesGethGenesis() {
                window.open(this.$store.state.config.links.resources.genesis.geth, "_blank");
            },
            onNavToExternalResourcesNethermindGenesis() {
                window.open(this.$store.state.config.links.resources.genesis.nethermind, "_blank");
            },
            onSeeLatestBlock() {
                window.open(`${this.$store.state.config.links.blockExplorer}block/latest`, "_blank");
            },
            async onClickSettings() {
                if (this.$store.state.accounts == null) {
                    this.$store.state.accounts = await this.$store.state.services.genesis.loadAccounts();
                }
                this.$bvModal.show('modal-settings');
            },
        },
    }
</script>

<style scoped>

</style>