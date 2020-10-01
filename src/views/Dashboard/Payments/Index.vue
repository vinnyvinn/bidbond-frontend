<template>
    <div>
        <h5>Payments</h5>
        <table class="table table-striped table-responsive-sm" v-if="is_loaded">
            <thead>
            <tr>
                <th>#</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Amount</th>
                <th>Account</th>
                <th>Transaction Number</th>
                <th>Transaction Date</th>
                <th>Type</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(data, index) in payments" :key="index">
                <td>{{ pagination.from + index }}</td>
                <td>{{ data.name }}</td>
                <td>{{ data.phone }}</td>
                <td>{{ $number.format(data.amount) }}</td>
                <td>{{ data.account }}</td>
                <td>{{ data.transaction_number }}</td>
                <td>{{ data.transaction_date | dateFilter }}</td>
                <td>
                    <router-link :to="{ name: 'bidbonds.show', params: { id: data.payable_id }}"
                                 v-if="getPayable(data.payable_type) === 'Bidbond'">{{ getPayable(data.payable_type) }}
                    </router-link>
                    <router-link :to="{ name: 'companies.show', params: { id: data.payable_id }}"
                                 v-if="getPayable(data.payable_type) === 'Company'">{{ getPayable(data.payable_type) }}
                    </router-link>
                    <router-link :to="{ name: 'agents.show', params: { secret: data.payable_id }}"
                                 v-if="getPayable(data.payable_type) === 'Agent'">{{ getPayable(data.payable_type) }}
                    </router-link>
                </td>
            </tr>
            </tbody>
        </table>
        <loading v-else/>
        <pagination v-if="pagination.last_page > 1" :pagination="pagination" :offset="5"
                    @paginate="fetch"></pagination>
    </div>
</template>

<script>
    export default {
        mounted() {
            this.fetch();
        },
        data() {
            return {
                payments: [],
                is_loaded: false,
                pagination: {
                    'current_page': 1,
                    'last_page': 1,
                    'from': 1
                }
            }
        },
        methods: {
            fetch() {
                this.is_loaded = true;
                axios.get('/api/v1/payments?page=' + this.pagination.current_page).then(response => {
                    this.is_loaded = true;
                    if (!response.data.hasOwnProperty('data')) return;
                    this.payments = response.data.data;
                    this.pagination = this.pagination = (({total, per_page, current_page, last_page, from, to}) => ({
                        total,
                        per_page,
                        current_page,
                        last_page,
                        from,
                        to
                    }))(response.data);
                });
            },
            getPayable(type) {
                return type.replace("App\\", "");
            }
        }
    }
</script>
