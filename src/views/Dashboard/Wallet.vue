<template>
    <div>
        <h4>Company Balances</h4>
        <loading v-if="loading"/>
        <template v-else>
            <table class="table table-striped table-responsive-sm" v-if="wallets.length">
                <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Amount</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, i) in wallets" :key="i">
                    <td>{{ i + 1 }}</td>
                    <td>{{ item.company }}</td>
                    <td>KES {{ $number.format(item.balance) }}</td>
                </tr>
                </tbody>
            </table>
            <div class="alert alert-warning" v-else>
                <p>There are no wallets</p>
            </div>
        </template>
    </div>
</template>

<script>
    export default {
        mounted() {
            this.fetchwallets();
        },
        data() {
            return {
                wallets: [],
                loading: true
            }
        },
        methods: {
            fetchwallets() {
                this.loading = true;
                axios.get('/api/v1/wallets').then(response => {
                    this.loading = false;
                    this.wallets = response.data;
                }).catch(error => {
                    this.loading = false;
                    toastr.warning(error.response.data.error);
                });
            },
        }
    }
</script>
