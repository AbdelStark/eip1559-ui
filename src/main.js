import 'bootstrap-css-only/css/bootstrap.min.css'
import 'mdbvue/lib/css/mdb.min.css'
import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import Vuex from 'vuex'
import './plugins/bootstrap-vue'
import App from './App.vue'

Vue.config.productionTip = false;
const store = new Vuex.Store({
    state: {
        show: show(),
        config: configuration(),
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
        }
    }
});
new Vue({
    render: h => h(App),
    store,
}).$mount('#app');

function configuration() {
    return {
        apiGwRoot: 'http://eip1559-tx.ops.pegasys.tech:8080',
        baseFeeEndpoint: 'basefee',
        submitFrontierTransactionEndpoint: 'tx/legacy',
        submitEIP1559TransactionEndpoint: 'tx/eip1559',
    };
}

function show() {
    return {
        blockPanel: false,
        transactionPanel: true,
    }
}