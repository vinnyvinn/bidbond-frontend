<template>
    <div>
        <table class="table table-striped table-responsive-sm">
            <thead>
            <tr>
                <th>#</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Tenure</th>
                <th>Amount</th>
                <th>Charge</th>
                <th>Requested On</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(quote, i) in quotes" :key="i">
                <td>{{ pagination.from + i }}</td>
                <td>{{ quote.email }}</td>
                <td>{{ quote.phone }}</td>
                <td>{{ quote.tenure }}</td>
                <td>{{ $number.format(quote.amount) }}</td>
                <td>{{ $number.format(quote.charge) }}</td>
                <td>{{ quote.created_at }}</td>
            </tr>
            </tbody>
        </table>
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
                quotes: [],
                pagination: {
                    'current_page': 1,
                    'last_page': 1,
                    'from': 1
                }
            }
        },

        methods: {
            fetch() {
                axios.get('/api/v1/quotes?page=' + this.pagination.current_page).then(response => {
                    if(!response.data.hasOwnProperty('data')) return;
                    this.quotes = response.data.data;
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
        }
    }
</script>
