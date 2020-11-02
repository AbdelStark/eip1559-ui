<template>
    <b-card class="mt-3" header="Block management" v-if="this.$store.state.show.blockPanel">
        <b-form>
            <b-form @submit="onSubmitGetBaseFee">
                <b-form-group
                        id="input-group-block-number"
                        label="Block number:"
                        label-for="input-block-number"
                >
                    <b-form-input
                            id="input-block-number"
                            placeholder="enter block number or one of earliest, latest"
                            required
                            v-model="block.number"
                    ></b-form-input>
                </b-form-group>
                <b-form-group>
                    <b-button class="mr-2" type="submit" variant="primary">Get base fee</b-button>
                    <h2 v-if="displayBaseFee">
                        <b-badge>{{baseFee}}</b-badge>
                    </h2>
                </b-form-group>
            </b-form>
        </b-form>
    </b-card>
</template>

<script>
    export default {
        name: "BlockPanel",
        data() {
            return {
                block: newBlock(),
                displayBaseFee: false,
                baseFee: '',
            }
        },
        methods: {
            async onSubmitGetBaseFee(evt) {
                evt.preventDefault();
                this.baseFee = await this.$store.state.services.baseFee.getBaseFeeAt(this.block.number);
                this.displayBaseFee = true;
            },
        }
    }


    function newBlock() {
        return {
            number: 'latest',
        };
    }

</script>

<style scoped>

</style>