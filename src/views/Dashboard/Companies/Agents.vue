<template>
    <div>
        <loading v-if="loading"/>
        <template v-else>
            <table class="table table-striped table-responsive-sm" v-if="companies.length">
                <thead>
                <th>#</th>
                <th>Name</th>
                <th>Registration No</th>
                <th>Postal Address</th>
                <th>Postal Code</th>
                <th>County</th>
                </thead>
                <tbody>
                <tr v-for="(company, i) in companies" :key="i">
                    <td>{{ pagination.from + i }}</td>
                    <td>{{ company.name }}</td>
                    <td>{{ company.crp }}</td>
                    <td>{{ company.postal_address }}</td>
                    <td>{{ company.postal_code }}</td>
                    <td>{{ company.county }}</td>
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
                this.$axios.get('/api/v1/companies/agent?page=' + this.pagination.current_page).then(response => {
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
            }
        },
    }
</script>
