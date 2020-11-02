<template>
    <!-- Footer -->
    <mdb-footer class="font-small pt-4 mt-4" color="blue">
        <mdb-container class="text-left">
            <mdb-row>
                <mdb-col class="mb-2">
                    <a class="mr-2" href="https://github.com/abdelhamidbakhta/eip1559-ui"><img
                            height="32" src="/logos/github.png" width="32"></a>
                    <a class="mr-2" href="https://discord.gg/hrBUGu78Sf"><img height="32" src="/logos/discord.png"
                                                                              width="32"></a>
                    <a class="mr-2" href="mailto:abdelhamid.bakhta@consensys.net"><img height="32"
                                                                                       src="/logos/gmail.png"
                                                                                       width="32"></a>
                </mdb-col>
            </mdb-row>
        </mdb-container>
        <div class="footer-copyright text-center py-3">
            <mdb-container fluid>
                &copy; 2020 Copyright: <a href="https://consensys.net/"> ConsenSys </a>
            </mdb-container>
        </div>
    </mdb-footer>
    <!-- Footer -->
</template>

<script>
    import {mdbCol, mdbContainer, mdbFooter, mdbRow} from 'mdbvue';

    export default {
        name: "app-footer",
        components: {
            mdbFooter,
            mdbContainer,
            mdbRow,
            mdbCol
        },
    }
</script>