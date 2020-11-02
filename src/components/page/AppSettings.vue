<template>
    <b-modal id="modal-settings" title="Settings">
        <h2>Toolbox configuration</h2>
        <b-form-group
                id="input-group-private-key"
                label="Private key:"
                label-for="input-private-key"
        >
            <b-form-input
                    id="input-private-key"
                    placeholder="Enter private key"
                    required
                    type="password"
                    v-model="userSettings.privateKey"
            ></b-form-input>
        </b-form-group>
    </b-modal>
</template>

<script>
    import {mapState} from "vuex";

    export default {
        name: "settings",
        computed: mapState([
            'userSettings'
        ])
    }
</script>

<style scoped>

</style>