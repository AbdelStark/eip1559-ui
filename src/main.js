import 'bootstrap-css-only/css/bootstrap.min.css'
import 'mdbvue/lib/css/mdb.min.css'
import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import Vuex from 'vuex'
import './plugins/bootstrap-vue'
import App from './App.vue'
import BaseFeeService from './service/BaseFeeService'
import {newTransaction} from './util/transaction'
import {GlobalConfiguration} from './config'
import TransactionService from "./service/TransactionService";
import GenesisService from "./service/GenesisService";

Vue.config.productionTip = false;
const store = new Vuex.Store({
    state: {
        show: show(),
        config: GlobalConfiguration(),
        userSettings: userSettings(),
        formSubmitTransaction: formSubmitTransaction(),
        accounts: null,
    },
    mutations: {
        showBlockPanel(state) {
            state.show.blockPanel = true;
            state.show.transactionPanel = false;
        },
        showTransactionPanel(state) {
            state.show.blockPanel = false;
            state.show.transactionPanel = true;
        },
        hideBlockPanel(state) {
            state.show.blockPanel = false;
        },
        hideTransactionPanel(state) {
            state.show.transactionPanel = false;
        },
        resetFormSubmitTransaction(state) {
            state.formSubmitTransaction.transaction = newTransaction();
        }
    },
    getters: {
        getTransactionExplorerLink: (state) => (hash) => {
            return `${state.config.links.blockExplorer}tx/${hash}`;
        }
    }
});
store.state.services = services(store.state.config);
new Vue({
    render: h => h(App),
    store,
}).$mount('#app');

function show() {
    return {
        blockPanel: false,
        transactionPanel: true,
    }
}

function services(config) {
    return {
        baseFee: new BaseFeeService(config),
        transaction: new TransactionService(config),
        genesis: new GenesisService(config.links.resources.genesis.besu),
    };
}

function userSettings() {
    return {
        // default private key in genesis file
        privateKey: '8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63',
    }
}

function formSubmitTransaction() {
    return {
        privateKey: null,
        transaction: newTransaction(),
        result: {
            transactionHash: '',
        }
    };
}