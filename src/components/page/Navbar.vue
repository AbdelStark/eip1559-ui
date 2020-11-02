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
        props: [
            "onNavToTransaction", "onNavToBlock", "onNavToExternalBlockExplorer", "onNavToExternalNetworkStatus",
            "onNavToExternalEIPSpecification", "onNavToExternalEIPWorkUpdates", "onClickSettings"
        ],
    }
</script>

<style scoped>

</style>