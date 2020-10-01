<template>
    <div>
        <router-link :to="{ name: 'bid-bond-templates.create'}" class="btn btn-sm btn-black pull-right"
                     v-if="$can.view($store.getters.getAuthUser, 'create-bidbond-templates')">Create New
        </router-link>
        <h4>Bid Bond Templates</h4>

        <div>
            <table v-if="is_loaded" class="table table-striped table-responsive-sm">
                <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(bid, i) in bidtemplates" :key="i">
                    <td>{{ pagination.from + i }}</td>
                    <td>{{ bid.name }}</td>
                    <td>
                        <router-link :to="{name: 'bid-bond-templates.show', params: {id: bid.secret}}"><i
                                class="fa fa-eye"></i> show
                        </router-link>
                    </td>
                </tr>
                </tbody>
            </table>
            <loading v-else/>
            <pagination v-if="pagination.last_page > 1" :pagination="pagination" :offset="5"
                        @paginate="fetch"></pagination>
            <!--            <api-table :url="url" :columns="columns" classes="table table-striped table-responsive-sm"-->
            <!--                       show="bid-bond-templates.show" link="secret"/>-->
        </div>
    </div>
</template>

<script>
    export default {
        mounted() {
            this.fetch();
        },
        data() {
            return {
                is_loaded: false,
                pagination: {
                    'current_page': 1,
                    'last_page': 1,
                    'from': 1
                },
                bidtemplates:[]
            }
        },
        methods: {
            fetch() {
                this.is_loaded = false;
                axios.get('/api/v1/bid-bond-templates?page=' + this.pagination.current_page).then(response => {
                    console.log('templates----------------')
                    console.log(response.data.data)
                    console.log('----end templates----------------')
                    this.is_loaded = true;
                    if(!response.data.hasOwnProperty('data')) return;
                    this.bidtemplates = response.data.data;
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
        }
    }
</script>
