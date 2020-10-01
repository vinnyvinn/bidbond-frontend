<template>
    <div>
        <h5>Commission</h5>
        <table class="table table-striped table-responsive-sm" v-if="is_loaded">
            <thead>
            <tr>
                <th>#</th>
                <th v-if="$can.view($store.getters.getAuthUser, 'list-commission')">Name</th>
                <th>Amount</th>
                <th>Bidbond No</th>
                <th>Date</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(commission, i) in commissions" :key="i">
                <td>{{ pagination.from + i }}</td>
                <td v-if="$can.view($store.getters.getAuthUser, 'list-commission')">{{ commission.user.firstname }} {{ commission.user.lastname }}</td>
                <td>{{ $number.format(commission.commission_amount) }}</td>
                <td>
                    <router-link :to="{ name: 'bidbonds.show', params: { id: commission.bidbond_id }}">{{ commission.bidbond_id }}
                    </router-link>
                </td>
                <td>{{ commission.created_at }}</td>
            </tr>
            <tr v-if="!commissions.length">
                <td :colspan="$can.view($store.getters.getAuthUser, 'list-commission') ? 5 : 4">
                    <div class="alert alert-info">No commissions found</div>
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
                commissions: [],
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
                axios.get('/api/v1/commission?page=' + this.pagination.current_page).then(response => {
                    this.is_loaded = true;
                    if(!response.data.hasOwnProperty('data')) return;
                    this.commissions = response.data.data;
                    this.pagination = this.pagination = (({total, per_page, current_page, last_page, from, to}) => ({
                        total,
                        per_page,
                        current_page,
                        last_page,
                        from,
                        to
                    }))(response.data);
                });
            }
        }
    }
</script>
