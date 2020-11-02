<template>
    <b-navbar toggleable="lg" type="dark" variant="info">
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
            </b-navbar-nav>

            <!-- Right aligned nav items -->
            <b-navbar-nav class="ml-auto">
                <b-nav-form>
                    <b-nav-item @click="onNavToExternalEIPSpecification" href="#">Specification</b-nav-item>
                    <b-nav-item @click="onNavToExternalEIPWorkUpdates" href="#">Work Updates</b-nav-item>
                    <b-nav-item @click="onNavToExternalBlockExplorer" href="#">Block Explorer</b-nav-item>
                    <b-nav-item @click="onNavToExternalNetworkStatus" href="#">Network Status</b-nav-item>
                    <b-button @click="$bvToast.show('qrcode-toast')" class="mb-2" variant="primary">
                        Get QR code
                    </b-button>
                </b-nav-form>
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
</template>

<script>
    export default {
        name: "navbar",
        methods: {
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
            onClickSettings() {
                this.$bvModal.show('modal-settings');
            },
        },
    }
</script>

<style scoped>

</style>