<template>
    <div>
        <loading v-if="loading"/>
        <template v-else>
            <table class="table table-striped table-responsive-sm" v-if="companies.length">
                <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Reg Number</th>
                    <th>Phone</th>
                    <th>Approval Status</th>
                    <th>Payment Status</th>
                    <th>Created At</th>
                    <th v-if="$can.view($store.getters.getAuthUser, 'restore-companies')">Actions</th>
                </tr>
                </thead>
                <tbody>
                    <tr v-for="(company, i) in companies" :key="i">
                        <td>{{ i + pagination.from }}</td>
                        <td>{{ company.name }}</td>
                        <td>{{ company.crp }}</td>
                        <td>{{ company.phone_number }}</td>
                        <td>{{ company.approval_status }}</td>
                        <td>{{ company.paid ? 'Paid' : 'Unpaid' }}</td>
                        <td>{{ company.created_at }}</td>
                        <td v-if="$can.view($store.getters.getAuthUser, 'restore-companies')">
                            <a href="#" class="btn btn-success btn-sm" @click.prevent="restore(company)">Restore</a>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="alert alert-warning" v-else>
                <p>There are no companies</p>
            </div>
            <pagination v-if="pagination.last_page > 1" :pagination="pagination" :offset="5"
                        @paginate="fetch"></pagination>

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
                companies: [],
                loading: true,
                pagination: {
                    'current_page': 1,
                    'last_page': 1,
                    'from': 1
                }
            }
        },

        methods: {
            fetch() {
                axios.get('/api/v1/companies/deleted?page=' + this.pagination.current_page).then(response => {
                    this.loading = false;
                    if (!response.data.hasOwnProperty('data')) return;
                    this.companies = response.data.data;
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
            restore(company) {
                this.$swal({
                    title: 'Are you sure?',
                    text: "This will restore "+ company.name,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, restore it!'
                }).then((result) => {
                    if (result.value) {
                        axios.post('/api/v1/companies/'+ company.id +'/restore').then(() => {
                            toastr.success(company.name + ' restored successfully.', 'Success');
                            this.$router.replace({name: 'companies.index'});
                        });
                    }
                })
            },
        },
    }
</script>
