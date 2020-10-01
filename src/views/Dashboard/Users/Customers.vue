<template>
    <div>
        <div class="row">
            <div class="col-md-4">
                <v-text-field
                        v-model="search"
                        append-icon="mdi-magnify"
                        label="Search"
                        single-line
                        hide-details
                ></v-text-field>
            </div>
        </div>
        <loading v-if="!is_loaded"/>
        <template v-else>
            <table class="table table-striped table-responsive-sm">
                <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone Number</th>
                    <th>ID Number</th>
                    <th>Status</th>
                    <th>Created At</th>
                    <th v-if="$can.view($store.getters.getAuthUser, 'view-user')">Actions</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(user, i) in users" :key="i">
                    <td>{{ pagination.from + i}}</td>
                    <td>{{ user.firstname }} {{ user.middlename }} {{ user.lastname }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ user.phone_number }}</td>
                    <td>{{ user.id_number }}</td>
                    <td>{{ user.active ? 'Active' : 'Inactive' }}</td>
                    <td>{{ user.created_at }}</td>
                    <td v-if="$can.view($store.getters.getAuthUser, 'view-user')">
                        <router-link :to="{name: 'users.show', params: { id: user.user_unique_id }}"
                                     class="btn btn-sm btn-warning">show
                        </router-link>
                    </td>
                </tr>
                <tr v-if="!users.length">
                    <td :colspan="$can.view($store.getters.getAuthUser, 'view-user') ? 8 : 7">
                        <div class="alert alert-info">No customers found</div>
                    </td>
                </tr>
                </tbody>
            </table>
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
                users: [],
                is_loaded: false,
                search: '',
                pagination: {
                    'current_page': 1,
                    'last_page': 1,
                    'from': 1
                }
            }
        },

        methods: {
            fetch() {
                axios.get('/api/v1/customers', {
                    params: {
                        page: this.pagination.current_page,
                        search: this.search
                    }
                }).then(response => {
                    this.is_loaded = true;
                    if (!response.data.hasOwnProperty('data')) return;
                    this.users = response.data.data;
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
            fetchEntriesDebounced() {
                // cancel pending call
                clearTimeout(this._timerId);

                // delay new call 1200ms
                this._timerId = setTimeout(() => {
                    this.fetch()
                }, 1200)
            }
        },
        watch: {
            search(o,n) {
                if (!n && !o) {
                    return
                }
                this.fetchEntriesDebounced()
            }
        }
    }
</script>

