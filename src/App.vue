<template>
    <div id="app">
        <b-navbar toggleable="lg" type="dark" variant="info">
            <b-navbar-brand href="#">Ethereum</b-navbar-brand>

            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <b-collapse id="nav-collapse" is-nav>
                <b-navbar-nav>
                    <b-nav-item @click="onNavToTransaction" href="#">Transaction</b-nav-item>
                    <b-nav-item @click="onNavToBlock" href="#">Block</b-nav-item>
                </b-navbar-nav>

                <!-- Right aligned nav items -->
                <b-navbar-nav class="ml-auto">
                    <b-nav-form>
                        <b-form-input class="mr-sm-2" placeholder="Search" size="sm"></b-form-input>
                        <b-button class="my-2 my-sm-0" size="sm" type="submit">Search</b-button>
                    </b-nav-form>

                    <b-nav-item-dropdown right text="Lang">
                        <b-dropdown-item href="#">EN</b-dropdown-item>
                        <b-dropdown-item href="#">FR</b-dropdown-item>
                    </b-nav-item-dropdown>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
        <b-jumbotron header="EIP-1559" lead="Fee market change for ETH 1.0 chain">
            <p>
                This EIP introduces a transaction pricing mechanism that includes fixed-per-block network fee that is
                burned and dynamically expands/contracts block sizes to deal with transient congestion.
            </p>
            <b-alert dismissible v-model="showSuccessAlert" variant="success">
                {{successAlertMessage}}
            </b-alert>

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

                </b-form>
            </b-card>
        </b-jumbotron>
    </div>
</template>

<script>

    export default {
        data() {
            return {
                formSubmitTransaction: {
                    transaction: newTransaction(),
                },
                showSuccessAlert: false,
                successAlertMessage: '',
                showTransactionPanel: true,
                showBlockPanel: false,
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
                this.showSuccessAlert = false;
                this.successAlertMessage = '';
                // Trick to reset/clear native browser form validation state
                this.showTransactionPanel = false;
                this.$nextTick(() => {
                    this.showTransactionPanel = true;
                })
            },
            onNavToTransaction() {
                this.showTransactionPanel = true;
                this.showBlockPanel = false;
            },
            onNavToBlock() {
                this.showTransactionPanel = false;
                this.showBlockPanel = true;
            },
        }
    }

    function newTransaction() {
        return {
            nonce: null,
            to: '',
        };
    }
</script>