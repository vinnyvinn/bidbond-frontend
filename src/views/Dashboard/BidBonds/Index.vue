<template>
    <div>
        <template v-if="is_loaded">
            <table class="table table-bordered table-responsive-sm" v-if="bidbonds.length">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>BidBond Number</th>
                    <th>Company</th>
                    <th>Counter Party</th>
                    <th>Amount</th>
                    <th>Effective Date</th>
                    <th>Period</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(bond, i) in bidbonds">
                    <td>{{ pagination.from + i }}</td>
                    <td>{{ bond.bidbond_secret }}</td>
                    <td>{{ bond.company_name }}</td>
                    <td>{{ bond.counter_party_name }}</td>
                    <td>{{ $number.format(bond.tender_amount) }}</td>
                    <td>{{ bond.tender_effective_date }}</td>
                    <td>{{ bond.tender_period }}</td>
                    <td>{{ pay_status(bond.bidbond_paid) }}</td>
                    <td>
                        <template v-if="bond.bidbond_paid">
                            <router-link :to="{ 'name': 'bidbonds.edit', params: { id: bond.id} }"
                                         v-if="$can.view($store.getters.getAuthUser, 'update-bidbonds')"
                                         class="btn btn-sm mr-2 btn-outline-primary"><i class="fa fa-edit"></i> Edit</router-link>
                            <router-link :to="{ name: 'bidbonds.show', params: { id: bond.bidbond_secret, co: bond.company_id }}"
                                         class="btn btn-outline-info btn-sm"><i class="fa fa-eye"></i> View
                            </router-link>
                        </template>
                        <template v-else>
                            <router-link
                                    :to="{ name: 'bidbonds.payment', params: { id: bond.bidbond_secret, co: bond.company_id}}"
                                    class="btn btn-outline-success btn-sm"><i class="fa fa-money"></i> Pay
                            </router-link>
                            <router-link
                                    :to="{ name: 'bidbonds.edit', params: {id: bond.id}}"
                                    class="btn btn-outline-primary mt-1 btn-sm" v-if="bond.reference"> <i class="fa fa-edit"></i> Edit
                            </router-link>
                          <router-link
                                    :to="{ name: 'bidbonds.create', params: {tender_no:bond.tender_number}}"
                                    class="btn btn-outline-primary mt-1 btn-sm" v-if="!bond.reference"> <i class="fa fa-edit"></i> Edit
                            </router-link>
                        </template>
                    </td>
                </tr>
                </tbody>
            </table>
            <div class="alert alert-warning" v-else>
                <p>There are no bidbonds generated</p>
            </div>
            <pagination v-if="pagination.last_page > 1" :pagination="pagination" :offset="5"
                        @paginate="fetch"></pagination>
        </template>
        <template v-else>
            <loading/>
        </template>
    </div>
</template>

<script>
    export default {
        mounted() {
            this.fetch();
        },
        data() {
            return {
                bidbonds: [],
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
                this.is_loaded = false;
                axios.get('/api/v1/bid-bonds?page=' + this.pagination.current_page).then(response => {
                    this.is_loaded = true;
                    if(!response.data.hasOwnProperty('data')) return;
                    this.bidbonds = response.data.data;
                    this.pagination = (({total, per_page, current_page, last_page, from, to}) => ({
                        total,
                        per_page,
                        current_page,
                        last_page,
                        from,
                        to
                    }))(response.data);
                }).catch(error => {
                    if (error.response) {
                        this.$error.handle(error.response);
                    }
                });
            },
            pay_status(x) {
                return x ? 'Paid' : 'Pending Payment';
            }
        }
    }
</script>
