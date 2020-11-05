<template>
    <div id="app">
        <app-nav-bar/>
        <app-qr-code/>
        <app-settings/>
        <b-jumbotron bg-variant="light" border-variant="dark" header="EIP-1559 Toolbox"
                     lead="Fee market change for ETH 1.0 chain" text-variant="dark">
            <p>
                This EIP introduces a transaction pricing mechanism that includes fixed-per-block network fee that is
                burned and dynamically expands/contracts block sizes to deal with transient congestion.
            </p>
            <submit-transaction-panel/>
            <block-panel/>
        </b-jumbotron>
        <!--app-footer/-->
    </div>
</template>

<script>
    import AppNavBar from "./components/page/AppNavBar";
    import AppSettings from "./components/page/AppSettings";
    import AppQrCode from "./components/page/AppQrCode";
    import BlockPanel from "./components/core/BlockPanel";
    import SubmitTransactionPanel from "./components/core/SubmitTransactionPanel";

    export default {
        components: {
            SubmitTransactionPanel,
            BlockPanel,
            AppQrCode,
            AppSettings,
            AppNavBar,
        },
        data() {
            return {
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
        }
    }
</script>